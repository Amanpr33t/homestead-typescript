import { Link } from "react-router-dom"
import { Fragment } from "react"

//This component is the navigation bar
function ListOfPropertiesAddedByFieldAgent() {

    return (
        <Fragment>
            <div className= " w-full flex justify-center pt-16">
                <Link to='/field-agent' className="fixed top-20 left-4 bg-green-500 text-white font-medium rounded p-1 h-fit w-fit">Home</Link>
                <div className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 justify-center flex flex-wrap gap-10 mt-20">
                    <Link to='/field-agent/properties-added/agricultual-properties' className="bg-blue-500 text-white font-medium rounded p-2 h-fit w-fit">Agricultural Properties Added</Link>
                    <Link to='/field-agent/properties-added/commercial-properties' className="bg-blue-500 text-white font-medium rounded p-2 h-fit w-fit">Commercial Properties Added</Link>
                    <Link to='/field-agent/properties-added/residential-properties' className="bg-blue-500 text-white font-medium rounded p-2 h-fit w-fit">Residential Properties Added</Link>
                </div>
            </div>
        </Fragment>
    )
}
export default ListOfPropertiesAddedByFieldAgent