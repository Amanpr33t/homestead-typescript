import { Fragment, useState } from "react"
import * as EmailValidator from 'email-validator';
import AlertModal from "../AlertModal";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

function VerifyPropertyDealerBeforeAddingProperty(props) {
    const navigate = useNavigate()
    const { propertyDealerSetterFunction } = props
    const authToken = localStorage.getItem("homestead-field-agent-authToken") //This variable stores the authToken present in local storage

    const [email, setEmail] = useState('')
    const [emailValid, setEmailValid] = useState(true)

    const [contactNumber, setContactNumber] = useState('')

    const [dealerId, setDealerId] = useState('')

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: ''
    }) //This state is used to show or hide alert modal

    const [showOtpModal, setShowOtopModal] = useState(false)
    const [otp, setOtp] = useState('')

    const [spinner, setSpinner] = useState(false) //This state is used to show or hide spinner

    const formSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim() && !contactNumber.trim() && !dealerId.trim()) {
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
            } else if (contactNumber.trim()) {
                query = `contactNumber=${contactNumber.trim()}`
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

    const verifyOtp = async (e) => {
        e.preventDefault()
        if (!otp.trim()) {
            return
        }
        try {
            setSpinner(true)
            let query
            if (email.trim()) {
                query = `email=${email.trim()}&otp=${otp.trim()}`
            } else if (contactNumber.trim()) {
                query = `contactNumber=${contactNumber.trim()}&otp=${otp.trim()}`
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
            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} alertModalRemover={() => setAlert({
                isAlertModal: false,
                alertType: '',
                alertMessage: ''
            })} />}

            {/* The code below is used to show a spinner */}
            {spinner && <Spinner />}

            <div className={`w-full h-screen pt-32 flex  justify-center ${alert.isAlertModal || spinner ? 'blur-sm' : ''}`} >

                {showOtpModal &&
                    <form className="w-full sm:w-96 p-4 mr-1.5 ml-1.5 flex flex-col bg-white rounded border-2 shadow-2xl h-fit" onSubmit={verifyOtp}>
                        <p className="text-lg font-bold text-center mb-3">A one-time-password has been sent to dealer's email. It will be valid for 10 minutes. </p>
                        <input type="otp" id="otp" name="otp" className="border-2 border-gray-400 p-1 rounded" placeholder="Enter OTP here..." autoComplete="new-password" value={otp}
                            onChange={e => {
                                setOtp(e.target.value)
                            }} />
                        <div className="flex justify-center mt-4">
                            <button type='submit' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">Verify OTP</button>
                        </div>
                    </form>}

                {!showOtpModal &&
                    <form className="w-full sm:w-96 p-4 mr-1.5 ml-1.5 flex flex-col bg-white rounded border-2 shadow-2xl h-fit" onSubmit={formSubmit}>

                        <p className="text-lg font-bold text-center mb-3">Provide email or contact number or dealer Id of the property dealer</p>

                        <label className="text-lg font-semibold mb-1 text-gray-600" htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" className="border-2 border-gray-400 p-1 rounded" placeholder="dealer@gmail.com" autoComplete="new-password" value={email}
                            onChange={e => {
                                setEmailValid(true)
                                setContactNumber('')
                                setEmail(e.target.value.trimEnd().toLowerCase())
                                setDealerId('')
                            }} />
                        {!emailValid && <p className="text-red-500">Email not in correct format</p>}

                        <p className="text-center text-xl font-semibold mb-3 mt-3">Or</p>

                        <label className="text-lg font-semibold mb-0.5 text-gray-600" htmlFor="dealerId">Dealer Id</label>
                        <input type="text" className='border-2 border-gray-400  p-1 rounded' id="dealerId" name="dealerId" autoComplete="new-password" value={dealerId} onChange={e => {
                            setEmail('')
                            setContactNumber('')
                            setDealerId(e.target.value.trimEnd())
                        }} />

                        <p className="text-center text-xl font-semibold mb-3 mt-3">Or</p>

                        <label className="text-lg font-semibold mb-0.5 text-gray-600" htmlFor="contactNumber">Contact number</label>
                        <input type="tel" className='border-2 border-gray-400  p-1 rounded' id="contactNumber" name="contactNumber" placeholder='E.g. 9876543210' autoComplete="new-password" value={contactNumber} onChange={e => {
                            setEmail('')
                            setContactNumber(e.target.value.trimEnd())
                            setDealerId('')
                        }} />
                        <div className="flex justify-center mt-4">
                            <button type='submit' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">Submit</button>
                        </div>
                    </form>}
            </div>
        </Fragment >
    )
}
export default VerifyPropertyDealerBeforeAddingProperty