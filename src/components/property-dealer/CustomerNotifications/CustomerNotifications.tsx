import React, { Fragment, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CustomerRequestsActions } from "../../../store/slices/customerRequests";
import { PropertyDataType as AgriculturalPropertyType } from "../../../dataTypes/agriculturalPropertyTypes";
import { PropertyDataType as ResidentialPropertyType } from "../../../dataTypes/residentialPropertyTypes";
import { PropertyDataType as CommercialPropertyType } from "../../../dataTypes/commercialPropertyTypes";
import CustomerInformationModal from "./CustomerInformationModal";
import CustomerNotificationsContainer from "./CustomerNotificationsContainer";
import { IoMdArrowRoundBack } from "react-icons/io";

interface PropsType {
    propertySetter?: (property: AgriculturalPropertyType | ResidentialPropertyType | CommercialPropertyType) => void,
    selectedCustomerSetter?: (customer: {
        name: string,
        email: string,
        contactNumber: number
    }) => void,
    selectedCustomerInformation?: {
        name: string,
        email: string,
        contactNumber: number
    } | null,
    propertyOfSelectedCustomer?: AgriculturalPropertyType | CommercialPropertyType | ResidentialPropertyType | null,
    propertyReset?: () => void,
    selectedCustomerReset?: () => void
}

//This component is used to show customer messages to property dealer
const CustomerNotifications: React.FC<PropsType> = ({
    propertySetter,
    selectedCustomerSetter,
    selectedCustomerInformation,
    propertyOfSelectedCustomer,
    propertyReset,
    selectedCustomerReset
}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();

    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

    const [property, setProperty] = useState<AgriculturalPropertyType | CommercialPropertyType | ResidentialPropertyType | null>(null)

    const [selectedCustomer, setSelectedCustomer] = useState<{
        name: string,
        email: string,
        contactNumber: number
    } | null>(null)

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [showAllMessages, setShowAllMessages] = useState(true)//if true all messages will be shown and if false only unread messages will be shown

    //When an unread query has been seen, its status will be updated to seen using this function
    const updateSeenStatusOfSelectedCustomer = async (customerId: string, propertyId: string, requestSeen: boolean) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/updateSeenStatusOfCustomerRequest?customerId=${customerId}&propertyId=${propertyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    requestSeen
                })
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            console.log(data)
            if (data.status === 'ok') {
                if (data.customerRequests) {
                    dispatch(CustomerRequestsActions.setCustomerRequests(data.customerRequests))
                }
                if (propertySetter && selectedCustomerSetter) {
                    propertySetter(data.property)
                    selectedCustomerSetter(data.customerInformation)
                } else {
                    setProperty(data.property)
                    setSelectedCustomer(data.customerInformation)
                }
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            //error
        }
    }

    return (
        <Fragment>

            {location.pathname.includes('customer-notifications') && <div className='cursor-pointer pl-1.5 sm:px-5 md:px-10 lg:px-20 pt-20 mt-2 flex flex-row text-gray-600 hover:text-gray-800 w-fit' onClick={() => navigate('/property-dealer')}>
                <IoMdArrowRoundBack className='mt-1 mr-1' />
                Home
            </div>}

            <div className={`w-full ${location.pathname.includes('customer-notifications') ? 'h-full flex justify-center' : 'h-fit'}`}>
                <CustomerNotificationsContainer
                    showAllMessages={showAllMessages}
                    showMessagesSetter={(input: boolean) => setShowAllMessages(input)}
                    updateSeenStatusOfSelectedCustomer={updateSeenStatusOfSelectedCustomer}
                />
            </div>

            {selectedCustomerInformation && propertyOfSelectedCustomer && propertyReset && selectedCustomerReset &&
                <CustomerInformationModal
                    selectedCustomerInformation={selectedCustomerInformation}
                    property={propertyOfSelectedCustomer}
                    propertyReset={propertyReset}
                    selectedCustomerReset={selectedCustomerReset}
                />}

            {selectedCustomer && property &&
                <CustomerInformationModal
                    selectedCustomerInformation={selectedCustomer}
                    property={property}
                    propertyReset={() => setProperty(null)}
                    selectedCustomerReset={() => setSelectedCustomer(null)}
                />}
        </Fragment>
    )
}
export default CustomerNotifications