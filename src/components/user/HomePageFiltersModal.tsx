
import { Fragment, useEffect, useState } from "react"
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";
import { IoCloseOutline } from "react-icons/io5";
import { MdCurrencyRupee } from "react-icons/md";
import { states } from "../../utils/states";
import { chooseDistrictsForState } from "../../utils/chooseDistrictsForState";

interface FiltersType {
    propertyType: 'agricultural' | 'residential' | 'commercial' | null,
    commercialPropertyType: 'shop' | 'industrial' | null,
    builtupOrEmpty: 'built-up' | 'empty' | null,
    builtUpPropertyType: 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic' | null,
    residentialPropertyType: 'house' | 'flat' | 'plot' | null,
    state: string | null,
    district: string | null,
    price: {
        min: number | null,
        max: number | null
    }
}

interface PropsType {
    modalReset: () => void,
    applyFilters: (filters: FiltersType, skip: number) => void,
    propertyTypeSetter: (input: 'agricultural' | 'commercial' | 'residential' | null) => void,
    commercialPropertyTypeSetter: (input: 'shop' | 'industrial' | null) => void,
    builtupOrEmptySetter: (input: 'built-up' | 'empty' | null) => void,
    builtUpPropertyTypeSetter: (input: 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic' | null) => void,
    residentialPropertyTypeSetter: (input: 'flat' | 'house' | 'plot' | null) => void,
    stateSetter: (input: string) => void,
    districtSetter: (input: string) => void,
    minPriceSetter: (input: number | '') => void,
    maxPriceSetter: (input: number | '') => void,
    propertyType: 'agricultural' | 'commercial' | 'residential' | null,
    commercialPropertyType: 'shop' | 'industrial' | null,
    builtupOrEmpty: 'built-up' | 'empty' | null,
    builtUpPropertyType: 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic' | null,
    residentialPropertyType: 'flat' | 'house' | 'plot' | null,
    state: string,
    district: string,
    minPrice: number | '',
    maxPrice: number | '',
    sortBySetter: (input: 'newToOld' | 'oldToNew' | 'highToLow' | 'lowToHigh' | '') => void,
    fetchDataForHomePage: () => void
}

//This component is the home page for property dealer
const HomePageFilterModal: React.FC<PropsType> = ({
    modalReset,
    applyFilters,
    propertyTypeSetter,
    commercialPropertyTypeSetter,
    builtupOrEmptySetter,
    builtUpPropertyTypeSetter,
    residentialPropertyTypeSetter,
    stateSetter,
    districtSetter,
    minPriceSetter,
    maxPriceSetter,
    propertyType,
    commercialPropertyType,
    builtUpPropertyType,
    builtupOrEmpty,
    residentialPropertyType,
    state,
    district,
    minPrice,
    maxPrice,
    sortBySetter,
    fetchDataForHomePage
}) => {
    const [propertyTypeNew, setPropertyTypeNew] = useState<'agricultural' | 'commercial' | 'residential' | null>(propertyType)
    const [commercialPropertyTypeNew, setCommercialPropertyTypeNew] = useState<'shop' | 'industrial' | null>(commercialPropertyType)
    const [builtupOrEmptyNew, setBuiltupOrEmptyNew] = useState<'built-up' | 'empty' | null>(builtupOrEmpty)
    const [builtUpPropertyTypeNew, setBuiltUpPropertyTypeNew] = useState<'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic' | null>(builtUpPropertyType)
    const [residentialPropertyTypeNew, setResidentialPropertyTypeNew] = useState<'flat' | 'house' | 'plot' | null>(residentialPropertyType)
    const [stateNew, setStateNew] = useState(state)
    const [districtNew, setDistrictNew] = useState(district)
    const [minPriceNew, setMinPriceNew] = useState<'' | number>(minPrice)
    const [maxPriceNew, setMaxPriceNew] = useState<'' | number>(maxPrice)

    const clearFilters = () => {
        setPropertyTypeNew(null)
        setCommercialPropertyTypeNew(null)
        setBuiltupOrEmptyNew(null)
        setBuiltUpPropertyTypeNew(null)
        setResidentialPropertyTypeNew(null)
        setMinPriceNew('')
        setMaxPriceNew('')
        setStateNew('')
        setDistrictNew('')
        sortBySetter('')
    }

    return (
        <Fragment>

            <div className="w-full h-screen fixed top-0 z-40 flex items-center justify-center bg-black bg-opacity-50 py-5" onClick={() => {
                clearFilters()
                modalReset()
            }}>
                <div className="relative rounded-xl w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 h-full bg-white flex flex-col " onClick={e => e.stopPropagation()}>
                    <IoCloseOutline className="absolute right-3 top-3 text-4xl text-gray-700 hover:bg-gray-100 rounded cursor-pointer" onClick={modalReset} />
                    <p className="flex justify-center items-center font-bold text-2xl h-16 border-b text-gray-800">Filters</p>

                    <div className="flex-1 overflow-y-auto px-3 sm:px-8 ">

                        <div className="flex flex-col gap-3  border-b py-5">
                            <p className="font-semibold text-lg text-gray-800 ">Location</p>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row items-center gap-6 pl-5">
                                    <p className=" text-gray-700">State</p>
                                    <select className="w-44 sm:w-fit border p-1.5 rounded-lg cursor-pointer"
                                        value={stateNew}
                                        onChange={(e) => {
                                            setStateNew(e.target.value)
                                            setDistrictNew('')
                                        }}>
                                        <option disabled value="">Select an option</option>
                                        {states.map(option => (
                                            <option className="" key={option} value={option}>
                                                {capitalizeFirstLetterOfAString(option)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-row  items-center gap-3 pl-5">
                                    <p className=" text-gray-700">District</p>
                                    <select
                                        className={`w-44 sm:w-fit border p-1.5 rounded-lg ${!chooseDistrictsForState(stateNew || "") ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        disabled={!stateNew || chooseDistrictsForState(stateNew || '') === null} onChange={(e) => {
                                            setDistrictNew(e.target.value)
                                        }}
                                        value={districtNew || ""}>
                                        <option disabled value="">Select an option</option>
                                        {stateNew && chooseDistrictsForState(stateNew)?.map(option => (
                                            <option key={option} value={option}>
                                                {capitalizeFirstLetterOfAString(option)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-3  border-b py-5">
                            <p className="font-semibold text-lg text-gray-800 ">Property type</p>
                            <select
                                className={`w-44 sm:w-fit border p-1.5 rounded-lg cursor-pointer`}
                                onChange={(e) => {
                                    setPropertyTypeNew(e.target.value as 'agricultural' | 'commercial' | 'residential')
                                    setCommercialPropertyTypeNew(null)
                                    setBuiltupOrEmptyNew(null)
                                    setBuiltUpPropertyTypeNew(null)
                                    setResidentialPropertyTypeNew(null)
                                }}
                                value={propertyTypeNew || ''}>
                                <option disabled value="">Select an option</option>
                                {['agricultural', 'commercial', 'residential'].map(option => (
                                    <option key={option} value={option}>
                                        {capitalizeFirstLetterOfAString(option)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`flex flex-row gap-3  border-b py-5 ${propertyTypeNew !== 'commercial' && 'hidden'}`}>
                            <p className="font-semibold text-lg text-gray-800 ">Commercial property type</p>
                            <select
                                className={`w-44 sm:w-fit border p-1.5 rounded-lg cursor-pointer`}
                                onChange={(e) => {
                                    setCommercialPropertyTypeNew(e.target.value as 'shop' | 'industrial')
                                    setBuiltUpPropertyTypeNew(null)
                                    setBuiltupOrEmptyNew(null)
                                }}
                                value={commercialPropertyTypeNew || ''}>
                                <option disabled value="">Select an option</option>
                                {['shop', 'industrial'].map(option => (
                                    <option key={option} value={option}>
                                        {capitalizeFirstLetterOfAString(option)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`flex flex-row gap-3  border-b py-5 ${propertyTypeNew === 'commercial' ? '' : 'hidden'}`}>
                            <p className="font-semibold text-lg text-gray-800 ">State of property</p>
                            <select
                                className={`w-44 sm:w-fit border p-1.5 rounded-lg cursor-pointer`}
                                onChange={(e) => {
                                    setBuiltupOrEmptyNew(e.target.value as 'built-up' | 'empty')
                                    setBuiltUpPropertyTypeNew(null)
                                }}
                                value={builtupOrEmptyNew || ''}>
                                <option disabled value="">Select an option</option>
                                {['built-up', 'empty'].map(option => (
                                    <option key={option} value={option}>
                                        {capitalizeFirstLetterOfAString(option)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`flex flex-row gap-3  border-b py-5 ${propertyTypeNew === 'commercial' && commercialPropertyTypeNew === 'industrial' && builtupOrEmptyNew === 'built-up' ? '' : 'hidden'}`}>
                            <p className="font-semibold text-lg text-gray-800 ">Built-up property type</p>
                            <select
                                className={`w-44 sm:w-fit border p-1.5 rounded-lg cursor-pointer`}
                                onChange={(e) => {
                                    setBuiltUpPropertyTypeNew(e.target.value as 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic')
                                }}
                                value={builtUpPropertyTypeNew || ''}>
                                <option disabled value="">Select an option</option>
                                {['hotel/resort', 'factory', 'banquet hall', 'cold store', 'warehouse', 'school', 'hospital/clinic'].map(option => (
                                    <option key={option} value={option}>
                                        {capitalizeFirstLetterOfAString(option)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`flex flex-row gap-3  border-b py-5 ${propertyTypeNew === 'residential' ? '' : 'hidden'}`}>
                            <p className="font-semibold text-lg text-gray-800 ">Residential property type</p>
                            <select
                                className={`w-44 sm:w-fit border p-1.5 rounded-lg cursor-pointer`}
                                onChange={(e) => {
                                    setResidentialPropertyTypeNew(e.target.value as 'plot' | 'house' | 'flat')
                                }}
                                value={residentialPropertyTypeNew || ''}>
                                <option disabled value="">Select an option</option>
                                {['plot', 'house', 'flat'].map(option => (
                                    <option key={option} value={option}>
                                        {capitalizeFirstLetterOfAString(option)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-3 py-5">
                            <p className="font-semibold text-lg text-gray-800 ">Price</p>
                            <div className="flex flex-col sm:flex-row gap-3 px-5">
                                <div className="flex flex-col">
                                    <p className="text-gray-700">Min</p>
                                    <div className="relative">
                                        <MdCurrencyRupee className="absolute left-2 top-3" />
                                        <input type='number' className="border border-gray-400 p-2 pl-7 rounded-lg text-gray-700"
                                            value={minPriceNew}
                                            onChange={e => {
                                                if (+e.target.value >= 0 && e.target.value !== '') {
                                                    setMinPriceNew(+e.target.value)
                                                } else {
                                                    setMinPriceNew('')
                                                }
                                            }} />
                                    </div>
                                </div>
                                <div className="flex flex-col" >
                                    <p>Max</p>
                                    <div className="relative">
                                        <MdCurrencyRupee className="absolute left-2 top-3" />
                                        <input
                                            type='number'
                                            className="border border-gray-400 p-2 pl-7 rounded-lg text-gray-700"
                                            value={maxPriceNew}
                                            onChange={e => {
                                                if (+e.target.value >= 0 && e.target.value !== '') {
                                                    setMaxPriceNew(+e.target.value)
                                                } else {
                                                    setMaxPriceNew('')
                                                }
                                            }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="h-16 border-t flex justify-between px-5 py-2">
                        <button className="text-white bg-black hover:bg-gray-800 p-3 rounded-lg font-semibold" onClick={clearFilters}>Clear filters</button>
                        <button className="text-white bg-red-600 hover:bg-red-800 p-3 rounded-lg font-semibold" onClick={() => {
                            if (!propertyTypeNew && !commercialPropertyTypeNew && !builtUpPropertyTypeNew && !builtupOrEmptyNew && !residentialPropertyTypeNew && !stateNew && !districtNew && !minPriceNew && !maxPriceNew) {
                                fetchDataForHomePage()
                                modalReset()
                                return
                            }
                            propertyTypeSetter(propertyTypeNew)
                            commercialPropertyTypeSetter(commercialPropertyTypeNew)
                            builtUpPropertyTypeSetter(builtUpPropertyTypeNew)
                            builtupOrEmptySetter(builtupOrEmptyNew)
                            residentialPropertyTypeSetter(residentialPropertyTypeNew)
                            stateSetter(stateNew)
                            districtSetter(districtNew)
                            minPriceSetter(minPriceNew)
                            maxPriceSetter(maxPriceNew)

                            applyFilters({
                                propertyType: propertyTypeNew,
                                commercialPropertyType: commercialPropertyTypeNew,
                                builtUpPropertyType: builtUpPropertyTypeNew,
                                builtupOrEmpty: builtupOrEmptyNew,
                                residentialPropertyType: residentialPropertyTypeNew,
                                state: stateNew || null,
                                district: districtNew || null,
                                price: {
                                    min: minPriceNew || null,
                                    max: maxPriceNew || null
                                }
                            }, 0)
                        }
                        }>Search</button>
                    </div>
                </div>
            </div>

        </Fragment >
    )
}
export default HomePageFilterModal