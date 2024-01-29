import React, { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../../../AlertModal";
import { useNavigate } from "react-router-dom";

type RoadType = 'unpaved road' | 'village road' | 'district road' | 'state highway' | 'national highway'
type IrrigationSystemType = 'sprinkler' | 'drip' | 'underground pipeline'
type ReservoirType = 'public' | 'private'
type CropTypeArray = 'rice' | 'wheat' | 'maize' | 'cotton'

interface PropertyDataType {
    addedByPropertyDealer: string,
    landSize: {
        size: number,
        unit: 'metre-square' | 'acre',
        details: string | null,
    },
    location: {
        name: {
            village: string | null,
            city: string | null,
            tehsil: string | null,
            district: string,
            state: string
        }
    },
    numberOfOwners: number,
    waterSource: {
        canal: string[] | null,
        river: string[] | null,
        tubewells: {
            numberOfTubewells: number,
            depth: number[] | null
        }
    },
    reservoir: {
        isReservoir: boolean,
        type: ReservoirType[] | null,
        capacityOfPrivateReservoir: number | null,
        unitOfCapacityForPrivateReservoir: 'cusec' | 'litre' | null
    },
    irrigationSystem: IrrigationSystemType[] | null,
    priceDemanded: {
        number: number,
        words: string
    },
    crops: CropTypeArray[],
    road: {
        type: RoadType,
        details: string | null,
    },
    legalRestrictions: {
        isLegalRestrictions: boolean,
        details: string | null,
    },
    nearbyTown: string | null,
}
interface FinalPropertyDataType extends PropertyDataType {
    propertyImagesUrl: string[],
    contractImagesUrl: string[] | null
}

interface ImageType {
    file: string;
    upload: File;
}
interface PropsType {
    propertyData: PropertyDataType,
    agriculturalLandImages: ImageType[],
    contractImages: ImageType[],
    propertyDataReset: () => void,
    firmName: string
}
interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

//This component is used to review the property dealer data submitted
const ReviewAgriculturalPropertyAfterSubmission: React.FC<PropsType> = (props) => {
    const { propertyData, propertyDataReset, firmName, agriculturalLandImages, contractImages } = props
    const navigate = useNavigate()

    const [spinner, setSpinner] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [propertyImagesUrl, setPropertyImagesUrl] = useState<string[]>([]) //This state is array that stores the url of all the property images uploaded
    const [contractImagesUrl, setContractImagesUrl] = useState<string[]>([]) //This state is array that stores the url of all the proeprty images uploaded

    useEffect(() => {
        //The code below is used to scroll the screen to the top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")

    //The function is used to upload the images to the server
    const uploadImages = async () => {
        try {
            const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
            if (!cloudinaryCloudName) {
                throw new Error('Some error occured')
            }
            setPropertyImagesUrl([])
            setContractImagesUrl([])
            setSpinner(true)
            agriculturalLandImages.length && agriculturalLandImages.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image.upload)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', cloudinaryCloudName)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.error) {
                    setPropertyImagesUrl([])
                    throw new Error('Some error occured')
                } else {
                    setPropertyImagesUrl(images => [
                        ...images,
                        data.secure_url
                    ])
                }
            })

            contractImages.length && contractImages.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image.upload)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', cloudinaryCloudName)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.error) {
                    setContractImagesUrl([])
                    throw new Error('Some error occured')
                } else {
                    setContractImagesUrl(images => [
                        ...images,
                        data.secure_url
                    ])
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

    //The function is used to save proeprty details to the database
    const saveDetailsToDatabase = useCallback(async (propertyImagesUrl: string[], contractImagesUrl: string[]) => {
        const finalPropertyData: FinalPropertyDataType = {
            propertyImagesUrl,
            contractImagesUrl: contractImagesUrl.length ? contractImagesUrl : null,
            ...propertyData
        }
        try {
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
                    routeTo: '/field-agent'
                })
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'no-evaluator-available') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'No evaluator is available. Try later',
                    routeTo: '/field-agent'
                })
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
    }, [authToken, navigate,propertyData])

    //The code inside the useEffect hook is triggered when the images have been successfully uploaded
    useEffect(() => {
        if (propertyImagesUrl.length === agriculturalLandImages.length && contractImagesUrl.length === contractImages.length) {
            saveDetailsToDatabase(propertyImagesUrl, contractImagesUrl)
        }
    }, [propertyImagesUrl, propertyImagesUrl.length, agriculturalLandImages.length, contractImagesUrl, contractImagesUrl.length, contractImages.length, saveDetailsToDatabase])

    return (
        <Fragment>
            {/*The code bolow is used to show an alert modal to the user */}
            {alert.isAlertModal && <AlertModal
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

            <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center z-20 ${alert.isAlertModal ? 'blur' : ''}`} >

                {/*Back button */}
                <button
                    type='button'
                    className="fixed top-16 mt-2 left-2  bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 z-30 "
                    onClick={() => {
                        propertyDataReset()
                    }}>
                    Back
                </button>

                {/*Heading */}
                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-semibold text-center">Review the details</p>
                </div>

                {/*table that shows property data */}
                <table
                    className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto"
                    onClick={(e: React.MouseEvent<HTMLTableElement, MouseEvent>) => e.stopPropagation()}>
                    <thead >
                        <tr className="bg-gray-200 border-2 border-gray-300">
                            <th className="w-28 text-xl pt-4 pb-4 sm:w-fit">Field</th>
                            <th className="text-xl ">Data</th>
                        </tr>
                    </thead>
                    <tbody>

                        {/*Firm name*/}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Firm name</td>
                            <td className=" pt-4 pb-4 text-center">{firmName}</td>
                        </tr>

                        {/*land size details */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Land Size</td>
                            <td className="pt-4 pb-4 text-center">
                                <p>{propertyData.landSize.size} {propertyData.landSize.unit}</p>
                                {propertyData.landSize.details && <p> {propertyData.landSize.details}</p>}
                            </td>
                        </tr>

                        {/*location */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                            <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
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

                        {/*number of owners */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                            <td className="pt-4 pb-4 text-center" >{propertyData.numberOfOwners}</td>
                        </tr>

                        {/*water source details */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Water Source</td>
                            <td className="flex flex-col gap-2 place-items-center pt-4 pb-4 text-center">
                                {propertyData.waterSource.canal && propertyData.waterSource.canal.length > 0 && <div className="flex flex-row gap-2">
                                    <p className="font-semibold">Canal:</p>
                                    <div className="flex flex-col">
                                        {propertyData.waterSource.canal.map(canal => {
                                            return <p key={Math.random()}>{canal}</p>
                                        })}
                                    </div>
                                </div>}
                                {propertyData.waterSource.river && propertyData.waterSource.river.length > 0 && <div className="flex flex-row gap-2">
                                    <p className="font-semibold">River:</p>
                                    <div className="flex flex-col">
                                        {propertyData.waterSource.river.map(river => {
                                            return <p key={Math.random()}>{river}</p>
                                        })}
                                    </div>
                                </div>}
                                {propertyData.waterSource.tubewells.depth && propertyData.waterSource.tubewells.depth.length > 0 &&
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Tubewell Depth:</p>
                                        <div className="flex flex-col">
                                            {propertyData.waterSource.tubewells.depth.map(depth => {
                                                return <p key={Math.random()}>{depth} feet</p>
                                            })}
                                        </div>
                                    </div>}
                            </td>
                        </tr>

                        {/*reservoir */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Reservoir</td>
                            <td className="flex flex-row place-content-center gap-2 flex-wrap pt-4 pb-4 text-center">
                                {!propertyData.reservoir.isReservoir &&
                                    <p>No</p>
                                }
                                {propertyData.reservoir.isReservoir &&
                                    <div className="flex flex-col gap-1">
                                        <div className="flex flex-row gap-2">
                                            <p className="font-semibold">Type of Reservoir:</p>
                                            {propertyData.reservoir.type && propertyData.reservoir.type.map(type => {
                                                return <p key={Math.random()}>{type}</p>
                                            })}
                                        </div>
                                        {propertyData.reservoir.type && propertyData.reservoir.type.includes('private') &&
                                            <div className="flex flex-row gap-2">
                                                <p className="font-semibold">Capacity:</p>
                                                <p>{propertyData.reservoir.capacityOfPrivateReservoir} {propertyData.reservoir.unitOfCapacityForPrivateReservoir}</p>
                                            </div>
                                        }
                                    </div>}
                            </td>

                            {/*irrigation system */}
                        </tr>
                        {propertyData.irrigationSystem && propertyData.irrigationSystem.length > 0 &&
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Irrigation System</td>
                                <td className="flex flex-col place-items-center gap-0.5 flex-wrap pt-4 pb-4 text-center">
                                    {propertyData.irrigationSystem.map(system => {
                                        return <p key={Math.random()}>{system}</p>
                                    })}
                                </td>
                            </tr>}

                        {/*price */}
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

                        {/*crops */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Crops</td>
                            <td className="pt-4 pb-4 flex flex-col place-items-center gap-0.5">
                                {propertyData.crops.map(crop => {
                                    return <p key={Math.random()}>{crop}</p>
                                })}
                            </td>
                        </tr>

                        {/*road type */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Road type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <p>{propertyData.road.type}</p>
                                {propertyData.road.details && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{propertyData.road.details}</p>}
                            </td>
                        </tr>

                        {/*legal restrictions */}
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

                        {/*nearby town */}
                        {propertyData.nearbyTown && propertyData.nearbyTown.trim() &&
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Nearby town</td>
                                <td className="pt-4 pb-4 text-center">
                                    <p>{propertyData.nearbyTown}</p>
                                </td>
                            </tr>}

                        {/*Land images */}
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Land images</td>
                            <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                {agriculturalLandImages.map(image => {
                                    return <img key={Math.random()} className='w-40 h-auto ' src={image.file} alt="" />;
                                })}
                            </td>
                        </tr>

                        {/*contract images */}
                        {contractImages.length > 0 &&
                            <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract images</td>
                                <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                    {contractImages.map(image => {
                                        return <img
                                            key={Math.random()}
                                            className='w-40 h-auto '
                                            src={image.file}
                                            alt="" />
                                    })}
                                </td>
                            </tr>}
                    </tbody>
                </table>

                <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button
                        type='button'
                        className={`px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pt-0.5 h-8 flex flex-row place-content-center gap-1 ${spinner ? 'w-20' : ''}`}
                        disabled={spinner || alert.isAlertModal}
                        onClick={uploadImages}>
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
                        onClick={() => {
                            propertyDataReset()
                        }}>
                        Edit
                    </button>
                </div>
            </div>

        </Fragment >
    )
}
export default ReviewAgriculturalPropertyAfterSubmission