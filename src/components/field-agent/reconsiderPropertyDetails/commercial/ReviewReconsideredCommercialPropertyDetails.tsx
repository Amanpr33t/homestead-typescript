import { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../../../AlertModal";
import { useNavigate } from "react-router-dom";
import CommercialPropertyTable from "../../../table/CommercialPropertyTable";

type BuiltUpType = 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic' | 'other'

interface PropertyDataType {
    commercialPropertyType: string,
    landSize: {
        totalArea: {
            metreSquare: number,
            squareFeet: number
        },
        coveredArea: {
            metreSquare: number,
            squareFeet: number
        },
        details: string | null,
    },
    stateOfProperty: {
        empty: boolean,
        builtUp: boolean,
        builtUpPropertyType: BuiltUpType | null
    },
    location: {
        name: {
            plotNumber: number | null,
            village: string | null,
            city: string | null,
            tehsil: string | null,
            district: string,
            state: string
        }
    },
    numberOfOwners: number,
    floors: {
        floorsWithoutBasement: number,
        basementFloors: number
    },
    widthOfRoadFacing: {
        feet: number,
        metre: number
    },
    priceDemanded: {
        number: number,
        words: string
    },
    legalRestrictions: {
        isLegalRestrictions: boolean,
        details: string | null,
    },
    remarks: string | null,
    lockInPeriod?: {
        years: number | null,
        months: number | null
    },
    leasePeriod?: {
        years: number | null,
        months: number | null
    },
    shopPropertyType?: 'booth' | 'shop' | 'showroom' | 'retail-space' | 'other'
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
    propertyId: string,
    propertyData: PropertyDataType,
    propertyImages: ImageType[],
    contractImages: ImageType[],
    propertyDataReset: () => void,
    fetchedPropertyImagesUrl: string[],
    fetchedContractImagesUrl: string[]
}

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

//The component is used to review the details of a commercial proeprty before they are sent to the server
const ReviewReconsiderdCommercialPropertyDetails: React.FC<PropsType> = (props) => {
    const {
        propertyId,
        propertyData,
        propertyDataReset,
        propertyImages,
        contractImages,
        fetchedPropertyImagesUrl,
        fetchedContractImagesUrl } = props

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
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) //it scrools screen to the top
    }, [])

    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")

    const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    useEffect(() => {
        if (!cloudinaryCloudName) {
            navigate('/field-agent')
        }
    }, [cloudinaryCloudName, navigate])

    //The function is used to upload images to the database
    const uploadImages = async () => {
        try {
            setPropertyImagesUrl([])
            setContractImagesUrl([])
            setSpinner(true)
            propertyImages.length && propertyImages.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image.upload)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', cloudinaryCloudName as string)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.error) {
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
                formData.append('cloud_name', cloudinaryCloudName as string)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.error) {
                    throw new Error('Some error occured')
                } else {
                    setContractImagesUrl(images => [...images, data.secure_url])
                }
            })
        } catch (error) {
            setPropertyImagesUrl(fetchedPropertyImagesUrl)
            setContractImagesUrl(fetchedContractImagesUrl || [])
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
    const saveDetailsToDatabase = useCallback(async (propertyImagesUrl: string[], contractImagesUrl: string[]) => {
        const finalPropertyData: FinalPropertyDataType = {
            propertyImagesUrl: [...propertyImagesUrl, ...fetchedPropertyImagesUrl],
            contractImagesUrl: [...contractImagesUrl, ...fetchedContractImagesUrl].length ? [...contractImagesUrl, ...fetchedContractImagesUrl] : null,
            ...propertyData
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/updateReevaluatedPropertyData?type=commercial&id=${propertyId}`, {
                method: 'PATCH',
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
                    alertMessage: 'Property details have been reconsidered successfully',
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
    }, [authToken, navigate, propertyData, fetchedContractImagesUrl, fetchedPropertyImagesUrl, propertyId])

    //The code in the useEffect hook is executed when the images are sucessfully uploaded
    useEffect(() => {
        if (!propertyImages.length && !contractImages.length) {
            return
        }
        if (propertyImages.length === propertyImagesUrl.length && contractImages.length === contractImagesUrl.length) {
            saveDetailsToDatabase(propertyImagesUrl, contractImagesUrl)
        }
    }, [propertyImages.length, contractImages.length, propertyImagesUrl.length, contractImagesUrl.length, propertyImagesUrl, contractImagesUrl, saveDetailsToDatabase])

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

            {/*Back button */}
            <button
                type='button'
                className="fixed top-16 mt-2 left-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 "
                disabled={spinner}
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

                <CommercialPropertyTable
                    propertyData={propertyData}
                    propertyImages={contractImages}
                    contractImages={contractImages}
                    fetchedPropertyImagesUrl={fetchedPropertyImagesUrl}
                    fetchedContractImagesUrl={fetchedContractImagesUrl}
                />

                <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button
                        type='button'
                        className={`px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pt-0.5 h-8 flex flex-row place-content-center gap-1 ${spinner ? 'w-20' : ''}`}
                        disabled={spinner || alert.isAlertModal}
                        onClick={async () => {
                            if (propertyImages.length || contractImages.length) {
                                await uploadImages()
                            } else {
                                await saveDetailsToDatabase(propertyImagesUrl, contractImagesUrl)
                            }
                        }}
                    >
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
export default ReviewReconsiderdCommercialPropertyDetails