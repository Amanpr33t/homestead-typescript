import { Link } from "react-router-dom"
import { Fragment, useEffect } from "react"
import { useNavigate } from "react-router-dom"

//This component is the navigation bar
function PropertyDealersAdded() {
    const navigate = useNavigate()
    const fieldAgentAuthToken = localStorage.getItem('homestead-field-agent-authToken')
    useEffect(() => {
        if (!fieldAgentAuthToken) {
            navigate('/field-agent/signIn')
        }
    }, [fieldAgentAuthToken,navigate])

    return (
        <Fragment>
            <div className="">
                <div className='w-full z-20 bg-white fixed top-24 md:top-16 flex justify-start gap-3 pt-3.5 md:pt-2 pb-2 pl-2'>
                    <Link to='/' className="bg-blue-500 text-white font-semibold p-1 rounded-lg flex flex-row gap-2" >Home</Link>
                </div>
            </div>
        </Fragment>
    )
}
export default PropertyDealersAdded