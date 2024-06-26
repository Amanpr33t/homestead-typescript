import { useNavigate } from "react-router-dom"
import React, { Fragment, useEffect } from "react"

//This component shows three buttons used to fetch properties pending for evaluation
const PropertiesToBeReconsidered: React.FC = () => {
    const navigate = useNavigate()

    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")
    useEffect(() => {
        if (!authToken) {
            navigate('/user', { replace: true })
            return
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
                    onClick={() => {
                        navigate('/field-agent', { replace: true })
                        return
                    }}>
                    Home
                </button>
            </div>

            <div className=" w-full flex flex-col gap-10 place-items-center pt-16">
                <div className="pt-16 flex justify-center w-full">
                    <p className="text-xl font-semibold">Properties pending for reconsideration</p>
                </div>

                <div className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 justify-center flex flex-wrap gap-10 ">

                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => {
                        if (numberOfAgriculturalProperties && +numberOfAgriculturalProperties) {
                            navigate('/field-agent/reconsider-property-details/agricultural-properties')
                            return
                        }
                    }}>
                        <p className="text-5xl text-green-800">{numberOfAgriculturalProperties}</p>
                        <p className="w-36 text-center" >Agricultural properties</p>
                    </div>

                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => {
                        if (numberOfCommercialProperties && +numberOfCommercialProperties) {
                            navigate('/field-agent/reconsider-property-details/commercial-properties')
                            return
                        }
                    }}>
                        <p className="text-5xl text-green-800">{numberOfCommercialProperties}</p>
                        <p className="w-36 text-center">Commercial properties</p>
                    </div>

                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => {
                        if (numberOfResidentialProperties && +numberOfResidentialProperties) {
                            navigate('/field-agent/reconsider-property-details/residential-properties')
                            return
                        }
                    }}>
                        <p className="text-5xl text-green-800">{numberOfResidentialProperties}</p>
                        <p className="w-36 text-center">Residential properties</p>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}
export default PropertiesToBeReconsidered