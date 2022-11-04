import { Combobox } from '@headlessui/react';
import { useState } from 'react';
import data from '../data/countries.json';
import styles from '../styles/headlessCombobox.module.css';
import { Country } from '../types/openweathertypes';

const getFlagEmoji = (countryCode:string): string => {
  if(!countryCode) return '';
  return String.fromCodePoint(...[...Array.from(countryCode.toUpperCase())].map(x=>0x1f1a5+x.charCodeAt()))
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

const currentValue = () => {
  if(selectedCountry == null) return null;
  const { flag, name } = selectedCountry;
  if(flag && name) return flag + '    ' + name;
  return name;
}
  return (
    <div className={styles.relative}>
    <Combobox value={currentValue()} onChange={setSelectedCountry}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} className={styles.input} autoComplete="off" id="country_selector" placeholder="e.g. Australia" required/>
      <input type="hidden" name="country_code" value={selectedCountry?.value}  />
      {filteredCountry.length > 0 && 
      <Combobox.Options className={styles.resultList}>
        {filteredCountry.map((country, index) => (
          <Combobox.Option key={country.name+index} value={country} className={styles.resultListOptions}>
            {({ active, selected }) => (
              <li className={`${styles.resultListItem} ${active && styles.active} ${selected && styles.selected}`}>
               {country.flag + '   ' + country.name}
              </li>
           )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
      }
    </Combobox>
    </div>
  )
}