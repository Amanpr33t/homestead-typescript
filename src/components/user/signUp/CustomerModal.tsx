import React, { Fragment, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdOutlineEmail } from 'react-icons/md';
import { states } from '../../../utils/states';
import { capitalizeFirstLetterOfAString } from '../../../utils/stringUtilityFunctions';
import { chooseDistrictsForState } from '../../../utils/chooseDistrictsForState';
import SetPasswordModal from './SetPasswordModal';
import { AlertType } from '../../../dataTypes/alertType';
import Spinner from '../../Spinner';
import AlertModal from '../../AlertModal';

interface PropsType {
    openSignInSignUpModalSetter: (input: 'sign-in' | 'sign-up' | null) => void,
    selectedUserTypeSetter: (input: 'dealer' | 'customer' | null) => void
}

const CustomerSignUpModal: React.FC<PropsType> = ({
    openSignInSignUpModalSetter,
    selectedUserTypeSetter
}) => {
    const [spinner, setSpinner] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [email, setEmail] = useState<string>('') //Used to set email
    const [emailError, setEmailError] = useState<boolean>(false) //used to show an error when email is not provided ot the format of email is not correct
    const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null) //Used to set error message to be shown when an error regarding email occurs
    const [emailVerified, setEmailVerified] = useState<boolean>(false) //used to check if an email already exists in the database

    const [contactNumber, setContactNumber] = useState<number | ''>('') //used to set contact number
    const [contactNumberError, setContactNumberError] = useState<boolean>(false) //used to set error when no contact number is provided or a similar contact number already exists in database
    const [contactNumberErrorMessage, setContactNumberErrorMessage] = useState<string | null>(null) //used to set error message for contact number errors
    const [contactNumberVerified, setContactNumberVerified] = useState<boolean>(false) //used to check if the contact number is already present in the database

    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState(false);

    const [district, setDistrict] = useState<string>('');
    const [districtError, setDistrictError] = useState<boolean>(false)

    const [state, setState] = useState('');
    const [stateError, setStateError] = useState<boolean>(false)

    const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')


    //This function is used to check if the email provided by the user is already present in the database
    const checkIfEmailExists = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/customerEmailExists?email=${email}`)
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/customerContactNumberExists?contactNumber=${contactNumber}`)
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

    const checkIfErrorExists = () => {
        if (!state.trim() || !district.trim() || !name.trim() || !contactNumber || !email.trim() || !emailVerified || !contactNumberVerified) {
            if (!state.trim()) {
                setStateError(true)
            }
            if (!district.trim()) {
                setDistrictError(true)
            }
            if (!name.trim()) {
                setNameError(true)
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

    //This function is used to submit the form once the save button is clicked
    const formSubmit = async () => {
        if (!state.trim() || !district.trim() || !name.trim() || !contactNumber || !email.trim() || !emailVerified || !contactNumberVerified) {
            if (!state.trim()) {
                setStateError(true)
            }
            if (!district.trim()) {
                setDistrictError(true)
            }
            if (!name.trim()) {
                setNameError(true)
            }
            if (!email.trim()) {
                setEmailError(true)
            }
            if (!contactNumber) {
                setContactNumberError(true)
            }
            return
        }
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/addCustomer`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    contactNumber,
                    state,
                    district,
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
                //setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'Your account has been successfully created',
                    routeTo: null
                })
                localStorage.setItem(`homestead-user-authToken`, data.authToken)
                localStorage.removeItem('homestead-property-dealer-authToken')
                localStorage.removeItem('homestead-field-agent-authToken')
                localStorage.removeItem('homestead-property-evaluator-authToken')
                localStorage.removeItem('homestead-city-manager-authToken')
                window.location.reload()
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured',
                routeTo: null
            })
            return
        }
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

            <div className={`w-full h-screen fixed top-0 left-0 z-40 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur py-5 ${openPasswordModal && 'transform translate-x-full'}`} onClick={() => {
                selectedUserTypeSetter(null)
                openSignInSignUpModalSetter(null)
            }}>

                <form className="relative max-h-full overflow-y-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-6/12 h-fit py-4 px-4 sm:px-10 flex flex-col gap-5 rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={e => {
                    e.stopPropagation()
                }} >
                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => {
                        selectedUserTypeSetter(null)
                        openSignInSignUpModalSetter(null)
                    }}>
                        <IoClose className="text-3xl" />
                    </button>

                    <p className='text-center text-xl font-bold text-gray-700'>Create account</p>

                    <input
                        type="text"
                        placeholder="Name"
                        className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 ${nameError ? 'border-red-600' : 'border-gray-300'}`}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            setNameError(false)
                        }}
                    />

                    <div className='relative'>
                        <MdOutlineEmail className='absolute left-2 top-2 text-2xl text-gray-500' />
                        <input
                            type="email"
                            placeholder='Email address'
                            autoComplete='new-password'
                            className={`w-full border border-gray-300 rounded-md pl-10 pr-2 py-2 text-gray-700 ${emailError ? 'border-red-600' : 'border-gray-300'}`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError(false)
                                setEmailErrorMessage('')
                            }}
                            onBlur={checkIfEmailExists}
                        />
                        {emailErrorMessage && <p className='text-red-500'>{emailErrorMessage}</p>}
                    </div>

                    <div className='relative'>
                        <div className='flex flex-row gap-2 items-center absolute left-2 top-2'>
                            <FaPhoneAlt className=' text-lg text-gray-500' />
                            <p className='text-gray-400 '>+91</p>
                        </div>

                        <input
                            autoComplete='new-password'
                            type="tel"
                            placeholder="Contact Number"
                            className={`w-full border border-gray-300 rounded-md  pl-16 pr-2 py-2  text-gray-700 ${contactNumberError ? 'border-red-600' : 'border-gray-300'}`}
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
                        {contactNumberErrorMessage && <p className='text-red-500'>{contactNumberErrorMessage}</p>}
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3'>
                        <div className='relative w-full sm:w-1/2 '>
                            <select className={`text-gray-700 w-full  border pl-4 pr-1.5 py-1.5 rounded-lg cursor-pointer ${stateError ? 'border-red-600' : ''}`} value={state} onChange={(e) => {
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

                        <div className='relative w-full sm:w-1/2 '>
                            <select className={`w-full  text-gray-700 border pl-4 pr-1.5 py-1.5 rounded-lg ${state ? 'cursor-pointer' : 'cursor-not-allowed'}  ${districtError ? 'border-red-600' : ''}`}
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
                </form>

            </div >
        </Fragment>
    );
};

export default CustomerSignUpModal
