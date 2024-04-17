import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import Spinner from "../../Spinner"
import Pagination from "../../Pagination"
import CardToShowProperty from "../../CardToShowAProperty"

interface LocationType {
    name: {
        plotNumber: number | null,
        village: string | null,
        city: string | null,
        tehsil: string | null,
        district: string,
        state: string
    }
}

interface PropertyDataType {
    _id: string,
    propertyType: 'agricultural' | 'commercial' | 'residential',
    location: LocationType,
    sentToEvaluatorByFieldAgentForEvaluation: {
        date: string
    }
}

//This component shows list of proerties pending for evaluation by property evaluator
const ListOfPropertiesToBeEvaluatedByEvaluator: React.FC = () => {
    const navigate = useNavigate()
    const authToken: null | string = localStorage.getItem("homestead-property-evaluator-authToken") //This variable stores the authToken present in local storage

    // Get the current URL
    const currentUrl = window.location.href;

    const isResidential: null | boolean = currentUrl.includes('residential');
    const isCommercial: null | boolean = currentUrl.includes('commercial');
    const isAgricultural: null | boolean = currentUrl.includes('agricultural');

    useEffect(() => {
        if ((isResidential && isCommercial) ||
            (isCommercial && isAgricultural) ||
            (isAgricultural && isResidential) ||
            (!isResidential && !isCommercial && !isAgricultural)) {
            navigate('/property-evaluator')
            return
        }
    }, [navigate, isResidential, isCommercial, isAgricultural])

    const [currentPage, setCurrentPage] = useState<number>(1);//stores the number for current page the user is on. Used for pagination
    const [totalPages, setTotalPages] = useState<number>(1);//Total number of pages for pagination

    const [initialLoad, setInitialLoad] = useState(true)

    const [startingIndex, setStartingIndex] = useState<number>(1) //It is updated every a new page is selected by the user
    let index: number = startingIndex - 1 //Used to give serial numbers to propertiess

    const [pendingPropertyEvaluations, setPendingPropertyEvaluations] = useState<[PropertyDataType] | null>(null) //Information regarding pending property evaluations

    useEffect(() => {
        if (!authToken) {
            navigate('/user', { replace: true })
            return
        }
    }, [authToken, navigate])

    const [error, setError] = useState<boolean>(false)

    //function is used by ReactPaginate to handle page numbers
    const handlePageClick = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected + 1);
        setStartingIndex((selectedPage.selected) * 10 + 1)
    };

    //The function is used to fetch properties pending for evaluation by evaluator
    const fetchPendingPropertyEvaluations = useCallback(async () => {
        let type
        if (isResidential) {
            type = 'residential'
        } else if (isCommercial) {
            type = 'commercial'
        } else if (isAgricultural) {
            type = 'agricultural'
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/propertiesPendingToBeEvaluated?type=${type}&page=${currentPage}`, {
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
                localStorage.removeItem("homestead-property-evaluator-authToken")
                navigate('/user', { replace: true })
            } else if (data.status === 'ok') {
                if (!data.pendingPropertyEvaluations.length) {
                    return navigate('/property-evaluator', { replace: true })
                }
                setError(false)
                setPendingPropertyEvaluations(data.pendingPropertyEvaluations)
                setTotalPages(data.totalPages)
                if (initialLoad) {
                    setInitialLoad(false)
                }
            }
        } catch (error) {
            setError(true)
            setStartingIndex(1)
            setCurrentPage(1)
        }
    }, [authToken, navigate, currentPage, isAgricultural, isResidential, isCommercial, initialLoad])

    useEffect(() => {
        fetchPendingPropertyEvaluations()
    }, [fetchPendingPropertyEvaluations])

    return (
        <Fragment>

            {initialLoad && !error && <Spinner />}

            {error &&
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <p className="text-red-500 cursor-pointer" onClick={fetchPendingPropertyEvaluations}>Try again</p>
                </div>}

            <div className={`w-full z-20 fixed top-16 left-2 mt-2`}>
                <Link to='/property-evaluator/properties-pending-for-evaluation' className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded px-2 py-1 mr-2" >Back</Link>
                <Link to='/property-evaluator' className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded px-2 py-1" >Home</Link>
            </div>

            {!error && !initialLoad &&
                <div className="pt-28 min-h-screen sm:pt-20 flex flex-col place-items-center gap-7 bg-gray-100">

                    {pendingPropertyEvaluations &&
                        <p className="text-xl font-semibold">{pendingPropertyEvaluations.length} property evaluations are pending</p>}

                    <div className='w-full flex flex-col gap-10 place-items-center  pl-2 pr-2 '>
                        {pendingPropertyEvaluations && pendingPropertyEvaluations.length > 0 && pendingPropertyEvaluations.map(property => {
                            index++
                            return <CardToShowProperty
                                key={property._id}
                                _id={property._id}
                                index={index}
                                propertyType={property.propertyType}
                                location={property.location}
                                sentToEvaluatorByFieldAgentForEvaluation={property.sentToEvaluatorByFieldAgentForEvaluation}
                            />
                        })}

                        {totalPages > 1 &&
                            <Pagination handlePageClick={handlePageClick} totalPages={totalPages} />}
                    </div>
                </div>}

        </Fragment >
    )
}
export default ListOfPropertiesToBeEvaluatedByEvaluator