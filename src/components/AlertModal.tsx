import { Fragment } from "react"
import { FaCheckCircle } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import { MdErrorOutline } from "react-icons/md"
import { useNavigate } from "react-router-dom"

interface AlertPropsType {
    message: string | null,
    type: 'success' | 'warning' | null,
    alertModalRemover: () => void,
    routeTo?: string | null
}
//this component is an alert modal
const AlertModal: React.FC<AlertPropsType> = (props) => {
    const navigate = useNavigate()
    const { message, type, alertModalRemover, routeTo } = props

    const routeToPage = () => {
        if (routeTo) {
            navigate(routeTo, { replace: true })
        }
    }
    return (
        <Fragment>
            <div className="fixed z-50 top-0 left-0 pt-28 h-screen w-full flex justify-center bg-black bg-opacity-50 backdrop-blur" onClick={routeTo ? routeToPage : alertModalRemover}>
                <div className="relative w-11/12 sm:w-96 h-fit rounded shadow bg-white" onClick={e => e.stopPropagation()}>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded p-2 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={routeTo ? routeToPage : alertModalRemover}>
                        <IoClose className="text-3xl" />
                    </button>
                    <div className="p-6 text-center">
                        {type === 'success' && <div className="w-full flex justify-center mb-5"><FaCheckCircle className="text-5xl text-green-500" /></div>}
                        {type === 'warning' && <div className="w-full flex justify-center mb-5"><MdErrorOutline className="text-5xl text-red-500" /></div>}
                        <h3 className="mb-5 text-lg font-semibold text-gray-800 ">{message}</h3>
                        <button data-modal-hide="popup-modal" type="button" className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded border border-gray-400 hover:border-gray-300 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={routeTo ? routeToPage : alertModalRemover}>Ok</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default AlertModal