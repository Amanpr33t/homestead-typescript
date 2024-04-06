import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import { MdHomeWork } from "react-icons/md";
import { AlertType } from "../../dataTypes/alertType"
import { RxDropdownMenu } from "react-icons/rx";

//This component is the navigation bar
const NavbarUser: React.FC = () => {
    const navigate = useNavigate()
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [spinner, setSpinner] = useState<boolean>(false)

    const authToken: string | null = localStorage.getItem("homestead-user-authToken")

    const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false) //if true, a dropdown is shown 

    //to logout user
    const logoutFunction = async () => {
        setShowUserDropdown(false)
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, {
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
                localStorage.removeItem("homestead-user-authToken")
                navigate('/user/signIn', { replace: true })
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

            <div className={`fixed lg:px-20 z-30 top-0 w-full flex justify-between items-center bg-white h-20`} onClick={(e) => {
                e.stopPropagation()
                setShowUserDropdown(false)
            }}>

                <div className="md:w-60 h-full flex flex-row ">
                    {authToken && <div className="relative h-20 w-fit px-2.5 cursor-pointer hover:bg-gray-100 active:bg-gray-100" onMouseEnter={() => setShowUserDropdown(true)} onMouseLeave={() => setShowUserDropdown(false)} onClick={(e) => {
                        e.stopPropagation()
                        setShowUserDropdown(true)
                    }}>
                        <RxDropdownMenu className="text-3xl sm:text-4xl text-gray-700  cursor-pointer mt-6 " />

                        {showUserDropdown && <div className="absolute top-16 mt-3.5 left-0 w-48 flex flex-col bg-black text-white cursor-pointer" onMouseEnter={() => setShowUserDropdown(true)}>
                            <p className="pl-3 py-3 font-semibold text-lg border-b border-white hover:bg-gray-800" onClick={(e) => {
                                e.stopPropagation()
                                //navigate('/user/dealer-details')
                                setShowUserDropdown(false)
                            }}>User details</p>
                            <p className="pl-3 py-3 font-semibold text-lg hover:bg-gray-800" onClick={logoutFunction}>Logout</p>
                        </div>}

                    </div>}

                    <div className="ml-2 flex flex-row gap-0.5 cursor-pointer mt-6" onClick={() => navigate('/user', { replace: true })}>
                        <MdHomeWork role="svg" className="text-red-600 font-semibold text-4xl " />
                        <p className='font-bold text-2xl text-gray-700'>HomeStead</p>
                    </div>
                </div>

                <div className="md:w-60 h-full relative flex flex-row gap-1.5 md:gap-5 justify-end items-center" >
                    <button className="font-bold md:font-semibold text-sm md:text-base text-gray-700 hover:bg-gray-100 px-1 py-2 rounded-lg" >Sign in</button>
                    <button className="bg-red-600 hover:bg-red-800 font-bold md:font-semibold text-sm md:text-base rounded-lg text-white px-5 py-2 font-bold mr-2 lg:mr-2">Join</button>
                </div>

            </div >

            {showUserDropdown && <div className="z-20 fixed top-0 h-screen bg-transparent w-full" onClick={() => setShowUserDropdown(false)}></div>}

        </Fragment >
    )
}
export default NavbarUser