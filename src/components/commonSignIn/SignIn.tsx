import React, { Fragment, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdOutlineEmail } from 'react-icons/md';
import UserVerification from './UserVerification';
import { AlertType } from '../../dataTypes/alertType';
import Spinner from '../Spinner';
import AlertModal from '../AlertModal';

const CommonSignInModal: React.FC = () => {
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })
    const [spinner, setSpinner] = useState<boolean>(false)

    const [email, setEmail] = useState<string>('');

    const [contactNumber, setContactNumber] = useState<number | ''>('');

    const [showVerficationCodeModal, setShowVerficationCodeModal] = useState<boolean>(false)

    const [emailError, setEmailError] = useState<boolean>(false);

    const [contactNumberError, setContactNumberError] = useState<boolean>(false);

    const [userType, setUSerType] = useState<'field-agent' | 'property-evaluator' | 'city-manager' | null>(null)
    const [userTypeError, setUserTypeError] = useState<boolean>(false)


    const sendVerificationCode = async () => {
        try {
            if ((!email.trim() && !contactNumber) || !userType) {
                if (!userType) {
                    setUserTypeError(true)
                }
                if (!email.trim() && !contactNumber) {
                    setEmailError(true)
                    setContactNumberError(true)
                }
                return
            }
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${userType}/sendOtpForVerification`, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    contactNumber
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            console.log(data)
            if (data.status === 'ok') {
                setSpinner(false)
                setShowVerficationCodeModal(true)
            } else if (data.status === 'invalid-details') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertMessage: `No user with the ${email ? 'email' : 'contact number'} exists. Provide correct details.`,
                    alertType: 'warning',
                    routeTo: null
                })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertMessage: 'Some error occured. Try again.',
                alertType: 'warning',
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

            <div className={`w-full h-screen fixed top-0 left-0 z-40 flex justify-center items-center  py-5 ${(showVerficationCodeModal || alert.isAlertModal) && 'transform translate-x-full'}`} >

                <form className={`relative max-h-full overflow-y-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-6/12 h-fit py-4 px-4 sm:px-10 flex flex-col gap-3 rounded-lg border border-gray-200 shadow-2xl bg-white `} onClick={e => e.stopPropagation()} >

                    <p className='text-center text-xl font-bold text-gray-700'>Sign in</p>

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
                                setContactNumber('')
                                setContactNumberError(false)
                            }}
                        />
                    </div>

                    <p className='text-center text-lg font-semibold text-gray-700'>Or</p>

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
                                const newValue = parseInt(e.target.value); // Parse the value to an integer
                                if (!isNaN(newValue)) { // Check if it's a valid number
                                    setContactNumber(newValue);
                                    setEmail('');
                                    setEmailError(false)

                                }
                                if (e.target.value.length === 0) {
                                    setContactNumber('')
                                }
                            }}
                        />
                    </div>

                    <div className='flex flex-col my-3'>
                        {userTypeError && <p className='text-red-500'>Select a user type</p>}
                        <div className='flex flex-row gap-5'>
                            <p className='font-semibold text-gray-700'>User type</p>
                            <div>
                                <input type="radio" id="field-agent" name="user-type" value="field-agent" className='mr-2' onChange={() => {
                                    setUSerType('field-agent')
                                    setUserTypeError(false)
                                }} />
                                <label htmlFor="field-agent">Field agent</label>
                                <br />
                                <input type="radio" id="city-manager" name="user-type" value="city-manager" className='mr-2' onChange={() => {
                                    setUSerType('city-manager')
                                    setUserTypeError(false)
                                }} />
                                <label htmlFor="city-manager">City manager</label>
                                <br />
                                <input type="radio" id="property-evaluator" name="user-type" value="property-evaluator" className='mr-2' onChange={() => {
                                    setUSerType('property-evaluator')
                                    setUserTypeError(false)
                                }} />
                                <label htmlFor="property-evaluator">Property evalutor</label>
                            </div>
                        </div>
                    </div>


                    <div className="w-full flex gap-4 flex-row place-content-center">
                        <button
                            type='button'
                            className={`w-full h-12 bg-red-600  text-white font-medium rounded  flex justify-center items-center gap-1 cursor-pointer hover:bg-red-500`}
                            onClick={sendVerificationCode}
                        >
                            Continue
                        </button>
                    </div>
                </form>

            </div >

            {(showVerficationCodeModal) &&
                //the form is used to sign in a user
                <UserVerification
                    showVerficationCodeModalSetter={(input) => setShowVerficationCodeModal(input)}
                    email={email}
                    contactNumber={contactNumber}
                    showVerificationCodeModal={showVerficationCodeModal}
                    userType={userType}
                    alert={alert}
                    alertSetter={(input) => setAlert(input)}
                    sendVerificationCode={sendVerificationCode}
                />
            }
        </Fragment>
    );
};

export default CommonSignInModal
