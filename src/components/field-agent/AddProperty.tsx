
import React, { Fragment, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import VerifyPropertyDealerBeforeAddingProperty from "./VerifyPropertyDealerBeforeAddingProperty"

interface dealerType {
    dealerId: string,
    firmName: string,
    firmLogoUrl: string
}

//This component shows a modal from which the field agent can choose which type of property needs to be added
const AddProperty: React.FC = () => {
    const navigate = useNavigate()
    const authToken: null | string = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [propertyDealer, setPropertyDealer] = useState<dealerType | null>(null) //Information about the property dealer who wants to add a property

    const [selectedPropertyType, setSelectedPropertyType] = useState<'agricultural' | 'commercial' | 'residential' | null>(null) //Type of property that has been selected

    const [commericialPropertyType, setCommercialPropertyType] = useState<'shop' | 'industrial' | null>(null) //Type of commercial property chosen

    const [residentialPropertyType, setResidentialPropertyType] = useState<'house' | 'plot' | 'flat' | null>() //Type of residential property chosen

    //The function is used to set the dealer
    const propertyDealerSetterFunction = (dealer: dealerType) => {
        setPropertyDealer(dealer)
    }

    return (
        <Fragment>
            <div className='w-full min-h-screen'>

                {/*Home button */}
                <div className="w-full fixed top-16 bg-white z-50">
                    <button
                        type='button'
                        className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 h-8  "
                        onClick={() => navigate('/field-agent', { replace: true })}>
                        Home
                    </button>
                </div>

                {/*The component below is used to verify the property dealer who wants to add the property */}
                {!propertyDealer &&
                    <VerifyPropertyDealerBeforeAddingProperty
                        propertyDealerSetterFunction={propertyDealerSetterFunction}
                    />}

                {propertyDealer &&
                    <div className="top-32 fixed w-full h-screen flex justify-center z-20">

                        <div
                            className="rounded border-2 shadow-2xl bg-white p-2 h-fit"
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                            <p className="w-full text-center font-semibold mb-2">Select a property type</p>
                            <div className="mb-1">
                                <input
                                    className="mr-1"
                                    type="radio"
                                    id="agricultural"
                                    name="property"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.checked) {
                                            setCommercialPropertyType(null)
                                            setResidentialPropertyType(null)
                                            setSelectedPropertyType('agricultural')
                                        }
                                    }} />
                                <label htmlFor="agricultural">Agricultural</label>
                            </div>

                            <div className="mb-1">
                                <input
                                    className="mr-1"
                                    type="radio"
                                    id="commercial"
                                    name="property"
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setResidentialPropertyType(null)
                                            setSelectedPropertyType('commercial')
                                        }
                                    }} />
                                <label htmlFor="commercial">Commercial</label>

                                {selectedPropertyType === 'commercial' &&
                                    <div className="pl-5 flex flex-col">
                                        <div className="bg-gray-200 pr-1 pl-1 ">
                                            <input
                                                className="bg-gray-300 mr-1"
                                                type="radio"
                                                id="shop"
                                                name="commercial-type"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        setCommercialPropertyType('shop')
                                                    }
                                                }} />
                                            <label htmlFor="shop">Shop/Showroom/Booth</label>
                                        </div>
                                        <div className="bg-gray-200 pr-1 pl-1">
                                            <input
                                                className=" mr-1"
                                                type="radio"
                                                id="industrial"
                                                name="commercial-type"
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setCommercialPropertyType('industrial')
                                                    }
                                                }} />
                                            <label htmlFor="industrial">Industrial/Institutional</label>
                                        </div>
                                    </div>}
                            </div>

                            <div className="mb-2">
                                <input
                                    className="mr-1"
                                    type="radio"
                                    id="residential"
                                    name="property"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.checked) {
                                            setCommercialPropertyType(null)
                                            setSelectedPropertyType('residential')
                                        }
                                    }} />
                                <label htmlFor="residential">Residential</label>
                                {selectedPropertyType === 'residential' && <div className="pl-5 flex flex-col">
                                    <div className="bg-gray-200 pr-1 pl-1 ">
                                        <input
                                            className="bg-gray-300 mr-1"
                                            type="radio"
                                            id="plot"
                                            name="residential-type"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.checked) {
                                                    setResidentialPropertyType('plot')
                                                }
                                            }} />
                                        <label htmlFor="plot">Plot</label>
                                    </div>
                                    <div className="bg-gray-200 pr-1 pl-1">
                                        <input
                                            className=" mr-1"
                                            type="radio"
                                            id="flat"
                                            name="residential-type"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.checked) {
                                                    setResidentialPropertyType('flat')
                                                }
                                            }} />
                                        <label htmlFor="flat">Flat</label>
                                    </div>
                                    <div className="bg-gray-200 pr-1 pl-1">
                                        <input
                                            className=" mr-1"
                                            type="radio"
                                            id="house"
                                            name="residential-type"
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setResidentialPropertyType('house')
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