import { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../AlertModal";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

//The component is used to review the details of a commercial proeprty before they are sent to the server
function ReviewCommercialPropertyAfterSubmission(props) {
    const { propertyData, propertyDataReset, firmName, commercialPropertyImages, contractImages } = props
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    const [propertyImagesUrl, setPropertyImagesUrl] = useState([]) //array that stores the url of the commercial property images
    const [contractImagesUrl, setContractImagesUrl] = useState([])//array that stores the url of the contract images

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) //it scrools screen to the top
    }, [])
    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    //The function is used to upload images to the database
    const uploadImages = async () => {
        try {
            setPropertyImagesUrl([])
            setContractImagesUrl([])
            setSpinner(true)
            commercialPropertyImages.length && commercialPropertyImages.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image.upload)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.error) {
                    setPropertyImagesUrl([])
                    throw new Error('Some error occured')
                } else {
                    setPropertyImagesUrl(images => [...images, data.secure_url])
                }
            })

            contractImages.length && contractImages.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image.upload)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.error) {
                    setContractImagesUrl([])
                    throw new Error('Some error occured')
                } else {
                    setContractImagesUrl(images => [...images, data.secure_url])
                }
            })
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

    //The function is used to storre data to the database
    const saveDetailsToDatabase = useCallback(async (finalPropertyData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/addCommercialProperty`, {
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
    }, [authToken, navigate])

    //The code in the useEffect hook is executed when the images are sucessfully uploaded
    useEffect(() => {
        if (propertyImagesUrl.length === commercialPropertyImages.length && contractImagesUrl.length === contractImages.length) {
            saveDetailsToDatabase({
                propertyImagesUrl,
                contractImagesUrl,
                ...propertyData
            })
        }
    }, [propertyImagesUrl, contractImagesUrl, propertyImagesUrl.length, commercialPropertyImages.length, contractImagesUrl.length, contractImages.length, saveDetailsToDatabase, propertyData])

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

            <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center z-20 ${spinner || alert.isAlertModal ? 'blur' : ''}`} >
                <button type='button' className="fixed top-16 mt-2 left-2  bg-green-500 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 z-30 " onClick={() => {
                    propertyDataReset()
                    //setFinalPropertyData(null)
                }}>Back</button>

                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-semibold text-center">Review the details</p>
                </div>

                <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                    <thead >
                        <tr className="bg-gray-200 border-2 border-gray-300">
                            <th className="w-28 text-xl pt-4 pb-4 sm:w-fit">Field</th>
                            <th className="text-xl ">Data</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Firm name</td>
                            <td className=" pt-4 pb-4 text-center">{firmName}</td>
                        </tr>

                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.commercialPropertyType === 'industrial' ? 'Industrial/Institutional' : 'Shop/Showroom/Booth'}</td>
                        </tr>

                        {propertyData.commercialPropertyType === 'shop' && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Shop type</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.shopPropertyType}</td>
                        </tr>}

                        {propertyData.commercialPropertyType === 'industrial' ? <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.stateOfProperty.empty ? 'Empty' : `${propertyData.stateOfProperty.builtUpPropertyType === 'other' ? 'Built-up' : `Built-up (${propertyData.stateOfProperty.builtUpPropertyType})`}`}</td>
                        </tr> : <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.stateOfProperty.empty ? 'Empty' : 'Built-up'}</td>
                        </tr>}

                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Land Size</td>
                            <td className="pt-4 pb-4 text-center">
                                <div className="flex flex-row place-content-center gap-1 sm:gap-5 mb-4 pr-0.5 pl-0.5">
                                    <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                        <p className="w-full text-center font-semibold">Total area</p>
                                        <p>{propertyData.landSize.totalArea.metreSquare} metre square</p>
                                        <p>{propertyData.landSize.totalArea.squareFeet} square feet</p>
                                    </div>
                                    <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                        <p className="w-full text-center font-semibold">Covered area</p>
                                        <p>{propertyData.landSize.coveredArea.metreSquare} metre square</p>
                                        <p>{propertyData.landSize.coveredArea.squareFeet} square feet</p>
                                    </div>
                                </div>

                                {propertyData.landSize.details && < p > {propertyData.landSize.details}</p>}
                            </td>
                        </tr>

                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Floors (excluding basement)</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.floors.floorsWithoutBasement}</td>
                        </tr>

                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Basement floors</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.floors.basementFloors}</td>
                        </tr>

                        {propertyData.commercialPropertyType === 'shop' && (propertyData.leasePeriod.years !== 0 || propertyData.leasePeriod.months !== 0) && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lease period</td>
                            <td className=" pt-4 pb-4 text-center">
                                <div className="flex flex-col">
                                    {propertyData.leasePeriod.years !== 0 && <p>{propertyData.leasePeriod.years} years</p>}
                                    {propertyData.leasePeriod.months !== 0 && <p>{propertyData.leasePeriod.months} months</p>}
                                </div>
                            </td>
                        </tr>}

                        {propertyData.commercialPropertyType === 'shop' && (propertyData.lockInPeriod.years !== 0 || propertyData.lockInPeriod.months !== 0) && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lock-in period</td>
                            <td className=" pt-4 pb-4 text-center">
                                <div className="flex flex-col">
                                    {propertyData.lockInPeriod.years !== 0 && <p>{propertyData.lockInPeriod.years} years</p>}
                                    {propertyData.lockInPeriod.months !== 0 && <p>{propertyData.lockInPeriod.months} months</p>}
                                </div>
                            </td>
                        </tr>}

                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                            <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                                {propertyData.location.name.plotNumber && <div className="flex flex-row gap-2">
                                    <p className="font-semibold">Plot number:</p>
                                    <p>{propertyData.location.name.plotNumber}</p>
                                </div>}
                                {propertyData.location.name.village && <div className="flex flex-row gap-2">
                                    <p className="font-semibold">Village:</p>
                                    <p>{propertyData.location.name.village}</p>
                                </div>}
                                {propertyData.location.name.city && <div className="flex flex-row gap-2">
                                    <p className="font-semibold">City:</p>
                                    <p>{propertyData.location.name.city}</p>
                                </div>}
                                {propertyData.location.name.tehsil && <div className="flex flex-row gap-2">
                                    <h2 className="font-semibold">Tehsil:</h2>
                                    <p>{propertyData.location.name.tehsil}</p>
                                </div>}
                                <div className=" flex flex-row gap-2">
                                    <p className="font-semibold">District:</p>
                                    <p>{propertyData.location.name.district}</p>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <p className="font-semibold">State:</p>
                                    <p>{propertyData.location.name.state}</p>
                                </div>
                            </td>
                        </tr>

                        {propertyData.widthOfRoadFacing.metre !== 0 && propertyData.widthOfRoadFacing.feet !== 0 && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Road width</td>
                            <td className=" pt-4 pb-4 text-center">
                                <div className="flex flex-col place-items-center">
                                    <p>{propertyData.widthOfRoadFacing.feet}   feet</p>
                                    <p>{propertyData.widthOfRoadFacing.metre}  metre</p>
                                </div>
                            </td>
                        </tr>}

                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                            <td className="pt-4 pb-4 text-center" >{propertyData.numberOfOwners}</td>
                        </tr>

                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <div className="flex flex-row place-content-center gap-1">
                                    <p className="font-semibold">Rs.</p>
                                    <p>{propertyData.priceDemanded.number}</p>
                                </div>
                                <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{propertyData.priceDemanded.words}</p>
                            </td>
                        </tr>

                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {!propertyData.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                {propertyData.legalRestrictions.isLegalRestrictions && <>
                                    <p>Yes</p>
                                    <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{propertyData.legalRestrictions.details}</p>
                                </>}
                            </td>
                        </tr>

                        {propertyData.remarks && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Remarks</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.remarks}</td>
                        </tr>}
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Land images</td>
                            <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                {commercialPropertyImages.map(image => {
                                    return <img key={Math.random()} className='w-40 h-auto border border-gray-500' src={image.file} alt="" />;
                                })}
                            </td>
                        </tr>
                        {contractImages.length > 0 && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract images</td>
                            <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                {contractImages.map(image => {
                                    return <img key={Math.random()} className='w-40 h-auto border border-gray-500' src={image.file} alt="" />
                                })}
                            </td>
                        </tr>}
                    </tbody>
                </table>
                {!alert.isAlertModal &&<div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button type='button' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={uploadImages}>Save</button>
                    <button type='button' className="bg-orange-400 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => {
                        propertyDataReset()
                        //setFinalPropertyData(null)
                    }}>Edit</button>
                </div>}
            </div>

        </Fragment >
    )
}
export default ReviewCommercialPropertyAfterSubmission