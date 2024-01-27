import { Link, useLocation, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import Spinner from "../../Spinner"
import AlertModal from "../../AlertModal"
import ReviewResidentialProperty from "./ReviewResidentialProperty"
import { formatDate } from "../../../utils/dateFunctions"
import ReactPaginate from "react-paginate"
import ReviewCommercialProperty from "./ReviewCommercialProperty"
import ReviewAgriculturalProperty from "./ReviewAgriculturalProperty"

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

interface LocationType {
    name: {
        village: string | null,
        city: string | null,
        tehsil: string | null,
        district: string,
        state: string
    }
}

interface PropertyType {
    _id: string,
    location: LocationType,
    createdAt: string
}

//This component gives the list of properties added by a field-agent
const ListOfPropertiesAddedByFieldAgent: React.FC = () => {
    const navigate = useNavigate()

    const location = useLocation();
    const currentUrl = location.pathname;
    // Check if the current URL contains the word 'residential','agricultural'or 'commercial'
    const residentialProperty = currentUrl.includes('residential');
    const commercialProperty = currentUrl.includes('commercial')
    const agriculturalProperty = currentUrl.includes('agricultural')

    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        if ((!residentialProperty && !commercialProperty && !agriculturalProperty) ||
            (residentialProperty && commercialProperty && agriculturalProperty) ||
            (residentialProperty && commercialProperty) ||
            (commercialProperty && agriculturalProperty) ||
            (residentialProperty && agriculturalProperty)) {
            navigate('/field-agent/properties-added', { replace: true })
        }
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate, residentialProperty, commercialProperty, agriculturalProperty])

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [startingIndex, setStartingIndex] = useState<number>(1) //It is updated every a new page is selected by the user
    let index: number = startingIndex - 1 //Used to give serial numbers to properties

    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null) //Property selected to be shown in a table
    const [properties, setProperties] = useState<PropertyType[]>([]) //number of properties added by the field agent

    const [totalNumberOfProperties, setTotalNumberOfProperties] = useState<number | null>(null)//stores total number of properties available

    const [currentPage, setCurrentPage] = useState<number>(1);//stores the number for current page the user is on. Used for pagination
    const [totalPages, setTotalPages] = useState<number>(1);//Total number of pages for pagination

    //function is used by ReactPaginate to handle page numbers
    const handlePageClick = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected + 1);
        setStartingIndex((selectedPage.selected) * 10 + 1)
    };

    //Function is used to fetch all proeprties
    const fetchProperties = useCallback(async () => {
        let url: string
        if (residentialProperty) {
            url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/propertiesAddedByFieldAgent?page=${currentPage}&type=residential`
        } else if (agriculturalProperty) {
            url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/propertiesAddedByFieldAgent?page=${currentPage}&type=agricultural`
        } else if (commercialProperty) {
            url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/propertiesAddedByFieldAgent?page=${currentPage}&type=commercial`
        } else {
            return navigate('/field-agent/properties-added', { replace: true })
        }
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(url, {
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
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                if (!data.properties.length) {
                    navigate('/field-agent/properties-added', { replace: true })
                } else {
                    setProperties(data.properties);
                    setTotalNumberOfProperties(data.numberOfProperties)
                    setTotalPages(data.totalPages);
                }
            }
        } catch (error) {
            setStartingIndex(1)
            setCurrentPage(1)
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate, currentPage, agriculturalProperty, commercialProperty, residentialProperty])

    useEffect(() => {
        fetchProperties()
    }, [fetchProperties])

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {alert.isAlertModal && !error && !spinner &&
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

            {/*when error occurs */}
            {error && !spinner &&
                < div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <p className="text-red-500 cursor-pointer" onClick={fetchProperties}>Try again</p>
                </div>}

            {/*Back and Home buttons*/}
            {!spinner && !selectedPropertyId &&
                <div className={`w-full flex flex-row gap-2 z-20 fixed top-16 pt-3 pb-3 pl-3 ${alert.isAlertModal ? 'blur' : ''}`}>
                    <Link to='/field-agent/properties-added' className="bg-green-500 hover:bg-green-600 text-white font-semibold p-1 rounded">Back</Link>
                    <Link to='/field-agent' className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-1 rounded">Home</Link>
                </div>
            }

            {/*Selected property is shown in ReviewResidentialProperty component */}
            {residentialProperty && selectedPropertyId && !spinner && !error &&
                <ReviewResidentialProperty
                    propertyId={selectedPropertyId}
                    hideReviewPage={() => setSelectedPropertyId(null)} />}

            {/*Selected property is shown in ReviewCommercialProperty component */}
            {commercialProperty && selectedPropertyId && !spinner && !error &&
                <ReviewCommercialProperty
                    propertyId={selectedPropertyId}
                    hideReviewPage={() => setSelectedPropertyId(null)} />}

            {/*Selected property is shown in ReviewAgriculturalProperty component */}
            {agriculturalProperty && selectedPropertyId && !spinner && !error &&
                <ReviewAgriculturalProperty
                    propertyId={selectedPropertyId}
                    hideReviewPage={() => setSelectedPropertyId(null)} />}

            {!error &&
                <div className={`bg-gray-100 min-h-screen `}>
                    {!selectedPropertyId && !spinner && <div className=' pt-28 w-full flex flex-col place-items-center bg-gray-100 pl-2 pr-2 '>
                        {totalNumberOfProperties &&
                            //heading
                            <p className="w-full text-center text-xl font-bold mb-5 mt-2">{totalNumberOfProperties} {residentialProperty && 'residential'} {commercialProperty && 'commercial'} {agriculturalProperty && 'agricultural'} properties have been added</p>}

                        {properties.length > 0 && properties.map(property => {
                            index++
                            //List of properties
                            return <div key={property._id} className="h-fit flex flex-col gap-4 mb-10 place-items-center  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white rounded shadow-2xl p-3 sm:p-6">
                                <div className="w-full flex flex-row">
                                    <p className="text-gray-500 text-lg font-semibold">{index})</p>
                                    <div className="flex flex-row gap-5 sm:gap-10">
                                        <p className="text-lg font-bold pl-2">Location</p>

                                        <table className="table-auto flex flex-col bg-gray-100 p-2">
                                            <tbody>
                                                {property.location.name.village && <tr>
                                                    <td className="font-semibold">Village:</td>
                                                    <td className="pl-2 sm:pl-5">{property.location.name.village}</td>
                                                </tr>}
                                                {property.location.name.city && <tr>
                                                    <td className="font-semibold">City:</td>
                                                    <td className="pl-2 sm:pl-5">{property.location.name.city}</td>
                                                </tr>}
                                                {property.location.name.tehsil && <tr>
                                                    <td className="font-semibold">Tehsil:</td>
                                                    <td className="pl-2 sm:pl-5">{property.location.name.tehsil}</td>
                                                </tr>}
                                                <tr>
                                                    <td className="font-semibold">District:</td>
                                                    <td className="pl-2 sm:pl-5">{property.location.name.district}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold">State:</td>
                                                    <td className="pl-2 sm:pl-5">{property.location.name.state}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <p className="font-medium text-gray-500">Added on:</p>
                                    <p>{formatDate(property.createdAt)}</p>
                                </div>

                                <div className="w-full flex justify-center ">
                                    <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pb-1 pr-1 pl-1" onClick={() => setSelectedPropertyId(property._id)}>Open details</button>
                                </div>

                            </div>
                        })}
                    </div>}

                    <ReactPaginate
                        //component for pagination
                        pageCount={totalPages}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={`pagination flex justify-center pb-10 ${selectedPropertyId || spinner ? 'fixed right-full' : ''}`}
                        activeClassName="bg-gray-500 text-white px-3 rounded pt-1 hover:bg-gray-500"
                        pageClassName="mr-2 cursor-pointer px-3 rounded pt-1 border border-gray-400 hover:bg-gray-300"
                        previousClassName="mr-2 cursor-pointer btn-blue bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-1 rounded"
                        nextClassName="ml-2 cursor-pointer btn-blue bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-1 rounded"
                        disabledClassName="cursor-not-allowed"
                    />
                </div>}

        </Fragment >
    )
}
export default ListOfPropertiesAddedByFieldAgent