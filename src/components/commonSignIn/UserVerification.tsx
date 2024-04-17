import React, { Fragment, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdLockOpen, MdOutlineEmail } from 'react-icons/md';
import Spinner from '../Spinner';
import { AlertType } from '../../dataTypes/alertType';
import { useNavigate } from 'react-router-dom';

interface PropsType {
    email: string,
    contactNumber: '' | number,
    showVerificationCodeModal: boolean,
    showVerficationCodeModalSetter: (input: boolean) => void,
    userType: 'field-agent' | 'property-evaluator' | 'city-manager' | null
    alertSetter: (input: AlertType) => void,
    alert: AlertType,
    sendVerificationCode: () => void
}

const UserVerification: React.FC<PropsType> = ({ email, contactNumber, showVerificationCodeModal, showVerficationCodeModalSetter, userType, alert, alertSetter, sendVerificationCode }) => {
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState<boolean>(false)

    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const [verificationToken, setVerificationToken] = useState<string>('')
    const [verificationTokenError, setVerificationTokenError] = useState<boolean>(false)

    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false)

    const signIn = async () => {
        try {
            if (showPasswordModal) {
                if (!password) {
                    return setPasswordError(true)
                }
            } else {
                if (!verificationToken) {
                    return setVerificationTokenError(true)
                }
            }
            let requestBody: any
            if (showPasswordModal) {
                requestBody = {
                    password
                }
            } else {
                requestBody = {
                    otp: verificationToken.toString()
                }
            }
            if (email) {
                requestBody = {
                    ...requestBody,
                    email
                }
            } else {
                requestBody = {
                    ...requestBody,
                    contactNumber
                }
            }
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${userType}/signIn`, {
                method: 'POST',
                body: JSON.stringify(requestBody),
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
                if (userType === 'field-agent') {
                    localStorage.setItem(`homestead-field-agent-authToken`, data.authToken)
                    navigate('/field-agent')
                } else if (userType === 'property-evaluator') {
                    localStorage.setItem(`homestead-property-evaluator-authToken`, data.authToken)
                    navigate('/property-evaluator')
                } else if (userType === 'city-manager') {
                    localStorage.setItem(`homestead-city-manager-authToken`, data.authToken)
                    navigate('/city-manager')
                }
                showVerficationCodeModalSetter(false)
            } else if (data.status === 'incorrect_token' || data.status === 'incorrect_password') {
                setSpinner(false)
                alertSetter({
                    isAlertModal: true,
                    alertMessage: `Please enter a valid ${data.status === 'incorrect_token' ? 'verification token' : 'password'}`,
                    alertType: 'warning',
                    routeTo: null
                })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            alertSetter({
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

            <div className={`w-full h-screen fixed top-0 left-0 z-40 flex justify-center items-center   py-5 ${(alert.isAlertModal) && 'transform translate-x-full'}`} onClick={() => showVerficationCodeModalSetter(false)}>
                <form className="relative max-h-full overflow-y-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-6/12 h-fit py-4 px-4 sm:px-10 flex flex-col gap-3 rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={e => e.stopPropagation()} >
                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => showVerficationCodeModalSetter(false)}>
                        <IoClose className="text-3xl" />
                    </button>

                    <p className='text-center text-xl font-bold text-gray-700'>{showVerificationCodeModal ? 'Check your email for a code' : 'Enter your password'}</p>
                    {showVerificationCodeModal && <p className=''>Check your inbox for a 6-digit code and enter it below.</p>}


                    <div className='relative'>
                        {email.trim() && <MdOutlineEmail className='absolute left-2 top-2 text-2xl text-gray-500' />}
                        {contactNumber && <FaPhoneAlt className='absolute left-2 top-3 text-lg text-gray-500' />}
                        <button type='button' className='absolute right-2 top-2  font-semibold text-blue-500 hover:text-blue-600' onClick={() => showVerficationCodeModalSetter(false)}>Edit</button>
                        {email.trim() &&
                            <input
                                type="email"
                                disabled={true}
                                className={`w-full border border-gray-300 rounded-md pl-10 pr-2 py-2 text-gray-700 $border-gray-300`}
                                value={email}
                            />}
                        {contactNumber && <input
                            autoComplete='new-password'
                            type="tel"
                            className={`w-full border border-gray-300 rounded-md  pl-16 pr-2 py-2  text-gray-700 border-gray-300`}
                            value={contactNumber}
                        />}
                    </div>

                    {!showPasswordModal && <div className='relative'>
                        <p className='absolute -top-2.5 left-10 px-2 text-sm text-gray-700 bg-white'>Verification code</p>
                        <MdLockOpen className='absolute left-2 top-8 text-xl text-gray-700' />

                        <input
                            autoComplete='new-password'
                            type="text"
                            className={`w-full border border-gray-300 rounded-md  pl-16 pr-2 py-5 text-3xl text-gray-700 ${verificationTokenError ? 'border-red-600' : 'border-gray-300'}`}
                            value={verificationToken}
                            onChange={(e) => {
                                setVerificationTokenError(false)
                                setVerificationToken(e.target.value)
                            }}
                        />
                    </div>}

                    {showPasswordModal &&
                        <div className='relative'>
                            <p className='absolute -top-2.5 left-10 px-2 text-sm text-gray-700 bg-white'>Password</p>
                            <MdLockOpen className='absolute left-2 top-8 text-xl text-gray-700' />

                            <input
                                autoComplete='new-password'
                                type="password"
                                className={`w-full border border-gray-300 rounded-md  pl-16 pr-2 py-5 text-3xl text-gray-700 ${passwordError ? 'border-red-600' : 'border-gray-300'}`}
                                value={password}
                                onChange={(e) => {
                                    setPasswordError(false)
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                    }

                    <div className="w-full flex gap-4 flex-row place-content-center">
                        <button
                            type='button'
                            className={`w-full h-12 bg-red-600  text-white font-medium rounded  flex justify-center items-center gap-1 cursor-pointer hover:bg-red-500`}
                            onClick={signIn}
                        >
                            Sign in
                        </button>
                    </div>

                    {!showPasswordModal && <div className='flex justify-center items-center gap-2'>
                        <p>Can't find it?</p>
                        <button type='button' className='text-blue-600 hover:text-blue-500 font-semibold' onClick={sendVerificationCode}>Resend</button>
                    </div>}

                    <div className='flex justify-center items-center gap-2'>
                        <button type='button' className='text-blue-600 hover:text-blue-500 font-semibold' onClick={() => {
                            setShowPasswordModal(boolean => !boolean)
                            setPassword('')
                            setVerificationToken('')
                        }}>{showPasswordModal ? 'Use verification token to sign in' : 'Use password to sign in.'}</button>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default UserVerification
