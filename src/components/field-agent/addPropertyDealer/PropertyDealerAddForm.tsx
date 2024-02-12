import validator from 'validator'
import { ChangeEvent, Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from '../../AlertModal'
import ReviewPropertyDealerAfterSubmission from './ReviewPropertyDealerAfterSubmission'
import { punjabDistricts } from '../../../utils/tehsilsAndDistricts/districts'
import { generateNumberArray } from '../../../utils/arrayFunctions'
import { capitalizeFirstLetterOfAString } from '../../../utils/stringUtilityFunctions'

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

interface AddressType {
    addressId: number,
    flatPlotHouseNumber: string,
    areaSectorVillage: string,
    landmark: string | null,
    postalCode: number,
    city: string,
    state: string,
    district: string
}

//This component is a form used by a field agent to add a property dealer
const PropertyDealerAddForm: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [firmName, setFirmName] = useState<string>('') //Name of the firm
    const [firmNameError, setFirmNameError] = useState<boolean>(false) //Used to set error in case no firm name is provided

    const [propertyDealerName, setPropertyDealerName] = useState<string>('') //Name of the property dealer
    const [propertyDealerNameError, setPropertyDealerNameError] = useState<boolean>(false) //Used to set the error in case property dealer name is not provided

    const [experience, setExperience] = useState<number>(0) //Used to set experience

    const [flatPlotHouseNumber, setFlatPlotHouseNumber] = useState<string>('') //Used td store flat or house number
    const [flatPlotHouseNumberError, setFlatPlotHouseNumberError] = useState<boolean>(false) //used to show error when flat or house number is not provided

    const [areaSectorVillage, setAreaSectorVillage] = useState<string>('') //Used to store name of area or village
    const [areaSectorVillageError, setAreaSectorVillageError] = useState<boolean>(false) // Used to show error when area is not provided

    const [landmark, setLandmark] = useState<string>('') //Used to set landmark

    const [postalCode, setPostalCode] = useState<number | ''>('') //Used to set postal code
    const [postalCodeError, setPostalCodeError] = useState<boolean>(false) //Used to show error when no postal code is provided or postal code is more than 6 characters

    const [city, setCity] = useState<string>('') //Used to set city
    const [cityError, setCityError] = useState<boolean>(false) //Used to show error when no city is provided 

    const [district, setDistrict] = useState<string>('') //Used to set district
    const [districtError, setDistrictError] = useState<boolean>(false) //Used to show error when no district is provided

    const [state, setState] = useState<string>('') //Used to set state
    const [stateError, setStateError] = useState<boolean>(false) //Used to set error when no state is provided
    const states: string[] = ['chandigarh', 'punjab']

    const [addressArray, setAddressArray] = useState<AddressType[]>([]) //stores all the addresses added. Addresses are stored in an array
    const [addressError, setAddressError] = useState<boolean>(false) //Used to show error when no address is provided, i.e. addressArray is empty

    const [about, setAbout] = useState<string>('') //Used to set about
    const [aboutMoreThanFourHundredCharacters, setAboutMoreThanFourHundredCharacters] = useState<boolean>(false) //used to show an error when about is more than 400 characters

    const [email, setEmail] = useState<string>('') //Used to set email
    const [emailError, setEmailError] = useState<boolean>(false) //used to show an error when email is not provided ot the format of email is not correct
    const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null) //Used to set error message to be shown when an error regarding email occurs
    const [emailVerified, setEmailVerified] = useState<boolean>(false) //used to check if an email already exists in the database

    const [contactNumber, setContactNumber] = useState<number | ''>('') //used to set contact number
    const [contactNumberError, setContactNumberError] = useState<boolean>(false) //used to set error when no contact number is provided or a similar contact number already exists in database
    const [contactNumberErrorMessage, setContactNumberErrorMessage] = useState<string | null>(null) //used to set error message for contact number errors
    const [contactNumberVerified, setContactNumberVerified] = useState<boolean>(false) //used to check if the contact number is already present in the database

    const [gstNumber, setGstNumber] = useState<string>('') //used to set GST number
    const [gstNumberError, setGstNumberError] = useState<boolean>(false) //used to show error when no gst number is provided or the gst number is already present in the database
    const [gstNumberErrorMessage, setGstNumberErrorMessage] = useState<string | null>(null) //used to set gst number error message
    const [gstNumberVerified, setGstNumberVerified] = useState<boolean>(false)  //used to check if the gst number is already present in the database

    const [reraNumber, setReraNumber] = useState<string>('') //used to set RERA number
    const [reraNumberError, setReraNumberError] = useState<boolean>(false) //used to show error when no RERA number is provided or the gst number is already present in the database
    const [reraNumberErrorMessage, setReraNumberErrorMessage] = useState<string | null>(null) //used to set RERA number error message
    const [reraNumberVerified, setReraNumberVerified] = useState<boolean>(false)  //used to check if the RERA number is already present in the database

    const [firmLogoImageUpload, setFirmLogoImageUpload] = useState<File | null>(null) //used to store the entire image object to be set to the database
    const [firmLogoImageFile, setFirmLogoImageFile] = useState<string | null>(null) //Used to store image file string

    const [showReviewForm, setShowReviewForm] = useState<boolean>(false) //used to show a review form when the user saves the data

    //This code in useEffect hook is used to scroll the page to top 
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    }) //This state is used to manage alerts

    //This fuction is used to manage the image selected by the user
    const imageChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        // Assuming the input accepts only a single file
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            //setFirmLogoImageFileError(false);
            setFirmLogoImageFile(URL.createObjectURL(selectedFile));
            setFirmLogoImageUpload(selectedFile);
        }
    }

    //This fuction is used to store the address
    const addAddress = () => {
        if (!flatPlotHouseNumber || !areaSectorVillage.trim() || postalCode.toString().length !== 6 || !city.trim() || !state.trim() || !district.trim()) {
            if (!flatPlotHouseNumber) {
                setFlatPlotHouseNumberError(true)
            }
            if (!areaSectorVillage.trim()) {
                setAreaSectorVillageError(true)
            }
            if (postalCode.toString().length !== 6) {
                setPostalCodeError(true)
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
                alertMessage: 'Provide all fields for address',
                routeTo: null
            })
            return
        }

        const newAddress = {
            addressId: addressArray.length + 1,
            flatPlotHouseNumber,
            areaSectorVillage,
            landmark: landmark.trim() || null,
            postalCode: +postalCode,
            city,
            state,
            district
        }

        setAddressArray(addressArray => [
            ...addressArray,
            newAddress
        ])
        setFlatPlotHouseNumber('')
        setAreaSectorVillage('')
        setLandmark('')
        setPostalCode('')
        setCity('')
        setState('')
        setDistrict('')
    }

    //This function is used to check if the email provided by the user is already present in the database
    const checkIfEmailExists = async () => {
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

    //This function is used to check if the contact number provided by the user is already present in the database
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

    //This function is used to check if the gst number provided by the user is already present in the database
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
                setGstNumberVerified(false)
            }
        } catch (error) {
            setGstNumberVerified(false)
        }
    }

    //This function is used to check if the gst number provided by the user is already present in the database
    const checkIfReraNumberExists = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealerReraNumberExists?reraNumber=${reraNumber}`)
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'reraNumberExists') {
                setReraNumberError(true)
                setReraNumberErrorMessage('This RERA number already exists')
                setReraNumberVerified(false)
            } else if (data.status === 'ok') {
                setReraNumberVerified(true)
            } else {
                setReraNumberVerified(false)
            }
        } catch (error) {
            setReraNumberVerified(false)
        }
    }

    //This function is used to submit the form once the save button is clicked
    const formSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        console.log('here')
        e.preventDefault()
        if (!firmName.trim() || !propertyDealerName.trim() || !addressArray.length || !gstNumber.trim() || !reraNumber.trim() || !contactNumber || !email.trim() || !validator.isEmail(email.trim())) {
            if (!firmName.trim()) {
                setFirmNameError(true)
            }
            if (!propertyDealerName.trim()) {
                setPropertyDealerNameError(true)
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
            if (!reraNumber.trim()) {
                setReraNumberError(true)
                setReraNumberErrorMessage('provide a RERA number')
            }
            if (!email.trim()) {
                setEmailError(true)
                setEmailErrorMessage('Provide an email')
            }
            if (email.trim() && !validator.isEmail(email.trim())) {
                setEmailError(true)
                setEmailErrorMessage('Email not in correct format')
            }
            if (!contactNumber) {
                setContactNumberError(true)
                setContactNumberErrorMessage('Provide a contact number')
            }
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields',
                routeTo: null
            })
            return
        }
        if (emailError || contactNumberError || gstNumberError || reraNumberError) {
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields',
                routeTo: null
            })
            return
        }
        if (!emailVerified || !contactNumberVerified || !gstNumberVerified || !reraNumberVerified) {
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured',
                routeTo: null
            })
            return
        }
        setShowReviewForm(true)
    }

    return (
        <Fragment>

            {/*The code bolow is used to show an alert modal to the user */}
            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    alertModalRemover={() =>
                        setAlert({
                            isAlertModal: false,
                            alertType: null,
                            alertMessage: null,
                            routeTo: null
                        })} />}

            {showReviewForm &&
                <ReviewPropertyDealerAfterSubmission
                    firmName={firmName.trim()}
                    propertyDealerName={propertyDealerName.trim()}
                    experience={experience}
                    addressArray={addressArray}
                    gstNumber={gstNumber.trim()}
                    reraNumber={reraNumber.trim()}
                    about={about.trim()}
                    firmLogoImageUpload={firmLogoImageUpload}
                    firmLogoImageFile={firmLogoImageFile}
                    email={email.trim()}
                    contactNumber={contactNumber as number}
                    hideReviewForm={() => {
                        setShowReviewForm(false)
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }} />}

            <div className={`p-1 mb-10 sm:p-0 w-full flex flex-col place-items-center ${alert.isAlertModal ? 'blur-sm' : ''} ${showReviewForm ? 'fixed right-full' : ''}`} >

                {!showReviewForm && <>
                    {/*home button */}
                    <button
                        type='button'
                        className="fixed top-16 left-2 mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 h-8"
                        onClick={() => navigate('/field-agent', { replace: true })}>
                        Home
                    </button>

                    {/*heading */}
                    <p className="w-full text-center mt-28 sm:mt-20 pl-4 pr-4 pb-4  bg-white  text-xl font-semibold">Add a property dealer by filling the form</p>
                </>}

                <form className="w-full sm:w-9/12 md:w-8/12 lg:w-7/12  h-fit p-4 flex flex-col rounded border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

                    {/*Firm name */}
                    <div className="flex flex-col mb-1.5 ">
                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <label className="text-lg font-semibold mb-0.5" htmlFor="firmName">Name of the firm</label>
                        </div>
                        <input
                            type="text"
                            id="firmName"
                            name="firmName"
                            className={`border-2 border-gray-400 ${firmNameError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                            autoComplete="new-password"
                            value={firmName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setFirmName(e.target.value)
                                setFirmNameError(false)
                            }} />
                        {firmNameError && <p className="text-red-500">Provide a firm name</p>}
                    </div>

                    {/*dealer name */}
                    <div className="flex flex-col mb-1.5">
                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <label className="text-lg font-semibold mb-0.5" htmlFor="dealerName">Property dealer name</label>
                        </div>
                        <input
                            type="text"
                            id="dealerName"
                            name="dealerName"
                            className={`border-2 ${propertyDealerNameError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} placeholder="Passord should be of 6 digits"
                            autoComplete="new-password"
                            value={propertyDealerName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setPropertyDealerName(e.target.value)
                                setPropertyDealerNameError(false)
                            }} />
                        {propertyDealerNameError && <p className="text-red-500">Provide property dealer's name</p>}
                    </div>

                    {/*Experience */}
                    <div className="flex flex-row gap-4 mt-3 mb-1.5">
                        <label className="text-lg font-semibold" htmlFor="state">Experience (years)</label>
                        <select
                            className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                            name="experience"
                            id="experience"
                            value={experience}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                setExperience(+e.target.value)
                            }}>
                            {generateNumberArray(0, 50).map(number =>
                                <option key={number} value={number}>
                                    {number}
                                </option>)}
                        </select>
                    </div>

                    {/*address */}
                    <div className="flex flex-col mt-3 mb-1.5">
                        <p className="text-lg font-semibold">Office Address:</p>
                        {addressError && !addressArray.length &&
                            <p className="text-red-500 -mt-1">Provide atleast one address</p>}

                        <div className="flex flex-col pl-6 pr-6 gap-2">
                            {/*Flat number */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" font-semibold" htmlFor="number">Flat, House no., Building, Company</label>
                                </div>
                                <input
                                    type="text"
                                    id="number"
                                    name="number"
                                    disabled={addressArray.length === 10}
                                    className={`border-2 ${flatPlotHouseNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    autoComplete="new-password"
                                    value={flatPlotHouseNumber}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setFlatPlotHouseNumber(e.target.value)
                                        setFlatPlotHouseNumberError(false)
                                        setAddressError(false)
                                    }} />
                                {flatPlotHouseNumberError && <p className="text-red-500">Provide a house or plot number</p>}
                            </div>

                            {/*Area, Street, Sector, Village */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="font-semibold" htmlFor="area">Area, Street, Sector, Village</label>
                                </div>
                                <input
                                    type="text"
                                    id="area"
                                    disabled={addressArray.length === 10}
                                    name="area"
                                    className={`border-2 ${areaSectorVillageError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    autoComplete="new-password"
                                    value={areaSectorVillage}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setAreaSectorVillage(e.target.value)
                                        setAreaSectorVillageError(false)
                                        setAddressError(false)
                                    }} />
                                {areaSectorVillageError && <p className="text-red-500">Provide an area</p>}
                            </div>

                            {/*landmark */}
                            <div className="flex flex-col">
                                <label className=" font-semibold" htmlFor="landmark">Landmark</label>
                                <input
                                    type="text"
                                    id="landmark"
                                    name="landmark"
                                    disabled={addressArray.length === 10}
                                    className='border-2 border-gray-400 p-1 rounded'
                                    autoComplete="new-password"
                                    placeholder="E.g. near apollo hospital"
                                    value={landmark}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setLandmark(e.target.value)
                                        setAddressError(false)
                                    }} />
                            </div>

                            {/*pincode */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" font-semibold" htmlFor="pincode">Pincode</label>
                                </div>
                                <input
                                    type="number"
                                    id="pincode"
                                    disabled={addressArray.length === 10}
                                    name="pincode"
                                    className={`border-2 ${postalCodeError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    autoComplete="new-password"
                                    placeholder="6 digits [0-9] PIN code"
                                    min={100000}
                                    max={999999}
                                    value={postalCode}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        const parsedValue = parseInt(e.target.value, 10); // Parse the input as an integer
                                        if (!isNaN(parsedValue)) {
                                            setPostalCode(parsedValue)
                                            setPostalCodeError(false)
                                            setAddressError(false)
                                        } else {
                                            setPostalCode('')
                                        }
                                    }} />
                                {postalCodeError && <p className="text-red-500">Provide must be a 6 digit number</p>}
                            </div>

                            {/*town/city */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" font-semibold" htmlFor="town">Town/City</label>
                                </div>
                                <input
                                    type="text"
                                    id="town"
                                    name="town"
                                    disabled={addressArray.length === 10}
                                    className={`border-2 ${cityError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    autoComplete="new-password"
                                    value={city}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setCity(e.target.value)
                                        setCityError(false)
                                        setAddressError(false)
                                    }} />
                                {cityError && <p className="text-red-500">Provide a town</p>}
                            </div>

                            {/*state */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="font-semibold" htmlFor="state">State</label>
                                </div>
                                <select
                                    className={`border-2 ${stateError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    name="state"
                                    disabled={addressArray.length === 10}
                                    id="state"
                                    value={state}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setState(e.target.value)
                                        setStateError(false)
                                        setAddressError(false)
                                        setDistrict('')
                                        setDistrictError(false)
                                    }}>
                                    <option className="font-semibold" value="" disabled>Select a state</option>
                                    {states.map(state => {
                                        return <option key={state} value={state}>
                                            {capitalizeFirstLetterOfAString(state)}
                                        </option>
                                    })}
                                </select>
                                {stateError && <p className="text-red-500">Select a state</p>}
                            </div>

                            {/*district */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" font-semibold" htmlFor="district-chandigarh">District</label>
                                </div>
                                <select
                                    className={`border-2 ${districtError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    name="district-chandigarh"
                                    disabled={addressArray.length === 10}
                                    id="district-chandigarh"
                                    value={district}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setDistrict(e.target.value)
                                        setDistrictError(false)
                                        setAddressError(false)
                                    }}>
                                    <option className="font-semibold" value="" disabled>Select a district</option>
                                    {state.toLowerCase() === 'chandigarh' && <option value="chandigarh">Chandigarh</option>}
                                    {state.toLowerCase() === 'punjab' &&
                                        punjabDistricts.map(district => {
                                            return <option key={district} value={district}>
                                                {capitalizeFirstLetterOfAString(district)}
                                            </option>
                                        })}
                                </select>
                                {districtError && <p className="text-red-500">Select a district</p>}
                            </div>

                            <div className="w-full flex justify-center">
                                {/*button to add addressess */}
                                <button
                                    type="button"
                                    className="bg-green-400 hover:bg-green-500  text-white font-medium rounded pl-2 pr-2 h-8"
                                    disabled={addressArray.length === 10}
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation()
                                        addAddress()
                                    }}>
                                    Add Address
                                </button>
                            </div>

                            <div className="w-full text-center flex flex-row flex-wrap place-content-center gap-2 mt-2">
                                {/*shows all added addresses */}
                                {addressArray.length > 0 && addressArray.map(address => {
                                    return <div key={address.addressId} className="bg-gray-200 border-gray-400 rounded w-60 p-1">
                                        <p >{address.flatPlotHouseNumber}, {address.areaSectorVillage}, near {address.landmark}, {address.city}, {address.state}</p>
                                        <p>Pincode: {address.postalCode}</p>
                                        <button
                                            className="bg-red-400 hover:bg-red-500 text-white font-medium rounded pl-2 pr-2 mb-2 mt-2"
                                            onClick={() => {
                                                const updatedAddressArray = addressArray.filter(item => item.addressId !== address.addressId)
                                                setAddressArray(updatedAddressArray)
                                            }}>
                                            Remove
                                        </button>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                    {/*gst*/}
                    <div className="flex flex-col mb-1.5 mt-3 ">
                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <label className="text-lg font-semibold mb-0.5" htmlFor="gst">GST number</label>
                        </div>
                        <input
                            type="text"
                            id="gst"
                            name="gst"
                            className={`border-2 ${gstNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} autoComplete="new-password"
                            value={gstNumber}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setGstNumber(e.target.value.toUpperCase().trimEnd())
                                setGstNumberError(false)
                            }}
                            onBlur={checkIfGstNumberExists} />
                        {gstNumberError && <p className="text-red-500">{gstNumberErrorMessage}</p>}
                    </div>

                    {/*RERA number*/}
                    <div className="flex flex-col mb-1.5 mt-3 ">
                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <label className="text-lg font-semibold mb-0.5" htmlFor="rera">RERA number</label>
                        </div>
                        <input
                            type="text"
                            id="rera"
                            name="rera"
                            className={`border-2 ${reraNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                            autoComplete="new-password"
                            value={reraNumber}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setReraNumber(e.target.value.toUpperCase().trimEnd())
                                setReraNumberError(false)
                            }}
                            onBlur={checkIfReraNumberExists} />
                        {reraNumberError && <p className="text-red-500">{reraNumberErrorMessage}</p>}
                    </div>

                    {/*email*/}
                    <div className="flex flex-col mb-1.5 ">
                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <label className="text-lg font-semibold mb-0.5" htmlFor="email">Email</label>
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`border-2 ${emailError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                            autoComplete="new-password"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setEmail(e.target.value.trimEnd().toLowerCase())
                                setEmailError(false)
                            }}
                            onBlur={checkIfEmailExists} />
                        {emailError && <p className="text-red-500">{emailErrorMessage}</p>}
                    </div>

                    {/*contact number*/}
                    <div className="flex flex-col mb-1.5 ">
                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <label className="text-lg font-semibold mb-0.5" htmlFor="contactNumber">Contact number</label>
                        </div>
                        <input
                            type="tel"
                            className={`border-2 ${contactNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                            id="contactNumber"
                            name="contactNumber"
                            placeholder='E.g. 9876543210'
                            autoComplete="new-password"
                            value={contactNumber}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const parsedValue = parseInt(e.target.value, 10); // Parse the input as an integer
                                if (!isNaN(parsedValue)) {
                                    setContactNumber(parsedValue)
                                    setContactNumberError(false)
                                } else {
                                    setContactNumber('')
                                }
                            }}
                            onBlur={checkIfContactNumberExists} />
                        {contactNumberError && <p className="text-red-500">{contactNumberErrorMessage}</p>}
                    </div>

                    {/*about*/}
                    <div className="flex flex-col mb-1.5 ">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="about">About (not more than 500 characters)</label>
                        <textarea
                            className={`border-2 ${aboutMoreThanFourHundredCharacters ? 'border-red-400' : 'border-gray-400'} p-1 rounded  w-full  resize-none`}
                            rows={3}
                            autoCorrect="on"
                            autoComplete="new-password"
                            id="story"
                            name="story"
                            value={about}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                if (e.target.value.trim().length < 500) {
                                    setAboutMoreThanFourHundredCharacters(false)
                                    setAbout(e.target.value)
                                } else {
                                    setAboutMoreThanFourHundredCharacters(true)
                                }
                            }} />
                        {aboutMoreThanFourHundredCharacters && <p className="text-red-500">About should be less than 400 characters</p>}
                    </div>

                    {/*add firm logo*/}
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <div className='flex flex-row gap-3'>
                            <label className="text-lg font-semibold" htmlFor="image">Add firm logo</label>
                            <input
                                type='file'
                                className='text-transparent'
                                placeholder="image"
                                accept="image/png, image/jpeg"
                                name='image'
                                onChange={imageChangeHandler} />
                        </div>
                        {firmLogoImageFile && <div className='flex justify-center'>
                            <img className='w-28 h-auto' src={firmLogoImageFile} alt="" />
                        </div>}
                    </div>

                    <div className="w-full h-10 flex justify-center mt-8">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 h-8">
                            Save details
                        </button>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}
export default PropertyDealerAddForm