import { Fragment, useEffect, useState } from "react"
import AlertModal from "../AlertModal";
import Spinner from "../Spinner";

//This component is used to review the property dealer data submitted
function ReviewAgriculturalPropertyAfterSubmission(props) {
    const { propertyData, agriculturalLandImageFile, contractImageFile, propertyDataReset, agricultureLandImageUpload, contractImageUpload } = props

    const [spinner, setSpinner] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const authToken = localStorage.getItem("homestead-field-agent-authToken") //This variable stores the authToken present in local storage

    //This function is used to send details to backend API
    const saveDetailsToDatabase = async () => {
        try {
            let agriculturalLandImagesUrl = []
            setSpinner(true)
            agricultureLandImageUpload.length && agricultureLandImageUpload.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
                //The fetch promise code is used to store image in cloudinary database
                const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const cloudinaryData = await cloudinaryResponse.json()
                if (cloudinaryData && cloudinaryData.error) {
                    agriculturalLandImagesUrl = []
                    throw new Error('Some error occured')
                }
                agriculturalLandImagesUrl.push(cloudinaryData.secure_url)
            })

            let contractImagesUrl = []
            contractImageUpload.length && contractImageUpload.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
                //The fetch promise code is used to store image in cloudinary database
                const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const cloudinaryData = await cloudinaryResponse.json()
                if (cloudinaryData && cloudinaryData.error) {
                    contractImagesUrl = []
                    throw new Error('Some error occured')
                }
                contractImagesUrl.push(cloudinaryData.secure_url)
            })

            const finalPropertyData = {
                agriculturalLandImagesUrl,
                contractImagesUrl,
                ...propertyData
            }

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/addAgriculturalProperty`, {
                method: 'POST',
                body: JSON.stringify(finalPropertyData),
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
                    alertMessage: 'Property has been added successfully',
                    routeTo: null
                })
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'Session expired. Please login again',
                    routeTo: '/field-agent/signIn'
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

            <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center ${spinner || alert.isAlertModal ? 'blur' : ''}`} >
                <button type='button' className="fixed top-16 mt-2 left-2  bg-green-500 text-white font-semibold rounded-lg pl-2 pr-2 pt-0.5 h-8 z-20 " onClick={propertyDataReset}>Back</button>

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
                            <td className=" pt-2 pb-2 text-center">ABCD Private limited</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Land Size</td>
                            <td className="pt-2 pb-2 text-center">
                                <p>{propertyData.landSize.size} {propertyData.landSize.unit}</p>
                                {propertyData.landSize.details && < p > {propertyData.details}</p>}
                            </td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Location</td>
                            <td className="pt-2 pb-2 text-center">
                                {propertyData.location.name.village && <p>{propertyData.location.name.village}</p>}
                                {propertyData.location.name.city && <p>{propertyData.location.name.city}</p>}
                                {propertyData.location.name.tehsil && <p>{propertyData.location.name.tehsil}</p>}
                                {<p>{propertyData.location.name.district}</p>}
                                {<p>{propertyData.location.name.state}</p>}
                            </td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Number of owners</td>
                            <td className="pt-2 pb-2 text-center" >{propertyData.numberOfOwners}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Water Source</td>
                            <td className="flex flex-col pt-2 pb-2 text-center">
                                {propertyData.waterSource.canal.length > 0 && <div className="flex flex-row">
                                    <p>Canal</p>
                                    <div>
                                        {propertyData.waterSource.canal.map(canal => {
                                            return <p key={Math.random()}>{canal}</p>
                                        })}
                                    </div>
                                </div>}
                                {propertyData.waterSource.river.length > 0 && <div className="flex flex-row">
                                    <p>River</p>
                                    <div>
                                        {propertyData.waterSource.river.map(river => {
                                            return <p key={Math.random()}>{river}</p>
                                        })}
                                    </div>
                                </div>}
                                {propertyData.waterSource.tubewells.numberOfTubewells > 0 && <div className="flex flex-row">
                                    <p>Tubewell</p>
                                    <div>
                                        {propertyData.waterSource.tubewells.depth.map(depth => {
                                            return <p key={Math.random()}>{depth}</p>
                                        })}
                                    </div>
                                </div>}
                            </td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Reservoir</td>
                            <td className="flex flex-row place-content-center gap-2 flex-wrap pt-2 pb-2 text-center">
                                {!propertyData.reservoir.isReservoir &&
                                    <p>No</p>
                                }
                                {propertyData.reservoir.isReservoir &&
                                    <><div>
                                        <p>Type of Reservoir</p>
                                        {propertyData.reservoir.type.map(type => {
                                            return <p key={Math.random()}>{type}</p>
                                        })}
                                    </div>
                                        {propertyData.reservoir.type.includes('private') &&
                                            <div>
                                                <p>Capacity</p>
                                                <p>{propertyData.reservoir.capacityOfPrivateReservoir} {propertyData.reservoir.unitOfCapacityForPrivateReservoir}</p>
                                            </div>
                                        }
                                    </>
                                }
                            </td>
                        </tr>
                        {propertyData.irrigationSystem.length > 0 && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Irrigation System</td>
                            <td className="flex flex-row place-content-center gap-2 flex-wrap pt-2 pb-2 text-center">
                                {propertyData.irrigationSystem.map(system => {
                                    return <p key={system}>{system}</p>
                                })}
                            </td>
                        </tr>}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Price</td>
                            <td className="pt-2 pb-2 text-center">
                                <p>{propertyData.priceDemanded.number}</p>
                                <p>{propertyData.priceDemanded.words}</p>
                            </td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Crops</td>
                            <td className="pt-2 pb-2 text-center">
                                {propertyData.crops.map(crop => {
                                    return <p key={crop}>{crop}</p>
                                })}
                            </td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Road type</td>
                            <td className="pt-2 pb-2 text-center">
                                <p>{propertyData.road.type}</p>
                                {propertyData.road.details && <p>{propertyData.road.details}</p>}
                            </td>
                        </tr>
                        {<tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Legal Restrictions</td>
                            <td className="pt-2 pb-2 text-center">
                                <p>{propertyData.legalRestrictions.isLegalRestrictions}</p>
                                <p>{propertyData.legalRestrictions.details}</p>
                            </td>
                            </tr>}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Nearby town</td>
                            <td className="pt-2 pb-2 text-center">
                                <p>{propertyData.nearbyTown}</p>
                            </td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Land images</td>
                            <td className="pt-2 pb-2 flex justify-center">
                                {agriculturalLandImageFile.map(image => {
                                    return <img key={Math.random()} className='w-28 h-auto' src={image} alt="" />;
                                })}
                            </td>
                        </tr>
                        {contractImageFile.length && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Contract images</td>
                            <td className="pt-2 pb-2 flex justify-center">
                                {contractImageFile.map(image => {
                                    return <img key={Math.random()} className='w-28 h-auto' src={image} alt="" />
                                })}
                            </td>
                        </tr>}
                    </tbody>
                </table>
                <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button type='button' className="bg-green-500 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={saveDetailsToDatabase}>Save</button>
                    <button type='button' className="bg-orange-400 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => {
                        propertyDataReset()
                    }}>Edit</button>
                </div>
            </div>

        </Fragment >
    )
}
export default ReviewAgriculturalPropertyAfterSubmission