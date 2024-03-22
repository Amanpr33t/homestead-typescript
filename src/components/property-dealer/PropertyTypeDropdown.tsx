import { Fragment } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";

interface PropsType {
    propertyDropdownSetter: (input: boolean) => void,
    showPropertyTypeDropdown: boolean,
    propertyType?: 'agricultural' | 'residential' | 'commercial' | 'all',
    selectedPropertyTypeOptionDropdown: 'agricultural' | 'residential' | 'commercial' | 'all' | null,
    fetchProperties: (liveOrSold: 'live' | 'sold', skipProperties: boolean, propertyType?: 'agricultural' | 'residential' | 'commercial' | 'all') => Promise<any>,
    showPropertiesForSale: boolean,
    hideDropdown?: boolean
}

//This component is the home page for property dealer
const PropertyTypeDropdown: React.FC<PropsType> = ({
    propertyDropdownSetter,
    selectedPropertyTypeOptionDropdown,
    fetchProperties,
    showPropertyTypeDropdown,
    showPropertiesForSale,
    hideDropdown
}) => {

    return (
        <Fragment>

            <div className={`${hideDropdown && 'hidden'} z-10 absolute right-5 top-16  bg-white w-fit cursor-pointer text-gray-500  rounded-xl border border-gray-500 `} onClick={e => e.stopPropagation()}>
                <div className=" w-44 flex flex-row gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl p-3" onClick={() => {
                    propertyDropdownSetter(!showPropertyTypeDropdown)
                }}>
                    <p className="font-semibold">{selectedPropertyTypeOptionDropdown ? capitalizeFirstLetterOfAString(selectedPropertyTypeOptionDropdown) : 'Type of property'}</p>
                    {showPropertyTypeDropdown && <IoIosArrowUp className="absolute right-3 mt-1 text-gray-600 text-lg" />}
                    {!showPropertyTypeDropdown && <IoIosArrowDown className="absolute right-3 mt-1 text-gray-600 text-lg" />}
                </div>
                {showPropertyTypeDropdown &&
                    <div className={`w-44 bg-white rounded-b-xl border-t border-gray-500 `}>
                        <p className="p-2 hover:bg-gray-50" onClick={() => {
                            propertyDropdownSetter(false)
                            fetchProperties(showPropertiesForSale ? 'live' : 'sold', false, 'agricultural')
                        }}>Agricultural</p>
                        <p className="p-2 hover:bg-gray-50" onClick={() => {
                            propertyDropdownSetter(false)
                            fetchProperties(showPropertiesForSale ? 'live' : 'sold', false, 'residential')
                        }}>Residential</p>
                        <p className="p-2 hover:bg-gray-50" onClick={() => {
                            propertyDropdownSetter(false)
                            fetchProperties(showPropertiesForSale ? 'live' : 'sold', false, 'commercial')
                        }}>Commercial</p>
                        <p className="p-2 hover:bg-gray-50 rounded-b-xl" onClick={() => {
                            propertyDropdownSetter(false)
                            fetchProperties(showPropertiesForSale ? 'live' : 'sold', false, 'all')
                        }}>All</p>
                    </div>}
                <div></div>
            </div>

        </Fragment >
    )
}
export default PropertyTypeDropdown