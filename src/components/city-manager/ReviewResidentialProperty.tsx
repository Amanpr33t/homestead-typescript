import { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ApprovalForm from "./ApprovalForm";
import Spinner from "../Spinner"
import { PropertyDataType, } from "../../dataTypes/residentialPropertyTypes"
import ResidentialPropertyTable from "../table/ResidentialPropertyTable";
import EvaluationDataTable from "./EvaluationDataTable";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface PropsType {
    propertyId: string
}

//This component is used to show property data. It also passes property data as props to PropertyEvaluationForm component 
const ReviewResidentialProperty: React.FC<PropsType> = ({ propertyId }) => {
    const navigate = useNavigate()

    const [showPropertyData, setShowPropertyData] = useState<boolean>(true)

    const [showApprovalForm, setShowApprovalForm] = useState(false) //If set to true, PropertyEvaluationForm component will be shown to the user

    const [property, setProperty] = useState<PropertyDataType | null>(null)

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const authToken: string | null = localStorage.getItem("homestead-city-manager-authToken")

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, [])

    //The function is used to fetch the selected property
    const fetchSelectedProperty = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/city-manager/fetch-selected-property?propertyType=residential&propertyId=${propertyId}`, {
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
                localStorage.removeItem("homestead-city-manager-authToken")
                navigate('/city-manager/signIn', { replace: true })
                return
            } else if (data.status === 'ok') {
                setSpinner(false)
                setProperty(data.property)
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate, propertyId])

    useEffect(() => {
        fetchSelectedProperty()
    }, [fetchSelectedProperty])

    return (
        <Fragment>

            {spinner && !error && <Spinner />}

            {error && !spinner &&
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <button className="text-red-500" onClick={fetchSelectedProperty}>Try again</button>
                </div>}

            <div className={`${showApprovalForm ? 'blur' : ''} w-full fixed top-16 bg-white sm:bg-transparent pb-2 z-30`}>
                <button type='button' className="bg-green-500 hover:bg-green-600  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/city-manager/residential-properties-pending-for-approval')
                    return
                }}>Back</button>
                <button type='button' className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/city-manager', { replace: true })
                    return
                }}>Home</button>
            </div>

            {property && !spinner && !error &&
                <div className={`${showApprovalForm ? 'blur' : ''}`}>

                    {/*heading */}
                    <div className="w-full  bg-white z-20 mb-3">
                        <p className="text-2xl font-semibold text-center">Residential property details</p>
                    </div>

                    {/*toggle buttons */}
                    <div className="w-full flex justify-center mb-3">
                        <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                            <button className={`-mr-2 pl-5 pr-5 pt-1 pb-1 ${showPropertyData ? 'bg-blue-400 text-white' : 'text-gray-600'}   text-lg font-medium rounded-3xl`} onClick={() => setShowPropertyData(true)}>Property data</button>
                            <button className={`-ml-2 pl-5 pr-5  pt-1 pb-1  ${!showPropertyData ? 'bg-blue-400 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => setShowPropertyData(false)}>Evaluation data</button>
                        </div>
                    </div>

                    {showPropertyData && <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                        <ResidentialPropertyTable propertyData={property} />
                    </div>}

                    {!showPropertyData &&
                        //table shows evaluation data
                        <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                            {property.evaluationData && <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto">
                                <thead >
                                    <tr className="bg-gray-200 border-2 border-gray-200">
                                        <th className="w-40 text-xl pt-2 pb-2">Field</th>
                                        <th className="text-xl ">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-2 border-gray-300">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Type of location</td>
                                        <td className=" pt-4 pb-4 text-center">{property.evaluationData.typeOfLocation}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Location status</td>
                                        <td className="pt-2 pb-2 text-center">{property.evaluationData.locationStatus}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Fair value of property</td>
                                        <td className="pt-2 pb-2 text-center">{property.evaluationData.fairValueOfProperty}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Five year projection of prices</td>
                                        <td className="pt-7 text-center flex flex-row gap-2 items-center justify-center">
                                            <p>{property.evaluationData.fiveYearProjectionOfPrices.percentageIncreaseOrDecrease}%</p>
                                            {property.evaluationData.fiveYearProjectionOfPrices.decrease ? <FaArrowDown className="text-red-500 text-lg" /> : <FaArrowUp className="text-green-500 text-lg" />}
                                        </td>
                                    </tr>
                                    {property.evaluationData.qualityOfConstructionRating &&
                                        <tr className="border-2 border-gray-200">
                                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Quality of construction rating</td>
                                            <td className="pt-2 pb-2 text-center">{property.evaluationData.qualityOfConstructionRating}</td>
                                        </tr>}
                                </tbody>
                            </table>}
                        </div>}

                    <div className="w-full -mt-4 mb-6 flex justify-center ">
                        <button type="button" className="w-fit bg-blue-500 text-white font-medium rounded pl-2 pr-2 h-8" onClick={() => setShowApprovalForm(true)}>Fill approval form</button>
                    </div>
                </div>}

            {property &&
                <ApprovalForm
                    showApprovalForm={showApprovalForm}
                    hideApprovalForm={() => setShowApprovalForm(false)}
                    propertyType='residential'
                    propertyId={propertyId} />}

        </Fragment >
    )
}
export default ReviewResidentialProperty