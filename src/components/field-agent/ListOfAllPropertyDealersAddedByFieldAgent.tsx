import { Link, useNavigate } from "react-router-dom"
import React, { Fragment, useEffect, useCallback, useState } from "react"
import ReviewPropertyDealer from "./ReviewPropertyDealer"
import Spinner from "../Spinner"
import AlertModal from "../AlertModal"
import { formatDate } from "../../utils/dateFunctions"
import ReactPaginate from "react-paginate"
//This component is the navigation bar

interface DealerType {
    _id: string,
    firmName: string,
    firmLogoUrl: string,
    createdAt: string
}

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

//This component shows a list of property dealers added by the field agent
const ListOfAllPropertyDealersAddedByFieldAgent: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken") //This variable stores the authToken present in local storage

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [propertyDealers, setPropertyDealers] = useState<DealerType[]>([]) //array contains all the proeprty dealers added by the field agent

    const [selectedPropertyDealerId, setSelectedPropertyDealerId] = useState<string | null>(null) //it stores the selected property dealer Id

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [totalNumberOfPropertyDealers, setTotalNumberOfPropertyDealers] = useState<number | null>(null)//stores total number of property dealers available

    const [currentPage, setCurrentPage] = useState<number>(1);//stores the number for current page the user is on. Used for pagination
    const [totalPages, setTotalPages] = useState<number>(1);//Total number of pages for pagination

    const [startingIndex, setStartingIndex] = useState<number>(1) //It is updated every a new page is selected by the user
    let index: number = startingIndex - 1 //Used to give serial numbers to properties

    //function is used by ReactPaginate to handle page numbers
    const handlePageClick = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected + 1);
        setStartingIndex((selectedPage.selected) * 10 + 1)
    };

    //The function is used to fetch property dealers
    const fetchPropertyDealers = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealersAddedByFieldAgent?page=${currentPage}`, {
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
            console.log(data)
            if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                if (!data.propertyDealers.length) {
                    return navigate('/field-agent', { replace: true })
                }
                setPropertyDealers(data.propertyDealers)
                setTotalNumberOfPropertyDealers(data.numberOfPropertyDealers)
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            setStartingIndex(1)
            setCurrentPage(1)
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate, currentPage])

    useEffect(() => {
        fetchPropertyDealers()
    }, [fetchPropertyDealers])

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

            {error && !spinner &&
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <p className="text-red-500 cursor-pointer" onClick={fetchPropertyDealers}>Try again</p>
                </div>}

            {/*The component ReviewPropertyDealer is used to show the selected property dealer in a table*/}
            {selectedPropertyDealerId && !spinner && !error &&
                <ReviewPropertyDealer
                    dealerId={selectedPropertyDealerId}
                    hideReviewPage={() => setSelectedPropertyDealerId(null)} />}

            {!selectedPropertyDealerId && !spinner &&
                //Home button and heading
                <div className={`w-full z-20 fixed top-16 pt-3 pb-3 pl-3 ${alert.isAlertModal ? 'blur' : ''}`}>
                    <Link to='/field-agent' className="bg-green-500 hover:bg-green-600 text-white font-semibold p-1 rounded" >Home</Link>
                    {!error &&
                        <div className="w-full flex justify-center mt-3">
                            <p className="text-xl font-bold">{totalNumberOfPropertyDealers} dealers have been added by you</p>
                        </div>}
                </div>}

            {!error &&
                <div className={`min-h-screen bg-gray-100 ${selectedPropertyDealerId || spinner ? 'fixed right-full' : ''}`}>

                    <div className='pt-40 pb-10 w-full  flex flex-col gap-10 place-items-center bg-gray-100 pl-2 pr-2 '>

                        {propertyDealers.length > 0 && propertyDealers.map(dealer => {
                            index++
                            return <div key={dealer._id} className="h-fit flex flex-col gap-4  place-items-center  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white rounded shadow-2xl p-3 sm:p-6">
                                <div className="w-full flex flex-row  place-content-between">
                                    <div className="flex flex-row gap-2">
                                        <p className="text-gray-500 text-lg font-semibold">{index})</p>
                                        <p className="flex justify-center text-lg font-semibold">{dealer.firmName}</p>
                                    </div>
                                    {dealer.firmLogoUrl &&
                                        <img className='h-16 w-auto' src={dealer.firmLogoUrl
                                        } alt="logo" />}
                                </div>
                                <div className="flex flex-row gap-4">
                                    <p className="font-medium text-gray-500">Added on:</p>
                                    <p>{formatDate(dealer.createdAt)}</p>
                                </div>
                                <div className="w-full flex justify-center ">
                                    <button
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pb-1 pr-1 pl-1"
                                        onClick={() => setSelectedPropertyDealerId(dealer._id)}>
                                        Open details
                                    </button>
                                </div>
                            </div>
                        })}
                    </div>

                    <ReactPaginate
                        //component for pagination
                        pageCount={totalPages}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={`pagination flex justify-center pb-10 `}
                        activeClassName="bg-gray-500 text-white px-3 rounded pt-1 hover:bg-gray-500"
                        pageClassName="mr-2 cursor-pointer px-3 rounded pt-1 border border-gray-400 hover:bg-gray-300"
                        previousClassName="mr-2 cursor-pointer btn-blue bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-1 rounded"
                        nextClassName="ml-2 cursor-pointer btn-blue bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-1 rounded"
                        disabledClassName="cursor-not-allowed"
                    />
                </div>}

        </Fragment>
    )
}
export default ListOfAllPropertyDealersAddedByFieldAgent