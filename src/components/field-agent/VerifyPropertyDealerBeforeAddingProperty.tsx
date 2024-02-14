import React, { Fragment, useState } from "react"
import * as EmailValidator from 'email-validator';
import AlertModal from "../AlertModal";
import { useNavigate } from "react-router-dom";

interface propsType {
    propertyDealerSetterFunction: (dealer: {
        dealerId: string,
        firmName: string,
        firmLogoUrl: string
    }) => void
}
interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null
}

//This component is used to verify a property dealer before adding a property
const VerifyPropertyDealerBeforeAddingProperty: React.FC<propsType> = ({ propertyDealerSetterFunction }) => {
    const navigate = useNavigate()

    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")

    const [email, setEmail] = useState<string>('') //email of the proeprty dealer
    const [emailValid, setEmailValid] = useState<boolean>(true) //it is false if the email is not in valid format

    const [contactNumber, setContactNumber] = useState<string | number>('') //contact number of the property dealer

    const [dealerId, setDealerId] = useState<string>('') //dealerID of the proerty dealer

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null
    }) //This state is used to show or hide alert modal

    const [showOtpModal, setShowOtopModal] = useState<boolean>(false) //If it is true, an OTP modal will be shown where the user can fill the OTP
    const [otp, setOtp] = useState<string>('') //This state stores the OTP

    const [spinner, setSpinner] = useState<boolean>(false) //This state is used to show or hide spinner

    //This function is used to generate an OTP. The OTP is sent to the property dealers email
    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!email.trim() && !contactNumber && !dealerId.trim()) {
            return setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide email or contact number or dealer Id'
            })
        }
        if (email.trim() && !EmailValidator.validate(email.trim())) {
            return setEmailValid(false)
        }
        try {
            setSpinner(true)
            let query
            if (email.trim()) {
                query = `email=${email.trim()}`
            } else if (contactNumber) {
                query = `contactNumber=${contactNumber}`
            } else if (dealerId.trim()) {
                query = `dealerId=${dealerId.trim()}`
            } else {
                return
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealerOtpGeneration?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'noDealerExists') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'No dealer with this email or contact number exists'
                })
            } else if (data.status === 'ok') {
                setSpinner(false)
                setShowOtopModal(true)
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
                return
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured. Try again'
            })
        }
    }

    //The function is to verify the OTP
    const verifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!otp.trim()) {
            return
        }
        try {
            setSpinner(true)
            let query
            if (email.trim()) {
                query = `email=${email.trim()}&otp=${otp.trim()}`
            } else if (contactNumber) {
                query = `contactNumber=${contactNumber}&otp=${otp.trim()}`
            } else if (dealerId.trim()) {
                query = `dealerId=${dealerId.trim()}&otp=${otp.trim()}`
            } else {
                return
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealerOtpVerification?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'incorrect_token') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'OTP is incorrect'
                })
            } else if (data.status === 'token_expired') {
                setSpinner(false)
                setShowOtopModal(false)
                setOtp('')
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'OTP has expired.'
                })
            } else if (data.status === 'ok') {
                propertyDealerSetterFunction(data.dealer)
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
                return
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured. Try again'
            })
        }
    }

    return (
        <Fragment>

            {/*The code bolow is used to show an alert modal to the user */}
            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    alertModalRemover={() => setAlert({
                        isAlertModal: false,
                        alertType: null,
                        alertMessage: null
                    })} />}

            <div className={`w-full h-screen pt-32 flex  justify-center ${alert.isAlertModal ? 'blur-sm' : ''}`} >

                {showOtpModal &&
                    //A form that is used to get OTP from user
                    <form className="w-full sm:w-96 p-4 mr-1.5 ml-1.5 flex flex-col bg-white rounded border-2 shadow-2xl h-fit" onSubmit={verifyOtp}>
                        <p className="text-lg font-semibold text-center mb-3">A one-time-password has been sent to dealer's email. It will be valid for 10 minutes. </p>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            className="border-2 border-gray-400 p-1 rounded"
                            placeholder="Enter OTP here..."
                            autoComplete="new-password"
                            value={otp}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setOtp(e.target.value)
                            }} />

                        <div className="w-full flex justify-center mt-4">
                            <button
                                type='submit'
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1"
                                disabled={spinner}>
                                {spinner ? (
                                    <div className="spinner absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                                ) : (
                                    "Verify OTP"
                                )}
                            </button>
                        </div>
                    </form>}

                {!showOtpModal &&
                    //A form used to get email or contact number or dealerID from user
                    <form className="w-full sm:w-96 p-4 mr-1.5 ml-1.5 flex flex-col bg-white rounded border-2 shadow-2xl h-fit" onSubmit={formSubmit}>

                        <p className="text-lg font-semibold text-center mb-3">Provide email or contact number or dealer Id of the property dealer</p>

                        <label className="text-lg font-semibold mb-1 text-gray-600" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="border-2 border-gray-400 p-1 rounded"
                            placeholder="dealer@gmail.com" autoComplete="new-password"
                            value={email}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmailValid(true)
                                setContactNumber('')
                                setEmail(event.target.value.trimEnd().toLowerCase())
                                setDealerId('')
                            }} />
                        {!emailValid && <p className="text-red-500">Email not in correct format</p>}

                        <p className="text-center text-xl font-semibold mb-3 mt-3">Or</p>

                        <label className="text-lg font-semibold mb-0.5 text-gray-600" htmlFor="dealerId">Dealer Id  </label>
                        <input
                            type="text"
                            className='border-2 border-gray-400  p-1 rounded'
                            id="dealerId"
                            name="dealerId"
                            autoComplete="new-password"
                            value={dealerId}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail('')
                                setContactNumber('')
                                setDealerId(event.target.value.trimEnd())
                            }} />

                        <p className="text-center text-xl font-semibold mb-3 mt-3">Or</p>

                        <label className="text-lg font-semibold mb-0.5 text-gray-600" htmlFor="contactNumber">Contact number</label>
                        <input
                            type="tel"
                            className='border-2 border-gray-400  p-1 rounded'
                            id="contactNumber"
                            name="contactNumber"
                            placeholder='E.g. 9876543210'
                            autoComplete="new-password"
                            value={contactNumber}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail('')
                                setContactNumber(+event.target.value.trimEnd())
                                setDealerId('')
                            }} />

                        <div className="w-full flex justify-center mt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1"
                                disabled={spinner || alert.isAlertModal}>
                                {spinner ? (
                                    <div className="spinner absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </form>}
            </div>
        </Fragment >
    )
}
export default VerifyPropertyDealerBeforeAddingProperty