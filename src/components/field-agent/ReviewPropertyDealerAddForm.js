import { Fragment, useEffect, useState } from "react"
//import Spinner from "../Spinner"
//This component is tde navigation bar
import AlertModal from "../AlertModal";
import Spinner from "../Spinner";

function ReviewPropertyDealerAddForm(props) {
    const {
        firmName,
        propertyDealerName,
        experience,
        propertyType,
        addressArray,
        gstNumber,
        about,
        imageFile,
        imageUpload,
        email,
        contactNumber,
        hideReviewForm
    } = props
    const [spinner, setSpinner] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: ''
    })
    const [routeTo, setRouteTo] = useState('')

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const authToken = localStorage.getItem("homestead-field-agent-authToken")
    const formData = new FormData()
    formData.append('file', imageUpload)

    const saveDetailsToDatabase = async () => {
        setSpinner(true)
        try {
            const formData = new FormData()
            formData.append('file', imageUpload)
            formData.append('upload_preset', 'homestead')
            formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
            const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'post',
                body: formData
            })
            const cloudinaryData = await cloudinaryResponse.json()
            if (cloudinaryData && cloudinaryData.error) {
                throw new Error('Some error occured')
            }

            if (cloudinaryData && cloudinaryData.secure_url) {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/addPropertyDealer`, {
                    method: 'POST',
                    body: JSON.stringify({
                        firmName,
                        propertyDealerName,
                        experience,
                        propertyType,
                        addressArray,
                        gstNumber,
                        about,
                        cloudinaryImageURL: cloudinaryData.secure_url,
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
                    setRouteTo('/field-agent')
                    setAlert({
                        isAlertModal: true,
                        alertType: 'success',
                        alertMessage: 'Property dealer added successfully'
                    })
                } else if (data.status === 'invalid_authentication') {
                    setSpinner(false)
                    localStorage.removeItem("homestead-field-agent-authToken")
                    setRouteTo('/field-agent/signIn')
                    setAlert({
                        isAlertModal: true,
                        alertType: 'warning',
                        alertMessage: 'Session expired. Please login again'
                    })
                } else {
                    throw new Error('Some error occured')
                }
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setRouteTo('')
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
            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: ''
                })
            }} />}

            <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center ${spinner || alert.isAlertModal ? 'blur' : ''}`} >
                <button type='button' className="fixed top-16 mt-2 left-2  bg-green-500 text-white font-semibold rounded-lg pl-2 pr-2 pt-0.5 h-8 z-20 " onClick={hideReviewForm}>Back</button>

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
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">property type</td>
                            <td className="flex flex-col pt-2 pb-2 text-center">
                                {propertyType.map(type => {
                                    return <p key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                                })}
                            </td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Address</td>
                            <td className="flex flex-row place-content-center gap-2 flex-wrap pt-2 pb-2 text-center">
                                {addressArray.map(address => {
                                    return <div key={address.id} className="bg-gray-200 border-gray-200 rounded-lg w-60 p-1">
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
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Email</td>
                            <td className="pt-2 pb-2 text-center">{email}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Contact Number</td>
                            <td className="pt-2 pb-2 text-center">{contactNumber}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Dealers Image</td>
                            <td className="pt-2 pb-2 flex justify-center">
                                <img className='w-28 h-auto' src={imageFile} alt="" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button type='button' className="bg-green-500 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={saveDetailsToDatabase}>Save</button>
                    <button type='button' className="bg-orange-400 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => {
                        hideReviewForm()
                    }}>Edit</button>
                </div>
            </div>

        </Fragment >
    )
}
export default ReviewPropertyDealerAddForm