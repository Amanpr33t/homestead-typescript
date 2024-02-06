import { Link, useNavigate } from "react-router-dom"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import Spinner from "../../Spinner"

//This component shows three buttons used to fetch properties pending for evaluation
const PendingPropertyReevaluations: React.FC = () => {
    const navigate = useNavigate()

    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")
    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const queryParams = new URLSearchParams(window.location.search);

    // Get a specific query parameter by its name
    const numberOfResidentialProperties: string | null = queryParams.get('residential');
    const numberOfCommercialProperties: string | null = queryParams.get('commercial');
    const numberOfAgriculturalProperties: string | null = queryParams.get('agricultural');

    return (
        <Fragment>
            {/*Home button */}
            <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
                <button
                    type='button'
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 h-8"
                    onClick={() => navigate('/field-agent', { replace: true })}>
                    Home
                </button>
            </div>

            <div className=" w-full flex flex-col gap-10 place-items-center pt-16">
                <div className="pt-16 flex justify-center w-full">
                    <p className="text-xl font-semibold">Pending property reevaluations</p>
                </div>

                <div className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 justify-center flex flex-wrap gap-10 ">

                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfAgriculturalProperties && +numberOfAgriculturalProperties && navigate('/field-agent/reevaluate-property/agricultural-properties')}>
                        <p className="text-5xl text-green-800">{numberOfAgriculturalProperties}</p>
                        <p className="w-36 text-center" >Agricultural properties</p>
                    </div>

                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfCommercialProperties && +numberOfCommercialProperties && navigate('/field-agent/reevaluate-property/commercial-properties')}>
                        <p className="text-5xl text-green-800">{numberOfCommercialProperties}</p>
                        <p className="w-36 text-center">Commercial properties</p>
                    </div>

                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfResidentialProperties && +numberOfResidentialProperties && navigate('/field-agent/reevaluate-property/residential-properties')}>
                        <p className="text-5xl text-green-800">{numberOfResidentialProperties}</p>
                        <p className="w-36 text-center">Residential properties</p>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}
export default PendingPropertyReevaluations
