
import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaHome } from "react-icons/fa"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import VerifyPropertyDealerBeforeAddingProperty from "./VerifyPropertyDealerBeforeAddingProperty"

//This component is the navigation bar
function AddProperty() {
    const navigate = useNavigate()
    const [propertyTypeSelector, setPropertyTypeSelector] = useState(false)
    //const [isPropertyDealerAvailable, setIsPropertyDealerAvailable] = useState(false)
    const [propertyDealerId, setPropertyDealerId] = useState()
    const [selectedPropertyType, setSelectedPropertyType] = useState()

    const propertyDealerSetterFunction = (id) => {
        setPropertyDealerId(id)
    }

    return (
        <Fragment>
            <div className='w-full min-h-screen'>
                {!propertyDealerId && <VerifyPropertyDealerBeforeAddingProperty propertyDealerSetterFunction={propertyDealerSetterFunction} />}

                {propertyDealerId &&
                    <div className="top-20 fixed w-full h-screen flex justify-center z-20" onClick={() => setPropertyTypeSelector(false)}>
                        <div className="rounded-lg border-2 shadow-2xl bg-white p-2 h-fit" onClick={e => e.stopPropagation()}>
                            <p className="font-semibold mb-2">Select a property type</p>
                            <div className="mb-1">
                                <input className="mr-1" type="radio" id="agricultural" name="property" value="agricultural" onChange={e => {
                                    if (e.target.checked) {
                                        setSelectedPropertyType(e.target.value)
                                    } else {
                                        setSelectedPropertyType(null)
                                    }
                                }} />
                                <label htmlFor="property">Agricultural</label>
                            </div>

                            <div className="mb-1">
                                <input className="mr-1" type="radio" id="commercial" name="property" value="commercial" onChange={e => {
                                    if (e.target.checked) {
                                        setSelectedPropertyType(e.target.value)
                                    } else {
                                        setSelectedPropertyType(null)
                                    }
                                }} />
                                <label htmlFor="property">Commercial</label>
                            </div>

                            <div className="mb-2">
                                <input className="mr-1" type="radio" id="residential" name="property" value="residential" onChange={e => {
                                    if (e.target.checked) {
                                        setSelectedPropertyType(e.target.value)
                                    } else {
                                        setSelectedPropertyType(null)
                                    }
                                }} />
                                <label htmlFor="property">Residential</label>
                            </div>
                            <div className=" w-full flex justify-center">
                                <button type='button' className="bg-blue-500 text-white font-medium rounded p-1 w-fit" onClick={() => {
                                    if (selectedPropertyType === 'agricultural') {
                                        navigate(`/field-agent/add-property/agricultural/${propertyDealerId}`)
                                    }
                                }}>Select</button>
                            </div>
                        </div>
                    </div>}
            </div>
        </Fragment>
    )
}
export default AddProperty