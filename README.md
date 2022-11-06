# WeatherSlim

A minimalistic SPA to check the weather given the city and a country code built on Typescript. This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). 

### Features: 
- Form submissions
- Cypress based e2e testing including fixtures
- Error handling
- Geolocation based weather detection
- Autocomplete experience for country selector
- Demonstration of functional and class components
- API rate limiting
- Weather retrieval from Openweather using:
    - City and country code
    - Longitude and latitude

## Getting Started
Create a .env.local file with your credentials
```
NEXT_OPENWEATHER_BASE_URL='https://api.openweathermap.org/data/2.5/weather'
NEXT_OPENWEATHER_API_KEY='<YOUR_OPENWEATHER_API_KEY>'
```
First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Testing

We are using Cypress to run e2e tests for this application `start-server-and-test` to run dev server behind.

```bash
npm run test
```

If you want to directly run the tests, please put dev server on the road by `npm run dev` before running the following command.

```
npm run cypress
```

*Note: If your dev server is not up or your port 3000 is occupied, running Cypress might give an error upon testing.*