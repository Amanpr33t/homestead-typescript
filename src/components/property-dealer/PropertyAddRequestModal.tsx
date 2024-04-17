import { ChangeEvent, Fragment, useState } from "react"
import { StateType } from "../../dataTypes/stateType"
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions"
import { punjabDistricts } from "../../utils/tehsilsAndDistricts/districts"
import PunjabTehsilsDropdown from "../tehsilsDropdown/Punjab"
import { useNavigate } from "react-router-dom"

interface PropsType {
    hideModal: () => void,
    dealerId: string,
    alertSetter: (alertType: 'success' | 'warning', alertMessage: string) => void
}

//This component is the navigation bar
const PropertyAddRequestModal: React.FC<PropsType> = ({ hideModal, dealerId, alertSetter }) => {
    const navigate = useNavigate()
    const states: StateType[] = ['chandigarh', 'punjab']
    const [spinner, setSpinner] = useState<boolean>(false)
    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

    const [propertyType, setPropertyType] = useState<'agricultural' | 'residential' | 'commercial'>()
    const [propertyTypeError, setPropertyTypeError] = useState<boolean>(false)

    const [plotNumber, setPlotNumber] = useState<string>('')
    const [state, setState] = useState<string>('')
    const [stateError, setStateError] = useState<boolean>(false)
    const [district, setDistrict] = useState<string>('')
    const [districtError, setDistrictError] = useState<boolean>(false)
    const [city, setCity] = useState<string>('')
    const [tehsil, setTehsil] = useState<string>('')
    const [village, setVillage] = useState<string>('')

    const submitData = async () => {
        if (!state || !district || !propertyType) {
            if (!propertyType) {
                setPropertyTypeError(true)
            }
            if (!state) {
                setStateError(true)
            }
            if (!district) {
                setDistrictError(true)
            }
            return
        }
        try {
            setSpinner(true)
            const bodyData = {
                dealerId,
                propertyType,
                location: {
                    plotNumber,
                    state,
                    tehsil,
                    district,
                    village,
                    city
                }
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/assignFieldAgentForPropertyAddition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(bodyData)
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                hideModal()
                alertSetter('success', 'Our field agent will contact you shortly. Thank you.')
            } else if (data.status === 'not_found') {
                setSpinner(false)
                hideModal()
                alertSetter('warning', 'No filed agent currently available in your area. Please try again later')
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            hideModal()
            alertSetter('warning', 'Some error occured. Try again.')
            setSpinner(false)
            return
        }
    }

    return (
        <Fragment>

            <div className="top-0 pt-24 pb-10 fixed w-full flex justify-center h-screen z-20" onClick={hideModal}>
                {/*It shows different property types which can be selected by the user*/}

                <div className=" relative rounded border-2 shadow-2xl bg-white h-fit px-3 sm:px-5 py-7 w-11/12 sm:w-8/12 md:w-6/12 max-h-full overflow-y-auto" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>

                    <button type="button" className="absolute top-1 right-0.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={hideModal}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    <div className=" mb-5">
                        {propertyTypeError && <p className="text-red-500">Select an option</p>}

                        <div className="flex flex-col sm:flex-row sm:gap-5">
                            <p className="text-lg font-semibold">Select a property type</p>
                            <div className="flex flex-col pl-24 sm:pl-0 pt-1">
                                <div className="mb-1 flex flex-row">
                                    <input
                                        className="mr-1"
                                        type="radio"
                                        id="agricultural"
                                        name="property"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setPropertyTypeError(false)
                                                setPropertyType('agricultural')
                                            }
                                        }}
                                    />
                                    <label htmlFor="agricultural">Agricultural</label>
                                </div>

                                <div className="mb-1 flex flex-row">
                                    <input
                                        className="mr-1"
                                        type="radio"
                                        id="commercial"
                                        name="property"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setPropertyTypeError(false)
                                                setPropertyType('commercial')
                                            }
                                        }}
                                    />
                                    <label htmlFor="commercial">Commercial</label>
                                </div>

                                <div className="mb-1 flex flex-row">
                                    <input
                                        className="mr-1"
                                        type="radio"
                                        id="residential"
                                        name="property"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setPropertyTypeError(false)
                                                setPropertyType('residential')
                                            }
                                        }} />
                                    <label htmlFor="residential">Residential</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col mb-10">

                        <p className="text-lg font-semibold" >Property location</p>
                        <div className="flex flex-col place-self-center w-11/12 gap-2">

                            {/*plot number/street*/}
                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="plot">Plot number/street/locality</label>
                                <input
                                    type="text"
                                    id="plot"
                                    name="plot"
                                    className='border-2 border-gray-500  p-1 rounded'
                                    autoComplete="new-password"
                                    value={plotNumber}
                                    onChange={(e) => {
                                        setPlotNumber(e.target.value)
                                    }} />
                            </div>

                            {/*village */}
                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="village">Village</label>
                                <input
                                    type="text"
                                    id="village"
                                    name="village"
                                    className='border-2 border-gray-500  p-1 rounded'
                                    autoComplete="new-password"
                                    value={village}
                                    onChange={(e) => {
                                        setVillage(e.target.value)
                                    }} />
                            </div>

                            {/*city */}
                            <div className="flex flex-col w-full">
                                <label
                                    className="text-gray-500 font-semibold"
                                    htmlFor="city">
                                    City/Town
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className='border-2 border-gray-500 p-1 rounded'
                                    autoComplete="new-password"
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value)
                                    }} />
                            </div>

                            {/*state */}
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="text-gray-500 font-semibold" htmlFor="state">State</label>
                                </div>
                                <select
                                    className={`border-2 border-gray-500  p-1 rounded`}
                                    name="state"
                                    id="state"
                                    value={state}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setStateError(false)
                                        setState(e.target.value)
                                        setDistrict('')
                                        setTehsil('')
                                    }}>
                                    <option
                                        className="text-gray-500 font-semibold"
                                        value=""
                                        disabled>
                                        Select a state
                                    </option>
                                    {states.map(state => {
                                        return <option
                                            key={state}
                                            value={state}>
                                            {capitalizeFirstLetterOfAString(state)}
                                        </option>
                                    })}
                                </select>
                                {stateError && <p className="text-red-500">Select a state</p>}
                            </div>

                            {/*district */}
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="text-gray-500 font-semibold" htmlFor="district">District</label>
                                </div>
                                <select
                                    className={`border-2 border-gray-500  p-1 rounded`}
                                    name="district"
                                    id="district"
                                    disabled={state ? false : true}
                                    value={district}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setDistrictError(false)
                                        setDistrict(e.target.value)
                                        setTehsil('')
                                    }}>
                                    <option
                                        className="font-semibold"
                                        value=""
                                        disabled>
                                        Select a district
                                    </option>
                                    {state === 'punjab' &&
                                        punjabDistricts.map(district => {
                                            return <option
                                                key={district}
                                                value={district}>
                                                {capitalizeFirstLetterOfAString(district)}
                                            </option>
                                        })}
                                    {state === 'chandigarh' &&
                                        <option value="chandigarh">
                                            Chandigarh
                                        </option>}
                                </select>
                                {districtError && <p className="text-red-500">Select a state</p>}
                            </div>

                            <div className="flex flex-col w-full">
                                <label
                                    className="text-gray-500 font-semibold"
                                    htmlFor="state">
                                    Tehsil
                                </label>
                                <select
                                    className='border-2 border-gray-500 p-1 rounded'
                                    name="state"
                                    id="state"
                                    value={tehsil}
                                    disabled={state && district ? false : true}
                                    onChange={e => {
                                        setTehsil(e.target.value)
                                    }}
                                >
                                    <option
                                        className="font-semibold"
                                        value=""
                                        disabled>
                                        Select a tehsil
                                    </option>
                                    {state === 'punjab' && <PunjabTehsilsDropdown district={district} />}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-12 flex justify-center border-gray-400 ">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1 "
                            disabled={spinner}
                            onClick={submitData}
                        >
                            {spinner ? (
                                <div className="spinner absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                            ) : (
                                'Send request'
                            )}
                        </button>
                    </div>

                </div>


            </div>
        </Fragment >
    )
}
export default PropertyAddRequestModal