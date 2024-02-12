import React, { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../../../AlertModal";
import { useNavigate } from "react-router-dom";
import AgriculturalPropertyTable from "../../../table/AgriculturalPropertyTable";

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
    propertyImages: ImageType[],
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
    const {
        propertyData,
        propertyDataReset,
        firmName,
        propertyImages,
        contractImages
    } = props
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

    const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    useEffect(() => {
        if (!cloudinaryCloudName) {
            navigate('/field-agent')
        }
    }, [cloudinaryCloudName, navigate])

    //The function is used to upload the images to the server
    const uploadImages = async () => {
        try {
            setPropertyImagesUrl([])
            setContractImagesUrl([])
            setSpinner(true)

            propertyImages.length && propertyImages.forEach(async (image) => {
                //upload property images
                const formData = new FormData()
                formData.append('file', image.upload)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', cloudinaryCloudName as string)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.secure_url) {
                    setPropertyImagesUrl(images => [
                        ...images,
                        data.secure_url
                    ])
                } else {
                    throw new Error('Some error occured')
                }
            })

            contractImages.length && contractImages.forEach(async (image) => {
                //upload contract images
                const formData = new FormData()
                formData.append('file', image.upload)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', cloudinaryCloudName as string)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.secure_url) {
                    setContractImagesUrl(images => [
                        ...images,
                        data.secure_url
                    ])
                } else {
                    throw new Error('Some error occured')
                }
            })
        } catch (error) {
            setContractImagesUrl([])
            setPropertyImagesUrl([])
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
            setContractImagesUrl([])
            setPropertyImagesUrl([])
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured',
                routeTo: null
            })
            return
        }
    }, [authToken, navigate, propertyData])

    //The code inside the useEffect hook is triggered when the images have been successfully uploaded
    useEffect(() => {
        if (propertyImagesUrl.length === propertyImages.length && contractImagesUrl.length === contractImages.length) {
            saveDetailsToDatabase(propertyImagesUrl, contractImagesUrl)
        }
    }, [propertyImagesUrl, propertyImagesUrl.length, propertyImages.length, contractImagesUrl, contractImagesUrl.length, contractImages.length, saveDetailsToDatabase])

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

            {/*Back button */}
            <button
                type='button'
                className={`fixed top-16 mt-2 left-2  bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 z-30`}
                disabled={spinner || alert.isAlertModal}
                onClick={() => {
                    propertyDataReset()
                }}>
                Back
            </button>

            <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center z-20 ${alert.isAlertModal ? 'blur' : ''}`} >

                {/*Heading */}
                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-semibold text-center">Review the details</p>
                </div>

                {/*table that shows property data */}
                <AgriculturalPropertyTable
                    firmName={firmName}
                    propertyData={propertyData}
                    contractImages={contractImages}
                    propertyImages={propertyImages}
                />

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