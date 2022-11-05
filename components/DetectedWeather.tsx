import React from "react";
import sendPostRequest from "../utils/sendPostRequest";
const uri = '/api/weather'
import styles from '../styles/DetectedWeather.module.css'

interface ICurrentLocation {
    loading: boolean;
    error: GeolocationPositionError | null;
    data: any | null;
    geolocation: GeolocationPosition | null
}

export default class DetectedWeather extends React.Component<{},ICurrentLocation>{
    constructor(props: GeolocationPosition){
        super(props);
        this.state = {
            loading: false,
            error: null,
            data: null,
            geolocation: null
        }
        this.updateLocation = this.updateLocation.bind(this);
    }
    updateLocation(geolocation: GeolocationPosition){
        // Set data state
        this.setState({loading: true, geolocation: geolocation});
        const requestData = {
            lat: geolocation.coords.latitude, 
            lon: geolocation.coords.longitude
        }
        // Get data from Openweather API
        sendPostRequest(uri,requestData).then( response => {
            if(response?.status == 'error') throw new Error(response.message)
            this.setState(prevState => ({...prevState, data: response.data}))
          }).catch(error => {
            this.setState(prevState => ({...prevState, error: error}))
          }).finally( () => this.setState({loading:false}));          

    }
    componentDidMount(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // If user accepts the geolocation prompt
                (position: GeolocationPosition) => {this.updateLocation(position)},
                // If user rejects the geolocation prompt
                (error: GeolocationPositionError) => {this.setState(prevState => ({...prevState, error: error, loading: false}))}
            );        
        }
    }
    render() {
        const description = this.state?.data?.description;
        if(this.state?.data) return (<div role="list" className={styles.detectedWeather}><span className={styles.detectedWeatherSpan}>Your current weather is <b>{description}</b></span> </div>)
    }
}