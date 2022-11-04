import { APIData, OpenWeatherResponse, PluckedData } from '../../types/main';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const BASE_URL = process.env.NEXT_BASE_URL
const API_KEY = process.env.NEXT_API_KEY


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
                console.log(data);
                return res.status(200).send({ data: pluckDescription(data), status: 'success' })
            })
            .catch(error => res.status(400).json({ ...error, status: 'error' }))
}

/**
 * Plucks the description
 * @param data 
 * @returns object
 */
function pluckDescription(data: OpenWeatherResponse): PluckedData {
    return {
        description: data.weather.map(w => w.description).join(', ')
    }
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<APIData>
) {

    // We will only support POST request in this scenario for now.
    if (req.method !== 'POST') return res.status(405).send({ message: `Method not supported`, status: 'success' });

    try {

        // Conduct some magic.
        const { city, country_code, lat, lon } = req.body;
        
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
