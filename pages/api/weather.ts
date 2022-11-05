import { APIData, OpenWeatherResponse, PluckedData } from '../../types/main';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from '../../utils/rate-limit';
const BASE_URL = process.env.NEXT_BASE_URL;
const API_KEY = process.env.NEXT_API_KEY;
const MAX_API_HIT = 10;
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

/**
 * Simple wrapper to send a request
 * @param url string
 * @returns 
 */
async function sendApiRequest(url: string): Promise<OpenWeatherResponse> {
    const request = await fetch(url);
    const response = await request.json();
    return response;
}

/**
 * Prepares the request to send back the response and do all the waiting.
 * @param uri 
 * @param res 
 * @returns 
 */
function parseRequest(uri: string, res: NextApiResponse<APIData>){
    return sendApiRequest(uri)
            .then(data => {
                if (data?.cod && data?.message) return Promise.reject(data);
                return res.status(200).send({ data: pluckDescription(data), status: 'success' })
            })
            .catch(error => res.status(400).json({ message: 'Something with request.', ...error, status: 'error' }))
}

/**
 * Plucks the description
 * @param data 
 * @returns object | Error
 */
function pluckDescription(data: OpenWeatherResponse): PluckedData {
    const weatherFields = data.weather.map(w => w?.description);
    if(weatherFields.length == 0) throw new Error('Something went wrong with weather descriptions');
    return {
        description: weatherFields.join(', ')
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<APIData>
) {

    // We will only support POST request in this scenario for now.
    if (req.method !== 'POST') return res.status(405).send({ message: `Method not supported`, status: 'success' });

    try {

        // Conduct some magic.
        const { city, country_code, lat, lon } = req.body;

        // 10 requests per minute
        await limiter.check(res, MAX_API_HIT, 'CACHE_TOKEN') 
        
        // What's the weather like with lat lon?
        if(lat && lon) {
            return parseRequest(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`, res)
        }

        // What's the weather like?
        return parseRequest(`${BASE_URL}?q=${city},${country_code}&appid=${API_KEY}`, res)

    } catch (error: any) {
        // Just in case.
        res.status(400).json({ message: error?.message, status: 'error' })
    }
}
