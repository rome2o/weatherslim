import CountryAutocomplete from "./CountryAutocomplete";

import { useState } from "react";
import styles from '../styles/MainForm.module.css';
import { APIData } from "../types/main";
import sendPostRequest from "../utils/sendPostRequest";
import Spinner from "./Spinner";
const uri = '/api/weather'

export default function MainForm() {
  const [response, setResponse] = useState<APIData>();
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>();
  const [formValues, setFormValues] = useState<{ city: string | FormDataEntryValue, country_code: string | FormDataEntryValue; } | null>({ city: '', country_code: '' });
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const city = data.get('city')
    const country_code = data.get('country_code')
    if (!city || !country_code) return alert('Please add the required fields');
    setLoading(true);
    const requestData = {
      city: city,
      country_code: country_code
    }
    setFormValues({ ...requestData });
    sendPostRequest(uri, requestData).then(response => {
      if (response?.status == 'error') throw new Error(response.message)
      setResponse(response);
      setError(undefined);
    }).catch(error => {
      setError(error.message);
      setResponse(undefined)
    }).finally(() => setLoading(false));
  }

  const Heading = () => {
    if (loading) return <Spinner isLoading={true} />
    if (typeof response?.data?.description == 'undefined') return (<>What&apos;s the weather like <span>today</span>?</>)
    return <>{response?.data?.description}</>
  }

  const hasAddress = formValues?.city && formValues?.country_code;
  return (
    <>
      <h1 className={styles.title}><Heading /></h1>
      <p className={styles.description}>
        {
          error ?
            // if error occurs
            <span className={styles.errorText}>Oops! {error}. Try again.</span> :
            // if not loading and has address
            !loading && hasAddress ? <>{formValues.city}, {formValues.country_code}</> : <>Get started by telling us city and country.{' '}</>
        }
      </p>
      <form onSubmit={submitForm} className={styles.form}>
        <div className={styles.flexRow}>
          <div className={styles.flexColumn}>
            <label className={styles.label}>City</label>
            <input type="text" name="city" placeholder='E.g. Melbourne' className={styles.input} required />
          </div>

          <div className={styles.flexColumn}>
            <label className={styles.label}>Country</label>
            <CountryAutocomplete />
          </div>

        </div>
        <div style={{ display: 'flex', marginTop: '1em' }}>
          <button className={styles.button} type="submit">Check weather</button>
        </div>
      </form>
    </>

  )
}