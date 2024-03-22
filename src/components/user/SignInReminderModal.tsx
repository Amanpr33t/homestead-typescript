import { Fragment } from "react"
import { IoClose } from "react-icons/io5"
import { Link } from "react-router-dom"

interface PropsType {
    hideModal: () => void
}

//this component is an alert modal
const SignInReminderModal: React.FC<PropsType> = ({ hideModal }) => {

    return (
        <Fragment>
            <div className="z-50 fixed left-0 top-0 px-2 py-5  sm:px-0  h-screen w-screen flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm" onClick={hideModal}>
                <div className="relative w-full sm:w-96 h-fit max-h-full overflow-y-auto bg-white " onClick={e => e.stopPropagation()}>
                    <IoClose className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 cursor-pointer" onClick={hideModal} />
                    <div className="p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900">Please Log In</h3>
                            <p className="mt-2 text-sm text-gray-500">You need to log in to access this feature.</p>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}
export default SignInReminderModal