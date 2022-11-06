import { APIData, OpenWeatherResponse, PluckedData } from '../../types/main';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from '../../utils/rate-limit';
const BASE_URL = process.env.NEXT_OPENWEATHER_BASE_URL;
const API_KEY = process.env.NEXT_OPENWEATHER_API_KEY;
const RATE_LIMIT_DEBUG = process.env.NEXT_OPENWEATHER_RATE_LIMIT_DEBUG === 'true' ? true : false;
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
 * Plucks the description
 * @param data 
 * @returns object | Error
 */
function pluckDescription(data: OpenWeatherResponse): PluckedData {
    const weatherFields = data.weather.map(w => w?.description);
    if (weatherFields.length == 0) throw new Error('Something went wrong with weather descriptions');
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
        const isLatLon = lat && lon;
        const isCityCountry = city && country_code

        // Some basic validation
        if((!(isLatLon) && !(isCityCountry)) || isLatLon && isCityCountry) throw new Error('Provide city and country code or either provide longitude and latitude')

        // wrapped in IF condition with env variable so that we can easily write test without failing them for limits
        if (!(RATE_LIMIT_DEBUG)) {
            // 10 requests per minute
            await limiter.check(res, MAX_API_HIT, 'CACHE_TOKEN')
        }

        const request_url = isLatLon ? 
        `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}` : 
        `${BASE_URL}?q=${city},${country_code}&appid=${API_KEY}`

        // What's the weather like depending upon given info?
        return sendApiRequest(request_url)
        .then(data => {
            if (data?.cod && data?.message) return Promise.reject(data);
            return res.status(200).send({ data: pluckDescription(data), status: 'success' })
        })
        .catch(error => res.status(400).json({ message: 'Something with request.', ...error, status: 'error' }))

    } catch (error: any) {
        // Just in case.
        res.status(400).json({ message: error?.message, status: 'error' })
    }
}
