import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import { MdHomeWork} from "react-icons/md";
import { AlertType } from "../../dataTypes/alertType"
import { useSelector } from "react-redux"
import { RxDropdownMenu } from "react-icons/rx";
import { BiSolidMessageRoundedDots } from "react-icons/bi"

interface CustomerQueryType {
    propertyId: string,
    customerId: string,
    customerName: string,
    date: string,
    requestSeen: boolean
}

//This component is the navigation bar
const NavbarPropertyDealer: React.FC = () => {
    const navigate = useNavigate()
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const customerRequests = useSelector((state: { CustomerRequests: { customerRequests: CustomerQueryType[] } }) => state.CustomerRequests.customerRequests)

    const [unSeenCustomerRequests, setUnseenCustomerRequests] = useState<number>(0)

    useEffect(() => {
        if (customerRequests.length > 0) {
            setUnseenCustomerRequests(0)
            customerRequests.forEach(request => {
                if (request.requestSeen === false) {
                    setUnseenCustomerRequests(number => number + 1)
                }
            })
        }
    }, [customerRequests])

    const [spinner, setSpinner] = useState<boolean>(false)
    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

    const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false) //if true, a dropdown is shown 

    //to logout user
    const logoutFunction = async () => {
        setShowUserDropdown(false)
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/logout`, {
                method: 'PATCH',
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
            if (data.status === 'ok' || data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured. Try again later',
                routeTo: null
            })
        }
    }

    return (
        <Fragment>
            {/*The code bolow is used to show an alert modal to the user */}
            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} alertModalRemover={() => setAlert({
                isAlertModal: false,
                alertType: null,
                alertMessage: null,
                routeTo: null
            })} />}

            {spinner && <Spinner />}

            <div className={`fixed z-30 top-0 w-full px-5 md:px-10 lg:px-20 flex justify-between items-center border-b shadow bg-white h-20`} onClick={(e) => {
                e.stopPropagation()
                setShowUserDropdown(false)
            }}>

                <div className="sm:w-10 h-full flex flex-row gap-2">
                    <div className="relative h-20 w-fit px-2.5 cursor-pointer hover:bg-gray-100 active:bg-gray-100" onMouseEnter={() => setShowUserDropdown(true)} onMouseLeave={() => setShowUserDropdown(false)} onClick={(e) => {
                        e.stopPropagation()
                        setShowUserDropdown(true)
                    }}>
                        <RxDropdownMenu className="text-3xl sm:text-4xl text-gray-700  cursor-pointer mt-6 " />

                        {showUserDropdown && <div className="absolute top-16 mt-3.5 left-0 w-48 flex flex-col bg-black text-white cursor-pointer" onMouseEnter={() => setShowUserDropdown(true)}>
                            <p className="pl-3 py-3 font-semibold text-lg border-b border-white hover:bg-gray-800" onClick={() => {
                                navigate('/property-dealer/dealer-details')
                                setShowUserDropdown(false)
                            }}>User details</p>
                            <p className="pl-3 py-3 font-semibold text-lg hover:bg-gray-800" onClick={logoutFunction}>Logout</p>
                        </div>}

                    </div>

                    <div className="flex sm:hidden flex-row gap-0.5 cursor-pointer mt-6" onClick={() => navigate('/', { replace: true })}>
                        <MdHomeWork role="svg" className="text-red-600 font-semibold text-3xl " />
                        <p className='font-bold text-xl text-gray-700'>HomeStead</p>
                    </div>
                </div>

                <div className="hidden sm:flex flex-row gap-2 cursor-pointer" onClick={() => navigate('/', { replace: true })}>
                    <MdHomeWork role="svg" className="text-red-600 font-semibold text-4xl " />
                    <p className='font-bold text-2xl text-gray-700'>HomeStead</p>
                </div>

                <div className="w-10 hidden lg:flex"></div>

                <div className="w-10 h-full relative lg:hidden flex justify-center items-center cursor-pointer" onClick={() => navigate('/property-dealer/customer-notifications')}>
                    <BiSolidMessageRoundedDots className=" flex mt-2 text-3xl sm:text-4xl text-gray-700 hover:text-blue-500 active:text-blue-500" />
                    <p className="lg:hidden block absolute -right-1 top-4 sm:top-3 bg-orange-400 w-5 text-center rounded-full text-white  font-semibold">{unSeenCustomerRequests}</p>
                </div>

            </div >

            {showUserDropdown && <div className="z-20 fixed top-0 h-screen bg-transparent w-full" onClick={() => setShowUserDropdown(false)}></div>}

        </Fragment >
    )
}
export default NavbarPropertyDealer