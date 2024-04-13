import React, { Fragment, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdOutlineEmail } from 'react-icons/md';
import UserVerificationForSignIn from './UserVerificationForSignIn';
import { AlertType } from '../../../dataTypes/alertType';
import Spinner from '../../Spinner';
import AlertModal from '../../AlertModal';


interface PropsType {
    modalReset: () => void,
    selectUserTypeModalSetter: () => void
}

const SignInModal: React.FC<PropsType> = ({ modalReset, selectUserTypeModalSetter }) => {

    const [spinner, setSpinner] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [email, setEmail] = useState<string>('');

    const [contactNumber, setContactNumber] = useState<number | ''>('');

    const [showVerficationCodeModal, setShowVerficationCodeModal] = useState<boolean>(false)

    const [emailError, setEmailError] = useState<boolean>(false);

    const [contactNumberError, setContactNumberError] = useState<boolean>(false);

    const [userType, setUserType] = useState<'dealer' | 'customer'>('customer')

    const sendVerificationCode = async () => {
        try {
            if (!email.trim() && !contactNumber) {
                setEmailError(true)
                setContactNumberError(true)
                return
            }
            setSpinner(true)
            let url: string = ''
            if (userType === 'dealer') {
                url = `${process.env.REACT_APP_BACKEND_URL}/property-dealer/sendOtpForVerification`
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}/user/sendOtpForVerification`
            }
            const response = await fetch(url, {
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

            {spinner && <Spinner />}

            <div className={`w-full h-screen fixed top-0 left-0 z-40 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur py-5 ${(showVerficationCodeModal || alert.isAlertModal) && 'transform translate-x-full'}`} onClick={modalReset}>

                <form className={`relative max-h-full overflow-y-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-6/12 h-fit py-4 px-4 sm:px-10 flex flex-col gap-3 rounded-lg border border-gray-200 shadow-2xl bg-white `} onClick={e => e.stopPropagation()} >
                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={modalReset}>
                        <IoClose className="text-3xl" />
                    </button>

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

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 cursor-pointer"
                            onChange={e => {
                                if (e.target.checked) {
                                    setUserType('dealer')
                                } else {
                                    setUserType('customer')
                                }
                            }}
                        />
                        <span className="ml-2 text-gray-700 cursor-pointer">Sign in as a property dealer</span>
                    </label>


                    <div className="w-full flex gap-4 flex-row place-content-center">
                        <button
                            type='button'
                            className={`w-full h-12 bg-red-600  text-white font-medium rounded  flex justify-center items-center gap-1 cursor-pointer hover:bg-red-500`}
                            onClick={sendVerificationCode}
                        >
                            Continue
                        </button>
                    </div>
                    <div className='flex justify-center items-center gap-2'>
                        <p>Don't have an account?</p>
                        <button type='button' className='text-blue-600 hover:text-blue-500 font-semibold' onClick={selectUserTypeModalSetter}>Create account</button>
                    </div>
                </form>

            </div >

            {(showVerficationCodeModal ) &&
                //the form is used to sign in a user
                <UserVerificationForSignIn
                    showVerficationCodeModalSetter={(input) => setShowVerficationCodeModal(input)}
                    email={email}
                    contactNumber={contactNumber}
                    modalReset={modalReset}
                    showVerificationCodeModal={showVerficationCodeModal}
                    userType={userType}
                />
            }
        </Fragment>
    );
};

export default SignInModal
