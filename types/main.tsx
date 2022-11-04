export interface IWeather {
    id: number
    main: string
    description: string
    icon: string
}

export interface IWeatherResponse {
    id: number
    name: string
    visibility: number
    dt: number
    clouds: {
        all: number
    }
    weather: IWeather[]
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
    }
    wind: {
      speed: number
      deg: number
    }
    sys: {
      country: string
      sunrise: number
      sunset: number
      timezone: number
    }
}

export interface OpenWeatherResponse extends IWeatherResponse {
    cod?: string
    message?: string
}
export interface OpenWeatherRouteResponse extends OpenWeatherResponse {
  status: 'error' | 'success'

}

export interface PluckedData {
  description: string
}


export type APIData = {
  message?: string
  status: 'error' | 'success'
  data?: PluckedData 
  cod?: string
}


export type Country = {
  name: string
  value: string
  flag?: string
}
