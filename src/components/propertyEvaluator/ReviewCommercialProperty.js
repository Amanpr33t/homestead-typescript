import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropertyEvaluationForm from "./PropertyEvaluationForm"

//This component is used to show a commercial property details in a table
function ReviewCommercialProperty(props) {
    const navigate = useNavigate()
    const { property, hideReviewPage } = props

    const [showEvaluationForm, setShowEvaluationForm] = useState(false)

    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) //used to scroll to top of the screen
    }, [])

    console.log(property.commercialLandImagesUrl)

    return (
        <Fragment>

            {!showEvaluationForm &&
                <div className="w-full fixed top-16 bg-white pb-2 z-50">
                    <button type='button' className="bg-green-500  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={hideReviewPage}>Back</button>
                    <button type='button' className="bg-green-500  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/property-evaluator', { replace: true })}>Home</button>
                </div>
            }

            {!showEvaluationForm && <>
                <div className="w-full mt-32 bg-white z-20 mb-4">
                    <p className="text-2xl font-bold text-center">Commercial property details</p>
                </div>

                <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                    <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                        <thead >
                            <tr className="bg-gray-200 border-2 border-gray-300">
                                <th className="w-28 text-xl pt-4 pb-4 sm:w-fit">Field</th>
                                <th className="text-xl ">Data</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property ID</td>
                                <td className=" pt-4 pb-4 text-center">{property.uniqueId}</td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                                <td className=" pt-4 pb-4 text-center">{property.commercialPropertyType === 'industrial' ? 'Industrial/Institutional' : 'Shop/Showroom/Booth'}</td>
                            </tr>

                            {property.commercialPropertyType === 'shop' && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Shop type</td>
                                <td className=" pt-4 pb-4 text-center">{property.shopPropertyType}</td>
                            </tr>}

                            {property.commercialPropertyType === 'industrial' ? <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                                <td className=" pt-4 pb-4 text-center">{property.stateOfProperty.empty ? 'Empty' : `${property.stateOfProperty.builtUpPropertyType === 'other' ? 'Built-up' : `Built-up (${property.stateOfProperty.builtUpPropertyType})`}`}</td>
                            </tr> : <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                                <td className=" pt-4 pb-4 text-center">{property.stateOfProperty.empty ? 'Empty' : 'Built-up'}</td>
                            </tr>}

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Land Size</td>
                                <td className="pt-4 pb-4 text-center pr-0.5 pl-0.5">
                                    <div className="flex flex-row place-content-center gap-1 sm:gap-5 mb-4">
                                        <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                            <p className="w-full text-center font-semibold">Total area</p>
                                            <p>{property.landSize.totalArea.metreSquare} metre square</p>
                                            <p>{property.landSize.totalArea.squareFeet} square feet</p>
                                        </div>
                                        <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                            <p className="w-full text-center font-semibold">Covered area</p>
                                            <p>{property.landSize.coveredArea.metreSquare} metre square</p>
                                            <p>{property.landSize.coveredArea.squareFeet} square feet</p>
                                        </div>
                                    </div>

                                    {property.landSize.details && < p > {property.landSize.details}</p>}
                                </td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Floors (excluding basement)</td>
                                <td className=" pt-4 pb-4 text-center">{property.floors.floorsWithoutBasement}</td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Basement floors</td>
                                <td className=" pt-4 pb-4 text-center">{property.floors.basementFloors}</td>
                            </tr>

                            {property.commercialPropertyType === 'shop' && (property.leasePeriod.years !== 0 || property.leasePeriod.months !== 0) && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lease period</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col">
                                        {property.leasePeriod.years !== 0 && <p>{property.leasePeriod.years} years</p>}
                                        {property.leasePeriod.months !== 0 && <p>{property.leasePeriod.months} months</p>}
                                    </div>
                                </td>
                            </tr>}

                            {property.commercialPropertyType === 'shop' && (property.lockInPeriod.years !== 0 || property.lockInPeriod.months !== 0) && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lock-in period</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col">
                                        {property.lockInPeriod.years !== 0 && <p>{property.lockInPeriod.years} years</p>}
                                        {property.lockInPeriod.months !== 0 && <p>{property.lockInPeriod.months} months</p>}
                                    </div>
                                </td>
                            </tr>}

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                                <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                                    {property.location.name.plotNumber && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Plot number:</p>
                                        <p>{property.location.name.plotNumber}</p>
                                    </div>}
                                    {property.location.name.village && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Village:</p>
                                        <p>{property.location.name.village}</p>
                                    </div>}
                                    {property.location.name.city && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">City:</p>
                                        <p>{property.location.name.city}</p>
                                    </div>}
                                    {property.location.name.tehsil && <div className="flex flex-row gap-2">
                                        <h2 className="font-semibold">Tehsil:</h2>
                                        <p>{property.location.name.tehsil}</p>
                                    </div>}
                                    <div className=" flex flex-row gap-2">
                                        <p className="font-semibold">District:</p>
                                        <p>{property.location.name.district}</p>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold">State:</p>
                                        <p>{property.location.name.state}</p>
                                    </div>
                                </td>
                            </tr>

                            {property.widthOfRoadFacing.metre && property.widthOfRoadFacing.feet && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Road width</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col place-items-center">
                                        <p>{property.widthOfRoadFacing.feet}   feet</p>
                                        <p>{property.widthOfRoadFacing.metre}  metre</p>
                                    </div>
                                </td>
                            </tr>}

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                                <td className="pt-4 pb-4 text-center" >{property.numberOfOwners}</td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    <div className="flex flex-row place-content-center gap-1">
                                        <p className="font-semibold">Rs.</p>
                                        <p>{property.priceDemanded.number}</p>
                                    </div>
                                    <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.priceDemanded.words}</p>
                                </td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {!property.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                    {property.legalRestrictions.isLegalRestrictions && <>
                                        <p>Yes</p>
                                        <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.legalRestrictions.details}</p>
                                    </>}
                                </td>
                            </tr>

                            {property.remarks && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Remarks</td>
                                <td className=" pt-4 pb-4 text-center">{property.remarks}</td>
                            </tr>}
                            <tr className="border-2 border-gray-200">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Land Images</td>
                                <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                    {property.commercialLandImagesUrl.map(image => {
                                        return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={()=>window.open(image, '_blank')}/>;
                                    })}
                                </td>
                            </tr>
                            {property.contractImagesUrl.length > 0 && <tr className="border-2 border-gray-200">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract Images</td>
                                <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                    {property.contractImagesUrl.map(image => {
                                        return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={()=>window.open(image, '_blank')}/>
                                    })}
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                </div></>}

            {!showEvaluationForm && <div className="w-full -mt-4 mb-6 flex justify-center ">
                <button type="button" className="w-fit bg-blue-500 text-white font-medium rounded pl-2 pr-2 h-8" onClick={() => setShowEvaluationForm(true)}>Fill evaluation form</button>
            </div>}

            <div className={`${showEvaluationForm ? '' : 'fixed mx-[-200%]'}`}>
                <PropertyEvaluationForm
                    hideEvaluationForm={() => setShowEvaluationForm(false)}
                    propertyType='commercial'
                    commercialPropertyType={property.commercialPropertyType}
                    isBuiltUpProperty={property.stateOfProperty.builtUp}
                    propertyId={property._id}
                    propertyEvaluatorId={property.propertyEvaluator}
                    fieldAgentId={property.addedByFieldAgent}
                    numberOfReevaluationsReceived={property.numberOfReevaluationsReceived}
                />
            </div>

        </Fragment >
    )
}
export default ReviewCommercialProperty