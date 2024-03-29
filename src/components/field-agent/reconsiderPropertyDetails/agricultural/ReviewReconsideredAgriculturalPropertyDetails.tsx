import { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../../../AlertModal";
import useUploadImages from "../../../../custom-hooks/useImageUpload";
import { PropertyDataType } from "../../../../dataTypes/agriculturalPropertyTypes"
import { AlertType } from "../../../../dataTypes/alertType"
import useAddOrEditPropertyData from "../../../../custom-hooks/useAddOrEditPropertyData";
import AgriculturalPropertyTable from "../../../table/AgriculturalPropertyTable";

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

//The component is used to review the details of a commercial proeprty before they are sent to the server
const ReviewReconsideredAgriculturalPropertyDetails: React.FC<PropsType> = (props) => {
    const {
        propertyId,
        propertyData,
        propertyDataReset,
        propertyImages,
        contractImages,
        fetchedPropertyImagesUrl,
        fetchedContractImagesUrl } = props

    const { uploadImages } = useUploadImages()

    const { addOrEditPropertyData } = useAddOrEditPropertyData('edit', 'agricultural', propertyData)

    const [spinner, setSpinner] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    useEffect(() => {
        //The code below is used to scroll the screen to the top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const saveDetailsToDatabase = useCallback(async (propertyImagesUrl: string[], contractImagesUrl: string[]) => {
        setSpinner(true)
        try {
            const responseData = await addOrEditPropertyData(
                [...propertyImagesUrl, ...fetchedPropertyImagesUrl],
                [...contractImagesUrl, ...fetchedContractImagesUrl],
                propertyId
            )
            if (responseData.status === 'success' || responseData.status === 'warning') {
                setAlert({
                    isAlertModal: true,
                    alertType: responseData.status,
                    alertMessage: responseData.message,
                    routeTo: responseData.routeTo
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
    }, [addOrEditPropertyData, fetchedContractImagesUrl, fetchedPropertyImagesUrl, propertyId])

    const uploadImagesFunction = async () => {
        try {
            setSpinner(true)
            const uploadedPropertyImagesUrl: string[] = await uploadImages(propertyImages)

            if (uploadedPropertyImagesUrl) {
                if (uploadedPropertyImagesUrl.length === propertyImages.length) {
                    if (contractImages.length) {
                        const uploadedContractImagesUrl: string[] = await uploadImages(contractImages)
                        if (uploadedContractImagesUrl) {
                            if (uploadedContractImagesUrl.length === contractImages.length) {
                                await saveDetailsToDatabase(uploadedPropertyImagesUrl, uploadedContractImagesUrl)
                            } else {
                                throw new Error('some error occured')
                            }
                        }
                    } else {
                        await saveDetailsToDatabase(uploadedPropertyImagesUrl, [])
                    }
                } else {
                    throw new Error('some error occured')
                }
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

            {/*Back button */}
            {!alert.isAlertModal && <button
                type='button'
                className="fixed top-16 mt-2 left-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 z-30 "
                disabled={spinner}
                onClick={() => {
                    propertyDataReset()
                }}>
                Back
            </button>}

            <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center z-20 ${alert.isAlertModal ? 'blur' : ''}`} >

                {/*Heading */}
                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-semibold text-center">Review the details</p>
                </div>

                <AgriculturalPropertyTable
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
                                await uploadImagesFunction()
                            } else {
                                await saveDetailsToDatabase([], [])
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
export default ReviewReconsideredAgriculturalPropertyDetails