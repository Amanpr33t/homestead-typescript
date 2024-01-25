import { Fragment } from 'react'
import { amritsarTehsils, barnalaTehsils, bathindaTehsils, faridkotTehsils, fatehgarhSahibTehsils, fazilkaTehsils, ferozepurTehsils, gurdaspurTehsils, hoshiarpurTehsils, jalandharTehsils, kapurthalaTehsils, ludhianaTehsils, malerkotlaTehsils, mogaTehsils, mansaTehsils, sriMuktsarSahibTehsils, pathankotTehsils, patialaTehsils, rupNagarTehsils, sasNagarTehsils, sbsNagarTehsils, sangrurTehsils, tarnTaranTehsils } from '../../../utils/tehsilsAndDistricts/tehsils/punjabTehsils'
import { capitalizeFirstLetterOfAString } from '../../../utils/stringUtilityFunctions'

//This component is a dropdown for tehsils in punjab
const PunjabTehsilsDropdown: React.FC<{ district: string }> = ({ district }) => {
  return (
    <Fragment>
      {district === 'amritsar' && amritsarTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'barnala' && barnalaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'bathinda' && bathindaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'faridkot' && faridkotTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'fatehgarh sahib' && fatehgarhSahibTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'fazilka' && fazilkaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'ferozepur' && ferozepurTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'gurdaspur' && gurdaspurTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'hoshiarpur' && hoshiarpurTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'jalandhar' && jalandharTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'kapurthala' && kapurthalaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'ludhiana' && ludhianaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'malerkotla' && malerkotlaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'mansa' && mansaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'moga' && mogaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'sri muktsar sahib' && sriMuktsarSahibTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'pathankot' && pathankotTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'patiala' && patialaTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'rupnagar' && rupNagarTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'sahibzada ajit singh nagar' && sasNagarTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'sangrur' && sangrurTehsils
        .map(tehsil => {
          return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
        })}
      {district === 'shaheed bhagat singh nagar' && sbsNagarTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
      {district === 'tarn taran' && tarnTaranTehsils.map(tehsil => {
        return <option key={tehsil} value={tehsil}>{capitalizeFirstLetterOfAString(tehsil)}</option>
      })}
    </Fragment>
  )
}

export default PunjabTehsilsDropdown