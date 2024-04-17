import React, { Fragment, useState } from "react"
import { IoArrowUndo, IoClose } from "react-icons/io5";
import { formatDate, getDaysDifference } from "../../../utils/dateFunctions";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerRequestsActions } from "../../../store/slices/customerRequests";

interface PropsType {
    propertyId: string,
    customerId: string,
    customerName: string,
    date: string,
    requestSeen: boolean,
    updateSeenStatusOfSelectedCustomer: (customerId: string, propertyId: string, requestSeen: boolean) => void
}

//This component is used to show customer messages to property dealer
const SingleCustomerNotification: React.FC<PropsType> = ({
    propertyId,
    customerId,
    customerName,
    date,
    requestSeen,
    updateSeenStatusOfSelectedCustomer
}) => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const [spinner, setSpinner] = useState<boolean>(false)

    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

    const deleteRequest = async (customerId: string, propertyId: string) => {
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/deleteCustomerRequest?customerId=${customerId}&propertyId=${propertyId}`, {
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
            setSpinner(false)
            if (data.status === 'ok') {
                dispatch(CustomerRequestsActions.setCustomerRequests(data.customerRequests))
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            //error
        }
    }

    const dayDiffernceColorSetter = (days: number): string => {
        if (days < 1) {
            return 'text-green-500'
        } else if (days < 2) {
            return 'text-orange-500'
        } else {
            return 'text-red-500'
        }
    }

    return (
        <Fragment>
            <div key={Math.random()} className={`relative bg-white px-5 py-4  cursor-pointer  ${location.pathname.includes('customer-notifications') ? 'border-b shadow' : 'rounded-md border-b-2  border-l-4 hover:border-l-blue-500 '}`} onClick={(e) => {
                e.stopPropagation()
                updateSeenStatusOfSelectedCustomer(customerId, propertyId, requestSeen)
            }}>
                {spinner && <div className="absolute top-0.5 right-1 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>}
                {!spinner && <IoClose className="absolute top-0.5 right-1 text-xl bg-red-600 text-white  hover:bg-red-400 rounded" onClick={(e) => {
                    e.stopPropagation()
                    deleteRequest(customerId, propertyId)
                }} />}
                <div className="flex flex-row place-content-between gap-4">
                    <p className="font-semibold text-gray-700">{customerName.trim().split(/\s+/)[0]}</p>
                    <p className="text-gray-600 pt-0.5">{formatDate(date)}</p>
                </div>
                <div className="flex flex-row gap-1 mt-2">
                    <IoArrowUndo className="text-red-500" />
                    <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(date))}`}>
                        Received {getDaysDifference(date) > 0 ? `${getDaysDifference(date)} days ago` : 'today'}. Reply?
                    </p>
                </div>
            </div>

        </Fragment>
    )
}
export default SingleCustomerNotification