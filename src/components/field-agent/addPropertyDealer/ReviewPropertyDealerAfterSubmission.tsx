import { Fragment, useEffect, useState } from "react"
import AlertModal from "../../AlertModal";
import { useNavigate } from "react-router-dom";

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

interface AddressType {
    addressId: number,
    flatPlotHouseNumber: string,
    areaSectorVillage: string,
    landmark: string | null,
    postalCode: number,
    city: string,
    state: string,
    district: string
}

interface PropsType {
    firmName: string,
    propertyDealerName: string,
    experience: number,
    addressArray: AddressType[],
    gstNumber: string,
    reraNumber: string,
    about: string | null,
    firmLogoImageUpload: File | null,
    firmLogoImageFile: string | null,
    email: string,
    contactNumber: number,
    hideReviewForm: () => void
}

//This component is used to review the property dealer data befor sending the data to the server
const ReviewPropertyDealerAfterSubmission: React.FC<PropsType> = (props) => {
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
        email,
        contactNumber,
        hideReviewForm
    } = props
    const navigate = useNavigate()

    const [spinner, setSpinner] = useState<boolean>(false) //used to set spinner
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    }) //used to set the alert modal

    //The code in useEffect hook is used to scroll to the top of the page
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken") //This variable stores the authToken present in local storage

    //The function is used to upload images to the server
    const imageUpload = async () => {
        try {
            if (!firmLogoImageUpload || !process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
                throw new Error('No file selected for upload');
            }
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
            return cloudinaryData.secure_url
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

    //This function is used to save details to backend API
    const saveDetailsToDatabase = async () => {
        setSpinner(true)
        try {
            let cloudinaryData = ''
            if (firmLogoImageUpload) {
                cloudinaryData = await imageUpload()
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/addPropertyDealer`, {
                method: 'POST',
                body: JSON.stringify({
                    firmName,
                    propertyDealerName,
                    experience,
                    addressArray,
                    gstNumber,
                    reraNumber,
                    about: about?.trim() || null,
                    firmLogoUrl: cloudinaryData,
                    email,
                    contactNumber
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
                    routeTo: '/field-agent'
                })
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
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
            {/*The code bolow is used to show an alert modal to the user */}
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

            <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center ${alert.isAlertModal ? 'blur' : ''}`} >

                {/*back button */}
                <button
                    type='button'
                    className="fixed top-16 mt-2 left-2  bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 z-20 "
                    onClick={hideReviewForm}>
                    Back
                </button>

                {/*heading */}
                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-semibold text-center">Review the details</p>
                </div>

                <table
                    className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto"
                    onClick={(e: React.MouseEvent<HTMLTableElement>) => e.stopPropagation()}>
                    <thead >
                        <tr className="bg-gray-200 border-2 border-gray-200">
                            <th className="w-40 text-xl pt-2 pb-2">Field</th>
                            <th className="text-xl ">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* firm name*/}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Firm name</td>
                            <td className=" pt-2 pb-2 text-center">{firmName}</td>
                        </tr>

                        {/*dealer name*/}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Property dealer</td>
                            <td className="pt-2 pb-2 text-center">{propertyDealerName}</td>
                        </tr>

                        {/* experience*/}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Experience</td>
                            <td className="pt-2 pb-2 text-center">{experience}</td>
                        </tr>

                        {/*GST number*/}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">GST Number</td>
                            <td className="pt-2 pb-2 text-center" >{gstNumber}</td>
                        </tr>

                        {/*RERA number */}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">RERA Number</td>
                            <td className="pt-2 pb-2 text-center" >{reraNumber}</td>
                        </tr>

                        {/* Address*/}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Address</td>
                            <td className="flex flex-row place-content-center gap-2 flex-wrap pt-2 pb-2 text-center">
                                {addressArray.map(address => {
                                    return <div key={address.addressId} className="bg-gray-200 border-gray-200 rounded w-60 p-1">
                                        <p className="">{address.flatPlotHouseNumber}, {address.areaSectorVillage}, near {address.landmark}, {address.city}, {address.state}</p>
                                        <p>Pincode: {address.postalCode}</p>
                                    </div>
                                })}
                            </td>
                        </tr>

                        {/*about */}
                        {about && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">About</td>
                            <td className="pt-2 pb-2 text-center">{about}</td>
                        </tr>}

                        {/*email */}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Email</td>
                            <td className="pt-2 pb-2 text-center">{email}</td>
                        </tr>

                        {/*contact number */}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Contact Number</td>
                            <td className="pt-2 pb-2 text-center">{contactNumber}</td>
                        </tr>

                        {/*firm logo */}
                        {firmLogoImageFile && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Firm logo</td>
                            <td className="pt-2 pb-2 flex justify-center">
                                <img className='w-28 h-auto' src={firmLogoImageFile} alt="" />
                            </td>
                        </tr>}
                    </tbody>
                </table>

                <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button
                        type='button'
                        className={`px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pt-0.5 h-8 flex flex-row place-content-center gap-1 ${spinner ? 'w-20' : ''}`}
                        disabled={spinner || alert.isAlertModal}
                        onClick={saveDetailsToDatabase}>
                        {spinner ? (
                            <div className="spinner absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                        ) : (
                            'Save'
                        )}
                    </button>
                    <button
                        type='button'
                        className="bg-orange-400 hover:bg-orange-500 text-white font-medium rounded px-6 pt-0.5 h-8 flex flex-row place-content-center gap-1"
                        disabled={spinner || alert.isAlertModal}
                        onClick={hideReviewForm}>
                        Edit
                    </button>
                </div>
            </div>

        </Fragment >
    )
}
export default ReviewPropertyDealerAfterSubmission