
import React, { Fragment, useState } from "react"
import { PropertyDataType as AgriculturalPropertyType } from "../../dataTypes/agriculturalPropertyTypes";
import { PropertyDataType as ResidentialPropertyType } from "../../dataTypes/residentialPropertyTypes";
import { PropertyDataType as CommercialPropertyType } from "../../dataTypes/commercialPropertyTypes";
import AgriculturalPropertyReview from "./reviewProperty/Agricultural";
import CommercialPropertyReview from "./reviewProperty/Commercial";
import ResidentialPropertyReview from "./reviewProperty/Residential";
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../utils/stringUtilityFunctions";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoMdArrowRoundDown } from "react-icons/io";

interface PropsType {
    selectedCustomerInformation: {
        name: string;
        email: string;
        contactNumber: number;
    },
    property: AgriculturalPropertyType | CommercialPropertyType | ResidentialPropertyType,
    propertyReset: () => void,
    selectedCustomerReset: () => void
}

//This component is used to show customer messages to property dealer
const CustomerInformationModal: React.FC<PropsType> = ({
    selectedCustomerInformation,
    property,
    propertyReset,
    selectedCustomerReset
}) => {
    const [indexOfImageToBeShown, setIndexOfImageToBeShown] = useState<number>(0)

    const [showPropertyDetails, setShowPropertyDetails] = useState<boolean>(false)

    return (
        <Fragment>
            <div className="z-50 px-2 sm:px-0 fixed left-0 top-0 h-screen w-screen flex justify-center pt-24 pb-5 bg-black bg-opacity-75 backdrop-blur-sm z-20" onClick={() => {
                propertyReset()
                selectedCustomerReset()
            }}>
                <div className="relative w-full sm:w-11/12 md:w-10/12 lg:w-9/12 h-fit max-h-full overflow-y-auto bg-white " onClick={e => e.stopPropagation()}>
                    <IoClose className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 cursor-pointer" onClick={() => {
                        propertyReset()
                        selectedCustomerReset()
                    }} />

                    <div className={`py-7 mx-2 sm:mx-10 ${showPropertyDetails && 'border-b shadow-b border-gray-300'} `}>
                        <p className="text-xl font-semibold text-gray-800 mb-5">Customer information</p>
                        <table className="w-full ">
                            <thead>
                                <tr>
                                    <th className="bg-red-500 w-24"></th>
                                    <th ></th>
                                </tr>
                            </thead>
                            <tbody >
                                <tr className="border-b shadow-b border-gray-200">
                                    <td className="py-3 text-gray-800">Name</td>
                                    <td className="py-3 text-gray-600">{capitaliseFirstAlphabetsOfAllWordsOfASentence(selectedCustomerInformation.name)}</td>
                                </tr>
                                <tr className="border-b shadow-b border-gray-200">
                                    <td className="py-3 text-gray-800">Phone</td>
                                    <td className="py-3 text-gray-600 ">{selectedCustomerInformation.contactNumber}</td>
                                </tr>
                                <tr className="">
                                    <td className="py-3 text-gray-800">Email</td>
                                    <td className="py-3 text-gray-600 ">{selectedCustomerInformation.email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {!showPropertyDetails && <div className="flex justify-center mb-7">
                        <button className="flex flex-row gap-2 border border-gray-400 hover:border-gray-500 rounded-lg py-2 px-5 bg-black hover:bg-gray-900 text-white " onClick={() => setShowPropertyDetails(true)}>
                            Property details<IoMdArrowRoundDown className="text-2xl" />
                        </button>
                    </div>}

                    {showPropertyDetails && <>
                        <div className="mx-2 sm:mx-10 py-8 border-b shadow-b border-gray-300 flex flex-col sm:flex-row gap-4 sm:gap-10 ">
                            <p className="text-xl font-semibold text-gray-800 -mt-2">Property images</p>
                            <div className="flex justify-center">
                                <div className={`relative w-fit `}>
                                    <img
                                        src={property.propertyImagesUrl ? property.propertyImagesUrl[indexOfImageToBeShown] : ''}
                                        alt=''
                                        className={`w-72 md:w-96 h-44 md:h-60 rounded-xl`}
                                    />

                                    {property.propertyImagesUrl && property.propertyImagesUrl.length > 1 && <button
                                        className={`text-center absolute top-1/2 left-1 sm:left-2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full font-extrabold `}
                                        disabled={indexOfImageToBeShown === 0}
                                        onClick={() => {
                                            setIndexOfImageToBeShown(index => index - 1)
                                        }}
                                    >
                                        <MdArrowBackIosNew />
                                    </button>}
                                    {property.propertyImagesUrl && property.propertyImagesUrl.length > 1 && <button
                                        className={`text-center absolute top-1/2 right-1 sm:right-2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full font-extrabold`}
                                        disabled={indexOfImageToBeShown === property.propertyImagesUrl.length - 1}
                                        onClick={() => {
                                            setIndexOfImageToBeShown(index => index + 1)
                                        }}
                                    >
                                        <MdArrowForwardIos />
                                    </button>}
                                </div>
                            </div>
                        </div>
                        <div className="mx-2 sm:mx-10 ">
                            {property.propertyType === 'agricultural' &&
                                <AgriculturalPropertyReview property={property as AgriculturalPropertyType} />
                            }
                            {property.propertyType === 'commercial' &&
                                <CommercialPropertyReview property={property as CommercialPropertyType} />
                            }
                            {property.propertyType === 'residential' &&
                                <ResidentialPropertyReview property={property as ResidentialPropertyType} />
                            }
                        </div>
                    </>}
                </div>
            </div>

        </Fragment>
    )
}
export default CustomerInformationModal