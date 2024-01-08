import { Fragment } from "react"
import { Link, useNavigate } from "react-router-dom"

//this component is an alert modal
function HomePage(props) {
    const navigate = useNavigate()

    return (
        <Fragment>
            <div className="fixed z-50 top-16 pt-12 bg-transparent h-screen w-full flex gap-2 justify-center " >
                <Link to='/field-agent' className="bg-blue-500 h-fit text-white p-2 rounded">Field agent</Link>
                <Link to='/property-evaluator' className="bg-blue-500 h-fit text-white p-2 rounded">Property evaluator</Link>
                <Link to='/property-dealer' className="bg-blue-500 h-fit text-white p-2 rounded">Property dealer</Link>
            </div>
        </Fragment>
    )
}
export default HomePage
