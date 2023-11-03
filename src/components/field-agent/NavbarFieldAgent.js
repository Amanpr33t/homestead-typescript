import { Link } from "react-router-dom"
import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaHome } from "react-icons/fa"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"

//This component is the navigation bar
function NavbarFieldAgent() {
    const navigate = useNavigate()
    const [alertMessage, setAlertMesssage] = useState() //This state is used set message in the alert modal
    const [alertType, setAlertType] = useState() //This state is used set alert type in the alert modal
    const [alertModal, setAlertModal] = useState(false) //This state is used to show the alert mdoal if an error occurs
    const [isSpinner, setIsSpinner] = useState(false)
    const authToken = localStorage.getItem("homestead-field-agent-authToken")
    const logoutFunction = async () => {
        setIsSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/logout`, {
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
            if (data.status === 'ok') {
                setIsSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn')
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setIsSpinner(false)
            setAlertModal(true)
            setAlertType('warning')
            setAlertMesssage('Some error occured')
        }
    }
    return (
        <Fragment>
            {/*The code bolow is used to show an alert modal if an error occurs */}
            {alertModal && <AlertModal message={alertMessage} type={alertType} alertModalRemover={() => setAlertModal(false)} />}

            {isSpinner && <Spinner />}

            <div className='fixed z-40 top-0 w-full'>
                <nav className=" flex flex-col w-full bg-white" >
                    <div className="flex flex-row justify-between items-center h-16 w-full border-b shadow ">
                        <div className="flex flex-row gap-2 pl-2 md:pl-12 cursor-pointer" onClick={() => navigate('/')}>
                            <FaHome role="svg" className="font-semibold text-4xl md:text-5xl text-gray-600" />
                            <p className='font-semibold text-3xl md:text-4xl italic text-gray-600' >HomeStead </p>
                        </div>
                        {authToken && <div className="flex flex-row  gap-4 pr-2 md:pr-6">
                            <Link to='/field-agent/property-dealers-added' className='hidden md:block font-semibold text-xl sm:text-xl italic text-gray-500 hover:text-gray-600 pb-1 pt-1' >Property-Dealers</Link>
                            <Link to='/field-agent/properties-added' className='hidden md:block  font-semibold text-xl sm:text-xl italic text-gray-500 hover:text-gray-600 pb-1 pt-1' >Properties</Link>
                            <button className='font-semibold text-xl sm:text-xl italic text-red-500 hover:text-red-600 pb-1 pt-1' onClick={logoutFunction}>Logout</button>
                        </div>}
                    </div>

                    {authToken && <div className="md:hidden flex flex-row place-content-center gap-10 sm:gap-10 border-b shadow pl-4">
                        <Link to='/field-agent/property-dealers-added' className=' font-semibold text-xl sm:text-xl italic text-gray-500 hover:text-gray-600 pb-1 pt-1' >Property-Dealers</Link>
                        <Link to='/field-agent/properties-added' className=' font-semibold text-xl sm:text-xl italic text-gray-500 hover:text-gray-600 pb-1 pt-1' >Properties</Link>
                    </div>}
                </nav>
            </div>
        </Fragment>
    )
}
export default NavbarFieldAgent