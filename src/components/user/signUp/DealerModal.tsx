import React, { ChangeEvent, Fragment, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdOutlineEmail } from 'react-icons/md';
import { capitalizeFirstLetterOfAString } from '../../../utils/stringUtilityFunctions';
import { chooseDistrictsForState } from '../../../utils/chooseDistrictsForState';
import { AlertType } from '../../../dataTypes/alertType';
import Spinner from '../../Spinner';
import AlertModal from '../../AlertModal';
import SetPasswordModal from './SetPasswordModal';
import useUploadImages from '../../../custom-hooks/useImageUpload';
import { useLocation, useNavigate } from 'react-router-dom';

interface PropsType {
    openSignInSignUpModalSetter: (input: 'sign-in' | 'sign-up' | null) => void,
    selectedUserTypeSetter: (input: 'dealer' | 'customer' | null) => void
}

const DealerSignUpModal: React.FC<PropsType> = ({
    openSignInSignUpModalSetter,
    selectedUserTypeSetter
}) => {
    const { uploadImages } = useUploadImages()
    const navigate = useNavigate()
    // Access the location object
    const location = useLocation();
    // Access the current URL
    const currentUrl = location.pathname;

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

    const [about, setAbout] = useState<string>('') //Used to set about

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
    const [firmLogoError, setFirmLogoError] = useState<boolean>(false)

    const [spinner, setSpinner] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })


    const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const imageChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        setFirmLogoError(false)
        // Assuming the input accepts only a single file
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            //setFirmLogoImageFileError(false);
            setFirmLogoImageFile(URL.createObjectURL(selectedFile));
            setFirmLogoImageUpload(selectedFile);
        }
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
                setEmailErrorMessage('A user with this email already exists')
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
                setContactNumberErrorMessage('A user with this contact number already exists')
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
                setGstNumberErrorMessage('A user with this GST number already exists')
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
                setReraNumberErrorMessage('A user with RERA number already exists')
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

    const checkIfErrorExists = () => {
        if (!firmLogoImageFile || !firmLogoImageUpload || !flatPlotHouseNumber || !areaSectorVillage.trim() || !postalCode.toString().trim() || !city.trim() || !state.trim() || !district.trim() || !firmName.trim() || !propertyDealerName.trim() || !gstNumber.trim() || !reraNumber.trim() || !contactNumber || !email.trim() || !emailVerified || !contactNumberVerified || !gstNumberVerified || !reraNumberVerified) {
            if (!firmLogoImageFile || !firmLogoImageUpload) {
                setFirmLogoError(true)
            }
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

            if (!firmName.trim()) {
                setFirmNameError(true)
            }
            if (!propertyDealerName.trim()) {
                setPropertyDealerNameError(true)
            }
            if (!gstNumber.trim()) {
                setGstNumberError(true)
            }
            if (!reraNumber.trim()) {
                setReraNumberError(true)
            }
            if (!email.trim()) {
                setEmailError(true)
            }
            if (!contactNumber) {
                setContactNumberError(true)
            }
            return
        } else {
            setOpenPasswordModal(true)
        }
    }

    const uploadImagesFunction = async () => {
        try {
            setSpinner(true)
            const uploadedLogoUrl: string[] = await uploadImages([{ upload: firmLogoImageUpload as File, file: '' }])

            if (uploadedLogoUrl) {
                if (uploadedLogoUrl.length === 1) {
                    await saveDetailsToDatabase(uploadedLogoUrl[0])
                } else {
                    throw new Error('some error occured')
                }
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured. Try again.',
                routeTo: null
            })
            return
        }
    }

    //This function is used to save details to backend API
    const saveDetailsToDatabase = async (logoUrl: string) => {
        setSpinner(true)
        try {
            const address = {
                flatPlotHouseNumber,
                areaSectorVillage,
                landmark,
                postalCode,
                city,
                state,
                district
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/addPropertyDealer`, {
                method: 'POST',
                body: JSON.stringify({
                    firmName,
                    propertyDealerName,
                    experience,
                    address,
                    gstNumber,
                    reraNumber,
                    about: about?.trim() || null,
                    firmLogoUrl: logoUrl,
                    email,
                    contactNumber,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'Your account has been successfully created',
                    routeTo: null
                })
                localStorage.setItem(`homestead-property-dealer-authToken`, data.authToken)
                localStorage.removeItem('homestead-user-authToken')
                localStorage.removeItem('homestead-field-agent-authToken')
                localStorage.removeItem('homestead-property-evaluator-authToken')
                localStorage.removeItem('homestead-city-manager-authToken')
                if (currentUrl.includes('/property-dealer')) {
                    window.location.reload()
                } else {
                    navigate('/property-dealer')
                }
            } else {
                throw new Error('Some error occured')
            }

        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured. Try again.',
                routeTo: null
            })
            return
        }
    }

    //This function is used to submit the form once the save button is clicked
    const formSubmit = async () => {
        if (!firmLogoImageFile || !firmLogoImageUpload || !flatPlotHouseNumber || !areaSectorVillage.trim() || !postalCode.toString().trim() || !city.trim() || !state.trim() || !district.trim() || !firmName.trim() || !propertyDealerName.trim() || !gstNumber.trim() || !reraNumber.trim() || !contactNumber || !email.trim()) {
            if (!firmLogoImageFile || !firmLogoImageUpload) {
                setFirmLogoError(true)
            }
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

            if (!firmName.trim()) {
                setFirmNameError(true)
            }
            if (!propertyDealerName.trim()) {
                setPropertyDealerNameError(true)
            }
            if (!gstNumber.trim()) {
                setGstNumberError(true)
            }
            if (!reraNumber.trim()) {
                setReraNumberError(true)
            }
            if (!email.trim()) {
                setEmailError(true)
            }
            if (!contactNumber) {
                setContactNumberError(true)
            }
            return
        }

        if (!emailVerified || !contactNumberVerified || !gstNumberVerified || !reraNumberVerified) {
            return
        }
        setSpinner(true)
        uploadImagesFunction()
    }

    return (
        <Fragment>
            {spinner && <Spinner />}
            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    routeTo={alert.routeTo}
                    alertModalRemover={() => {
                        setAlert({
                            isAlertModal: false,
                            alertType: null,
                            alertMessage: null,
                            routeTo: null
                        })
                    }} />}

            {openPasswordModal &&
                <SetPasswordModal
                    isAlert={alert.isAlertModal}
                    passwordSetter={(input) => setPassword(input)}
                    confirmPasswordSetter={(input) => setConfirmPassword(input)}
                    modalReset={() => setOpenPasswordModal(false)}
                    password={password}
                    confirmPassword={confirmPassword}
                    formSubmit={formSubmit}
                />}

            <div className={`w-full h-screen fixed top-0 left-0 z-40 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur  py-5 ${openPasswordModal && 'transform translate-x-full'}`} onClick={() => {
                selectedUserTypeSetter(null)
                openSignInSignUpModalSetter(null)
            }}>

                <form className="relative max-h-full overflow-y-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-6/12 h-fit py-4 px-4 sm:px-10 flex flex-col gap-5 rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={e => e.stopPropagation()} onSubmit={formSubmit}>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => {
                        selectedUserTypeSetter(null)
                        openSignInSignUpModalSetter(null)
                    }}>
                        <IoClose className="text-3xl" />
                    </button>

                    <p className='text-center text-xl font-bold text-gray-700'>Create account</p>

                    <div className='relative'>
                        <p className='absolute text-lg left-1 top-2.5 text-red-600'>*</p>
                        <input
                            type="text"
                            placeholder="Firm name"
                            className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 ${firmNameError ? 'border-red-600' : 'border-gray-300'}`}
                            value={firmName}
                            onChange={(e) => {
                                setFirmName(e.target.value)
                                setFirmNameError(false)
                            }}
                        />
                    </div>

                    <div className='relative'>
                        <p className='absolute text-lg left-1 top-2.5 text-red-600'>*</p>
                        <input
                            type="text"
                            placeholder="Property dealer name"
                            className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 ${propertyDealerNameError ? 'border-red-600' : 'border-gray-300'}`}
                            value={propertyDealerName}
                            onChange={(e) => {
                                setPropertyDealerName(e.target.value)
                                setPropertyDealerNameError(false)
                            }}
                        />
                    </div>

                    <div className='relative'>
                        <div className='absolute left-1 top-2 flex flex-row'>
                            <p className='text-lg text-red-500'>*</p>
                            <MdOutlineEmail className=' text-2xl text-gray-500' />
                        </div>

                        <input
                            type="email"
                            placeholder='Email address'
                            autoComplete='new-password'
                            className={`w-full border border-gray-300 rounded-md pl-10 pr-2 py-2 text-gray-700 ${emailError || emailErrorMessage ? 'border-red-600' : 'border-gray-300'}`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError(false)
                                setEmailError(false)
                                setEmailErrorMessage('')
                            }}
                            onBlur={checkIfEmailExists}
                        />
                        {emailErrorMessage && <p className='text-red-600'>{emailErrorMessage}</p>}
                    </div>

                    <div className='relative'>
                        <div className='absolute left-1 top-2 flex flex-row items-center'>
                            <p className='text-lg text-red-500 mr-0.5'>*</p>
                            <FaPhoneAlt className=' text-gray-500 mr-0,5' />
                            <p className='text-gray-400 '>+91</p>
                        </div>

                        <input
                            autoComplete='new-password'
                            type="tel"
                            placeholder="Contact Number"
                            className={`w-full border border-gray-300 rounded-md  pl-16 pr-2 py-2  text-gray-700 ${contactNumberError || contactNumberErrorMessage ? 'border-red-600' : 'border-gray-300'}`}
                            value={contactNumber}
                            onChange={(e) => {
                                setContactNumberError(false)
                                setContactNumberErrorMessage('')
                                const newValue = e.target.value;
                                // Check if the input value is a valid number
                                if (!isNaN(Number(newValue))) {
                                    setContactNumber(Number(newValue));
                                }
                            }}
                            onBlur={checkIfContactNumberExists}
                        />
                        {contactNumberErrorMessage && <p className='text-red-600'>{contactNumberErrorMessage}</p>}
                    </div>

                    <div className='relative'>
                        <p className='absolute text-lg left-1 top-2.5 text-red-600'>*</p>
                        <input
                            type="text"
                            placeholder='GST number'
                            autoComplete='new-password'
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 ${gstNumberError || gstNumberErrorMessage ? 'border-red-600' : 'border-gray-300'}`}
                            value={gstNumber}
                            onChange={(e) => {
                                setGstNumber(e.target.value)
                                setGstNumberError(false)
                                setGstNumberErrorMessage('')
                            }}
                            onBlur={checkIfGstNumberExists}
                        />
                        {gstNumberErrorMessage && <p className='text-red-600'>{gstNumberErrorMessage}</p>}
                    </div>

                    <div className='relative'>
                        <p className='absolute text-lg left-1 top-2.5 text-red-600'>*</p>
                        <input
                            type="text"
                            placeholder='RERA number'
                            autoComplete='new-password'
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 ${reraNumberError || reraNumberErrorMessage ? 'border-red-600' : 'border-gray-300'}`}
                            value={reraNumber}
                            onChange={(e) => {
                                setReraNumber(e.target.value)
                                setReraNumberError(false)
                                setReraNumberErrorMessage('')
                            }}
                            onBlur={checkIfReraNumberExists}
                        />
                        {reraNumberErrorMessage && <p className='text-red-600'>{reraNumberErrorMessage}</p>}
                    </div>

                    <div className='flex flex-row items-center gap-5'>
                        <p className=' text-gray-700'>Experience (years)</p>

                        <select
                            value={experience}
                            onChange={(e) => setExperience(+e.target.value)}
                            className="cursor-pointer px-2 py-1 border rounded-md outline-none  text-gray-700">
                            {Array.from({ length: 51 }, (_, i) => (
                                <option className=' text-gray-700' key={i} value={i}>{i}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <p>Address</p>
                        <div className="grid sm:grid-cols-2 px-2 gap-2">

                            <div className='relative'>
                                <p className='absolute text-lg left-1 top-2.5 text-red-600'>*</p>
                                <input
                                    autoComplete='new-password'
                                    type="text"
                                    placeholder="Plot number"
                                    className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 ${flatPlotHouseNumberError ? 'border-red-600' : 'border-gray-300'}`}
                                    value={flatPlotHouseNumber}
                                    onChange={(e) => {
                                        setFlatPlotHouseNumber(e.target.value)
                                        setFlatPlotHouseNumberError(false)
                                    }}
                                />
                            </div>

                            <div className='relative'>
                                <p className='absolute text-lg left-1 top-2.5 text-red-600'>*</p>
                                <input
                                    autoComplete='new-password'
                                    type="text"
                                    placeholder="Area/Sector/Village"
                                    className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 ${areaSectorVillageError ? 'border-red-600' : 'border-gray-300'}`}
                                    value={areaSectorVillage}
                                    onChange={(e) => {
                                        setAreaSectorVillage(e.target.value)
                                        setAreaSectorVillageError(false)
                                    }}
                                />
                            </div>

                            <input
                                autoComplete='new-password'
                                type="text"
                                placeholder="Landmark"
                                className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 border-gray-300`}
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                            />

                            <div className='relative'>
                                <p className='absolute text-lg left-1 top-2.5 text-red-600'>*</p>
                                <input
                                    autoComplete='new-password'
                                    type="text"
                                    placeholder="City"
                                    className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 ${cityError ? 'border-red-600' : 'border-gray-300'}`}
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value)
                                        setCityError(false)
                                    }}
                                />
                            </div>

                            <div className='relative'>
                                <p className='absolute text-lg left-1 top-2 text-red-600'>*</p>
                                <select className={`text-gray-700 w-full border pl-4 pr-1.5 py-1.5 rounded-lg cursor-pointer ${stateError ? 'border-red-600' : ''}`} value={state} onChange={(e) => {
                                    setState(e.target.value)
                                    setDistrict('')
                                    setStateError(false)
                                    setDistrictError(false)
                                }}>
                                    <option className='text-gray-300' disabled value="">State</option>
                                    {states.map(option => (
                                        <option className="" key={option} value={option}>
                                            {capitalizeFirstLetterOfAString(option)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='relative'>
                                <p className=' absolute text-lg left-1 top-2 text-red-600'>*</p>
                                <select className={`w-full text-gray-700 border pl-4 pr-1.5 py-1.5 rounded-lg ${state ? 'cursor-pointer' : 'cursor-not-allowed'}  ${districtError ? 'border-red-600' : ''}`}
                                    value={district}
                                    disabled={!state}
                                    onChange={(e) => {
                                        setDistrict(e.target.value)
                                        setDistrictError(false)
                                    }}>
                                    <option disabled value="">District</option>
                                    {state && chooseDistrictsForState(state).map(option => {
                                        return <option className="" key={option} value={option}>
                                            {capitalizeFirstLetterOfAString(option)}
                                        </option>
                                    })}
                                </select>
                            </div>


                            <div className='relative'>
                                <p className='absolute text-lg left-1 top-2.5 text-red-600'>*</p>
                                <input
                                    autoComplete='new-password'
                                    type="number"
                                    placeholder="Pincode"
                                    className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 ${postalCodeError ? 'border-red-600' : 'border-gray-300'}`}
                                    value={postalCode}
                                    onChange={(e) => {
                                        setPostalCodeError(false)
                                        const newValue = e.target.value;
                                        // Check if the input value is a valid number
                                        if (!isNaN(Number(newValue))) {
                                            setPostalCode(Number(newValue));
                                        }
                                    }}
                                />
                            </div>

                        </div>
                    </div>

                    <div className="flex flex-col ">
                        {firmLogoError && <p className='text-red-500'>Add an image</p>}
                        <div className='flex flex-col sm:flex-row gap-3 mb-3'>
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <label className="text-gray-700" htmlFor="image">Firm logo/ Dealer photo</label>
                            </div>

                            <input
                                type='file'
                                className='text-transparent w-fit'
                                placeholder="image"
                                accept="image/png, image/jpeg"
                                name='image'
                                onChange={imageChangeHandler} />
                        </div>
                        {firmLogoImageFile && <div className='flex justify-center'>
                            <img className='w-28 h-auto' src={firmLogoImageFile} alt="" />
                        </div>}
                    </div>

                    <div>
                        <textarea
                            className={`border-2 border-gray-400 p-1 rounded  w-full  resize-none`}
                            rows={3}
                            autoCorrect="on"
                            placeholder='About'
                            autoComplete="new-password"
                            id="about"
                            name="about"
                            value={about}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                setAbout(e.target.value)
                            }} />
                    </div>

                    <div className="w-full flex gap-4 flex-row place-content-center">
                        <button
                            type='button'
                            className={`w-full h-12 bg-red-600  text-white font-medium rounded  flex justify-center items-center gap-1 cursor-pointer hover:bg-red-500`}
                            onClick={checkIfErrorExists}
                        >
                            Continue
                        </button>
                    </div>
                    <div className='flex justify-center items-center gap-2'>
                        <p>Already have an account?</p>
                        <button type='button' className='text-blue-600 hover:text-blue-500 font-semibold' onClick={() => openSignInSignUpModalSetter('sign-in')}>Sign in</button>
                    </div>

                </form >

            </div >
        </Fragment>
    );
};

export default DealerSignUpModal
