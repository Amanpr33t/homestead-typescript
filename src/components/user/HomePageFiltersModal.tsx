
import { Fragment, useEffect, useState } from "react"
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";
import { IoCloseOutline } from "react-icons/io5";
import { MdCurrencyRupee } from "react-icons/md";
import { states } from "../../utils/states";
import { chooseDistrictsForState } from "../../utils/chooseDistrictsForState";

interface FiltersType {
    propertyType: ('agricultural' | 'residential' | 'commercial')[],
    commercialPropertyType: ('shop' | 'industrial')[],
    builtupOrEmpty: ('built-up' | 'empty')[],
    builtUpPropertyType: ('hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic')[],
    residentialPropertyType: ('house' | 'flat' | 'plot')[],
    state: string | null,
    district: string | null,
    price: {
        min: number | null,
        max: number | null
    }
}

interface PropsType {
    modalReset: () => void,
    applyFilters: (filters: FiltersType) => void,
    propertyTypeSetter: (input: ('agricultural' | 'commercial' | 'residential')[]) => void,
    commercialPropertyTypeSetter: (input: ('shop' | 'industrial')[]) => void,
    builtupOrEmptySetter: (input: ('built-up' | 'empty')[]) => void,
    builtUpPropertyTypeSetter: (input: ('hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic')[]) => void,
    residentialPropertyTypeSetter: (input: ('flat' | 'house' | 'plot')[]) => void,
    stateSetter: (input: string) => void,
    districtSetter: (input: string) => void,
    minPriceSetter: (input: number | '') => void,
    maxPriceSetter: (input: number | '') => void,
    propertyType: ('agricultural' | 'commercial' | 'residential')[],
    commercialPropertyType: ('shop' | 'industrial')[],
    builtupOrEmpty: ('built-up' | 'empty')[],
    builtUpPropertyType: ('hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic')[],
    residentialPropertyType: ('flat' | 'house' | 'plot')[],
    state: string,
    district: string,
    minPrice: number | '',
    maxPrice: number | ''
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
    maxPrice
}) => {

    const clearFilters = () => {
        propertyTypeSetter([])
        commercialPropertyTypeSetter([])
        builtupOrEmptySetter([])
        builtUpPropertyTypeSetter([])
        residentialPropertyTypeSetter([])
        minPriceSetter('')
        maxPriceSetter('')
        stateSetter('')
        districtSetter('')
    }

    const removeItemFromArray = (array: string[], input: string): string[] => {
        const index = array.findIndex(item => item === input);
        if (index !== -1) {
            const newArray = [...array]; // Create a copy of the array
            newArray.splice(index, 1); // Remove the element
            return newArray; // Return the updated array
        }
        return array
    }


    return (
        <Fragment>

            <div className="w-full h-screen fixed top-0 z-40 flex items-center justify-center bg-black bg-opacity-50 py-5" onClick={modalReset}>
                <div className="relative rounded-xl w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 h-full bg-white flex flex-col " onClick={e => e.stopPropagation()}>
                    <IoCloseOutline className="absolute right-3 top-3 text-4xl text-gray-700 hover:bg-gray-100 rounded cursor-pointer" onClick={modalReset} />
                    <p className="flex justify-center items-center font-bold text-2xl h-16 border-b text-gray-800">Filters</p>

                    <div className="flex-1 overflow-y-auto px-3 sm:px-8 ">

                        <div className="flex flex-col gap-3  border-b py-5">
                            <p className="font-semibold text-lg text-gray-800 ">Location</p>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row items-center gap-6 pl-5">
                                    <p className=" text-gray-700">State</p>
                                    <select className="w-44 sm:w-fit border p-1.5 rounded-lg cursor-pointer" value={state} onChange={(e) => {
                                        stateSetter(e.target.value)
                                        districtSetter('')
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
                                    <select className={`w-44 sm:w-fit border p-1.5 rounded-lg ${!chooseDistrictsForState(state || "") ? 'cursor-not-allowed' : 'cursor-pointer'}`} disabled={!state || chooseDistrictsForState(state || '') === null} onChange={(e) => {
                                        districtSetter(e.target.value)
                                    }} value={district || ""}>
                                        <option disabled value="">Select an option</option>
                                        {state && chooseDistrictsForState(state)?.map(option => (
                                            <option key={option} value={option}>
                                                {capitalizeFirstLetterOfAString(option)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3  border-b py-5">
                            <p className="font-semibold text-lg text-gray-800 ">Property type</p>
                            <div className="flex flex-col gap-3 pl-5">

                                <div className="flex flex-row gap-3 items-center">
                                    <input
                                        type='checkbox'
                                        id="agricultural"
                                        className="form-checkbox h-4 w-4"
                                        checked={propertyType.includes('agricultural')}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                propertyTypeSetter([...propertyType, 'agricultural'])
                                            } else {
                                                let updatedArray = removeItemFromArray(propertyType, 'agricultural') as ('agricultural' | 'commercial' | 'residential')[]
                                                propertyTypeSetter(updatedArray)
                                            }
                                        }} />
                                    <label className=" text-gray-700" htmlFor="agricultural">Agricultural</label>
                                </div>

                                <div className=" flex flex-col gap-1">
                                    <div className="flex flex-row gap-3 items-center">
                                        <input
                                            type='checkbox'
                                            id="commercial"
                                            className="form-checkbox h-4 w-4"
                                            checked={propertyType.includes('commercial')}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    propertyTypeSetter([...propertyType, 'commercial'])
                                                } else {
                                                    let updatedArray = removeItemFromArray(propertyType, 'commercial') as ('agricultural' | 'commercial' | 'residential')[]
                                                    propertyTypeSetter(updatedArray)
                                                    commercialPropertyTypeSetter([])
                                                    builtupOrEmptySetter([])
                                                    builtUpPropertyTypeSetter([])
                                                }
                                            }} />
                                        <label className=" text-gray-700" htmlFor="commercial">Commercial</label>
                                    </div>
                                    {propertyType.includes('commercial') &&
                                        <div className="flex flex-col gap-1 ml-10">
                                            {['shop', 'industrial'].map(type => {
                                                return <div key={Math.random()} className="flex flex-row gap-3 items-center">
                                                    <input
                                                        type='checkbox'
                                                        id={type}
                                                        className="form-checkbox h-4 w-4"
                                                        checked={commercialPropertyType.includes(type as 'shop' | 'industrial')}
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                commercialPropertyTypeSetter([...commercialPropertyType, type as 'shop' | 'industrial'])
                                                            } else {
                                                                let updatedArray = removeItemFromArray(commercialPropertyType, type) as ('shop' | 'industrial')[]
                                                                commercialPropertyTypeSetter(updatedArray)
                                                            }
                                                        }} />
                                                    <label className=" text-gray-500" htmlFor={type}>{type === 'shop' ? 'Shop/Showroom/Booth' : 'Industrial'}</label>
                                                </div>
                                            })}
                                        </div>}
                                </div>

                                <div className="relative flex flex-col gap-1">
                                    <div className="flex flex-row items-center gap-3">
                                        <input
                                            type='checkbox'
                                            id='residential'
                                            className="form-checkbox h-4 w-4"
                                            checked={propertyType.includes('residential')}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    propertyTypeSetter([...propertyType, 'residential'])
                                                } else {
                                                    let updatedArray = removeItemFromArray(propertyType, 'residential') as ("residential" | "commercial" | 'agricultural')[]
                                                    propertyTypeSetter(updatedArray)
                                                    residentialPropertyTypeSetter([])
                                                }
                                            }} />
                                        <label className=" text-gray-700" htmlFor="residential">Residential</label>
                                    </div>
                                    {propertyType.includes('residential') &&
                                        <div className="flex flex-col gap-1 ml-10">
                                            {['flat', 'house', 'plot'].map(type => {
                                                return <div key={Math.random()} className="flex flex-row items-center gap-3">
                                                    <input
                                                        type='checkbox'
                                                        id={type}
                                                        className="form-checkbox h-4 w-4"
                                                        checked={residentialPropertyType.includes(type as 'flat' | 'plot' | 'house')}
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                residentialPropertyTypeSetter([...residentialPropertyType, type as 'flat' | 'plot' | 'house'])
                                                            } else {
                                                                let updatedArray = removeItemFromArray(residentialPropertyType, type) as ('flat' | 'plot' | 'house')[]
                                                                residentialPropertyTypeSetter(updatedArray)
                                                            }
                                                        }} />
                                                    <label className=" text-gray-500" htmlFor={type}>{capitalizeFirstLetterOfAString(type)}</label>
                                                </div>
                                            })}
                                        </div>}
                                </div>
                            </div>
                        </div>

                        {propertyType.includes('commercial') &&
                            <div className="flex flex-col gap-3  border-b py-5">
                                <p className="font-semibold text-lg text-gray-800 ">State of property</p>
                                <div className="flex flex-col gap-3 pl-5">

                                    <div className=" flex flex-col gap-1">
                                        <div className="flex flex-row gap-3 items-center">
                                            <input
                                                type='checkbox'
                                                id='built-up'
                                                className="form-checkbox h-4 w-4"
                                                checked={builtupOrEmpty.includes('built-up')}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        builtupOrEmptySetter([...builtupOrEmpty, 'built-up'])
                                                    } else {
                                                        let updatedArray = removeItemFromArray(builtupOrEmpty, 'built-up') as ('empty' | 'built-up')[]
                                                        builtupOrEmptySetter(updatedArray)
                                                    }
                                                }} />
                                            <label className=" text-gray-700" htmlFor="built-up">Built-up</label>
                                        </div>
                                        {commercialPropertyType.includes('industrial') && builtupOrEmpty.includes('built-up') &&
                                            <div className="flex flex-col gap-1 ml-10">
                                                {['hotel/resort', 'factory', 'banquet hall', 'cold store', 'warehouse', 'school', 'hospital/clinic'].map(type => {
                                                    return <div key={Math.random()} className="flex flex-row gap-3 items-center">
                                                        <input
                                                            type='checkbox'
                                                            className="form-checkbox h-4 w-4"
                                                            id={type}
                                                            checked={builtUpPropertyType.includes(type as "hotel/resort" | "factory" | "banquet hall" | "cold store" | "warehouse" | "school" | "hospital/clinic")}
                                                            onChange={e => {
                                                                if (e.target.checked) {
                                                                    builtUpPropertyTypeSetter([...builtUpPropertyType, type as 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic'])
                                                                } else {
                                                                    let updatedArray = removeItemFromArray(builtUpPropertyType, type) as ('hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic')[]
                                                                    builtUpPropertyTypeSetter(updatedArray)
                                                                }
                                                            }} />
                                                        <label className=" text-gray-500" htmlFor={type}>{capitalizeFirstLetterOfAString(type)}</label>
                                                    </div>
                                                })}
                                            </div>}
                                    </div>

                                    <div className="flex flex-row gap-3 items-center">
                                        <input
                                            type='checkbox'
                                            className="form-checkbox h-4 w-4"
                                            id='empty'
                                            checked={builtupOrEmpty.includes('empty')}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    builtupOrEmptySetter([...builtupOrEmpty, 'empty'])
                                                } else {
                                                    let updatedArray = removeItemFromArray(builtupOrEmpty, 'empty') as ('built-up' | 'empty')[]
                                                    builtupOrEmptySetter(updatedArray)
                                                }
                                            }} />
                                        <label className=" text-gray-700" htmlFor="empty">Empty</label>
                                    </div>

                                </div>
                            </div>}

                        <div className="flex flex-col gap-3 py-5">
                            <p className="font-semibold text-lg text-gray-800 ">Price</p>
                            <div className="flex flex-col sm:flex-row gap-3 px-5">
                                <div className="flex flex-col">
                                    <p className="text-gray-700">Min</p>
                                    <div className="relative">
                                        <MdCurrencyRupee className="absolute left-2 top-3" />
                                        <input type='number' className="border border-gray-400 p-2 pl-7 rounded-lg text-gray-700" value={minPrice} onChange={e => {
                                            if (+e.target.value >= 0 && e.target.value !== '') {
                                                minPriceSetter(+e.target.value)
                                            } else {
                                                minPriceSetter('')
                                            }
                                        }} />
                                    </div>
                                </div>
                                <div className="flex flex-col" >
                                    <p>Max</p>
                                    <div className="relative">
                                        <MdCurrencyRupee className="absolute left-2 top-3" />
                                        <input type='number' className="border border-gray-400 p-2 pl-7 rounded-lg text-gray-700" value={maxPrice} onChange={e => {
                                            if (+e.target.value >= 0 && e.target.value !== '') {
                                                maxPriceSetter(+e.target.value)
                                            } else {
                                                maxPriceSetter('')
                                            }
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="h-16 border-t flex justify-between px-5 py-2">
                        <button className="text-white bg-black hover:bg-gray-800 p-3 rounded-lg font-semibold" onClick={clearFilters}>Clear filters</button>
                        <button className="text-white bg-red-600 hover:bg-red-800 p-3 rounded-lg font-semibold" onClick={() => applyFilters({
                            propertyType,
                            commercialPropertyType,
                            builtUpPropertyType,
                            builtupOrEmpty,
                            residentialPropertyType,
                            state: state || null,
                            district: district || null,
                            price: {
                                min: minPrice || null,
                                max: maxPrice || null
                            }
                        })}>Search</button>
                    </div>
                </div>
            </div>

        </Fragment >
    )
}
export default HomePageFilterModal