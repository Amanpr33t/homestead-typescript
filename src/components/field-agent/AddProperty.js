
import { Fragment, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import VerifyPropertyDealerBeforeAddingProperty from "./VerifyPropertyDealerBeforeAddingProperty"

//This component shows a modal from which the field agent can choose which type of property needs to be added
function AddProperty() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        if (!authToken) {
          navigate('/field-agent/signIn')
        }
      }, [authToken, navigate])

    const [propertyDealer, setPropertyDealer] = useState() //Information about the property dealer who wants to add a property
    const [selectedPropertyType, setSelectedPropertyType] = useState() //Type of property that has been selected
    const [commericialPropertyType, setCommercialPropertyType] = useState() //Type of commercial property chosen
    const [residentialPropertyType, setResidentialPropertyType] = useState() //Type of residential property chosen

    //The function is used to set the dealer
    const propertyDealerSetterFunction = (dealer) => {
        setPropertyDealer(dealer)
    }

    return (
        <Fragment>
            <div className='w-full min-h-screen'>

                <div className="w-full fixed top-16 bg-white z-50">
                    <button type='button' className="bg-green-500 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 h-8  " onClick={() => navigate('/field-agent', { replace: true })}>Home</button>
                </div>

                {/*The component below is used to verify the property dealer who wants to add the property */}
                {!propertyDealer && <VerifyPropertyDealerBeforeAddingProperty propertyDealerSetterFunction={propertyDealerSetterFunction} />}

                {propertyDealer &&
                    <div className="top-32 fixed w-full h-screen flex justify-center z-20">

                        <div className="rounded border-2 shadow-2xl bg-white p-2 h-fit" onClick={e => e.stopPropagation()}>
                            <p className="w-full text-center font-semibold mb-2">Select a property type</p>
                            <div className="mb-1">
                                <input className="mr-1" type="radio" id="agricultural" name="property" value="agricultural" onChange={e => {
                                    if (e.target.checked) {
                                        setCommercialPropertyType(null)
                                        setResidentialPropertyType(null)
                                        setSelectedPropertyType(e.target.value)
                                    }
                                }} />
                                <label htmlFor="property">Agricultural</label>
                            </div>

                            <div className="mb-1">
                                <input className="mr-1" type="radio" id="commercial" name="property" value="commercial" onChange={e => {
                                    if (e.target.checked) {
                                        setResidentialPropertyType(null)
                                        setSelectedPropertyType(e.target.value)
                                    }
                                }} />
                                <label htmlFor="property">Commercial</label>

                                {selectedPropertyType === 'commercial' && <div className="pl-5 flex flex-col">
                                    <div className="bg-gray-200 pr-1 pl-1 ">
                                        <input className="bg-gray-300 mr-1" type="radio" id="shop" name="commercial-type" value="shop" onChange={e => {
                                            if (e.target.checked) {
                                                setCommercialPropertyType(e.target.value)
                                            }
                                        }} />
                                        <label htmlFor="shop">Shop/Showroom/Booth</label>
                                    </div>
                                    <div className="bg-gray-200 pr-1 pl-1">
                                        <input className=" mr-1" type="radio" id="industrial" name="commercial-type" value="industrial" onChange={e => {
                                            if (e.target.checked) {
                                                setCommercialPropertyType(e.target.value)
                                            }
                                        }} />
                                        <label htmlFor="industrial">Industrial/Institutional</label>
                                    </div>
                                </div>}
                            </div>

                            <div className="mb-2">
                                <input className="mr-1" type="radio" id="residential" name="property" value="residential" onChange={e => {
                                    if (e.target.checked) {
                                        setCommercialPropertyType(null)
                                        setSelectedPropertyType(e.target.value)
                                    }
                                }} />
                                <label htmlFor="property">Residential</label>
                                {selectedPropertyType === 'residential' && <div className="pl-5 flex flex-col">
                                    <div className="bg-gray-200 pr-1 pl-1 ">
                                        <input className="bg-gray-300 mr-1" type="radio" id="plot" name="residential-type" value="Plot" onChange={e => {
                                            if (e.target.checked) {
                                                setResidentialPropertyType(e.target.value)
                                            }
                                        }} />
                                        <label htmlFor="plot">Plot</label>
                                    </div>
                                    <div className="bg-gray-200 pr-1 pl-1">
                                        <input className=" mr-1" type="radio" id="flat" name="residential-type" value="Flat" onChange={e => {
                                            if (e.target.checked) {
                                                setResidentialPropertyType(e.target.value)
                                            }
                                        }} />
                                        <label htmlFor="flat">Flat</label>
                                    </div>
                                    <div className="bg-gray-200 pr-1 pl-1">
                                        <input className=" mr-1" type="radio" id="house" name="residential-type" value="House" onChange={e => {
                                            if (e.target.checked) {
                                                setResidentialPropertyType(e.target.value)
                                            }
                                        }} />
                                        <label htmlFor="house">House</label>
                                    </div>
                                </div>}
                            </div>

                            <div className=" w-full flex justify-center">
                                <button type='button' className="bg-blue-500 text-white font-medium rounded p-1 w-fit" onClick={() => {
                                    if (selectedPropertyType === 'agricultural') {
                                        navigate(`/field-agent/add-property/agricultural?id=${propertyDealer.dealerId}&firmName=${propertyDealer.firmName}&logoUrl=${propertyDealer.firmLogoUrl}`, { replace: true })
                                    } else if (selectedPropertyType === 'commercial' && commericialPropertyType) {
                                        navigate(`/field-agent/add-property/commercial?id=${propertyDealer.dealerId}&firmName=${propertyDealer.firmName}&logoUrl=${propertyDealer.firmLogoUrl}&propertyType=${commericialPropertyType}`, { replace: true })
                                    } else if (selectedPropertyType === 'residential' && residentialPropertyType) {
                                        navigate(`/field-agent/add-property/residential?id=${propertyDealer.dealerId}&firmName=${propertyDealer.firmName}&logoUrl=${propertyDealer.firmLogoUrl}&propertyType=${residentialPropertyType}`, { replace: true })
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