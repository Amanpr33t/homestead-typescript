import { Link, useNavigate } from "react-router-dom"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import Spinner from "../Spinner"

//This component shows three buttons used to fetch properties pending for evaluation
const PropertiesToBeEvaluated: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-property-evaluator-authToken")
    useEffect(() => {
        if (!authToken) {
            navigate('/property-evaluator/signIn', { replace: true })
        }
    }, [authToken, navigate])

    useEffect(() => {
        if (!authToken) {
            navigate('/property-evaluator/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const [numberOfAgriculturalProperties, setNumberOfAgriculturalProperties] = useState<number>(0)
    const [numberOfCommercialProperties, setNumberOfCommercialProperties] = useState<number>(0)
    const [numberOfResidentialProperties, setNumberOfResidentialProperties] = useState<number>(0)

    //The function is used to fetch data regarding properties evaluated by the property evaluator
    const fetchNumberOfPropertiesForEvaluation = useCallback(async () => {
        try {
            setSpinner(true)
            setError(false)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/numberOfPropertiesPendingToBeEvaluated`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                setNumberOfAgriculturalProperties(data.numberOfAgriculturalProperties)
                setNumberOfCommercialProperties(data.numberOfCommercialProperties)
                setNumberOfResidentialProperties(data.numberOfResidentialProperties)
                return
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-evaluator-authToken")
                navigate('/property-evaluator/signIn', { replace: true })
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [authToken, navigate])

    useEffect(() => {
        if (authToken) {
            fetchNumberOfPropertiesForEvaluation()
        }
    }, [fetchNumberOfPropertiesForEvaluation, authToken])


    return (
        <Fragment>
            <Link to='/property-evaluator' className="fixed top-20 left-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded p-1 h-fit w-fit">Home</Link>

            {spinner && !error && <Spinner />}

            {error && !spinner && <div className="fixed top-36 w-full flex flex-col place-items-center">
                <p>Some error occured</p>
                <p className="text-red-500 cursor-pointer" onClick={fetchNumberOfPropertiesForEvaluation}>Try again</p>
            </div>}

            {!error && !spinner &&
                <div className=" w-full flex flex-col gap-10 place-items-center pt-16">
                    <div className="pt-16 flex justify-center w-full">
                        <p className="text-xl font-semibold">Pending property evaluations</p>
                    </div>

                    <div className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 justify-center flex flex-wrap gap-10 ">

                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfAgriculturalProperties && navigate('/property-evaluator/agricultural-properties-to-be-evaluated')}>
                            <p className="text-5xl text-green-800">{numberOfAgriculturalProperties}</p>
                            <p className="w-36 text-center" >Agricultural properties</p>
                        </div>

                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfCommercialProperties && navigate('/property-evaluator/commercial-properties-to-be-evaluated')}>
                            <p className="text-5xl text-green-800">{numberOfCommercialProperties}</p>
                            <p className="w-36 text-center">Commercial properties</p>
                        </div>

                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfResidentialProperties && navigate('/property-evaluator/residential-properties-to-be-evaluated')}>
                            <p className="text-5xl text-green-800">{numberOfResidentialProperties}</p>
                            <p className="w-36 text-center">Residential properties</p>
                        </div>

                    </div>
                </div>}
        </Fragment>
    )
}
export default PropertiesToBeEvaluated
