import { Fragment, useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaHome } from "react-icons/fa"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa"
import { MdOutlineMessage } from "react-icons/md";

//This component is the navigation bar
function NavbarPropertyDealer() {
    const navigate = useNavigate()
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null 
    })

    const [spinner, setSpinner] = useState(false)
    const authToken = localStorage.getItem("homestead-property-dealer-authToken")

    const [userDropdown, setUserDropdown] = useState(false) //if true, a dropdown is shown 

    const [numberOfCustomerRequests, setNumberOfCustomerRequests] = useState(0)//stores number of unread customer queries

    //used to fetch unread customer queries
    const fetchNumberOfCustomerRequests = useCallback(async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/numberOfCustomerRequests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        const data = await response.json()
        if (data.status === 'ok') {
            setNumberOfCustomerRequests(data.numberOfCustomerRequests)
        } else if (data.status === 'invalid_authentication') {
            setSpinner(false)
            localStorage.removeItem("homestead-property-dealer-authToken")
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    useEffect(() => {
        fetchNumberOfCustomerRequests()
    }, [fetchNumberOfCustomerRequests])

    //to logout user
    const logoutFunction = async () => {
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
                alertMessage: 'Some error occured',
                routeTo: null
            })
        }
    }

    return (
        <Fragment>
            {/*The code bolow is used to show an alert modal to the user */}
            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} alertModalRemover={() => setAlert({
                isAlertModal: false,
                alertType: '',
                alertMessage: ''
            })} />}

            {spinner && <Spinner />}

            <div className={`fixed top-0 z-50 w-full ${!userDropdown ? '' : 'h-screen sm:h-fit'}`} onClick={() => setUserDropdown(false)} >
                <nav className=" flex flex-col w-full bg-white " >
                    <div className="flex flex-row justify-between items-center h-20 w-full border-b shadow">
                        <div className="flex flex-row gap-2 pl-2 md:pl-12 cursor-pointer" onClick={() => navigate('/', { replace: true })}>
                            <FaHome role="svg" className="font-semibold text-3xl sm:text-4xl md:text-5xl text-gray-600" />
                            <p className='font-semibold text-xl sm:text-3xl md:text-4xl italic text-gray-600' >HomeStead</p>
                        </div>

                        {/*The JSX below will be executed only if there is an auth token*/}
                        {authToken &&
                            <div className="flex flex-row gap-2 sm:gap-4 pr-2 md:pr-6">
                                {/*The div below is for messsage font */}
                                <div className="relative flex items-center justify-center p-2 pt-5 cursor-pointer" onClick={() => navigate('/property-dealer/customer-notifications')}>
                                    <MdOutlineMessage className="text-3xl sm:text-4xl  text-gray-500 hover:text-blue-500 active:text-blue-500" />
                                    {numberOfCustomerRequests > 0 && <p className="absolute right-0 top-4 bg-orange-400 w-5 text-center rounded-full text-white font-bold">{numberOfCustomerRequests}</p>}
                                </div>

                                {/*The div below is for icons on navbar for screens with width greater than 'sm' */}
                                <div className="relative hover:bg-blue-100 cursor-pointer h-20 hidden sm:flex items-center justify-center pl-5 pr-5" onMouseEnter={() => setUserDropdown(true)} onMouseLeave={() => setUserDropdown(false)}>
                                    {userDropdown ?
                                        <FaArrowAltCircleUp className="text-3xl sm:text-4xl cursor-pointer text-blue-500" />
                                        :
                                        <FaArrowAltCircleDown className="text-3xl sm:text-4xl cursor-pointer text-gray-600" />
                                    }

                                    {/*The div below is a dropdown box*/}
                                    {userDropdown &&
                                        <div className="fixed top-20 right-6 w-72 flex flex-col border shadow bg-white cursor-pointer" >
                                            <div className="p-5 border-b cursor-text">
                                                <p className="font-semibold  text-lg">ABCD private limited</p>
                                                <p>abcd@gmail.com</p>
                                            </div>
                                            <p className="pl-5 pr-3 pt-5 pb-2 font-semibold text-gray-700 text-lg hover:text-blue-500" onClick={() => navigate('/property-dealer/details')}>User details</p>
                                            <p className="pl-5 pr-3 pt-2 pb-5 font-semibold text-red-400 text-lg hover:text-red-700" onClick={logoutFunction}>Logout</p>
                                        </div>}
                                </div>

                                {/*The div below is for icons on navbar for screens with width smaller than 'sm' */}
                                <div className="relative cursor-pointer h-20 flex items-center justify-center pl-5 pr-5 sm:hidden" onClick={(e) => {
                                    e.stopPropagation()
                                    setUserDropdown(true)
                                }} >
                                    {userDropdown ?
                                        <FaArrowAltCircleUp className="text-3xl sm:text-4xl cursor-pointer text-blue-500" />
                                        :
                                        <FaArrowAltCircleDown className="text-3xl sm:text-4xl cursor-pointer text-gray-600" />
                                    }

                                    {/*The div below is a dropdown box*/}
                                    {userDropdown &&
                                        <div className="fixed top-20 right-2 w-72 flex flex-col border shadow bg-white cursor-pointer z-50" >
                                            <div className="p-5 border-b cursor-text">
                                                <p className="font-semibold  text-lg">ABCD private limited</p>
                                                <p>abcd@gmail.com</p>
                                            </div>
                                            <p className="pl-5 pr-3 pt-5 pb-2 font-semibold text-gray-700 text-lg active:text-blue-500" onClick={(e) => {
                                                e.stopPropagation()
                                                setUserDropdown(false)
                                                navigate('/property-dealer/details')
                                            }}>User details</p>
                                            <p className="pl-5 pr-3 pt-2 pb-5 font-semibold text-red-400 text-lg active:text-red-700" onClick={(e) => {
                                                e.stopPropagation()
                                                setUserDropdown(false)
                                                logoutFunction()
                                            }}>Logout</p>
                                        </div>}
                                </div>
                            </div>}
                    </div>
                </nav>
                <div className="h-full w-full blur-xl"></div>
            </div >
        </Fragment >
    )
}
export default NavbarPropertyDealer