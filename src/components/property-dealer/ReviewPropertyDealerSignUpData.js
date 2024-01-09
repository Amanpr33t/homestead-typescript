import { Fragment, useEffect, useState } from "react"
import AlertModal from "../AlertModal";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";
import validator from 'validator'

//This component is used to review the property dealer data befor sending the data to the server
function ReviewPropertyDealerSignUpData(props) {
    const {
        firmName,
        propertyDealerName,
        experience,
        addressArray,
        gstNumber,
        reraNumber,
        about,
        firmLogoImageUpload,
        firmLogoImageFile,
        hideReviewForm
    } = props
    const navigate = useNavigate()

    const [spinner, setSpinner] = useState(false) //used to set spinner
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: ''
    }) //used to set the alert modal

    const [showEmailPasswordPage, setShowEmailPasswordPage] = useState(false)

    const [email, setEmail] = useState('') //Used to set email
    const [emailError, setEmailError] = useState(false) //used to show an error when email is not provided or the format of email is not correct
    const [emailErrorMessage, setEmailErrorMessage] = useState(false) //Used to set error message to be shown when an error regarding email occurs
    const [emailVerified, setEmailVerified] = useState(false) //used to check if an email already exists in the database

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [passwordsNotSameError, setPasswordsNotSameError] = useState(false)

    const [contactNumber, setContactNumber] = useState('') //used to set contact number
    const [contactNumberError, setContactNumberError] = useState(false) //used to set error when no contact number is provided or a similar contact number already exists in database
    const [contactNumberErrorMessage, setContactNumberErrorMessage] = useState(false) //used to set error message for contact number errors
    const [contactNumberVerified, setContactNumberVerified] = useState(false) //used to check if the contact number is already present in the database

    const [finalAlertModal, setFinalAlertModal] = useState(false)


    //The code in useEffect hook is used to scroll to the top of the page
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const authToken = localStorage.getItem("homestead-property-dealer-authToken") //This variable stores the authToken present in local storage

    //This function is used to check if the email provided by the user is already present in the database
    const checkIfEmailExists = async (e) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/propertyDealerEmailExists?email=${email}`)
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/propertyDealerContactNumberExists?contactNumber=${contactNumber}`)
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

    //The function is used to upload images to the server
    const imageUpload = async () => {
        try {
            const formData = new FormData()
            formData.append('file', firmLogoImageUpload)
            formData.append('upload_preset', 'homestead')
            formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
            //The fetch promise code is used to store image in cloudinary database
            const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'post',
                body: formData
            })
            const cloudinaryData = await cloudinaryResponse.json()
            if (cloudinaryData && cloudinaryData.error) {
                throw new Error('Some error occured')
            }
            return cloudinaryData
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
            return
        }
    }

    const verifyData = (e) => {
        e.preventDefault()
        if (!contactNumber.trim() || !email.trim() || !validator.isEmail(email.trim()) || (!password || password.length < 6 || password.length > 10) || (!confirmPassword || confirmPassword.length < 6 || confirmPassword.length > 10) || (password !== confirmPassword)) {
            if (!email.trim()) {
                setEmailError(true)
                setEmailErrorMessage('Provide an email')
            }
            if (email.trim() && !validator.isEmail(email.trim())) {
                setEmailError(true)
                setEmailErrorMessage('Email not in correct format')
            }
            if ((!password || password.length < 6 || password.length > 10) || (!confirmPassword || confirmPassword.length < 6 || confirmPassword.length > 10)) {
                if (!password || password.length < 6 || password.length > 10) {
                    setPasswordError(true)
                }
                if (!confirmPassword || confirmPassword.length < 6 || confirmPassword.length > 10) {
                    setConfirmPasswordError(true)
                }
            } else {
                setPasswordsNotSameError(true)
            }
            if (!contactNumber.trim()) {
                setContactNumberError(true)
                setContactNumberErrorMessage('Provide a contact number')
            }
            return
        }
        if (emailError || contactNumberError) {
            return
        }
        if (!emailVerified || !contactNumberVerified) {
            return
        }
        setFinalAlertModal(true)
    }

    //This function is used to save details to backend API
    const saveDetailsToDatabase = async (e) => {
        try {
            setSpinner(true)
            setFinalAlertModal(false)
            let cloudinaryData = ''
            if (firmLogoImageUpload) {
                cloudinaryData = await imageUpload()
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/addPropertyDealer`, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    contactNumber,
                    password,
                    firmName,
                    propertyDealerName,
                    experience,
                    addressArray,
                    gstNumber,
                    reraNumber,
                    about,
                    firmLogoUrl: cloudinaryData.secure_url
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
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
                    alertMessage: 'Property dealer added successfully',
                    routeTo: '/property-dealer/signIn'
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
            return
        }
    }

    return (
        <Fragment>
            {spinner && <Spinner />}

            {/*The code bolow is used to show an alert modal to the user */}
            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}

            {!showEmailPasswordPage && <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center ${spinner || alert.isAlertModal ? 'blur' : ''}`} >
                <button type='button' className="fixed top-16 mt-2 left-2  bg-green-500 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 z-20 " onClick={hideReviewForm}>Back</button>

                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-bold text-center">Review the details</p>
                </div>

                <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                    <thead >
                        <tr className="bg-gray-200 border-2 border-gray-200">
                            <th className="w-40 text-xl pt-2 pb-2">Field</th>
                            <th className="text-xl ">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Firm name</td>
                            <td className=" pt-2 pb-2 text-center">{firmName}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Property dealer</td>
                            <td className="pt-2 pb-2 text-center">{propertyDealerName}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Experience</td>
                            <td className="pt-2 pb-2 text-center">{experience}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">GST Number</td>
                            <td className="pt-2 pb-2 text-center" >{gstNumber}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">RERA Number</td>
                            <td className="pt-2 pb-2 text-center" >{reraNumber}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Address</td>
                            <td className="flex flex-row place-content-center gap-2 flex-wrap pt-2 pb-2 text-center">
                                {addressArray.map(address => {
                                    return <div key={Math.random()} className="bg-gray-200 border-gray-200 rounded w-60 p-1">
                                        <p className="">{address.flatPlotHouseNumber}, {address.areaSectorVillage}, near {address.landmark}, {address.city}, {address.state}</p>
                                        <p>Pincode: {address.postalCode}</p>
                                    </div>
                                })}
                            </td>
                        </tr>
                        {about && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">About</td>
                            <td className="pt-2 pb-2 text-center">{about}</td>
                        </tr>}
                        {firmLogoImageFile && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Firm logo</td>
                            <td className="pt-2 pb-2 flex justify-center">
                                <img className='w-28 h-auto' src={firmLogoImageFile} alt="" />
                            </td>
                        </tr>}
                    </tbody>
                </table>
                {!alert.isAlertModal && <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button type='button' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => setShowEmailPasswordPage(true)}>Save</button>
                    <button type='button' className="bg-orange-400 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={hideReviewForm}>Edit</button>
                </div>}
            </div>}

            {showEmailPasswordPage && <div className={`w-full h-screen pt-28 flex justify-center ${finalAlertModal || spinner || alert.isAlertModal ? 'blur' : ''}`}>

                <button type='button' className="fixed top-16 mt-2 left-2  bg-green-500 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 z-20 " onClick={() => setShowEmailPasswordPage(false)}>Back</button>

                <form onSubmit={verifyData} className="w-full sm:w-96 p-4 mr-1.5 ml-1.5 flex flex-col gap-2 bg-white rounded border-2 shadow-2xl h-fit">
                    <p className="text-lg w-full text-center font-bold">Provide contact details and set a password</p>
                    {/*email*/}
                    <div className="flex flex-col ">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" className={`border-2 ${emailError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} autoComplete="new-password" value={email} onChange={e => {
                            setEmail(e.target.value.trimEnd().toLowerCase())
                            setEmailError(false)
                        }} onBlur={checkIfEmailExists} />
                        {emailError && <p className="text-red-500">{emailErrorMessage}</p>}
                    </div>

                    {/*contact number*/}
                    <div className="flex flex-col ">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="contactNumber">Contact number</label>
                        <input type="tel" className={`border-2 ${contactNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} id="contactNumber" name="contactNumber" placeholder='E.g. 9876543210' autoComplete="new-password" value={contactNumber} onChange={e => {
                            setContactNumber(e.target.value.trimEnd())
                            setContactNumberError(false)
                        }} onBlur={checkIfContactNumberExists} />
                        {contactNumberError && <p className="text-red-500">{contactNumberErrorMessage}</p>}
                    </div>

                    {/*password*/}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="password">Password</label>
                        <input type="password" autoComplete="password" id="password" name="password" className={`border-2 ${passwordError || passwordsNotSameError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} value={password} onChange={e => {
                            setPassword(e.target.value.trimEnd())
                            setPasswordError(false)
                            setPasswordsNotSameError(false)
                        }} />
                        {passwordError && <p className="text-red-500">Password should be of 6-10 characters</p>}
                    </div>

                    {/*confirm password*/}
                    <div className="flex flex-col  ">
                        <div className="flex flex-col">
                            <label className="text-lg font-semibold mb-0.5" htmlFor="confirm-password">Confirm Password</label>
                            <input type="password" autoComplete="password" id="confirm-password" name="confirm-password" className={`border-2 ${confirmPasswordError || passwordsNotSameError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} value={confirmPassword} onChange={e => {
                                setConfirmPassword(e.target.value.trimEnd())
                                setConfirmPasswordError(false)
                                setPasswordsNotSameError(false)
                            }} />
                            {confirmPasswordError && <p className="text-red-500">Password should be of 6-10 characters</p>}
                        </div>
                        {passwordsNotSameError && <p className="text-red-500">Enter same passwords</p>}
                    </div>

                    <div className="flex justify-center mt-4">
                        <button type='submit' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">Save details</button>
                    </div>
                </form>


            </div>}

            {finalAlertModal && <div className="fixed z-50 top-16 pt-12 bg-transparent h-screen w-full flex justify-center " onClick={() => setFinalAlertModal(false)}>
                <div className="relative w-11/12 sm:w-96 h-fit rounded shadow bg-white" onClick={e => e.stopPropagation()}>
                    <button type="button" className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-md w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => setFinalAlertModal(false)}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-700 ">Make sure your email and contact number are correct. You wouldn't be able to change them after saving the data</h3>
                        <div className="w-full flex gap-4 flex-row place-content-center">
                            <button type='button' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={saveDetailsToDatabase}>Save Details</button>
                            <button type='button' className="bg-orange-400 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => setFinalAlertModal(false)}>Edit Details</button>
                        </div>
                    </div>
                </div>
            </div>}

        </Fragment >
    )
}
export default ReviewPropertyDealerSignUpData