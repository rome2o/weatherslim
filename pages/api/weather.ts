import { APIData, OpenWeatherResponse, PluckedData } from '../../types/openweathertypes';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const BASE_URL = process.env.NEXT_BASE_URL
const API_KEY = process.env.NEXT_API_KEY


async function sendApiRequest(url: string): Promise<OpenWeatherResponse> {
    const request = await fetch(url);
    const response = await request.json();
    return response;
}

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
        const { city, country_code, } = req.body;

        // What's the weather like?
        return sendApiRequest(`${BASE_URL}?q=${city},${country_code}&appid=${API_KEY}`)
            .then(data => {

                if (data?.cod && data?.message) return Promise.reject(data);
                console.log(data);
                return res.status(200).send({ data: pluckDescription(data), status: 'success' })
            })
            .catch(error => res.status(400).json({ ...error, status: 'error' }))

    } catch (error: any) {
        // Just in case.
        res.status(400).json({ message: error?.message, status: 'error' })
    }
}
