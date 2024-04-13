import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import { MdHomeWork } from "react-icons/md";
import { AlertType } from "../../dataTypes/alertType"
import { RxDropdownMenu } from "react-icons/rx";
import SignInModal from "./signIn/SignInModal";
import SignUpModal from "./signUp/SignUpModal";
import UserTypeModal from "./UserTypeModal";
import UserEditDetailsModal from "./UserEditDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import { OpenSignInSignUpModalActions } from "../../store/slices/openSignInSignUpModal";

//This component is the navigation bar
const NavbarUser: React.FC = () => {
    const navigate = useNavigate()
    const dispatch=useDispatch()
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const openSignInSignUpModal = useSelector((state: { SignInSignUpModal: { openSignInSignUpModal: 'sign-in' | 'sign-up' | null } }) => state.SignInSignUpModal.openSignInSignUpModal)

    const [spinner, setSpinner] = useState<boolean>(false)

    const authToken: string | null = localStorage.getItem("homestead-user-authToken")

    const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false) //if true, a dropdown is shown 

    const [selectUserTypeModal, setSelectUserTypeModal] = useState<boolean>(false)
    const [selectedUserType, setSelectedUserType] = useState<'dealer' | 'customer' | null>(null)

    //const [openSignInSignUpModal, setOpenSignInSignUpModal] = useState<'sign-in' | 'sign-up' | null>(null)

    const [showUserEditDetailsModal, setShowUserEditDetailsModal] = useState<boolean>(false)

    //to logout user
    const logoutFunction = async () => {
        localStorage.removeItem('homestead-user-authToken')
        window.location.reload()
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

            {selectUserTypeModal &&
                <UserTypeModal
                    selectUserTypeModalSetter={(input) => setSelectUserTypeModal(input)}
                    selectedUserTypeSetter={(input) => setSelectedUserType(input)}
                    selectedUserType={selectedUserType}
                    operationSetter={() => dispatch(OpenSignInSignUpModalActions.setOpenSignInSignUpModal('sign-up'))}
                />}

            {openSignInSignUpModal === 'sign-in' &&
                <SignInModal
                    selectUserTypeModalSetter={() => {
                        setSelectUserTypeModal(true)
                        dispatch(OpenSignInSignUpModalActions.setOpenSignInSignUpModal(null))
                    }}
                    modalReset={() =>dispatch(OpenSignInSignUpModalActions.setOpenSignInSignUpModal(null))} />}

            {openSignInSignUpModal === 'sign-up' &&
                <SignUpModal
                    openSignInSignUpModalSetter={(input) => dispatch(OpenSignInSignUpModalActions.setOpenSignInSignUpModal(input))}
                    selectedUserTypeSetter={(input) => setSelectedUserType(input)}
                    selectedUserType={selectedUserType}
                />}

            {showUserEditDetailsModal &&
                <UserEditDetailsModal
                    modalReset={() => setShowUserEditDetailsModal(false)}
                    alertSetter={(input) => setAlert(input)}
                    alert={alert}
                />}

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
                                setShowUserEditDetailsModal(true)
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

                {!authToken && <div className="md:w-60 h-full relative flex flex-row gap-1.5 md:gap-5 justify-end items-center" >
                    <button className="font-bold md:font-semibold text-sm md:text-base text-gray-700 hover:bg-gray-100 px-1 py-2 rounded-lg" onClick={() => dispatch(OpenSignInSignUpModalActions.setOpenSignInSignUpModal('sign-in'))}>Sign in</button>

                    <button className="bg-red-600 hover:bg-red-800 font-bold md:font-semibold text-sm md:text-base rounded-lg text-white px-5 py-2 font-bold mr-2 lg:mr-2" onClick={() => setSelectUserTypeModal(true)}>Join</button>
                </div>}

            </div >

            {showUserDropdown && <div className="z-20 fixed top-0 h-screen bg-transparent w-full" onClick={() => setShowUserDropdown(false)}></div>}

        </Fragment >
    )
}
export default NavbarUser