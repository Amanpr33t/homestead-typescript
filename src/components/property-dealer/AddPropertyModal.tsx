
import { ChangeEvent, Fragment, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AlertType } from "../../dataTypes/alertType";
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";
import { punjabDistricts } from "../../utils/tehsilsAndDistricts/districts";
import { IoClose } from "react-icons/io5";
import PunjabTehsilsDropdown from "../tehsilsDropdown/Punjab";

interface PropsType {
    dealerId: string,
    modalReset: () => void,
    alertSetter: (alert: AlertType) => void
}

//This component is the home page for property dealer
const AddPropertyModal: React.FC<PropsType> = ({ dealerId, modalReset, alertSetter }) => {
    const navigate = useNavigate()

    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")
    const [spinner, setSpinner] = useState<boolean>(false)

    const states: string[] = ['chandigarh', 'punjab']

    const [propertyType, setPropertyType] = useState<'agricultural' | 'residential' | 'commercial' | ''>('')
    const [plotNumber, setPlotNumber] = useState<string>('')
    const [village, setVillage] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [tehsil, setTehsil] = useState<string>('')
    const [district, setDistrict] = useState<string>('')
    const [districtError, setDistrictError] = useState<boolean>(false)
    const [stateError, setStateError] = useState<boolean>(false)
    const [state, setState] = useState<string>('')

    const assignFieldAgentToAddProperty = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!propertyType || !district || !state) {
            if (!district) {
                setDistrictError(true)
            }
            if (!state) {
                setStateError(true)
            }
            return
        }
        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/assignFieldAgentForPropertyAddition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    dealerId,
                    location: {
                        plotNumber: plotNumber || null,
                        village: village || null,
                        city: city || null,
                        tehsil: tehsil || null,
                        district,
                        state
                    },
                    propertyType
                })
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            setSpinner(false)
            console.log(data)
            if (data.status === 'ok') {
                alertSetter({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'Our field agent will contact you shortly and add the property',
                    routeTo: null
                })
                modalReset()
            } else if (data.status === 'not_found') {
                alertSetter({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'No field agent is available in your area. Try again later',
                    routeTo: null
                })
                modalReset()
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            alertSetter({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured. Try again later.',
                routeTo: null
            })
            modalReset()
        }
    }

    return (
        <Fragment>

            <div className="w-full h-screen fixed top-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg py-5 " onClick={modalReset}>

                <form className="relative max-h-full overflow-y-auto w-11/12 sm:w-9/12 md:w-8/12 lg:w-7/12  h-fit px-4 pt-8 pb-4 flex flex-col rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={(e) => e.stopPropagation()} onSubmit={assignFieldAgentToAddProperty}>

                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={modalReset}>
                        <IoClose className="text-3xl" />
                    </button>

                    {/*property type*/}
                    <div className="flex flex-row gap-4 mt-3 mb-1.5">
                        <label className="text-lg font-semibold" htmlFor="state">Property type</label>
                        <div className="flex flex-col gap-1.5 mt-1">
                            <div className="flex flex-row gap-1">
                                <input
                                    id="agri-radio"
                                    name='radio'
                                    type="radio"
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setPropertyType('agricultural')
                                        }
                                    }}
                                />
                                <label htmlFor="agri-radio">Agricultural</label>
                            </div>
                            <div className="flex flex-row gap-1">
                                <input
                                    id='comm-radio'
                                    name='radio'
                                    type="radio"
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setPropertyType('commercial')
                                        }
                                    }}
                                />
                                <label htmlFor="comm-radio">Commercial</label>
                            </div>
                            <div className="flex flex-row gap-1">
                                <input
                                    id='resi-radio'
                                    name='radio'
                                    type="radio"
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setPropertyType('residential')
                                        }
                                    }}
                                />
                                <label htmlFor="resi-radio">Residential</label>
                            </div>
                        </div>
                    </div>

                    {/*address */}
                    <div className="flex flex-col mt-3 mb-1.5">
                        <p className="text-lg font-semibold">Location</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-2 px-6">

                            {/*plot number*/}
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700" htmlFor="plot-number">Plot number</label>
                                <input
                                    type="text"
                                    id="plot-number"
                                    className={`border border-gray-400 p-1 rounded`}
                                    autoComplete="new-password"
                                    value={plotNumber}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setPlotNumber(e.target.value)
                                    }} />
                            </div>

                            {/*city*/}
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700" htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    className={`border border-gray-400 p-1 rounded`}
                                    autoComplete="new-password"
                                    value={city}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setCity(e.target.value)
                                    }} />
                            </div>

                            {/*village*/}
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700" htmlFor="village">Village</label>
                                <input
                                    type="text"
                                    id="village"
                                    className={`border border-gray-400 p-1 rounded`}
                                    autoComplete="new-password"
                                    value={village}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setVillage(e.target.value)
                                    }} />
                            </div>

                            {/*state */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="font-semibold text-gray-700" htmlFor="state">State</label>
                                </div>
                                <select
                                    className={`border ${stateError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    name="state"
                                    id="state"
                                    value={state}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setState(e.target.value)
                                        setStateError(false)
                                        setDistrict('')
                                        setDistrictError(false)
                                    }}>
                                    <option className="font-semibold" value="" disabled>Select a state</option>
                                    {states.map(state => {
                                        return <option key={state} value={state}>
                                            {capitalizeFirstLetterOfAString(state)}
                                        </option>
                                    })}
                                </select>
                            </div>

                            {/*district */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" font-semibold text-gray-700" htmlFor="district">District</label>
                                </div>
                                <select
                                    className={`border ${districtError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    name="district"
                                    id="district"
                                    value={district}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setDistrict(e.target.value)
                                        setDistrictError(false)
                                    }}>
                                    <option className="font-semibold" value="" disabled>Select a district</option>
                                    {state.toLowerCase() === 'chandigarh' && <option value="chandigarh">Chandigarh</option>}
                                    {state.toLowerCase() === 'punjab' &&
                                        punjabDistricts.map(district => {
                                            return <option key={district} value={district}>
                                                {capitalizeFirstLetterOfAString(district)}
                                            </option>
                                        })}
                                </select>
                            </div>

                            {/*tehsil */}
                            <div className="flex flex-col w-full">
                                <label
                                    className="font-semibold text-gray-700"
                                    htmlFor="tehsil">
                                    Tehsil
                                </label>
                                <select
                                    className='border border-gray-500 p-1 rounded'
                                    name="tehsil"
                                    id="tehsil"
                                    disabled={state && district ? false : true}
                                    value={tehsil}
                                    onChange={e => {
                                        setTehsil(e.target.value)
                                    }}>
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

                    <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                        <button
                            type='submit'
                            className={`w-40 h-12 bg-red-500  text-white font-medium rounded  flex justify-center items-center gap-1  ${spinner ? 'cursor-auto' : 'hover:bg-red-600 cursor-pointer'}`}
                            disabled={spinner}
                        >
                            {spinner ? (
                                <div className=" absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                            ) : (
                                'Add property'
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </Fragment >
    )
}
export default AddPropertyModal