import React, { Fragment } from "react"
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

interface DealerAddressType {
    flatPlotHouseNumber: string,
    areaSectorVillage: string
    landmark?: string
    postalCode: number,
    city: string,
    state: string,
    district: string,
}

interface DealerInfoType {
    dealerInfo: {
        logoUrl: string,
        firmName: string,
        id: string,
        contactNumber: number,
        address: DealerAddressType,
        averageCustomerRatings: number,
        numberOfReviews: number
    }
}

//This component is used to show customer messages to property dealer
const DealerInfoCard: React.FC<DealerInfoType> = ({ dealerInfo }) => {
    const {
        logoUrl,
        firmName,
        contactNumber,
        address,
        averageCustomerRatings,
        numberOfReviews
    } = dealerInfo

    return (
        <Fragment>

            <div className="sticky top-20 h-fit w-96 border shadow rounded-xl hidden lg:flex flex-col mt-5">
                <div className="py-5 px-2 flex flex-row gap-3 border-b">
                    <img className="rounded-full w-16 h-16 border border-gray-300" src={logoUrl} alt='' />
                    <div className="flex flex-col gap-1">
                        <p className=" font-semibold text-blue-700 text-wrap">{firmName}</p>
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
                    {address.flatPlotHouseNumber}, {address.areaSectorVillage}, {address.city}, {address.landmark && `Near ${address.landmark},`} {address.district}, {address.state}
                </p>
                <div className="flex justify-center p-5">
                    <button className="py-2 w-full flex flex-row gap-1 justify-center rounded-lg border border-gray-400 hover:border-gray-600 font-semibold text-gray-700 hover:bg-gray-100">
                        <CiStar className="text-2xl" />
                        <FaStar className="text-xl mt-0.5 text-red-500" />
                        Save property
                    </button>
                </div>
            </div>

        </Fragment>
    )
}
export default DealerInfoCard