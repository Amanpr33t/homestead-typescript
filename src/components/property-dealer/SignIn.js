import { Fragment, useState, useEffect } from "react"
import * as EmailValidator from 'email-validator';
import AlertModal from "../AlertModal";
import { useNavigate } from "react-router-dom";

/*This component contains code for the following tasks:
  1) For sign in of a property dealer
  2) For password change by a proeprty dealer in case he forgets password
*/
function PropertyDealerSignIn() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-property-dealer-authToken")

    useEffect(() => {
        if (authToken) {
            navigate('/property-dealer', { replace: true })
        }
    }, [authToken, navigate])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: ''
    }) //This state is used to show or hide alert modal
    const [isSpinner, setIsSpinner] = useState(false) //This state is used to show or hide spinner

    const [emailForPasswordChange, setEmailForPasswordChange] = useState('') //This state stores the email for which the user wants to change password.
    const [isEmailForPasswordChangeValid, seetEmailForPasswordChangeValid] = useState(true) //This state it true when the format of email, for the password change, is valid.

    const [email, setEmail] = useState('') //This state stores the email provided by the user for sign in.
    const [emailValid, setEmailValid] = useState(true) //This state is true when if the email provided by the user for sigin in is valid, and vice-versa

    const [password, setPassword] = useState('') //This state stores the password provided by the user for sign in.
    const [passwordValid, setPasswordValid] = useState(true) //This state is true when if the password provided by the user for sign in is valid, and vice-versa

    const [isForgotPassword, setIsForgotPassword] = useState(false) //This state is set to true when the chooses to change password
    const [confirmOTP, setConfirmOTP] = useState(false) //This state is set to true if the OTP for password change has been successfully sent to the email of the user.
    const [newPasswordEnabler, setNewPasswordEnabler] = useState(false) //This state is set to true when the user provides the correct OTP to our API
    const [oneTimePassword, setOneTimePassword] = useState('') //This state stores the OTP the user receives from the server

    const [buttonText, setButtonText] = useState('Sign in') //This state manages the text to be shown inside the submit button in our form

    const [newPassword, setNewPassword] = useState('') //This state stores the new password provided by the user
    const [newPasswordValid, setNewPasswordValid] = useState(true) //This state is true if the new password provided by the user for signin is in valid format, and vice-versa
    const [confirmNewPassword, setConfirmNewPassword] = useState('') //This state stores the new confirmed password provided by the user
    const [confirmNewPasswordValid, setConfirmNewPasswordValid] = useState(true) //This state is true if the new confirmed password provided by the user for signin is in valid format, and vice-versa

    //This useEffect hook is used manage the buttonText state
    useEffect(() => {
        if (isForgotPassword && !confirmOTP) {
            setButtonText('Send OTP to email')
        } else if (isForgotPassword && confirmOTP) {
            if (newPasswordEnabler) {
                setButtonText('Reset password')
            } else {
                setButtonText('Confirm OTP')
            }
        } else {
            setButtonText('Sign in')
        }
    }, [isForgotPassword, confirmOTP, newPasswordEnabler])

    //This is the function that resets all the states
    const resetStateFunction = () => {
        setEmail('')
        setPassword('')
        setEmailValid(true)
        setPasswordValid(true)
        setNewPassword('')
        setConfirmNewPassword('')
        setConfirmNewPasswordValid(true)
        setNewPasswordValid(true)
        setIsForgotPassword(false)
        setConfirmOTP(false)
        setNewPasswordEnabler(false)
        setOneTimePassword('')
        setEmailForPasswordChange('')
        seetEmailForPasswordChangeValid(true)
    }

    //This function is used to sign in the user
    const signInFunction = async (e) => {
        if (!email || !password) {
            return
        } else if (!EmailValidator.validate(email) && (password.trim().length < 6 || password.trim().length > 10)) {
            setEmailValid(false)
            setPasswordValid(false)
            return
        } else if (EmailValidator.validate(email) && (password.trim().length < 6 || password.trim().length > 10)) {
            setPasswordValid(false)
            return
        } else if (!EmailValidator.validate(email) && (password.trim().length >= 6 || password.trim().length <= 10)) {
            setEmailValid(false)
            return
        }
        setIsSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/signIn`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                localStorage.setItem('homestead-property-dealer-authToken', data.authToken)
                navigate('/property-dealer', { replace: true })
                setIsSpinner(false)
            } else if (data.status === 'not_found') {
                setIsSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'No dealer agent with this email exists'
                })
            } else if (data.status === 'incorrect_password') {
                setIsSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'Incorrect password'
                })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setIsSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
        }
    }

    //This function is used to send a request to the API. The API will then send a user verification token or OTP to the email 
    const forgotPasswordRequest = async () => {
        if (!emailForPasswordChange) {
            return
        }
        if (!EmailValidator.validate(emailForPasswordChange)) {
            seetEmailForPasswordChangeValid(false)
            return
        }
        setIsSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/forgotPassword`, {
                method: 'PATCH',
                body: JSON.stringify({ email: emailForPasswordChange }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setIsSpinner(false)
                setConfirmOTP(true)
            } else if (data.status === 'not_found') {
                setIsSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'No dealer with this email exists'
                })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setIsSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
        }
    }

    //This function is used to confirm the user verification token or OTP
    const confirmOneTimePasswordFunction = async () => {
        setIsSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/confirmPasswordVerificationToken`, {
                method: 'POST',
                body: JSON.stringify({
                    email: emailForPasswordChange,
                    passwordVerificationToken: oneTimePassword
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
                setIsSpinner(false)
                setNewPasswordEnabler(true)
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'OTP has been successfully confirmed'
                })
            } else if (data.status === 'incorrect_token') {
                setIsSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'Incorrect OTP'
                })
            } else if (data.status === 'token_expired') {
                setIsSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'OTP has expired'
                })
                resetStateFunction()
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setIsSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
        }
    }

    //This function is used to update the password
    const updatePassword = async () => {
        if (!newPassword || !confirmNewPassword) {
            return
        }
        if (newPassword.trim().length < 6 || newPassword.trim().length > 10 || confirmNewPassword.trim().length < 6 || confirmNewPassword.trim().length > 10) {
            if (newPassword.trim().length < 6 || newPassword.trim().length > 10) {
                setNewPasswordValid(false)
            }
            if (confirmNewPassword.trim().length < 6 || confirmNewPassword.trim().length > 10) {
                setConfirmNewPasswordValid(false)
            }
            return
        }
        if (newPassword.trim() !== confirmNewPassword.trim()) {
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Both password are not similar'
            })
            return
        }
        setIsSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/updatePassword`, {
                method: 'PATCH',
                body: JSON.stringify({
                    email: emailForPasswordChange,
                    newPassword,
                    passwordVerificationToken: oneTimePassword
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
                setIsSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'Password updated successfully'
                })
                resetStateFunction()
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setIsSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
        }
    }

    //This function is used to reset the OTP or user verification token in the database
    const resetPasswordVerificationToken = async () => {
        setIsSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/resetPasswordVerificationToken`, {
                method: 'PATCH',
                body: JSON.stringify({ email: emailForPasswordChange }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setIsSpinner(false)
                resetStateFunction()
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setIsSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
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

            {!alert.isAlertModal  && <div className='fixed w-full top-20 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
                <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/', { replace: true })}>Home</button>
            </div>}

            <div className={`w-full h-screen pt-32 flex justify-center ${alert.isAlertModal ? 'blur-sm' : null}`} >
                <form className="w-full sm:w-96 p-4 mr-1.5 ml-1.5 flex flex-col bg-white rounded border-2 shadow-2xl h-fit" onSubmit={e => {
                    e.preventDefault()
                    if (!isForgotPassword) {
                        return signInFunction()
                    }
                    if (isForgotPassword) {
                        if (!confirmOTP) {
                            return forgotPasswordRequest()
                        }
                        if (confirmOTP) {
                            if (newPasswordEnabler) {
                                return updatePassword()
                            }
                            return confirmOneTimePasswordFunction()
                        }
                    }
                }}>

                    {!isForgotPassword && <>
                        <label className="text-lg font-semibold mb-1" htmlFor="email-1">Email</label>
                        <input type="email" id="email-1" name="email-1" className="border-2 border-gray-400 p-1 rounded" placeholder="abcd@gmail.com" autoComplete="new-password" value={email}
                            onChange={e => {
                                setEmailValid(true)
                                setEmail(e.target.value.trimEnd().toLowerCase())
                            }} />
                        {!emailValid && <p className="text-red-500">Email not in correct format</p>}
                        <label className="text-lg font-semibold mb-1 mt-2" htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" className="border-2 border-gray-400 p-1 rounded" autoComplete="new-password" value={password}
                            onChange={e => {
                                setPassword(e.target.value.trimEnd())
                                setPasswordValid(true)
                            }} />
                        {!passwordValid && <p className="text-red-500">Password should be of atleast 6 and not more than 10 characters.</p>}
                    </>}


                    {isForgotPassword && !confirmOTP && <>
                        <label className="text-lg font-semibold mb-1" htmlFor="email-2">Field agent email</label>
                        <input type="email" id="email-2" name="email-2" className="border-2 border-gray-400 p-1 rounded" placeholder="abcd@gmail.com" autoComplete="new-password" value={emailForPasswordChange}
                            onChange={e => {
                                seetEmailForPasswordChangeValid(true)
                                setEmailForPasswordChange(e.target.value.trimEnd())
                            }} />
                        {!isEmailForPasswordChangeValid && <p className="text-red-500">Email not in correct format</p>}
                    </>}


                    {confirmOTP && !newPasswordEnabler && <>
                        <label className="text-lg font-semibold mb-1" htmlFor="otp">A one-time-password(OTP) has been sent to your email. OTP will be valid for 10 minutes.</label>
                        <input type="text" id="otp" name="otp" className="border-2 border-gray-400 p-1 rounded" placeholder="Enter OTP here..." autoComplete="new-password" value={oneTimePassword}
                            onChange={e => { setOneTimePassword(e.target.value.trimEnd()) }} />
                    </>}

                    {newPasswordEnabler && <>
                        <label className="text-lg font-semibold mb-1 mt-2" htmlFor="newPassword">New password</label>
                        <input type="password" id="newPassword" name="newPassword" className="border-2 border-gray-400 p-1 rounded" autoComplete="password" value={newPassword}
                            onChange={e => {
                                setNewPassword(e.target.value.trimEnd())
                                setNewPasswordValid(true)
                            }} />
                        {!newPasswordValid && <p className="text-red-500">Password should be of atleast 6 and not more than 10 characters.</p>}

                        <label className="text-lg font-semibold mb-1 mt-2" htmlFor="confirmNewPassword">Confirm new password</label>
                        <input type="password" id="confirmNewPassword" name="confirmNewPassword" className="border-2 border-gray-400 p-1 rounded" autoComplete="password" value={confirmNewPassword}
                            onChange={e => {
                                setConfirmNewPassword(e.target.value.trimEnd())
                                setConfirmNewPasswordValid(true)
                            }} />
                        {!confirmNewPasswordValid && <p className="text-red-500">Password should be of atleast 6 and not more than 10 characters.</p>}
                    </>}

                    <div className="w-full h-12 flex justify-center mt-4 border-b border-gray-400 ">
                        {!isSpinner && <button type="submit" className="w-full bg-blue-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">{buttonText}</button>}
                        {isSpinner && <div className="w-full bg-blue-500 rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1 cursor-pointer">
                            <div className="animate-spin text-white font-bold text-xl">&#9696;</div>
                        </div>}
                    </div>

                    {!isForgotPassword &&
                        <div className="w-full flex flex-col place-items-center mt-2 pb-2 cursor-pointer font-medium border-b border-gray-400">
                            <div className="flex flex-row gap-1">
                                <p>Don't have an account?</p>
                                <button type='button' className="text-blue-600" onClick={()=>navigate('/property-dealer/signUp')}>Sign Up</button>
                            </div>
                        </div>}

                    {!isForgotPassword &&
                        <div className="w-full flex flex-col place-items-center mt-2 cursor-pointer font-medium ">
                            <div className="flex flex-row gap-1">
                                <button type='button' className="text-red-600" onClick={(e) => {
                                    setIsForgotPassword(true)
                                    setEmail('')
                                    setEmailValid(true)
                                }}>Forgot password?</button>
                            </div>
                        </div>}
                    {isForgotPassword &&
                        <div className="flex justify-center mt-4">
                            <button type='button' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={async () => {
                                if (confirmOTP) {
                                    return await resetPasswordVerificationToken()
                                }
                                resetStateFunction()
                            }}>Sign in with an existing account</button>
                        </div>}
                </form>
            </div>
        </Fragment >
    )
}
export default PropertyDealerSignIn