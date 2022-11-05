import { Combobox } from '@headlessui/react';
import { useState } from 'react';
import data from '../data/countries.json';
import styles from '../styles/headlessCombobox.module.css';
import { Country } from '../types/main';

const getFlagEmoji = (countryCode:string): string => {
  if(!countryCode) return '';
  return String.fromCodePoint(...[...Array.from(countryCode.toUpperCase())].map(x=>0x1f1a5+x.charCodeAt(0)))
}

const mappedCountries = Object.values(data.countries).map((country: any): Country => ({
  name: country.name,
  value: country.abbr,
  flag: getFlagEmoji(country.abbr)
}));

export default function CountryAutocomplete() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [query, setQuery] = useState('')
  const filteredCountry =
    query === ''
      ? mappedCountries
      : mappedCountries.filter((country) => {
          return country.name.toLowerCase().includes(query.toLowerCase())
        }).slice(0, 10)

  return (
    <div className={styles.relative}>
      {/* @ts-ignore */}
    <Combobox value={selectedCountry?.name ?? ''} onChange={setSelectedCountry}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} className={styles.input} value="" autoComplete="off" id="country_selector" placeholder="e.g. Australia" required/>
      <input type="hidden" name="country_code" value={selectedCountry?.value ?? ''}  />
      {filteredCountry.length > 0 && 
      <Combobox.Options className={styles.resultList}>
        {filteredCountry.map((country, index) => (
          <Combobox.Option key={country.name+index} value={country} className={styles.resultListOptions}>
            {({ active, selected }) => (
              <div className={`${styles.resultListItem} ${active && styles.active} ${selected && styles.selected}`}>
               {country.flag + '   ' + country.name}
              </div>
           )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
      }
    </Combobox>
    </div>
  )
}