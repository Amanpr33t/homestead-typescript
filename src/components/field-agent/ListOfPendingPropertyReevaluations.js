import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import Spinner from "../Spinner"
import AlertModal from "../AlertModal"
import ReviewAgriculturalProperty from "./ReviewAgriculturalProperty"

function ListOfPendingPropertyReevaluations() {
    const authToken = localStorage.getItem("homestead-field-agent-authToken")
    const navigate = useNavigate()

    const [selectedProperty, setSelectedProperty] = useState() //Property selected to be shown in a table
    const [pendingPropertyReevaluations, setPendingPropertyReevaluations] = useState([])
    const [spinner, setSpinner] = useState(true)
    const [error, setError] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    let index = 0


    const fetchPendingPropertiesForReevaluations = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/pendingPropertiesForReevaluationByFieldAgent`, {
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
                console.log(data)
                if (!data.pendingPropertyReevaluations.length) {
                    navigate('/field-agent', { replace: true })
                } else {
                    setPendingPropertyReevaluations(data.pendingPropertyReevaluations)
                }
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate])

    useEffect(() => {
        fetchPendingPropertiesForReevaluations()
    }, [fetchPendingPropertiesForReevaluations])

    const dateCreater = (date) => {
        const dateFormat = new Date(date)
        return `${dateFormat.getDate()}-${dateFormat.getMonth() + 1}-${dateFormat.getFullYear()}`;
    }

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {alert.isAlertModal && !error && !spinner && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}

            {error && !spinner && <div className="fixed top-36 w-full flex flex-col place-items-center">
                <p>Some error occured</p>
                <p className="text-red-500 cursor-pointer" onClick={fetchPendingPropertiesForReevaluations}>Try again</p>
            </div>}

            {!spinner && !selectedProperty && <div className={`w-full flex flex-row gap-2 z-20 fixed top-16 pt-3 pb-3 pl-3  ${error ? 'bg-white' : 'bg-gray-100'} ${alert.isAlertModal ? 'blur' : ''}`}>
                <Link to='/field-agent' className="bg-blue-500 text-white font-semibold p-1 rounded">Home</Link>
            </div>}

            {/*When a property is selected, it will be shown in a table in  ReviewAgriculturalProperty component*/}
            {/*selectedProperty && !spinner && !error && <ReviewAgriculturalProperty property={selectedProperty} hideReviewPage={() => setSelectedProperty(null)} />*/}

            {!selectedProperty && !spinner && !error && <>
                <div className=' pt-28 w-full min-h-screen flex flex-col place-items-center bg-gray-100 pl-2 pr-2 '>
                    {pendingPropertyReevaluations.length > 0 && <p className="w-full text-center text-xl font-bold mb-5 mt-2">{pendingPropertyReevaluations.length} properties pending for re-evaluation</p>}
                    {pendingPropertyReevaluations.length > 0 && pendingPropertyReevaluations.map(property => {
                        index++
                        return <div key={property._id} className="h-fit flex flex-col gap-4 mb-10 place-items-center  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white rounded shadow-2xl p-3 sm:p-6">
                            <div className="w-full flex flex-row">
                                <p className="text-gray-500 text-lg font-semibold">{index})</p>
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg font-semibold pl-2">{property.propertyType} property</p>
                                    <p className="font-semibold pl-2">{property.location.name.district}, {property.location.name.state}</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4">
                                <p className="font-medium text-gray-500">Request received on:</p>
                                <p>{dateCreater(property.evaluationData
                                    .evaluatedAt)}</p>
                            </div>
                            <div className="w-full flex justify-center ">
                                <button type="button" className="bg-blue-500 text-white font-medium rounded pb-1 pr-1 pl-1" onClick={()=>navigate(`/field-agent/reevaluate-property?id=${property._id}&type=${property.propertyType}`)}>Open details</button>
                            </div>
                        </div>
                    })}
                </div>
            </>}
        </Fragment>
    )
}
export default ListOfPendingPropertyReevaluations