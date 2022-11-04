import CountryAutocomplete from "./CountryAutocomplete"

import styles from '../styles/MainForm.module.css'
import { useState } from "react";
import { APIData } from "../types/main";
import sendPostRequest from "../utils/sendPostRequest";
import DetectedWeather from "./DetectedWeather";
import Spinner from "./Spinner";
const uri = '/api/weather'

export default function MainForm(){

  
  
const Default = () => {
    return (<>What&apos;s the weather like <span>today</span>?</>)
}
    
const [response, setResponse] = useState<APIData>();
const [loading, setLoading] = useState<boolean>(false)
const [error, setError] = useState<string>();
const [detectLocation, setDetectedLocation] = useState<boolean>(false);
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const city = data.get('city')
    const country_code = data.get('country_code')
    if(!city || !country_code) return alert('Please add the required fields');
    setLoading(true);
    const requestData = {
      city: city,
      country_code: country_code
    }
    sendPostRequest(uri,requestData).then( response => {
      if(response?.status == 'error') throw new Error(response.message)
      setResponse(response);
      setError(undefined);
    }).catch(error => {
      setError(error.message);
      setResponse(undefined)
    }).finally( () => setLoading(false));


}
    return (
        <>
        <h1 className={styles.title}>
        {loading ? 
        <Spinner isLoading={true} /> : 
        response?.data ? response.data.description: <Default />
        }
        </h1>
        {detectLocation && <DetectedWeather />}
        <p className={styles.description}>
        {typeof error == 'undefined' ? <>Get started by writing the city name{' '}</> : <span className={styles.errorText}>Oops! {error}. Try again.</span>}
        </p>
        <form onSubmit={submitForm} className={styles.form}>
        <div className={styles.flexRow}>
          <div className={styles.flexColumn}>
          <label className={styles.label}>City name</label>
          <input type="text" name="city" placeholder='E.g. Melbourne' className={styles.input} required />
          </div>

          <div className={styles.flexColumn}>
          <label className={styles.label}>Country</label>
          <CountryAutocomplete />
          </div>

        </div>
        <div style={{display: 'flex', marginTop: '1em'}}>
          <button className={styles.button} type="submit">Search</button> 
        
        </div>
        <div style={{display: 'flex', marginTop: '1em'}}>
          <button className={styles.buttonSecondary} type="button" onClick={() => setDetectedLocation(true)}>Detect my location</button> 
        </div>
        </form>
        </>
     
    )
}