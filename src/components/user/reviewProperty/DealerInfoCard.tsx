import React, { Fragment, useState } from "react"
import { capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions";
import { Link } from "react-router-dom";
import SignInReminderModal from "../SignInReminderModal";
import ContactDealerModal from "../ContactDealerModal";

interface DealerAddressType {
    flatPlotHouseNumber: string,
    areaSectorVillage: string
    landmark?: string
    postalCode: number,
    city: string,
    state: string,
    district: string
}

interface PropsType {
    dealerInfo: {
        logoUrl: string,
        firmName: string,
        id: string,
        email: string,
        propertyDealerName: string,
        contactNumber: number,
        address: DealerAddressType,
        averageCustomerRatings: number,
        numberOfReviews: number
    },
    propertyId: string
}

//This component is used to show customer messages to property dealer
const DealerInfoCard: React.FC<PropsType> = ({ dealerInfo, propertyId }) => {
    const {
        logoUrl,
        firmName,
        contactNumber,
        address,
        averageCustomerRatings,
        numberOfReviews
    } = dealerInfo

    const authToken: string | null = localStorage.getItem("homestead-user-authToken")

    const [showSignInReminderModal, setShowSignInReminderModal] = useState<boolean>(false)

    const [showDealerInfoModal, setShowDealerInfoModal] = useState<boolean>(false)

    return (
        <Fragment>

            <div className="sticky top-24 h-fit w-96 border shadow rounded-xl hidden lg:flex flex-col mt-5">
                <div className="py-5 px-2 flex flex-row gap-3 border-b">
                    <img className="rounded-full w-16 h-16 border border-gray-300" src={logoUrl} alt='' />
                    <div className="flex flex-col gap-1">
                        <Link to={`/dealer-details?id=${dealerInfo.id}`} className=" font-semibold text-blue-600 hover:text-blue-800 text-wrap">{firmName}</Link>
                        <div className="flex flex-row gap-1">
                            {numberOfReviews > 0 && <>
                                <span className="text-2xl text-yellow-500 -mt-2">&#9733;</span>
                                <div className="flex flex-row text-sm">
                                    <p className="text-gray-700">{averageCustomerRatings}</p>
                                    <p className="text-gray-500 hover:text-gray-700 " >({numberOfReviews} reviews)</p>
                                </div>
                            </>}
                        </div>
                        <p className="text-gray-700 border border-gray-300 rounded-lg p-1 text-sm w-fit" >{contactNumber}</p>
                    </div>
                </div>
                <p className="text-gray-700 border-b py-4 px-3">
                    {capitalizeFirstLetterOfAString(address.flatPlotHouseNumber)}, {capitalizeFirstLetterOfAString(address.areaSectorVillage)}, {capitalizeFirstLetterOfAString(address.city)}, {address.landmark && `Near ${capitalizeFirstLetterOfAString(address.landmark)},`} {capitalizeFirstLetterOfAString(address.district)}, {capitalizeFirstLetterOfAString(address.state)}
                </p>
                <div className="flex justify-center p-5">
                    <button className="py-2 w-full flex flex-row gap-1 justify-center rounded-lg hover:border-gray-600 font-semibold text-white bg-red-600 hover:bg-red-800" onClick={() => {
                        if (authToken) {
                            setShowDealerInfoModal(true)
                        } else {
                            setShowSignInReminderModal(true)
                        }
                    }}>
                        Contact property dealer
                    </button>
                </div>
            </div>

            {showSignInReminderModal &&
                <SignInReminderModal hideModal={() => setShowSignInReminderModal(false)} />}

            {showDealerInfoModal &&
                <ContactDealerModal
                    dealerInfo={{
                        firmName: dealerInfo.firmName,
                        firmLogoUrl: dealerInfo.logoUrl,
                        propertyDealerName: dealerInfo.propertyDealerName,
                        address: dealerInfo.address,
                        email: dealerInfo.email,
                        contactNumber: dealerInfo.contactNumber,
                        _id: dealerInfo.id
                    }}
                    propertyId={propertyId}
                    modalReset={() => setShowDealerInfoModal(false)}
                />}

        </Fragment>
    )
}
export default DealerInfoCard