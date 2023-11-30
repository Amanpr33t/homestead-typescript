
import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import VerifyPropertyDealerBeforeAddingProperty from "./VerifyPropertyDealerBeforeAddingProperty"

function AddProperty() {
    const navigate = useNavigate()

    const [propertyDealer, setPropertyDealer] = useState()
    const [selectedPropertyType, setSelectedPropertyType] = useState()
    const [commericialPropertyType, setCommercialPropertyType] = useState()

    const propertyDealerSetterFunction = (dealer) => {
        setPropertyDealer(dealer)
    }

    return (
        <Fragment>
            <div className='w-full min-h-screen'>

                <div className="w-full fixed top-16 bg-white z-50">
                    <button type='button' className="bg-green-500 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 h-8  " onClick={() => navigate('/field-agent', { replace: true })}>Home</button>
                </div>

                {!propertyDealer && <VerifyPropertyDealerBeforeAddingProperty propertyDealerSetterFunction={propertyDealerSetterFunction} />}

                {propertyDealer &&
                    <div className="top-32 fixed w-full h-screen flex justify-center z-20">

                        <div className="rounded border-2 shadow-2xl bg-white p-2 h-fit" onClick={e => e.stopPropagation()}>
                            <p className="w-full text-center font-semibold mb-2">Select a property type</p>
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

                                {selectedPropertyType === 'commercial' && <div className="pl-5 flex flex-col">
                                    <div className="bg-gray-200 pr-1 pl-1 ">
                                        <input className="bg-gray-300 mr-1" type="radio" id="shop" name="commercial-type" value="shop" onChange={e => {
                                            if (e.target.checked) {
                                                setCommercialPropertyType(e.target.value)
                                            } else {
                                                setCommercialPropertyType(null)
                                            }
                                        }} />
                                        <label htmlFor="shop">Shop/Showroom/Booth</label>
                                    </div>
                                    <div className="bg-gray-200 pr-1 pl-1">
                                        <input className=" mr-1" type="radio" id="industrial" name="commercial-type" value="industrial" onChange={e => {
                                            if (e.target.checked) {
                                                setCommercialPropertyType(e.target.value)
                                            } else {
                                                setCommercialPropertyType(null)
                                            }
                                        }} />
                                        <label htmlFor="industrial">Industrial/Institutional</label>
                                    </div>
                                </div>}
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
                                        navigate(`/field-agent/add-property/agricultural?id=${propertyDealer.dealerId}&firmName=${propertyDealer.firmName}&logoUrl=${propertyDealer.firmLogoUrl}`, { replace: true })
                                    } else if (selectedPropertyType === 'commercial' && commericialPropertyType) {
                                        navigate(`/field-agent/add-property/commercial?id=${propertyDealer.dealerId}&firmName=${propertyDealer.firmName}&logoUrl=${propertyDealer.firmLogoUrl}&propertyType=${commericialPropertyType}`, { replace: true })
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