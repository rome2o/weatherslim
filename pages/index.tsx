

import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import CountryAutocomplete from '../components/CountryAutocomplete'
import Spinner from '../components/Spinner'
import styles from '../styles/Home.module.css'
import { APIData } from '../types/main'
import sendPostRequest from '../utils/sendPostRequest'
const uri = '/api/weather'

export default function Home() {
  const [response, setResponse] = useState<APIData>();
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>();


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
  const Default = () => {
    return (<>What&apos;s the weather like <span>today</span>?</>)
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        {loading ? 
          <Spinner isLoading={true} /> : 
          response?.data ? response.data.description: <Default />
          }
        </h1>

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
        </form>


      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
