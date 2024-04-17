
import { ChangeEvent, Fragment, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AlertType } from "../../../dataTypes/alertType";
import { IoClose } from "react-icons/io5";

interface PropsType {
    propertyId: string,
    modalReset: () => void,
    alertSetter: (alert: AlertType) => void
}

//This component is the home page for property dealer
const AddPropertyModal: React.FC<PropsType> = ({ propertyId, modalReset, alertSetter }) => {
    const navigate = useNavigate()

    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")
    const [spinner, setSpinner] = useState<boolean>(false)

    const [reasonToCloseProperty, setReasonToCloseProperty] = useState<{
        propertySoldByDealer?: boolean,
        customerRemovesProperty?: boolean,
        dealerNotInterestedInSelling?: boolean,
        other?: boolean
    } | null>(null)

    const closeProperty = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!reasonToCloseProperty) {
            return
        }
        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/closeProperty?propertyId=${propertyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(reasonToCloseProperty)
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            setSpinner(false)
            if (data.status === 'ok') {
                alertSetter({
                    isAlertModal: true,
                    alertType: "success",
                    alertMessage: "Property has been closed successfully",
                    routeTo: '/property-dealer'
                })
                modalReset()
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            alertSetter({
                isAlertModal: true,
                alertType: "warning",
                alertMessage: "Some error occured. Try again later.",
                routeTo: null
            })
            modalReset()
        }
    }

    return (
        <Fragment>
  
            <div className="w-full h-screen fixed top-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg py-5 " onClick={modalReset}>

                <form className="relative max-h-full overflow-y-auto w-fit  h-fit mx-2 px-4 pt-8 pb-4 flex flex-col rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={(e) => e.stopPropagation()} onSubmit={closeProperty}>

                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={modalReset}>
                        <IoClose className="text-3xl" />
                    </button>

                    {/*property type*/}
                    <div className="flex flex-col gap-4 mt-3 mb-1.5">
                        <label className="text-lg font-semibold" htmlFor="state">Select a reason to close property</label>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2">
                                <input
                                    className="cursor-pointer"
                                    type="radio"
                                    id='sold-by-dealer'
                                    name="radioInput"
                                    onChange={() => setReasonToCloseProperty({
                                        propertySoldByDealer: true
                                    })}
                                />
                                <label htmlFor='sold-by-dealer'>Property has been sold by the dealer</label>
                            </div>
                            <div className="flex flex-row gap-2">
                                <input
                                    className="cursor-pointer"
                                    type="radio"
                                    id='closed-by-seller'
                                    name="radioInput"
                                    onChange={() => setReasonToCloseProperty({
                                        customerRemovesProperty: true
                                    })}
                                />
                                <label htmlFor='closed-by-seller'>Seller does not want to sell property</label>
                            </div>
                            <div className="flex flex-row gap-2">
                                <input
                                    className="cursor-pointer"
                                    type="radio"
                                    id='dealer-not-intereset'
                                    name="radioInput"
                                    onChange={() => setReasonToCloseProperty({
                                        dealerNotInterestedInSelling: true
                                    })}
                                />
                                <label htmlFor='dealer-not-intereset'>Dealer is no longer interested in selling property</label>
                            </div>
                            <div className="flex flex-row gap-2">
                                <input
                                    className="cursor-pointer"
                                    type="radio"
                                    id='other'
                                    name="radioInput"
                                    onChange={() => setReasonToCloseProperty({
                                        other: true
                                    })}
                                />
                                <label htmlFor='other'>Some other reason</label>
                            </div>
                        </div>

                    </div>

                    <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                        <button
                            type='submit'
                            className={`w-40 h-12 bg-red-500  text-white font-medium rounded  flex justify-center items-center gap-1  ${spinner || !reasonToCloseProperty ? 'cursor-auto' : 'hover:bg-red-600 cursor-pointer'}`}
                            disabled={spinner || !reasonToCloseProperty}
                        >
                            {spinner ? (
                                <div className=" absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                            ) : (
                                'Close property'
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </Fragment >
    )
}
export default AddPropertyModal