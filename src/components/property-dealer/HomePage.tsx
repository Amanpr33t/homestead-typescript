
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import AlertModal from "../AlertModal"
import { MdFrontHand } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AlertType } from "../../dataTypes/alertType";
import CustomerNotifications from "./CustomerNotifications";
import CustomerInformationModal from "./CustomerInformationModal";
import Spinner from "../Spinner";
import TableProperty from "./TableProperty";
import PropertyAddRequestModal from "./PropertyAddRequestModal";

interface CustomerQueryType {
    propertyType: 'agricultural' | 'commercial' | 'residential',
    propertyId: string,
    customerId: string,
    customerName: string,
    customerEmail: string,
    customerContactNumber: string,
    requestDate: string,
    requestSeen: boolean
}

interface FetchedPropertyType {
    _id: string,
    location: {
        name: {
            plotNumber?: number | null,
            village: string | null,
            city: string | null,
            tehsil: string | null,
            district: string,
            state: string
        }
    },
    isApprovedByCityManager: {
        isApproved: boolean
    },
    isLive: boolean,
    createdAt: string
}

//This component is the home page for property dealer
const PropertyDealerHomePage: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")
    const targetRef = useRef<HTMLParagraphElement>(null);

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerQueryType | null>(null) //stores data about customer who has been selected
    const [dealerInfo, setDealerInfo] = useState<{
        logoUrl: string,
        firmName: string,
        reraNumber: string,
        gstNumber: string,
        id: string
    }>()
    const [numberOfPropertiesAdded, setNumberOfPropertiesAdded] = useState<{
        agricultural: number,
        residential: number,
        commercial: number
    }>()
    const [fetchedPropertyData, setFetchedPropertData] = useState<FetchedPropertyType[]>([])
    const [selectedPropertyType, setSelectedPropertyType] = useState<'agricultural' | 'residential' | 'commercial'>()
    const [numberOfPagesForProperty, setNumberOfPagesForProperty] = useState<number>()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [allCustomerQueries, setAllCustomerQueries] = useState<CustomerQueryType[]>([])//stores data about all customers who sent queries
    const [disableShowMorePropertiesButton, setDisableShowMorePropertiesButton] = useState<boolean>(false)
    const [showPropertyAddModal, setShowPropertyAddModal] = useState<boolean>(false)

    const fetchDataForHomePage = useCallback(async () => {
        setError(false)
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/homePageData`, {
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
            if (data.status === 'ok') {
                setSpinner(false)
                setAllCustomerQueries(data.customerRequests)
                setDealerInfo(data.dealerInfo)
                setNumberOfPropertiesAdded(data.numberOfProperties)
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
            return
        }
    }, [authToken, navigate])

    const fetchSelectedPropertyTypeData = async (type: 'agricultural' | 'residential' | 'commercial', page?: number) => {
        setError(false)
        setDisableShowMorePropertiesButton(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/fetchAllProperties?type=${type}&page=${page || pageNumber}`, {
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
            if (data.status === 'ok') {
                setPageNumber(number => number + 1)
                setDisableShowMorePropertiesButton(false)
                setFetchedPropertData(fetchedPropertyData => [...fetchedPropertyData, ...data.properties])
                setNumberOfPagesForProperty(data.totalPages)
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setPageNumber(1)
            setFetchedPropertData([])
            setDisableShowMorePropertiesButton(false)
            setError(true)
            return
        }
    }

    useEffect(() => {
        fetchDataForHomePage()
    }, [fetchDataForHomePage])

    useEffect(() => {
        if (fetchedPropertyData && fetchedPropertyData.length) {
            if (targetRef.current) {
                targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
    }, [fetchedPropertyData])

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    return (
        <Fragment>

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

            {spinner && !error && <Spinner />}

            {error && !spinner &&
                < div className="fixed top-36 w-full flex flex-col place-items-center ">
                    <p>Some error occured</p>
                    <button type='button' className="text-red-500" onClick={fetchDataForHomePage}>Try again</button>
                </div>}

            {selectedCustomer && !spinner && !error &&
                <CustomerInformationModal
                    selectedCustomerSetter={() => setSelectedCustomer(null)}
                    selectedCustomer={selectedCustomer}
                />}

            {/*Show a modal to add a new property */}
            {showPropertyAddModal && dealerInfo?.id && !spinner && !error &&
                <PropertyAddRequestModal
                    hideModal={() => setShowPropertyAddModal(false)}
                    dealerId={dealerInfo?.id}
                    alertSetter={(alertType: 'success' | 'warning', alertMessage: string) => setAlert({
                        alertMessage,
                        routeTo: null,
                        isAlertModal: true,
                        alertType
                    })}
                />}

            {!spinner && !error &&
                <div className={`pb-10 pt-16 ${selectedCustomer || alert.isAlertModal || spinner || showPropertyAddModal ? 'blur' : ''}`}>
                    <div className={`flex flex-row `}>
                        <div className="w-full md:w-2/3">
                            {/*Shows dealer info such as logo, rera number and gst number */}
                            {dealerInfo && <div className=" flex-row place-content-start gap-10 py-10 sm:pl-10 hidden sm:flex">
                                <img className="h-24 w-auto" src={dealerInfo.logoUrl} alt='' />
                                <div className="flex flex-col">
                                    <p className="text-lg font-bold mb-5 text-gray-700">{dealerInfo.firmName}</p>
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold text-gray-500">RERA number-</p>
                                        <p>{dealerInfo.reraNumber}</p>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold text-gray-500">GST number-</p>
                                        <p>{dealerInfo.gstNumber}</p>
                                    </div>
                                </div>
                            </div>}
                            {/*A message and an add property button */}
                            <div className="flex flex-col place-items-center gap-10 py-10 px-2 border-b shadow ">
                                <div className="flex flex-col gap-2 place-items-center ">
                                    <div className="flex flex-row place-content-center gap-3">
                                        <p className="text-3xl text-gray-700 font-bold">Hi!</p>
                                        <MdFrontHand className="text-3xl text-yellow-300 font-bold" />
                                    </div>
                                    <div className="text-2xl text-gray-500 text-center">Let's help you expand your business</div>
                                </div>
                                <button className="bg-green-400 hover:bg-green-500 text-white text-xl font-semibold p-5 rounded" onClick={() => setShowPropertyAddModal(true)}>Add Property</button>
                            </div>

                        </div>

                        {/*Shows customer messages */}
                        <div className={`w-1/3 hidden md:flex ${selectedCustomer || spinner ? 'blur' : ''}`}>
                            <CustomerNotifications
                                selectedCustomerSetter={(customer: CustomerQueryType) => setSelectedCustomer(customer)}
                                selectedCustomer={selectedCustomer}
                                errorSetter={(input: boolean) => setError(input)}
                                allCustomerQueries={allCustomerQueries}
                                customerQueriesSetter={(input: CustomerQueryType[]) => setAllCustomerQueries(input)}
                            />
                        </div>
                    </div>

                    {numberOfPropertiesAdded && (numberOfPropertiesAdded?.agricultural + numberOfPropertiesAdded?.commercial + numberOfPropertiesAdded?.residential > 0) &&
                        //A select element to select property type 
                        < div className="mt-7 flex flex-col place-items-center">
                            <p  className="text-center font-semibold text-2xl text-gray-700 px-2 mb-5">{numberOfPropertiesAdded?.agricultural + numberOfPropertiesAdded?.commercial + numberOfPropertiesAdded?.residential} properties have already been added by you</p>
                            <select className="border-2 border-gray-400 rounded bg-gray-200 p-2 cursor-pointer" defaultValue='' onChange={(e) => {
                                setFetchedPropertData([])
                                setPageNumber(1)
                                setSelectedPropertyType(e.target.value as 'agricultural' | 'residential' | 'commercial')
                                fetchSelectedPropertyTypeData(e.target.value as 'agricultural' | 'residential' | 'commercial', 1)
                            }}>
                                <option className="font-semibold" disabled value="">Choose a property type</option>
                                {numberOfPropertiesAdded.agricultural > 0 && <option className="p-1" value="agricultural">Agricultural ({numberOfPropertiesAdded.agricultural})</option>}
                                {numberOfPropertiesAdded.residential > 0 && <option className="p-1" value="residential">Residential ({numberOfPropertiesAdded.residential})</option>}
                                {numberOfPropertiesAdded.commercial > 0 && <option className="p-1" value="commercial">Commercial ({numberOfPropertiesAdded.commercial})</option>}
                            </select>
                        </div>}

                    {fetchedPropertyData.length > 0 && numberOfPagesForProperty &&
                        //a table to show properties
                        <div className="overflow-x-auto flex flex-col gap-5 place-items-center mt-6 px-1 sm:px-0">
                            <TableProperty
                                propertyData={fetchedPropertyData}
                                selectedPropertyType={selectedPropertyType as 'agricultural' | 'residential' | 'commercial'}
                            />
                            {numberOfPagesForProperty > 1 && pageNumber <= numberOfPagesForProperty &&
                                //a button to fetch more properties
                                <button
                                    className={`${disableShowMorePropertiesButton ? 'bg-slate-400' : 'bg-slate-500 hover:bg-slate-600'} text-white py-1 px-2 rounded-lg`}
                                    onClick={() => fetchSelectedPropertyTypeData(selectedPropertyType as "agricultural" | "residential" | "commercial")}
                                    disabled={disableShowMorePropertiesButton}
                                >
                                    Show more properties
                                </button>}
                        </div>}
                </div>}

                <div ref={targetRef}></div>

        </Fragment >
    )
}
export default PropertyDealerHomePage