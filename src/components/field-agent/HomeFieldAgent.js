import { Link } from "react-router-dom"
import { Fragment, useEffect } from "react"
import { useNavigate } from "react-router-dom"


//This component is the navigation bar
function HomeFieldAgent() {
    const navigate = useNavigate()
    const fieldAgentAuthToken = localStorage.getItem('homestead-field-agent-authToken')
    useEffect(() => {
        if (!fieldAgentAuthToken) {
            navigate('/field-agent/signIn')
        }
    }, [fieldAgentAuthToken,navigate])

    return (
        <Fragment>
            <div className="flex flex-col md:flex-row pt-32 gap-3 w-full place-items-center md:place-content-center">
                
                <Link to='/' className="bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 pt-1 h-8 w-fit " onClick={()=>navigate('/add-property-dealer')}>Add Property</Link>
                <Link to='/field-agent/add-property-dealer' className="bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 pt-1 h-8 w-fit" >Add Property Dealer</Link>
            </div>
        </Fragment>
    )
}
export default HomeFieldAgent