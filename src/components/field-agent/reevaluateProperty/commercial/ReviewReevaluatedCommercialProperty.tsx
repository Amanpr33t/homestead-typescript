import { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../../../AlertModal";
import { useNavigate } from "react-router-dom";

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
    commercialPropertyImages: ImageType[],
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
const ReviewReevaluatedCommercialProperty: React.FC<PropsType> = (props) => {
    const {
        propertyId,
        propertyData,
        propertyDataReset,
        commercialPropertyImages,
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

    //The function is used to upload images to the database
    const uploadImages = async () => {
        try {
            setPropertyImagesUrl([])
            setContractImagesUrl([])
            const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
            if (!cloudinaryCloudName) {
                throw new Error('Some error occured')
            }
            setSpinner(true)
            commercialPropertyImages.length && commercialPropertyImages.forEach(async (image) => {
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
    }, [authToken, navigate, propertyData, fetchedContractImagesUrl, fetchedPropertyImagesUrl, propertyId])

    //The code in the useEffect hook is executed when the images are sucessfully uploaded
    useEffect(() => {
        if (!commercialPropertyImages.length && !contractImages.length) {
            return
        }
        if (commercialPropertyImages.length === propertyImagesUrl.length && contractImages.length === contractImagesUrl.length) {
            saveDetailsToDatabase(propertyImagesUrl, contractImagesUrl)
        }
    }, [commercialPropertyImages.length, contractImages.length, propertyImagesUrl.length, contractImagesUrl.length, propertyImagesUrl, contractImagesUrl, saveDetailsToDatabase])

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

            <div className={`pl-1 pr-1 mt-20 mb-10 w-full flex flex-col place-items-center z-20 ${alert.isAlertModal ? 'blur' : ''}`} >

                {/*Back button */}
                <button
                    type='button'
                    className="fixed top-16 mt-2 left-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 z-30 "
                    disabled={spinner}
                    onClick={() => {
                        propertyDataReset()
                    }}>
                    Back
                </button>

                {/*Heading */}
                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-semibold text-center">Review the details</p>
                </div>

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

                        {/*Property type */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.commercialPropertyType === 'industrial' ? 'Industrial/Institutional' : 'Shop/Showroom/Booth'}</td>
                        </tr>

                        {/* shop type*/}
                        {propertyData.commercialPropertyType === 'shop' && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Shop type</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.shopPropertyType}</td>
                        </tr>}

                        {/*state of property*/}
                        {propertyData.commercialPropertyType === 'industrial' ?
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                                <td className=" pt-4 pb-4 text-center">
                                    {propertyData.stateOfProperty.empty ?
                                        'Empty' :
                                        `${propertyData.stateOfProperty.builtUpPropertyType === 'other' ?
                                            'Built-up' :
                                            `Built-up (${propertyData.stateOfProperty.builtUpPropertyType})`}
                                        `}
                                </td>
                            </tr> :
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                                <td className=" pt-4 pb-4 text-center">
                                    {propertyData.stateOfProperty.empty ? 'Empty' : 'Built-up'}
                                </td>
                            </tr>}

                        {/* land size*/}
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
                                {propertyData.landSize.details && <p>{propertyData.landSize.details}</p>}
                            </td>
                        </tr>

                        {/*Number of floors excluding basement*/}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Floors (excluding basement)</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.floors.floorsWithoutBasement}</td>
                        </tr>

                        {/*Basement floors */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Basement floors</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.floors.basementFloors}</td>
                        </tr>

                        {/* lease period*/}
                        {propertyData.commercialPropertyType === 'shop' &&
                            propertyData.leasePeriod &&
                            (propertyData.leasePeriod.years !== 0 || propertyData.leasePeriod.months !== 0) &&
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lease period</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col">
                                        {propertyData.leasePeriod.years !== 0 && <p>{propertyData.leasePeriod.years} years</p>}
                                        {propertyData.leasePeriod.months !== 0 && <p>{propertyData.leasePeriod.months} months</p>}
                                    </div>
                                </td>
                            </tr>}

                        {/*lockin period */}
                        {propertyData.commercialPropertyType === 'shop' &&
                            propertyData.lockInPeriod &&
                            (propertyData.lockInPeriod.years !== 0 || propertyData.lockInPeriod.months !== 0) &&
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lock-in period</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col">
                                        {propertyData.lockInPeriod.years !== 0 && <p>{propertyData.lockInPeriod.years} years</p>}
                                        {propertyData.lockInPeriod.months !== 0 && <p>{propertyData.lockInPeriod.months} months</p>}
                                    </div>
                                </td>
                            </tr>}

                        {/*Location*/}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                            <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                                {propertyData.location.name.plotNumber &&
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Plot number:</p>
                                        <p>{propertyData.location.name.plotNumber}</p>
                                    </div>}
                                {propertyData.location.name.village &&
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Village:</p>
                                        <p>{propertyData.location.name.village}</p>
                                    </div>}
                                {propertyData.location.name.city &&
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold">City:</p>
                                        <p>{propertyData.location.name.city}</p>
                                    </div>}
                                {propertyData.location.name.tehsil &&
                                    <div className="flex flex-row gap-2">
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

                        {/* Road width*/}
                        {propertyData.widthOfRoadFacing.metre !== 0 &&
                            propertyData.widthOfRoadFacing.feet !== 0 &&
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Road width</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col place-items-center">
                                        <p>{propertyData.widthOfRoadFacing.feet}   feet</p>
                                        <p>{propertyData.widthOfRoadFacing.metre}  metre</p>
                                    </div>
                                </td>
                            </tr>}

                        {/* Number of owners*/}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                            <td className="pt-4 pb-4 text-center">{propertyData.numberOfOwners}</td>
                        </tr>

                        {/*Price */}
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

                        {/*Legal restrictions */}
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {!propertyData.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                {propertyData.legalRestrictions.isLegalRestrictions &&
                                    <>
                                        <p>Yes</p>
                                        <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{propertyData.legalRestrictions.details}</p>
                                    </>
                                }
                            </td>
                        </tr>

                        {/* Remarks*/}
                        {propertyData.remarks &&
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Remarks</td>
                                <td className=" pt-4 pb-4 text-center">{propertyData.remarks}</td>
                            </tr>}

                        {/*Property images */}
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Property images</td>
                            <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                {fetchedPropertyImagesUrl.map(image => {
                                    return <img
                                        key={Math.random()}
                                        className='w-40 h-auto border border-gray-500'
                                        src={image}
                                        alt="" />;
                                })}
                                {commercialPropertyImages.map(image => {
                                    return <img
                                        key={Math.random()}
                                        className='w-40 h-auto border border-gray-500'
                                        src={image.file}
                                        alt="" />;
                                })}
                            </td>
                        </tr>

                        {/* contract images*/}
                        {contractImages.length > 0 &&
                            <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract images</td>
                                <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                    {fetchedContractImagesUrl && fetchedContractImagesUrl.map(image => {
                                        return <img
                                            key={Math.random()}
                                            className='w-40 h-auto border border-gray-500'
                                            src={image}
                                            alt="" />
                                    })}
                                    {contractImages.map(image => {
                                        return <img
                                            key={Math.random()}
                                            className='w-40 h-auto border border-gray-500'
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
                        onClick={async () => {
                            if (commercialPropertyImages.length || contractImages.length) {
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
export default ReviewReevaluatedCommercialProperty