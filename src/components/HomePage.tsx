import { Fragment } from "react"
import { Link } from "react-router-dom"

//this component is an alert modal
const HomePage: React.FC = () => {

    return (
        <Fragment>
            <div className="fixed z-50 top-16 pt-12 bg-transparent h-screen w-full flex flex-col gap-2 place-items-center " >
                <Link to='/field-agent' className="bg-blue-500 h-fit text-white p-2 rounded">Field agent</Link>
                <Link to='/property-evaluator' className="bg-blue-500 h-fit text-white p-2 rounded">Property evaluator</Link>
                <Link to='/property-dealer' className="bg-blue-500 h-fit text-white p-2 rounded">Property dealer</Link>
                <Link to='/city-manager' className="bg-blue-500 h-fit text-white p-2 rounded">City manager</Link>
            </div>
        </Fragment>
    )
}
export default HomePage
