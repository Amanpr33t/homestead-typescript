import { Fragment, useCallback, useEffect, useState } from "react"
import Spinner from "../Spinner"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

//This component is used to show property data in a tables
function ReviewAgriculturalProperty() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [spinner, setSpinner] = useState(true)
    const [error, setError] = useState(false)
    const [property, setProperty] = useState()

    const authToken = localStorage.getItem("homestead-property-dealer-authToken")

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    //This function is used to get the property deatails
    const getPropertyDetails = useCallback(async () => {
        try {
            setSpinner(true)
            setError(false)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/getPropertyDetails?type=agricultural&id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                if(!data.property){
                   return setError(true)
                }
                setProperty(data.property)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [id, authToken, navigate])

    useEffect(() => {
        getPropertyDetails()
    }, [getPropertyDetails])

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {!spinner &&
                <div className="w-full fixed top-20 bg-white pb-2 z-50">
                    <button type='button' className="bg-green-500  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/property-dealer/properties-added', { replace: true })}>Back</button>
                </div>
            }

            {error && !spinner && <>
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <p className="text-red-500 cursor-pointer" onClick={getPropertyDetails}>Try again</p>
                </div>
            </>}

            {!error && !spinner && property && <>
                <div className="w-full mt-32 bg-white z-20 mb-4">
                    <p className="text-gray-600 text-xl font-semibold text-center">Agricultural property details</p>
                </div>

                <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                    <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto">
                        <thead >
                            <tr className="bg-gray-200 border-2 border-gray-200">
                                <th className="w-40 text-xl pt-2 pb-2">Field</th>
                                <th className="text-xl ">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-2 border-gray-300">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Property ID</td>
                                <td className=" pt-4 pb-4 text-center">{property.uniqueId}</td>
                            </tr>
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Land Size</td>
                                <td className="pt-2 pb-2 text-center">
                                    <p>{property.landSize.size} {property.landSize.unit}</p>
                                    {property.landSize.details && < p > {property.details}</p>}</td>
                            </tr>
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Location</td>
                                <td className="flex flex-col place-content-center gap-1 flex-wrap pt-2 pb-2 text-center">
                                    {property.location.name.village && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Village:</p>
                                        <p>{property.location.name.village}</p>
                                    </div>}
                                    {property.location.name.city && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">City:</p>
                                        <p>{property.location.name.city}</p>
                                    </div>}
                                    {property.location.name.tehsil && <div className="flex flex-row gap-2">
                                        <h2 className="font-semibold">Tehsil:</h2>
                                        <p>{property.location.name.tehsil}</p>
                                    </div>}
                                    <div className=" flex flex-row gap-2">
                                        <p className="font-semibold">District:</p>
                                        <p>{property.location.name.district}</p>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold">State:</p>
                                        <p>{property.location.name.state}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Number of owners</td>
                                <td className="pt-2 pb-2 text-center">{property.numberOfOwners}</td>
                            </tr>
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Water source</td>
                                <td className="pt-2 pb-2 flex flex-col place-items-center gap-2" >
                                    {property.waterSource.canal.length > 0 && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Canal:</p>
                                        <div className="flex flex-col">
                                            {property.waterSource.canal.map(canal => {
                                                return <p key={Math.random()}>{canal}</p>
                                            })}
                                        </div>
                                    </div>}
                                    {property.waterSource.river.length > 0 && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">River:</p>
                                        <div className="flex flex-col">
                                            {property.waterSource.river.map(river => {
                                                return <p key={Math.random()}>{river}</p>
                                            })}
                                        </div>
                                    </div>}
                                    {property.waterSource.tubewells.numberOfTubewells > 0 && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Tubewell Depth:</p>
                                        <div className="flex flex-col">
                                            {property.waterSource.tubewells.depth.map(depth => {
                                                return <p key={Math.random()}>{depth} feet</p>
                                            })}
                                        </div>
                                    </div>}
                                </td>
                            </tr>

                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Reservoir</td>
                                <td className="pt-2 pb-2 flex flex-col place-items-center">
                                    {!property.reservoir.isReservoir &&
                                        <p>No</p>
                                    }
                                    {property.reservoir.isReservoir &&
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row gap-2">
                                                <p className="font-semibold">Type:</p>
                                                <p>{property.reservoir.type[0]}, {property.reservoir.type[1]}</p>
                                            </div>
                                            {property.reservoir.type.includes('private') &&
                                                <div className="flex flex-row gap-2">
                                                    <p className="font-semibold w-fit">Capacity of private reservoir:</p>
                                                    <p>{property.reservoir.capacityOfPrivateReservoir} {property.reservoir.unitOfCapacityForPrivateReservoir}</p>
                                                </div>
                                            }
                                        </div>
                                    }
                                </td>
                            </tr>
                            {property.irrigationSystem.length > 0 && <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Irrigation System</td>
                                <td className="pt-2 pb-2 text-center">
                                    {property.irrigationSystem.map(system => {
                                        return <p key={Math.random()}>{system}</p>
                                    })}
                                </td>
                            </tr>}
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Price</td>
                                <td className="pt-2 pb-2 text-center">
                                    <div className="flex flex-row place-content-center gap-1">
                                        <p className="font-semibold">Rs.</p>
                                        <p>{property.priceDemanded.number}</p>
                                    </div>
                                    <p className="p-1 mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center">{property.priceDemanded.words}</p>
                                </td>
                            </tr>
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Road Type</td>
                                <td className="pt-2 pb-2 flex flex-col place-items-center gap-1">
                                    <p>{property.road.type}</p>
                                    {property.road.details && <p className="p-1 mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center" text-center>{property.road.details}</p>}
                                </td>
                            </tr>
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Legal Restrictions</td>
                                <td className="pt-2 pb-2 flex flex flex-col place-items-center">
                                    {!property.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                    {property.legalRestrictions.isLegalRestrictions && <>
                                        <p>Yes</p>
                                        <p className="p-1 mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center">{property.legalRestrictions.details}</p>
                                    </>}
                                </td>
                            </tr>
                            {property.nearbyTown && <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Nearby town</td>
                                <td className="pt-2 pb-2 flex justify-center">
                                    <p>{property.nearbyTown}</p>
                                </td>
                            </tr>}
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Land Images</td>
                                <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                    {property.propertyImagesUrl
                                        .map(image => {
                                            return <img key={Math.random()} className='w-40 h-auto border border-gray-500' src={image} alt="" />;
                                        })}
                                </td>
                            </tr>
                            {property.contractImagesUrl.length > 0 && <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Contract Images</td>
                                <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                    {property.contractImagesUrl.map(image => {
                                        return <img key={Math.random()} className='w-40 h-auto border border-gray-500' src={image} alt="" />
                                    })}
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                </div></>}

        </Fragment >
    )
}
export default ReviewAgriculturalProperty