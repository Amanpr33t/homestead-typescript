import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import Spinner from "../Spinner"
import AlertModal from "../AlertModal"
import ReviewResidentialProperty from "./ReviewResidentialProperty"

//This component gives the list of residential properties added by a field-agent
function ResidentialPropertiesAddedByFieldAgent() {
    const authToken = localStorage.getItem("homestead-field-agent-authToken")
    const navigate = useNavigate()

    useEffect(() => {
        if (!authToken) {
          navigate('/field-agent/signIn', { replace: true })
        }
      }, [authToken, navigate])

    const [selectedProperty, setSelectedProperty] = useState() //Selected prperty to be shown in a table
    const [residentialProperties, setResidentialProperties] = useState([]) //array stores all the residential proeprties added by a field agent
    const [spinner, setSpinner] = useState(true)
    const [error, setError] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    let index = 0

    //Function is used to fetch all residebtial proeprties
    const fetchResidentialProperties = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/residentialPropertiesAddedByFieldAgent`, {
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
                if (!data.residentialProperties.length) {
                    navigate('/field-agent/properties-added', { replace: true })
                } else {
                    setResidentialProperties(data.residentialProperties)
                }
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate])

    useEffect(() => {
        fetchResidentialProperties()
    }, [fetchResidentialProperties])

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
                <p className="text-red-500 cursor-pointer" onClick={fetchResidentialProperties}>Try again</p>
            </div>}

            {!spinner && !selectedProperty && <div className={`w-full flex flex-row gap-2 z-20 fixed top-16 pt-3 pb-3 pl-3  ${error ? 'bg-white' : 'bg-gray-100'} ${alert.isAlertModal ? 'blur' : ''}`}>
                <Link to='/field-agent/properties-added' className="bg-green-500 text-white font-semibold p-1 rounded">Back</Link>
                <Link to='/field-agent' className="bg-blue-500 text-white font-semibold p-1 rounded">Home</Link>
            </div>}

            {/*Selected property is shown in ReviewResidentialProperty component */}
            {selectedProperty && !spinner && !error && <ReviewResidentialProperty property={selectedProperty} hideReviewPage={() => setSelectedProperty(null)} />}

            {!selectedProperty && !spinner && !error && <>
                <div className=' pt-28 w-full min-h-screen flex flex-col place-items-center bg-gray-100 pl-2 pr-2 '>
                    {residentialProperties.length > 0 && <p className="w-full text-center text-xl font-bold mb-5 mt-2">{residentialProperties.length} residential properties have been added</p>}
                    {residentialProperties.length > 0 && residentialProperties.map(property => {
                        index++
                        return <div key={property._id} className="h-fit flex flex-col gap-4 mb-10 place-items-center  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white rounded shadow-2xl p-3 sm:p-6">
                            <div className="w-full flex flex-row">
                                <p className="text-gray-500 text-lg font-semibold">{index})</p>
                                <div className="flex flex-row gap-5 sm:gap-10">
                                    <p className="text-lg font-bold pl-2">Location</p>

                                    <table className="table-auto flex flex-col bg-gray-100 p-2">
                                        <tbody>
                                            {property.location.name.plotNumber && <tr>
                                                <td className="font-semibold">Plot/house no.</td>
                                                <td className="pl-2 sm:pl-5">{property.location.name.plotNumber}</td>
                                            </tr>}
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
                                <p>{dateCreater(property.createdAt)}</p>
                            </div>
                            <div className="w-full flex justify-center ">
                                <button type="button" className="bg-blue-500 text-white font-medium rounded pb-1 pr-1 pl-1" onClick={() => setSelectedProperty(property)}>Open details</button>
                            </div>
                        </div>
                    })}
                </div>
            </>}
        </Fragment>
    )
}
export default ResidentialPropertiesAddedByFieldAgent