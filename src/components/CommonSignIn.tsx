import { Fragment, useState, useEffect } from "react"
import * as EmailValidator from 'email-validator';
import AlertModal from "./AlertModal";
import { useNavigate } from "react-router-dom";
import useLoginSignupPasswordChange from "../custom-hooks/useLoginSignupPasswordChange";

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null
}

interface PropsType {
    userType: 'field-agent' | 'property-evaluator' | 'city-manager' | 'property-dealer' | 'user'
}

/*This component contains code for the following tasks:
  1) For sign in of a user
  2) For password change by a user in case he forgets password
*/
const CommonSignIn: React.FC<PropsType> = ({ userType }) => {
    const navigate = useNavigate()

    const authToken: string | null = localStorage.getItem(`homestead-${userType}-authToken`)

    const { signIn, forgotPassword, confirmOneTimePassword, updatePassword, resetPasswordVerificationToken } = useLoginSignupPasswordChange(userType)

    useEffect(() => {
        if (authToken) {
            navigate(`/${userType}`, { replace: true })
            return
        }
    }, [authToken, navigate, userType])

    const [emailForPasswordChange, setEmailForPasswordChange] = useState<string>('') //This state stores the email for which the user wants to change password.
    const [isEmailForPasswordChangeValid, seetEmailForPasswordChangeValid] = useState<boolean>(true) //This state it true when the format of email, for the password change, is valid.

    const [email, setEmail] = useState<string>('') //This state stores the email provided by the user for sign in.
    const [emailValid, setEmailValid] = useState<boolean>(true) //This state is true when if the email provided by the user for sigin in is valid, and vice-versa

    const [password, setPassword] = useState<string>('') //This state stores the password provided by the user for sign in.
    const [passwordValid, setPasswordValid] = useState<boolean>(true) //This state is true when if the password provided by the user for sign in is valid, and vice-versa

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null
    }) //This state is used to show or hide alert modal

    const [spinner, setSpinner] = useState<boolean>(false) //This state is used to show or hide spinner

    const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false) //This state is set to true when the chooses to change password
    const [confirmOTP, setConfirmOTP] = useState<boolean>(false) //This state is set to true if the OTP for password change has been successfully sent to the email of the user.
    const [newPasswordEnabler, setNewPasswordEnabler] = useState<boolean>(false) //This state is set to true when the user provides the correct OTP to our API
    const [oneTimePassword, setOneTimePassword] = useState<string>('') //This state stores the OTP the user receives from the server

    const [buttonText, setButtonText] = useState<string>('Sign in') //This state manages the text to be shown inside the submit button in our form

    const [newPassword, setNewPassword] = useState<string>('') //This state stores the new password provided by the user
    const [newPasswordValid, setNewPasswordValid] = useState<boolean>(true) //This state is true if the new password provided by the user for signin is in valid format, and vice-versa
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('') //This state stores the new confirmed password provided by the user
    const [confirmNewPasswordValid, setConfirmNewPasswordValid] = useState<boolean>(true) //This state is true if the new confirmed password provided by the user for signin is in valid format, and vice-versa

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
    const signInFunction = async () => {
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
        setSpinner(true)
        try {
            const responseData = await signIn(email, password)
            if (responseData.status === 'ok') {
                localStorage.setItem(`homestead-${userType}-authToken`, responseData.authToken)
                navigate(`/${userType}`, { replace: true })
                setSpinner(false)
                return
            } else if (responseData.status === 'not_found') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'No user agent with this email exists'
                })
            } else if (responseData.status === 'incorrect_password') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'Incorrect password'
                })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
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
        setSpinner(true)
        try {
            const responseData = await forgotPassword(emailForPasswordChange)
            if (responseData.status === 'ok') {
                setSpinner(false)
                setConfirmOTP(true)
            } else if (responseData.status === 'not_found') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'No user with this email exists'
                })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
        }
    }

    //This function is used to confirm the user verification token or OTP
    const confirmOneTimePasswordFunction = async () => {
        setSpinner(true)
        try {
            const responseData = await confirmOneTimePassword(emailForPasswordChange, oneTimePassword)
            if (responseData.status === 'ok') {
                setSpinner(false)
                setNewPasswordEnabler(true)
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'OTP has been successfully confirmed'
                })
            } else if (responseData.status === 'incorrect_token') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'Incorrect OTP'
                })
            } else if (responseData.status === 'token_expired') {
                setSpinner(false)
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
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
        }
    }

    //This function is used to update the password
    const updateUserPassword = async () => {
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
                alertMessage: 'Both password not similar'
            })
            return
        }
        setSpinner(true)
        try {
            const responseData = await updatePassword(emailForPasswordChange, newPassword, oneTimePassword)
            if (responseData.status === 'ok') {
                setSpinner(false)
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
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
        }
    }

    //This function is used to reset the OTP or user verification token in the database
    const resetPasswordVerificationTokenFunction = async () => {
        setSpinner(true)
        try {
            const responseData = await resetPasswordVerificationToken(emailForPasswordChange)
            if (responseData.status === 'ok') {
                setSpinner(false)
                resetStateFunction()
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
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
            {alert.isAlertModal && <AlertModal
                message={alert.alertMessage}
                type={alert.alertType}
                routeTo={null}
                alertModalRemover={() => setAlert({
                    isAlertModal: false,
                    alertType: null,
                    alertMessage: null
                })} />}

            {/*Home button  */}
            {!alert.isAlertModal && <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
                <button
                    type='button'
                    className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8 hover:bg-green-600"
                    onClick={() => {
                        navigate('/', { replace: true })
                        return
                    }}>
                    Home
                </button>
            </div>}

            <div className={`w-full h-screen pt-28 flex justify-center ${alert.isAlertModal ? 'blur-sm' : null}`} >
                <form
                    className="w-full sm:w-96 p-4 mr-1.5 ml-1.5 flex flex-col bg-white rounded border-2 shadow-2xl h-fit"
                    onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault()
                        if (!isForgotPassword) {
                            //User sign in 
                            return signInFunction()
                        }
                        if (isForgotPassword) {
                            //Code if user reuests for a new password as he has forgotten the old password
                            if (!confirmOTP) {
                                return forgotPasswordRequest()
                            }
                            if (confirmOTP) {
                                if (newPasswordEnabler) {
                                    return updateUserPassword()
                                }
                                return confirmOneTimePasswordFunction()
                            }
                        }
                    }}>

                    {/*Sign in box*/}
                    {!isForgotPassword && <>
                        <label
                            className="text-lg font-semibold mb-1"
                            htmlFor="email-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email-1"
                            name="email-1"
                            className="border-2 border-gray-400 p-1 rounded"
                            placeholder="abcd@gmail.com"
                            autoComplete="new-password"
                            value={email}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmailValid(true)
                                setEmail(event.target.value.trimEnd().toLowerCase())
                            }} />
                        {!emailValid && <p className="text-red-500">Email not in correct format</p>}
                        <label
                            className="text-lg font-semibold mb-1 mt-2"
                            htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="border-2 border-gray-400 p-1 rounded"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword(event.target.value.trimEnd())
                                setPasswordValid(true)
                            }} />
                        {!passwordValid && <p className="text-red-500">Password should be of atleast 6 and not more than 10 characters.</p>}
                    </>}

                    {/*This box is shown to user when he types email for new password generation*/}
                    {isForgotPassword && !confirmOTP && <>
                        <label
                            className="text-lg font-semibold mb-1"
                            htmlFor="email-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email-2"
                            name="email-2"
                            className="border-2 border-gray-400 p-1 rounded"
                            placeholder="abcd@gmail.com"
                            autoComplete="new-password"
                            value={emailForPasswordChange}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                seetEmailForPasswordChangeValid(true)
                                setEmailForPasswordChange(event.target.value.trimEnd())
                            }} />
                        {!isEmailForPasswordChangeValid && <p className="text-red-500">Email not in correct format</p>}
                    </>}

                    {/*This box is used to confirm the OTP sent to user */}
                    {confirmOTP && !newPasswordEnabler && <>
                        <label
                            className="text-lg font-semibold mb-1"
                            htmlFor="otp">
                            A one-time-password(OTP) has been sent to your email. OTP will be valid for 10 minutes.
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            className="border-2 border-gray-400 p-1 rounded"
                            placeholder="Enter OTP here..."
                            autoComplete="new-password"
                            value={oneTimePassword}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setOneTimePassword(event.target.value.trimEnd()) }} />
                    </>}

                    {/*Using this box the user fills in the new password */}
                    {newPasswordEnabler && <>
                        <label
                            className="text-lg font-semibold mb-1 mt-2"
                            htmlFor="newPassword">
                            New password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="border-2 border-gray-400 p-1 rounded"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setNewPassword(event.target.value.trimEnd())
                                setNewPasswordValid(true)
                            }} />
                        {!newPasswordValid && <p className="text-red-500">Password should be of atleast 6 and not more than 10 characters.</p>}

                        <label
                            className="text-lg font-semibold mb-1 mt-2"
                            htmlFor="confirmNewPassword">
                            Confirm new password
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            className="border-2 border-gray-400 p-1 rounded"
                            autoComplete="new-password"
                            value={confirmNewPassword}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setConfirmNewPassword(event.target.value.trimEnd())
                                setConfirmNewPasswordValid(true)
                            }} />
                        {!confirmNewPasswordValid && <p className="text-red-500">Password should be of atleast 6 and not more than 10 characters.</p>}
                    </>}

                    {/*Submission button*/}
                    <div className="w-full h-12 flex justify-center mt-4 border-b border-gray-400 ">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1 "
                            disabled={spinner || alert.isAlertModal}>
                            {spinner ? (
                                <div className="spinner absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                            ) : (
                                buttonText
                            )}
                        </button>
                    </div>

                    {/*This text is shown to user with the sign in box*/}
                    {!isForgotPassword &&
                        <div className="w-full flex flex-col place-items-center mt-2 cursor-pointer font-medium ">
                            <p>Forgot password?</p>
                            <div className="flex flex-row gap-1">
                                <button type='button' className="text-red-600 hover:text-red-700" onClick={() => {
                                    if (!spinner) {
                                        setIsForgotPassword(true)
                                        setEmail('')
                                        setEmailValid(true)
                                    }
                                }}>Click here</button>
                                <p>to create a new password.</p>
                            </div>
                        </div>}

                    {/*This text is shown to user with the forgaot password box*/}
                    {isForgotPassword &&
                        <div className="flex justify-center mt-4">
                            <button type='button' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={async () => {
                                if (confirmOTP) {
                                    return await resetPasswordVerificationTokenFunction()
                                }
                                resetStateFunction()
                            }}>Sign in with an existing account</button>
                        </div>}
                </form>
            </div>
        </Fragment >
    )
}
export default CommonSignIn