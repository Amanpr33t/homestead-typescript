import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaHome } from "react-icons/fa"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null
    routeTo: string | null
}

//This component is the navigation bar
const NavbarPropertyEvaluator: React.FC = () => {
    const navigate = useNavigate()
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [spinner, setSpinner] = useState<boolean>(false)
    const authToken: string | null = localStorage.getItem("homestead-property-evaluator-authToken")

    const logoutFunction = async () => {
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/logout`, {
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
                localStorage.removeItem("homestead-property-evaluator-authToken")
                navigate('/property-evaluator/signIn', { replace: true })
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
                alertType: null,
                alertMessage: null,
                routeTo:null
            })} />}

            {spinner && <Spinner />}

            <div className='fixed z-40 top-0 w-full'>
                <nav className=" flex flex-col w-full bg-white" >
                    <div className="flex flex-row justify-between items-center h-16 w-full border-b shadow ">
                        <div className="flex flex-row gap-2 pl-2 md:pl-12 cursor-pointer" onClick={() => navigate('/', { replace: true })}>
                            <FaHome role="svg" className="font-semibold text-4xl md:text-5xl text-gray-600" />
                            <p className='font-semibold text-3xl md:text-4xl italic text-gray-600' >HomeSteadd</p>
                        </div>
                        {authToken && <div className="flex flex-row  gap-4 pr-2 md:pr-6">
                            <button className='font-semibold text-xl sm:text-xl italic text-red-500 hover:text-red-600 pb-1 pt-1' onClick={logoutFunction}>Logout</button>
                        </div>}
                    </div>
                </nav>
            </div>
        </Fragment>
    )
}
export default NavbarPropertyEvaluator