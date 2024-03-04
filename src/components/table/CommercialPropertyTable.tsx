import { Fragment } from "react"

import { PropertyDataType } from "../../dataTypes/commercialPropertyTypes"

interface ImageType {
    file: string;
    upload: File;
}

interface PropsType {
    propertyData: PropertyDataType,
    propertyImages?: ImageType[],
    contractImages?: ImageType[],
    fetchedPropertyImagesUrl?: string[],
    fetchedContractImagesUrl?: string[]
    firmName?: string
}

//The component is used to review the details of a commercial property before they are sent to the server
const CommercialPropertyTable: React.FC<PropsType> = (props) => {
    const {
        propertyData,
        firmName,
        propertyImages,
        contractImages,
        fetchedContractImagesUrl,
        fetchedPropertyImagesUrl
    } = props

    return (
        <Fragment>
            <table
                className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto"
                onClick={(e: React.MouseEvent<HTMLTableElement, MouseEvent>) => e.stopPropagation()}>
                <thead >
                    <tr className="bg-gray-200 border-2 border-gray-300">
                        <th className="w-28 text-xl pt-4 pb-4 sm:w-48">Field</th>
                        <th className="text-xl ">Data</th>
                    </tr>
                </thead>
                <tbody>

                    {/*Firm name */}
                    {firmName && <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Firm name</td>
                        <td className=" pt-4 pb-4 text-center">{firmName}</td>
                    </tr>}

                    {/*Property type */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.commercialPropertyType === 'industrial' ? 'Industrial/Institutional' : 'Shop/Showroom/Booth'}</td>
                    </tr>

                    {/*title */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Title</td>
                        <td className=" pt-4 pb-4 pr-2 pl-2 flex justify-center">
                            <p>{propertyData.title}</p>
                        </td>
                    </tr>

                    {/*details */}
                    {propertyData.details && <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Details</td>
                        <td className=" pt-4 pb-4 pr-2 pl-2 flex justify-center">
                            <p>{propertyData.details}</p>
                        </td>
                    </tr>}

                    {/* shop type*/}
                    {propertyData.commercialPropertyType === 'shop' && propertyData.shopPropertyType && <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Shop type</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.shopPropertyType}</td>
                    </tr>}

                    {/*state of property*/}
                    {propertyData.commercialPropertyType === 'industrial' ?
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                            <td className=" pt-4 pb-4 text-center">
                                {propertyData.stateOfProperty.empty ?
                                    'Empty' :
                                    `${propertyData.stateOfProperty.builtUpPropertyType && propertyData.stateOfProperty.builtUpPropertyType === 'other' ?
                                        'Built-up' :
                                        `Built-up (${propertyData.stateOfProperty.builtUpPropertyType})`}
                                        `}
                            </td>
                        </tr> :
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                            <td className=" pt-4 pb-4 text-center">
                                {propertyData.stateOfProperty.empty ? 'Empty' : 'Built-up'}
                            </td>
                        </tr>}

                    {/* land size*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Land Size</td>
                        <td className="pt-4 pb-4 flex flex-col place-items-center">
                            <div className="flex flex-col place-items-center sm:flex-row sm:place-content-center gap-3 sm:gap-5 mb-4 pr-0.5 pl-0.5 text-center">
                                {propertyData.area.totalArea && <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                    <p className="w-full text-center font-semibold">Total area</p>
                                    <p>{propertyData.area.totalArea.metreSquare} metre square</p>
                                    <p>{propertyData.area.totalArea.squareFeet} square feet</p>
                                </div>}
                                {propertyData.area.coveredArea && <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                    <p className="w-full text-center font-semibold">Covered area</p>
                                    <p>{propertyData.area.coveredArea.metreSquare} metre square</p>
                                    <p>{propertyData.area.coveredArea.squareFeet} square feet</p>
                                </div>}
                            </div>
                            {propertyData.area.details && <p className="bg-gray-200 mx-2 p-1 rounded w-fit">{propertyData.area.details}</p>}
                        </td>
                    </tr>

                    {/*Number of floors excluding basement*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Floors (excluding basement)</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.floors.floorsWithoutBasement}</td>
                    </tr>

                    {/*Basement floors */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Basement floors</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.floors.basementFloors}</td>
                    </tr>

                    {/* lease period*/}
                    {propertyData.commercialPropertyType === 'shop' &&
                        propertyData.leasePeriod &&
                        (propertyData.leasePeriod.years || propertyData.leasePeriod.months) &&
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lease period</td>
                            <td className=" pt-4 pb-4 text-center">
                                <div className="flex flex-col">
                                    {propertyData.leasePeriod.years && propertyData.leasePeriod.years > 0 && <p>{propertyData.leasePeriod.years} years</p>}
                                    {propertyData.leasePeriod.months && propertyData.leasePeriod.months > 0 && <p>{propertyData.leasePeriod.months} months</p>}
                                </div>
                            </td>
                        </tr>}

                    {/*lockin period */}
                    {propertyData.commercialPropertyType === 'shop' &&
                        propertyData.lockInPeriod &&
                        (propertyData.lockInPeriod.years || propertyData.lockInPeriod.months) &&
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lock-in period</td>
                            <td className=" pt-4 pb-4 text-center">
                                <div className="flex flex-col">
                                    {propertyData.lockInPeriod.years && propertyData.lockInPeriod.years > 0 && <p>{propertyData.lockInPeriod.years} years</p>}
                                    {propertyData.lockInPeriod.months && propertyData.lockInPeriod.months > 0 && <p>{propertyData.lockInPeriod.months} months</p>}
                                </div>
                            </td>
                        </tr>}

                    {/*Location*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                        <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                            {propertyData.location.name.plotNumber &&
                                <div className="flex flex-row gap-2">
                                    <p className="font-semibold">Plot number:</p>
                                    <p>{propertyData.location.name.plotNumber}</p>
                                </div>}
                            {propertyData.location.name.village &&
                                <div className="flex flex-row gap-2">
                                    <p className="font-semibold">Village:</p>
                                    <p>{propertyData.location.name.village}</p>
                                </div>}
                            {propertyData.location.name.city &&
                                <div className="flex flex-row gap-2">
                                    <p className="font-semibold">City:</p>
                                    <p>{propertyData.location.name.city}</p>
                                </div>}
                            {propertyData.location.name.tehsil &&
                                <div className="flex flex-row gap-2">
                                    <h2 className="font-semibold">Tehsil:</h2>
                                    <p>{propertyData.location.name.tehsil}</p>
                                </div>}
                            <div className=" flex flex-row gap-2">
                                <p className="font-semibold">District:</p>
                                <p>{propertyData.location.name.district}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">State:</p>
                                <p>{propertyData.location.name.state}</p>
                            </div>
                        </td>
                    </tr>

                    {/* Road width*/}
                    {propertyData.widthOfRoadFacing.metre !== 0 &&
                        propertyData.widthOfRoadFacing.feet !== 0 &&
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Road width</td>
                            <td className=" pt-4 pb-4 text-center">
                                <div className="flex flex-col place-items-center">
                                    <p>{propertyData.widthOfRoadFacing.feet}   feet</p>
                                    <p>{propertyData.widthOfRoadFacing.metre}  metre</p>
                                </div>
                            </td>
                        </tr>}

                    {/* Number of owners*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                        <td className="pt-4 pb-4 text-center">{propertyData.numberOfOwners}</td>
                    </tr>

                    {/*Price */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                        <td className="pt-4 pb-4 text-center flex flex-col place-items-center gap-2">
                            <div className="flex flex-row place-content-center gap-1">
                                <p className="font-semibold">Rs.</p>
                                <p>{propertyData.price}</p>
                            </div>
                        </td>
                    </tr>

                    {/*Legal restrictions */}
                    <tr className="border-2 border-gray-300">
                        <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                        <td className="pt-4 pb-4 flex flex-col place-items-center gap-2">
                            {!propertyData.legalRestrictions.isLegalRestrictions && <p>No</p>}
                            {propertyData.legalRestrictions.details &&
                                <>
                                    <p>Yes</p>
                                    <p className="mx-2 bg-gray-200 p-1 rounded">{propertyData.legalRestrictions.details}</p>
                                </>
                            }
                        </td>
                    </tr>

                    {/*Land images */}
                    <tr className="border-2 border-gray-300">
                        <td className="pt-4 pb-4 text-lg font-semibold text-center">Land images</td>
                        <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                            {propertyImages && propertyImages.map(image => {
                                return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image.file} alt="" onClick={() => window.open(image.file, '_blank')} />;
                            })}
                            {fetchedPropertyImagesUrl && fetchedPropertyImagesUrl.map(image => {
                                return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={() => window.open(image, '_blank')} />;
                            })}
                            {propertyData.propertyImagesUrl && propertyData.propertyImagesUrl.map(image => {
                                return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={() => window.open(image, '_blank')} />;
                            })}
                        </td>
                    </tr>

                    {/*contract images */}
                    {(contractImages || propertyData.contractImagesUrl) &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract images</td>
                            <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                {contractImages && contractImages.map(image => {
                                    return <img
                                        key={Math.random()}
                                        className='w-40 h-auto cursor-pointer'
                                        src={image.file}
                                        alt=""
                                        onClick={() => window.open(image.file, '_blank')} />
                                })}
                                {fetchedContractImagesUrl && fetchedContractImagesUrl.map(image => {
                                    return <img
                                        key={Math.random()}
                                        className='w-40 h-auto cursor-pointer'
                                        src={image}
                                        alt=""
                                        onClick={() => window.open(image, '_blank')} />
                                })}
                                {propertyData.contractImagesUrl && propertyData.contractImagesUrl.map(image => {
                                    return <img
                                        key={Math.random()}
                                        className='w-40 h-auto cursor-pointer'
                                        src={image}
                                        alt=""
                                        onClick={() => window.open(image, '_blank')} />
                                })}
                            </td>
                        </tr>}

                </tbody>
            </table>
        </Fragment >
    )
}
export default CommercialPropertyTable