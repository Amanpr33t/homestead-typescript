import validator from 'validator'
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from '../AlertModal'
import ReviewPropertyDealerAddForm from './ReviewPropertyDealerAddForm'

function PropertyDealerAddForm() {
    const navigate = useNavigate()
    const fieldAgentAuthToken = localStorage.getItem('homestead-field-agent-authToken')

    const [firmName, setFirmName] = useState('')
    const [firmNameError, setFirmNameError] = useState(false)

    const [propertyDealerName, setPropertyDealerName] = useState('')
    const [propertyDealerNameError, setPropertyDealerNameError] = useState(false)

    const [experience, setExperience] = useState(0)

    const [propertyType, setPropertyType] = useState([])
    const [propertyTypeError, setPropertyTypeError] = useState(false)

    const [flatPlotHouseNumber, setFlatPlotHouseNumber] = useState('')
    const [flatPlotHouseNumberError, setFlatPlotHouseNumberError] = useState(false)

    const [areaSectorVillage, setAreaSectorVillage] = useState('')
    const [areaSectorVillageError, setAreaSectorVillageError] = useState(false)

    const [landmark, setLandmark] = useState('')

    const [postalCode, setPostalCode] = useState('')
    const [postalCodeError, setPostalCodeError] = useState(false)
    const [postalCodeErrorMessage, setPostalCodeErrorMessage] = useState('')

    const [city, setCity] = useState('')
    const [cityError, setCityError] = useState(false)

    const [district, setDistrict] = useState('')
    const [districtError, setDistrictError] = useState(false)

    const [state, setState] = useState('')
    const [stateError, setStateError] = useState(false)

    const [addressArray, setAddressArray] = useState([])
    const [addressError, setAddressError] = useState(false)

    const [about, setAbout] = useState('')
    const [aboutMoreThanOneFiftyCharacters, setAboutMoreThanOneFiftyCharacters] = useState(false)

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)

    const [contactNumber, setContactNumber] = useState('')
    const [contactNumberError, setContactNumberError] = useState(false)
    const [contactNumberErrorMessage, setContactNumberErrorMessage] = useState(false)
    const [contactNumberVerified, setContactNumberVerified] = useState(false)

    const [gstNumber, setGstNumber] = useState('')
    const [gstNumberError, setGstNumberError] = useState(false)
    const [gstNumberErrorMessage, setGstNumberErrorMessage] = useState(false)
    const [gstNumberVerified, setGstNumberVerified] = useState(false)

    const [imageUpload, setImageUpload] = useState()
    const [file, setFile] = useState()
    const [imageFileError, setImageFileError] = useState(false)

    const [showReviewForm, setShowReviewForm] = useState(false)

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: ''
    })

    useEffect(() => {
        if (!fieldAgentAuthToken) {
            navigate('/field-agent/signIn')
        }
    }, [fieldAgentAuthToken, navigate])

    const imageChangeHandler = (event) => {
        setImageFileError(false)
        setFile(URL.createObjectURL(event.target.files[0]))
        setImageUpload(event.target.files[0])
    }

    const addAddress = () => {
        if (!flatPlotHouseNumber.trim() || !areaSectorVillage.trim() || !postalCode.toString().trim() || postalCode.toString().trim().length !== 6 || !city.trim() || !state.trim() || !district.trim() || aboutMoreThanOneFiftyCharacters) {
            if (!flatPlotHouseNumber.trim()) {
                setFlatPlotHouseNumberError(true)
            }
            if (!areaSectorVillage.trim()) {
                setAreaSectorVillageError(true)
            }
            if (!postalCode) {
                setPostalCodeError(true)
                setPostalCodeErrorMessage('Provide a postal code')
            }
            if (postalCode && postalCode.toString().trim().length !== 6) {
                setPostalCodeError(true)
                setPostalCodeErrorMessage('Postal code should be a 6 digit number')
            }
            if (!city.trim()) {
                setCityError(true)
            }
            if (!state.trim()) {
                setStateError(true)
            }
            if (!district.trim()) {
                setDistrictError(true)
            }
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields for address'
            })
            return
        }
        const newAddress = {
            id: (addressArray.length + 1).toString(), flatPlotHouseNumber, areaSectorVillage, landmark, postalCode, city, state, district
        }
        setAddressArray(addressArray => [...addressArray, newAddress])
        setFlatPlotHouseNumber('')
        setAreaSectorVillage('')
        setLandmark('')
        setPostalCode('')
        setCity('')
        setState('')
    }

    const checkIfEmailExists = async (e) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealerEmailExists?email=${email}`)
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'emailExists') {
                setEmailError(true)
                setEmailErrorMessage('This email already exists')
                setEmailVerified(false)
            } else if (data.status === 'ok') {
                setEmailVerified(true)
            } else {
                setEmailVerified(false)
            }
        } catch (error) {
            setEmailVerified(false)
        }
    }

    const checkIfContactNumberExists = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealerContactNumberExists?contactNumber=${contactNumber}`)
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'contactNumberExists') {
                setContactNumberError(true)
                setContactNumberErrorMessage('This contact number already exists')
                setContactNumberVerified(false)
            } else if (data.status === 'ok') {
                setContactNumberVerified(true)
            } else {
                setContactNumberVerified(false)
            }
        } catch (error) {
            setContactNumberVerified(false)
        }
    }


    const checkIfGstNumberExists = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealerGstNumberExists?gstNumber=${gstNumber}`)
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'gstNumberExists') {
                setGstNumberError(true)
                setGstNumberErrorMessage('This gst number already exists')
                setGstNumberVerified(false)
            } else if (data.status === 'ok') {
                setGstNumberVerified(true)
            } else {
                setContactNumberVerified(false)
            }
        } catch (error) {
            setGstNumberVerified(false)
        }
    }

    const formSubmit = e => {
        e.preventDefault()
        if (!firmName.trim() || !propertyDealerName.trim() || propertyType.length === 0 || !addressArray.length || !gstNumber.trim() || !contactNumber.trim() || !email.trim() || !validator.isEmail(email.trim())) {
            if (!firmName.trim()) {
                setFirmNameError(true)
            }
            if (!propertyDealerName.trim()) {
                setPropertyDealerNameError(true)
            }
            if (!propertyType.length) {
                setPropertyTypeError(true)
            }
            if (!addressArray.length) {
                setAddressError(true)
                setFlatPlotHouseNumberError(false)
                setAreaSectorVillageError(false)
                setPostalCodeError(false)
                setCityError(false)
                setStateError(false)
            }
            if (!gstNumber.trim()) {
                setGstNumberError(true)
                setGstNumberErrorMessage('provide a GST number')
            }
            if (!file) {
                setImageFileError(true)
            }
            if (!email.trim()) {
                setEmailError(true)
                setEmailErrorMessage('Provide an email')
            }
            if (email.trim() && !validator.isEmail(email.trim())) {
                setEmailError(true)
                setEmailErrorMessage('Email not in correct format')
            }
            if (!contactNumber.trim()) {
                setContactNumberError(true)
                setContactNumberErrorMessage('Provide a contact number')
            }
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields'
            })
            return
        }
        if (emailError || contactNumberError || gstNumberError) {
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields'
            })
            return
        }
        if (!emailVerified || !contactNumberVerified || !gstNumberVerified) {
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
            return
        }
        setShowReviewForm(true)
    }

    const arrayOfFiftyNumbers = Array.apply(null, Array(51))
        .map(function (y, i) { return i })

    return (
        <Fragment>

            {/*The code bolow is used to show an alert modal to the user */}
            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} alertModalRemover={() => setAlert({
                isAlertModal: false,
                alertType: '',
                alertMessage: ''
            })} />}

            {showReviewForm && <ReviewPropertyDealerAddForm
                firmName={firmName.trim()}
                propertyDealerName={propertyDealerName.trim()}
                experience={experience}
                propertyType={propertyType}
                addressArray={addressArray}
                gstNumber={gstNumber.trim()}
                about={about.trim()}
                imageUpload={imageUpload}
                imageFile={file}
                email={email.trim()}
                contactNumber={contactNumber.trim()}
                hideReviewForm={() => {
                    setShowReviewForm(false)
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }} />}

            <div className={`p-1 mb-10 sm:p-0 w-full flex flex-col place-items-center ${alert.isAlertModal ? 'blur-sm' : ''} ${showReviewForm ? 'fixed right-full' : ''}`} >

                {!showReviewForm && <>
                    <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-10 bg-white sm:bg-transparent'>
                        <button type='button' className="bg-green-500 text-white font-semibold rounded-lg pl-2 pr-2 h-8" onClick={() => navigate('/field-agent')}>Home</button>
                    </div>

                    <p className="fixed w-full text-center top-28 sm:top-16 pl-4 pr-4 pb-4 sm:pt-4 bg-white  text-xl font-bold">Add a property dealer by filling the form</p>
                </>}

                <form className="w-full mt-40 sm:mt-36 sm:w-9/12 md:w-8/12 lg:w-7/12  h-fit p-4 flex flex-col rounded-lg border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

                    <div className="flex flex-col mb-1.5 ">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="firmName">Name of the firm</label>
                        <input type="text" id="firmName" name="firmName" className={`border-2 border-gray-400 ${firmNameError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} autoComplete="new-password" value={firmName} onChange={e => {
                            setFirmName(e.target.value.toUpperCase())
                            setFirmNameError(false)
                        }} />
                        {firmNameError && <p className="text-red-500">Provide a firm name</p>}
                    </div>

                    <div className="flex flex-col mb-1.5">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="dealerName">Property dealer name</label>
                        <input type="text" id="dealerName" name="dealerName" className={`border-2 ${propertyDealerNameError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`}placeholder="Passord should be of 6 digits" autoComplete="new-password" value={propertyDealerName} onChange={e => {
                            setPropertyDealerName(e.target.value.toUpperCase())
                            setPropertyDealerNameError(false)
                        }} />
                        {propertyDealerNameError && <p className="text-red-500">Provide property dealer's name</p>}
                    </div>

                    <div className="flex flex-row gap-4 mt-3 mb-1.5">
                        <label className="text-lg font-semibold" htmlFor="state">Experience (years)</label>
                        <select className="border-2 border-gray-400 p-1 rounded-lg cursor-pointer bg-white text-center" name="experience" id="experience" value={experience} onChange={e => {
                            setExperience(e.target.value)
                        }}>
                            {arrayOfFiftyNumbers.map(number => <option key={number} value={number}>{number}</option>)}
                        </select>
                    </div>

                    <div className="mt-3 mb-1.5">
                        <div className="flex flex-row gap-4 ">
                            <p className="text-lg font-semibold">Deals in:</p>
                            <div className="flex flex-col sm:flex-row gap-3 mt-1">
                                <div>
                                    <input className="mr-0.5 cursor-pointer" type="checkbox" id="residential" name="residential" value="residential" onChange={e => {
                                        setPropertyTypeError(false)
                                        if (e.target.checked) {
                                            setPropertyType(propertyType => [...propertyType, 'residential'])
                                        } else {
                                            const updatedPropertyType = propertyType.filter(type => type !== 'residential')
                                            setPropertyType(updatedPropertyType)
                                        }
                                    }} />
                                    <label htmlFor="residental">Residential</label>
                                </div>

                                <div>
                                    <input className="mr-0.5 cursor-pointer" type="checkbox" id="commercial" name="commercial" value="commercial" onChange={e => {
                                        setPropertyTypeError(false)
                                        if (e.target.checked) {
                                            setPropertyType(propertyType => [...propertyType, 'commercial'])
                                        } else {
                                            const updatedPropertyType = propertyType.filter(type => type !== 'commercial')
                                            setPropertyType(updatedPropertyType)
                                        }
                                    }} />
                                    <label htmlFor="commercial">Commercial</label>
                                </div>

                                <div>
                                    <input className="mr-0.5 cursor-pointer" type="checkbox" id="agricultural" name="agricultural" value="agricultural" onChange={e => {
                                        setPropertyTypeError(false)
                                        if (e.target.checked) {
                                            setPropertyType(propertyType => [...propertyType, 'agricultural'])
                                        } else {
                                            const updatedPropertyType = propertyType.filter(type => type !== 'agricultural')
                                            setPropertyType(updatedPropertyType)
                                        }
                                    }} />
                                    <label htmlFor="agricultural">Agricultural</label>
                                </div>
                            </div>
                        </div>
                        {propertyTypeError && <p className="text-red-500 -mt-1">Select atleast one property type</p>}
                    </div>

                    <div className="flex flex-col mt-3 mb-1.5">
                        <p className="text-lg font-semibold" htmlFor="address">Office Address:</p>
                        {addressError && !addressArray.length && <p className="text-red-500 -mt-1">Provide atleast one address</p>}
                        <div className="flex flex-col pl-6 pr-6 gap-2">
                            <div className="flex flex-col">
                                <label className=" font-semibold" htmlFor="number">Flat, House no., Building, Company</label>
                                <input type="text" id="number" name="number" 
                                className={`border-2 ${flatPlotHouseNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} autoComplete="new-password" value={flatPlotHouseNumber} onChange={e => {
                                    setFlatPlotHouseNumber(e.target.value.toUpperCase())
                                    setFlatPlotHouseNumberError(false)
                                    setAddressError(false)
                                }} />
                                {flatPlotHouseNumberError && <p className="text-red-500">Provide a house or plot number</p>}
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold" htmlFor="area">Area,Street, Sector, Village</label>
                                <input type="text" id="area" name="area" className={`border-2 ${areaSectorVillageError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`}autoComplete="new-password" value={areaSectorVillage} onChange={e => {
                                    setAreaSectorVillage(e.target.value.toUpperCase())
                                    setAreaSectorVillageError(false)
                                    setAddressError(false)
                                }} />
                                {areaSectorVillageError && <p className="text-red-500">Provide an area</p>}
                            </div>
                            <div className="flex flex-col">
                                <label className=" font-semibold" htmlFor="landmark">Landmark</label>
                                <input type="text" id="landmark" name="landmark" className='border-2 border-gray-400 p-1 rounded-lg'autoComplete="new-password" placeholder="E.g. near apollo hospital" value={landmark} onChange={e => {
                                    setLandmark(e.target.value.toUpperCase())
                                    setAddressError(false)
                                }} />
                            </div>
                            <div className="flex flex-col">
                                <label className=" font-semibold" htmlFor="pincode">Pincode</label>
                                <input type="number" id="pincode" name="pincode" className={`border-2 ${postalCodeError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`}autoComplete="new-password" placeholder="6 digits [0-9] PIN code" min={100000} max={999999} value={postalCode} onChange={e => {
                                    setPostalCode(e.target.value)
                                    setPostalCodeError(false)
                                    setAddressError(false)
                                }} />
                                {postalCodeError && <p className="text-red-500">{postalCodeErrorMessage}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label className=" font-semibold" htmlFor="town">Town/City</label>
                                <input type="text" id="town" name="town" className={`border-2 ${cityError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`}autoComplete="new-password" value={city} onChange={e => {
                                    setCity(e.target.value.toUpperCase())
                                    setCityError(false)
                                    setAddressError(false)
                                }} />
                                {cityError && <p className="text-red-500">Provide a town</p>}
                            </div>

                            <div className="flex flex-col">
                                <label className="font-semibold" htmlFor="state">State:</label>
                                <select className={`border-2 ${stateError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} name="state" id="state" value={state.toLowerCase()} onChange={e => {
                                    setState(e.target.value.toUpperCase())
                                    setStateError(false)
                                    setAddressError(false)
                                    setDistrict('')
                                    setDistrictError(false)
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a state:</option>
                                    {/*<option value="Andaman & Nicobar Islands">ANDAMAN & NICOBAR ISLANDS</option>
                                    <option value="Andhra Pradesh">ANDHRA PRADESH</option>
                                    <option value="Arunachal Pradesh">ARNACHAL PRADESH</option>
                                    <option value="Assam" >ASSAM</option>
                            <option value="Bihar" >BIHAR</option>*/}
                                    <option value="chandigarh" >CHANDIGARH</option>
                                    {/*<option value="Chattisgarh" >CHATTISGARH</option>
                                    <option value="Dadra and Nagar Haveli And Daman and Diu">DADRA AND NAGAR HAVELI AND DAMAN AND DIU</option>
                                    <option value="Delhi">DELHI</option>
                                    <option value="Goa">GOA</option>
                        <option value="Gujarat">GUJARAT</option>*/}
                                    <option value="haryana">HARYANA</option>
                                    {/* <option value="Himachal Pradesh">HIMACHAL PRADESH</option>
                                    <option value="Jammu & Kashmir">JAMMU & KASHMIR</option>
                                    <option value="Jharkhand">JHARKHAND</option>
                                    <option value="Karnataka">KARNATAKA</option>
                                    <option value="Kerala">KERALA</option>
                                    <option value="Ladakh">LADAKH</option>
                                    <option value="Lakshadweep">LAKSHADWEEP</option>
                                    <option value="Madhya Pradesh">MADHYA PRADESH</option>
                                    <option value="Maharashtra">MAHARASHTRA</option>
                                    <option value="Manipur">MANIPUR</option>
                                    <option value="Meghalaya">MEGHALAYA</option>
                                    <option value="Mizoram">MIZORAM</option>
                                    <option value="Nagaland">NAGALAND</option>
                                    <option value="Odisha">ODISHA</option>
                    <option value="Puducherry">PUDUCHERRY</option>*/}
                                    <option value="punjab">PUNJAB</option>
                                    {/*<option value="Rajasthan">RAJASTHAN</option>
                                    <option value="Sikkim">SIKKIM</option>
                                    <option value="Tamil Nadu">TAMIL NADU</option>
                                    <option value="Telangana">TELANGANA</option>
                                    <option value="Tripura">TRIPURA</option>
                                    <option value="Uttar Pradesh">UTTAR PRADESH</option>
                                    <option value="Uttarakhand">UTTARAKHAND</option>
                <option value="West Bengal">WEST BENGAL</option>*/}
                                </select>
                                {stateError && <p className="text-red-500">Select a state</p>}
                            </div>

                            {state.toLowerCase() === 'punjab' && <div className="flex flex-col">
                                <label className=" font-semibold" htmlFor="district-punjab">District:</label>
                                <select className={`border-2 ${districtError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} name="district-punjab" id="district-punjab" value={district.toLowerCase()} onChange={e => {
                                    setDistrict(e.target.value.toUpperCase())
                                    setDistrictError(false)
                                    setAddressError(false)
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a district:</option>
                                    <option value="amritsar">AMRITSAR</option>
                                    <option value="barnala">BARNALA</option>
                                    <option value="bathinda">BATHINDA</option>
                                    <option value="faridkot">FARIDKOT</option>
                                    <option value="fatehgarh Sahib">FATEHGARH SAHIB</option>
                                    <option value="firozpur">FIROZPUR</option>
                                    <option value="fazilka">FAZILKA</option>
                                    <option value="gurdaspur">GURDASPUR</option>
                                    <option value="hoshiarpur">HOSHIARPUR</option>
                                    <option value="jalandhar">JALANDHAR</option>
                                    <option value="kapurthala">KAPURTHALA</option>
                                    <option value="ludhiana">LUDHIANA</option>
                                    <option value="malerkotla">MALERKOTLA</option>
                                    <option value="mansa">MANSA</option>
                                    <option value="moga">MOGA</option>
                                    <option value="sri muktsar sahib">SRI MUKTSAR SAHIB</option>
                                    <option value="pathankot">PATHANKOT</option>
                                    <option value="patiala">PATIALA</option>
                                    <option value="rupnagar">RUPNAGAR</option>
                                    <option value="sahibzada ajit singh nagar">SAHIBZADA AJIT SINGH NAGAR</option>
                                    <option value="sangrur">SANGRUR</option>
                                    <option value="shaheed bhagat singh nagar">SAHIBZADA BHAGAT SINGH NAGAR</option>
                                    <option value="tarn taran">TARN TARAN</option>
                                </select>
                                {districtError && <p className="text-red-500">Select a district</p>}
                            </div>}

                            {state.toLowerCase() === 'haryana' && <div className="flex flex-col">
                                <label className=" font-semibold" htmlFor="district-haryana">District:</label>
                                <select className={`border-2 ${stateError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} name="district-haryana" id="district-haryana" value={district.toLowerCase()} onChange={e => {
                                    setDistrict(e.target.value.toUpperCase())
                                    setDistrictError(false)
                                    setAddressError(false)
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a district:</option>
                                    <option value="ambala">AMBALA</option>
                                    <option value="bhiwani">BHIWANI</option>
                                    <option value="charkhi Dadri">CHAKRI DADRI</option>
                                    <option value="faridabad">FARIDABAD</option>
                                    <option value="fatehabad">FATEHABAD</option>
                                    <option value="gurugram">GURUGRAM</option>
                                    <option value="hisar">HISAR</option>
                                    <option value="jhajjar">JHAJJAR</option>
                                    <option value="jind">JIND</option>
                                    <option value="kaithal">KAITHAL</option>
                                    <option value="karnal">KARNAL</option>
                                    <option value="kurukshetra">KURUKSHETRA</option>
                                    <option value="mahendragarh">MAHENDRAGARH</option>
                                    <option value="nuh">NUH</option>
                                    <option value="palwal">PALWAL</option>
                                    <option value="panchkula">PANCHKULA</option>
                                    <option value="panipat">PANIPAT</option>
                                    <option value="rewari">REWARI</option>
                                    <option value="rohtak">ROHTAK</option>
                                    <option value="sirsa">SIRSA</option>
                                    <option value="sonipat">SONIPAT</option>
                                    <option value="yamunanagar">YAMUNANAGAR</option>
                                </select>
                                {districtError && <p className="text-red-500">Select a district</p>}
                            </div>}

                            {state.toLowerCase() === 'chandigarh' && <div className="flex flex-col">
                                <label className=" font-semibold" htmlFor="district-chandigarh">District:</label>
                                <select className={`border-2 ${districtError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} name="district-chandigarh" id="district-chandigarh" value={district.toLowerCase()} onChange={e => {
                                    setDistrict(e.target.value.toUpperCase())
                                    setDistrictError(false)
                                    setAddressError(false)
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a district:</option>
                                    <option value="chandigarh">CHANDIGARH</option>
                                </select>
                                {districtError && <p className="text-red-500">Select a district</p>}
                            </div>}

                            <div className="w-full flex justify-center">
                                <button type="button" className="bg-green-400 text-white font-medium rounded-lg pl-2 pr-2 h-8" onClick={addAddress}>Add Address</button>
                            </div>

                            <div className="w-full text-center flex flex-row flex-wrap place-content-center gap-2 mt-2">
                                {addressArray.length > 0 && addressArray.map(address => {

                                    return <div key={address.id} className="bg-gray-200 border-gray-400 rounded-lg w-60 p-1">
                                        <p className="">{address.flatPlotHouseNumber}, {address.areaSectorVillage}, near {address.landmark}, {address.city}, {address.state}</p>
                                        <p>Pincode: {address.postalCode}</p>
                                        <button className="bg-red-400 text-white font-medium rounded-lg pl-2 pr-2 mb-2 mt-2" onClick={() => {
                                            const updatedAddressArray = addressArray.filter(item => item.id !== address.id)
                                            setAddressArray(updatedAddressArray)
                                        }}>Remove</button>
                                    </div>
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col mb-1.5 mt-3 ">
                            <label className="text-lg font-semibold mb-0.5" htmlFor="gst">GST number</label>
                            <input type="text" id="gst" name="gst" className={`border-2 ${gstNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} autoComplete="new-password" value={gstNumber} onChange={e => {
                                setGstNumber(e.target.value.toUpperCase().trimEnd())
                                setGstNumberError(false)
                            }} onBlur={checkIfGstNumberExists} />
                            {gstNumberError && <p className="text-red-500">{gstNumberErrorMessage}</p>}
                        </div>

                        <div className="flex flex-col mb-1.5 ">
                            <label className="text-lg font-semibold mb-0.5" htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" className={`border-2 ${emailError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} autoComplete="new-password" value={email} onChange={e => {
                                setEmail(e.target.value.trimEnd().toLowerCase())
                                setEmailError(false)
                            }} onBlur={checkIfEmailExists} />
                            {emailError && <p className="text-red-500">{emailErrorMessage}</p>}
                        </div>

                        <div className="flex flex-col mb-1.5 ">
                            <label className="text-lg font-semibold mb-0.5" htmlFor="contactNumber">Contact number</label>
                            <input type="tel" className={`border-2 ${contactNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} id="contactNumber" name="contactNumber" placeholder='E.g. 9876543210' autoComplete="new-password" value={contactNumber} onChange={e => {
                                setContactNumber(e.target.value.trimEnd())
                                setContactNumberError(false)
                            }} onBlur={checkIfContactNumberExists} />
                            {contactNumberError && <p className="text-red-500">{contactNumberErrorMessage}</p>}
                        </div>


                        <div className="flex flex-col mb-1.5 ">
                            <label className="text-lg font-semibold mb-0.5" htmlFor="about">About (not more than 150 words)</label>
                            <textarea className={`border-2 ${aboutMoreThanOneFiftyCharacters ? 'border-red-400' : 'border-gray-400'} p-1 rounded-lg`} id="story" name="story" value={about} onChange={e => {
                                setAboutMoreThanOneFiftyCharacters(false)
                                setAbout(e.target.value)
                                const numberOfWordsInAbout = e.target.value.trim().split(/\s+/);
                                if (numberOfWordsInAbout.length > 150) {
                                    setAboutMoreThanOneFiftyCharacters(true)
                                }
                            }} />
                            {aboutMoreThanOneFiftyCharacters && <p className="text-red-500">About should be less than 150  words</p>}
                        </div>

                        <div className="flex flex-row gap-2 mt-2">
                            <label className="text-lg font-semibold" htmlFor="image">Image:</label>
                            <input type="file" placeholder="image" accept="image/png, image/jpeg" name='image' onChange={imageChangeHandler} />
                            {file && <img className='w-28 h-auto' src={file} alt="" />}
                            {imageFileError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
                        </div>

                    </div>

                    <div type='submit' className="w-full h-10  flex justify-center mt-2">
                        <button type="submit" className="w-full bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 h-8">Save details</button>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}
export default PropertyDealerAddForm