
import { Fragment, useEffect, useState } from "react"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import { MdFrontHand } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TbFilterSearch } from "react-icons/tb";

//This component is the home page for property dealer
function PropertiesPreviouslyAdded() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-property-dealer-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })
    const [spinner, setSpinner] = useState(false)
    const [error, setError] = useState(false)


    const [state, setState] = useState('') //Used to set state
    const states = ['Chandigarh', 'Punjab']

    const [propertyAddedYear, setPropertyAddedYear] = useState(0) //Used to set experience
    const arrayOfYears = [2024, 2025, 2026]



    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    routeTo={alert.routeTo}
                    alertModalRemover={() => {
                        setAlert({
                            isAlertModal: false,
                            alertType: '',
                            alertMessage: '',
                            routeTo: null
                        })
                    }} />}

            <div className="pt-20 bg-gray-100 min-h-screen">
                <div className="flex flex-row place-content-center gap-5 pt-10 pb-20">

                    {/*Filters */}
                    <div className="w-80 mt-12 bg-white p-4 flex flex-col gap-5">
                        <div className="flex flex-row place-content-center gap-1 ">
                            <TbFilterSearch className="text-3xl text-blue-500" />
                            <p className="text-lg font-semibold text-gray-600">Filters</p>
                        </div>

                        {/*property type */}
                        <div>
                            <p className="text-lg font-semibold text-gray-600 mb-2">Property type</p>
                            <div className="flex flex-col gap-1.5">
                                {['Agricultural', 'Residential', 'Commercial'].map(type => {
                                    return <div className="ml-6 ">
                                        <input className="mr-2 cursor-pointer" type="checkbox" id={type} name={type} />
                                        <label className="text-lg text-gray-600 cursor-pointer" htmlFor={type}>{type}</label>
                                    </div>
                                })}
                            </div>
                        </div>

                        {/*State */}
                        <div className="flex flex-col gap-1">
                            <label className="text-lg font-semibold text-gray-600" htmlFor="state">State</label>
                            <select className='w-fit border-2 border-gray-400 p-1 rounded cursor-pointer' name="state" id="state" value={state} onChange={e => {
                                setState(e.target.value)
                            }}>
                                <option className="font-semibold" value="" >None</option>
                                {states.map(state => {
                                    return <option key={state} value={state}>{state}</option>
                                })}
                            </select>
                        </div>

                        {/*Year in which property was added*/}
                        <div className="flex flex-col gap-1">
                            <label className="text-lg font-semibold text-gray-600" htmlFor="propertyAddedYear">Property added in year</label>
                            <select className="w-fit border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="propertyAddedYear" id="propertyAddedYear" value={propertyAddedYear} onChange={e => {
                                setPropertyAddedYear(e.target.value)
                            }}>
                                <option className="font-semibold" value="">None</option>
                                {arrayOfYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>

                        {/*active or inactive status*/}
                        <div>
                            <p className="text-lg font-semibold text-gray-600 mb-1">Status</p>
                            <div className="flex flex-row gap-1">
                                {['Active', 'Inactive'].map(type => {
                                    return <div className="ml-6 ">
                                        <input className="mr-2 cursor-pointer" type="radio" id={type} name='status' />
                                        <label className="text-lg text-gray-600 cursor-pointer" htmlFor={type}>{type}</label>
                                    </div>
                                })}
                            </div>
                        </div>

                    </div>

                    {/*Container for list of properties */}
                    <div className="w-6/12 flex flex-col gap-5">
                        <p className="font-semibold text-xl text-center">10 properties added</p>
                        <div className="w-full p-5 rounded-lg bg-white">
                            <p className="text-xl font-semibold text-gray-900 mb-5 text-center">Agricultural property</p>
                            <div className="flex flex-row mb-4">
                                <p className="text-lg font-semibold text-gray-700">Location:</p>
                                <div className="mt-1">
                                    <div className="flex flex-row gap-3 ml-6">
                                        <p className="font-semibold text-gray-500">Plot No:</p>
                                        <p className="text-gray-600">1</p>
                                    </div>
                                    <div className="flex flex-row gap-5 ml-6">
                                        <p className="font-semibold text-gray-500">Village:</p>
                                        <p className="text-gray-600">Parta</p>
                                    </div>
                                    <div className="flex flex-row gap-7 ml-6">
                                        <p className="font-semibold text-gray-500">Tehsil:</p>
                                        <p className="text-gray-600">Samana:</p>
                                    </div>
                                    <div className="flex flex-row gap-4 ml-6">
                                        <p className="font-semibold text-gray-500">District:</p>
                                        <p className="text-gray-600">Patiala:</p>
                                    </div>
                                    <div className="flex flex-row gap-8 ml-6">
                                        <p className="font-semibold text-gray-500">State:</p>
                                        <p className="text-gray-600">Punjab</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-5 mb-4">
                                <p  className="text-lg font-semibold text-gray-700">Added on:</p>
                                <p className="text-lg">10 Jan 2024</p>
                            </div>
                            <div className="flex flex-row gap-5 mb-4">
                                <p className="text-lg font-semibold text-gray-700">Status:</p>
                                <p className="text-green-500 font-semibold text-lg ">Active</p>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button type='button' className="bg-blue-500 hover:bg-blue-700 text-white font-semibold text-lg rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" >View details</button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </Fragment>
    )
}
export default PropertiesPreviouslyAdded