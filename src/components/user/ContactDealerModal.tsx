
import React, { Fragment } from "react"
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../utils/stringUtilityFunctions";
import { IoClose } from "react-icons/io5";
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";
import { Link } from "react-router-dom";

interface PropsType {
    dealerInfo: {
        firmName: string;
        firmLogoUrl: string,
        propertyDealerName: string,
        address: {
            flatPlotHouseNumber: string,
            areaSectorVillage: string,
            landmark?: string,
            city: string,
            state: string,
            district: string
        }
        email: string;
        contactNumber: number;
        _id: string
    },
    propertyId?: string,
    modalReset: () => void
}

//This component is used to show customer messages to property dealer
const ContactDealerModal: React.FC<PropsType> = ({
    dealerInfo, propertyId, modalReset
}) => {
    const { firmName, propertyDealerName, address, email, contactNumber, _id } = dealerInfo
    const { flatPlotHouseNumber, areaSectorVillage, landmark, city, state, district } = address

    return (
        <Fragment>
            <div className="z-50 fixed left-0 top-0 px-2 py-5  sm:px-0  h-screen w-screen flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm" onClick={() => {
                modalReset()
            }}>
                <div className="relative w-full sm:w-11/12 md:w-10/12 lg:w-8/12 h-fit max-h-full overflow-y-auto bg-white " onClick={e => e.stopPropagation()}>
                    <IoClose className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 cursor-pointer" onClick={() => {
                        modalReset()
                    }} />

                    <div className={`py-7 mx-2 sm:mx-10 `}>
                        <p className="text-xl font-semibold text-gray-800 mb-5">Dealer information</p>
                        <table className="w-full ">
                            <thead>
                                <tr>
                                    <th className="bg-red-500 w-28 sm:w-40 md:w-52"></th>
                                    <th ></th>
                                </tr>
                            </thead>
                            <tbody >
                                <tr className="border-b shadow-b border-gray-200">
                                    <td className="py-3 text-gray-800">Firm name</td>
                                    <td className="py-3 ">
                                        <Link to={`/dealer-details?id=${_id}`} className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer w-fit">{capitaliseFirstAlphabetsOfAllWordsOfASentence(firmName)}</Link>
                                    </td>
                                </tr>
                                <tr className="border-b shadow-b border-gray-200">
                                    <td className="py-3 text-gray-800">Dealer name</td>
                                    <td className="py-3 text-gray-600 ">{propertyDealerName}</td>
                                </tr>
                                <tr className="border-b shadow-b border-gray-200">
                                    <td className="py-3 text-gray-800">Email</td>
                                    <td className="py-3 text-gray-600 ">{email}</td>
                                </tr>
                                <tr className="border-b shadow-b border-gray-200">
                                    <td className="py-3 text-gray-800">Contact number</td>
                                    <td className="py-3 text-gray-600 ">{contactNumber}</td>
                                </tr>
                                <tr className="">
                                    <td className="py-3 text-gray-800">Address</td>
                                    <td className="py-3 text-gray-600 ">{capitalizeFirstLetterOfAString(flatPlotHouseNumber)}, {capitalizeFirstLetterOfAString(areaSectorVillage)}, {landmark && `${capitalizeFirstLetterOfAString(landmark)}, `} {capitalizeFirstLetterOfAString(city)}, {capitalizeFirstLetterOfAString(state)}, {capitalizeFirstLetterOfAString(district)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {propertyId && <div className="flex justify-center pb-7">
                        <button className="flex flex-row gap-2 border border-gray-400 hover:border-gray-500 rounded-lg py-2 px-5 bg-red-700 hover:bg-red-900 text-white font-semibold" >
                            Ask property dealer to contact you
                        </button>
                    </div>}
                </div>
            </div>

        </Fragment>
    )
}
export default ContactDealerModal