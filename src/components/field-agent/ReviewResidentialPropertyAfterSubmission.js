import { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../AlertModal";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

function ReviewResidentialPropertyAfterSubmission(props) {
    const { propertyData, residentialLandImageFile, contractImageFile, propertyDataReset, residentialLandImageUpload, contractImageUpload, firmName } = props
    const navigate = useNavigate()
    //console.log(propertyData)

    const [spinner, setSpinner] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })
    const [residentialLandImagesUrl, setResidentialPropertyImagesUrl] = useState([])
    const [contractImagesUrl, setContractImagesUrl] = useState([])

    /*useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])*/
    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    const uploadImages = async () => {
        try {
            setResidentialPropertyImagesUrl([])
            setContractImagesUrl([])
            setSpinner(true)
            residentialLandImageUpload.length && residentialLandImageUpload.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.error) {
                    setResidentialPropertyImagesUrl([])
                    throw new Error('Some error occured')
                } else {
                    setResidentialPropertyImagesUrl(images => [...images, data.secure_url])
                }
            })

            contractImageUpload.length && contractImageUpload.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image)
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

    const saveDetailsToDatabase = useCallback(async (finalPropertyData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/addResidentialProperty`, {
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

    useEffect(() => {
        if (residentialLandImagesUrl.length === residentialLandImageUpload.length && contractImagesUrl.length === contractImageUpload.length) {
            saveDetailsToDatabase({
                residentialLandImagesUrl,
                contractImagesUrl,
                ...propertyData
            })
        }
    }, [residentialLandImagesUrl.length, residentialLandImageUpload.length, contractImagesUrl.length, contractImageUpload.length, saveDetailsToDatabase, residentialLandImagesUrl, contractImagesUrl, propertyData])

    console.log(propertyData.residentialPropertyType.toLowerCase())

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
                }}>Back</button>

                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-semibold text-center">Review the details</p>
                </div>

                <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                    <thead >
                        <tr className="bg-gray-200 border-2 border-gray-300">
                            <th className="w-28 text-xl pt-4 pb-4 sm:w-80">Field</th>
                            <th className="text-xl ">Data</th>
                        </tr>
                    </thead>
                    <tbody>

                        {/*firm name */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Firm name</td>
                            <td className=" pt-4 pb-4 text-center">{firmName}</td>
                        </tr>

                        {/*proeprty type */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.residentialPropertyType.toLowerCase()}</td>
                        </tr>

                        {/*title */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Title</td>
                            <td className=" pt-4 pb-4 pr-2 pl-2 text-center">{propertyData.title}</td>
                        </tr>

                        {/*details */}
                        {propertyData.details && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Details</td>
                            <td className=" pt-4 pb-4 pr-2 pl-2 text-center">{propertyData.details}</td>
                        </tr>}

                        {/*type of sale */}
                        {propertyData.residentialPropertyType.toLowerCase() === 'house' && propertyData.typeOfSale && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Type of sale</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.typeOfSale.floorForSale ? 'Floor for sale' : 'House for sale'}</td>
                        </tr>}

                        {/*price fixed*/}
                        {!propertyData.price.range.from && !propertyData.price.range.to && propertyData.price.fixed && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                            <td className=" pt-4 pb-4 text-center">Rs. {propertyData.price.fixed}</td>
                        </tr>}

                        {/*price range */}
                        {propertyData.price.range.from && propertyData.price.range.to && !propertyData.price.fixed && <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                            <td className=" pt-4 pb-4 text-center">Rs. {propertyData.price.range.from} - Rs. {propertyData.price.range.to}</td>
                        </tr>}

                        {/*water supply */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Water supply</td>
                            <td className=" pt-4 pb-4 flex flex-col place-items-center">
                                <p>{propertyData.waterSupply.available ? 'Yes' : 'No'}</p>
                                {propertyData.waterSupply.available && propertyData.waterSupply.twentyFourHours && <p className="w-fit bg-gray-200 mr-1 ml-1 text-center">24 hours water supply is available</p>}
                                {propertyData.waterSupply.available && !propertyData.waterSupply.twentyFourHours && <p className="w-fit bg-gray-200 mr-1 ml-1 text-center">24 hours water supply is not available</p>}
                            </td>
                        </tr>

                        {/*electricity connection */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Electricity connection</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.electricityConnection ? 'Yes' : 'No'}</td>
                        </tr>

                        {/*sewage system */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Sewage system</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.sewageSystem ? 'Yes' : 'No'}</td>
                        </tr>

                        {/*cable tv*/}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Cable TV</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.cableTV ? 'Yes' : 'No'}</td>
                        </tr>

                        {/*high speed internet */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">High speed internet</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.highSpeedInternet ? 'Yes' : 'No'}</td>
                        </tr>

                        {/*Distance from grocery store */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from grocery store</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromGroceryStore} km</td>
                        </tr>

                        {/*Distance from restaurant/cafe */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from restaurant/cafe</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromRestaurantCafe} km</td>
                        </tr>

                        {/* Distance from exercise area*/}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from exercise area</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromExerciseArea} km</td>
                        </tr>

                        {/*Distance from school */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from school</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromSchool} km</td>
                        </tr>

                        {/*Distance from hospital */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from hospital</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromHospital} km</td>
                        </tr>

                        {/* Area type*/}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Area type</td>
                            <td className=" pt-4 pb-4 text-center">{propertyData.areaType}</td>
                        </tr>

                        {/*Total area */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Total area</td>
                            <td className=" pt-4 pb-4 text-center flex flex-col">
                                <p>{propertyData.area.totalArea.metreSquare} metre-square</p>
                                <p>{propertyData.area.totalArea.gajj} gajj</p>
                            </td>
                        </tr>

                        {/*Covered area */}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Covered area</td>
                            <td className=" pt-4 pb-4 text-center flex flex-col">
                                <p>{propertyData.area.coveredArea.metreSquare} metre-square</p>
                                <p>{propertyData.area.coveredArea.gajj} gajj</p>
                            </td>
                        </tr>

                        {/*Number of owners*/}
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                            <td className=" pt-4 pb-4 text-center"> {propertyData.numberOfOwners}</td>
                        </tr>

                        {/*Legal restrictions */}
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {!propertyData.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                {propertyData.legalRestrictions.isLegalRestrictions && <>
                                    <p>Yes</p>
                                    <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center">{propertyData.legalRestrictions.details}</p>
                                </>}
                            </td>
                        </tr>

                        {/*Property taxes per year */}
                        {propertyData.propertyTaxes && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Property taxes per year</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">Rs. {propertyData.propertyTaxes}</td>
                        </tr>}

                        {/*Home owners association fees per year */}
                        {propertyData.homeOwnersAssociationFees && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Home owners association fees per year</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">Rs. {propertyData.homeOwnersAssociationFees}</td>
                        </tr>}

                        {/*Number of floors */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of floors</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfFloors}</td>
                        </tr>}

                        {/*Number of living rooms */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of living rooms</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfLivingRooms}</td>
                        </tr>}

                        {/*Number of bedrooms */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of bedrooms</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfBedrooms}</td>
                        </tr>}

                        {/*Number of office rooms */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of office rooms</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfOfficeRooms}</td>
                        </tr>}

                        {/*Number of washrooms */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of washrooms</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfWashrooms}</td>
                        </tr>}

                        {/*Number of kitchens */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of kitchens</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfKitchen}</td>
                        </tr>}

                        {/* Number of car parkings*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of car parkings</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfCarParkingSpaces}</td>
                        </tr>}

                        {/* Number of balconies*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of balconies</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfBalconies}</td>
                        </tr>}

                        {/*Store room */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Store room</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.storeRoom ? 'Yes' : 'No'}</td>
                        </tr>}


                        {/*Servant room */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Servant room</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.servantRoom.room ? 'Yes' : 'No'}</td>
                        </tr>}

                        {/* Servant washroom*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Servant washroom</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.servantRoom.washroom ? 'Yes' : 'No'}</td>
                        </tr>}

                        {/*Furnishing*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Furnishing</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.furnishing.type.fullyFurnished && <p>Fully furnished</p>}
                                {propertyData.furnishing.type.semiFurnished && <p>Semi furnished</p>}
                                {propertyData.furnishing.type.unFurnished && <p> Unfurnished</p>}
                                {propertyData.furnishing.details && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200"> {propertyData.furnishing.details}</p>}
                            </td>
                        </tr>}

                        {/* kitchen furnishing*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Kitchen furnishing</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.kitchenFurnishing.type.modular && <p>Modular</p>}
                                {propertyData.kitchenFurnishing.type.semiFurnished && <p>Semi furnished</p>}
                                {propertyData.kitchenFurnishing.type.unFurnished && <p> Unfurnished</p>}
                                {propertyData.kitchenFurnishing.details && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200"> {propertyData.kitchenFurnishing.details}</p>}
                            </td>
                        </tr>}

                        {/*Kitchen appliances */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Kitchen appliances</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <p>{propertyData.kitchenAppliances.available ? 'Yes' : 'No'}</p>
                                {propertyData.kitchenAppliances.available && propertyData.kitchenAppliances.details.trim() && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{propertyData.kitchenAppliances.details}</p>}
                            </td>
                        </tr>}

                        {/*Washroom fitting */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Washroom fitting</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.washroomFitting.standard && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Standard</p>}
                                {propertyData.washroomFitting.premium && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Premium</p>}
                                {propertyData.washroomFitting.luxurious && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Luxurious</p>}
                            </td>
                        </tr>}

                        {/*Electrical fitting */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Electrical fitting</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.electricalFitting.standard && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Standard</p>}
                                {propertyData.electricalFitting.premium && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Premium</p>}
                                {propertyData.electricalFitting.luxurious && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Luxurious</p>}
                            </td>
                        </tr>}

                        {/*property type*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Flooring type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.flooringTypeArray && propertyData.flooringTypeArray.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>}

                        {/*roof type */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Roof type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.roofTypeArray.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>}

                        {/*wall type */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Wall type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.wallTypeArray.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>}

                        {/* Window type*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Window type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <div className="flex flex-col">
                                    {propertyData.windowTypeArray.map(type => {
                                        return <p key={type}>{type}</p>
                                    })}
                                </div>
                            </td>
                        </tr>}

                        {/* safety system*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && propertyData.safetySystemArray.length > 0 && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Safety system</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.safetySystemArray.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>}

                        {/* Garden*/}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Garden</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <p>{propertyData.garden.available ? 'Yes' : 'No'}</p>
                                {propertyData.garden.details.trim() && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{propertyData.garden.details.trim()}</p>}
                            </td>
                        </tr>}

                        {/*age of construction */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Age of construction</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <p>{propertyData.ageOfConstruction} years</p>
                            </td>
                        </tr>}

                        {/*Condition of property */}
                        {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Condition of property</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <p>{propertyData.conditionOfProperty}</p>
                            </td>
                        </tr>}

                        {/* location*/}
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

                        {/*Property images*/}
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Property images</td>
                            <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                {residentialLandImageFile.map(image => {
                                    return <img key={Math.random()} className='w-40 h-auto border border-gray-500' src={image} alt="" />;
                                })}
                            </td>
                        </tr>

                        {/*Contract images*/}
                        {contractImageFile.length > 0 && <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract images</td>
                            <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                {contractImageFile.map(image => {
                                    return <img key={Math.random()} className='w-40 h-auto border border-gray-500' src={image} alt="" />
                                })}
                            </td>
                        </tr>}

                    </tbody>
                </table>
                <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button type='button' className="bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={uploadImages}>Save</button>
                    <button type='button' className="bg-orange-400 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => {
                        propertyDataReset()
                    }}>Edit</button>
                </div>
            </div>

        </Fragment >
    )
}
export default ReviewResidentialPropertyAfterSubmission