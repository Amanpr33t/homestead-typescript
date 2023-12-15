import { Fragment } from 'react'
import { amritsarTehsils, barnalaTehsils, bathindaTehsils, faridkotTehsils, fatehgarhSahibTehsils, fazilkaTehsils, ferozepurTehsils, gurdaspurTehsils, hoshiarpurTehsils, jalandharTehsils, kapurthalaTehsils, ludhianaTehsils, malerkotlaTehsils, mogaTehsils, mansaTehsils, sriMuktsarSahibTehsils, pathankotTehsils, patialaTehsils, rupNagarTehsils, sasNagarTehsils, sbsNagarTehsils, sangrurTehsils, tarnTaranTehsils } from '../../../utils/tehsilsAndDistricts/tehsils/punjabTehsils'

//This component is a dropdown for tehsils in punjab
function PunjabTehsilsDropdown({district}) {

    return (
        <Fragment>
            {district === 'Amritsar' && amritsarTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Barnala' && barnalaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Bathinda' && bathindaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Faridkot' && faridkotTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Fatehgarh sahib' && fatehgarhSahibTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Fazilka' && fazilkaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Ferozepur' && ferozepurTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Gurdaspur' && gurdaspurTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Hoshiarpur' && hoshiarpurTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Jalandhar' && jalandharTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Kapurthala' && kapurthalaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Ludhiana' && ludhianaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Malerkotla' && malerkotlaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Mansa' && mansaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Moga' && mogaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Sri Muktsar Sahib' && sriMuktsarSahibTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Pathankot' && pathankotTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Patiala' && patialaTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Rupnagar' && rupNagarTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Sahibzada Ajit Singh Nagar' && sasNagarTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Sangrur' && sangrurTehsils
                .map(tehsil => {
                    return <option key={tehsil} value={tehsil}>{tehsil}</option>
                })}
            {district === 'Shaheed Bhagat Singh Nagar' && sbsNagarTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
            {district === 'Tarn Taran' && tarnTaranTehsils.map(tehsil => {
                return <option key={tehsil} value={tehsil}>{tehsil}</option>
            })}
        </Fragment>
    )
}

export default PunjabTehsilsDropdown