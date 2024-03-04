import React, { Fragment } from "react"

import { PropertyDataType } from "../../dataTypes/agriculturalPropertyTypes"

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

//This component is used to review the property dealer data submitted
const AgriculturalPropertyTable: React.FC<PropsType> = (props) => {
    const {
        propertyData,
        firmName,
        propertyImages,
        contractImages,
        fetchedPropertyImagesUrl,
        fetchedContractImagesUrl
    } = props

    return (
        <Fragment>
            {/*table that shows property data */}
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

                    {/*Firm name*/}
                    {firmName && <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Firm name</td>
                        <td className=" pt-4 pb-4 text-center">{firmName}</td>
                    </tr>}

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

                    {/*land size details */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Land Size</td>
                        <td className="pt-4 pb-4 flex flex-col place-items-center">
                            <p className="text-center">{propertyData.area.size} {propertyData.area.unit}</p>
                            {propertyData.area.details && <p className="bg-gray-200 p-1 rounded mt-1 mx-1 w-fit"> {propertyData.area.details}</p>}
                        </td>
                    </tr>

                    {/*location */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                        <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                            {propertyData.location.name.village && <div className="flex flex-row gap-2">
                                <p className="font-semibold">Village:</p>
                                <p>{propertyData.location.name.village}</p>
                            </div>}
                            {propertyData.location.name.city && <div className="flex flex-row gap-2">
                                <p className="font-semibold">City:</p>
                                <p>{propertyData.location.name.city}</p>
                            </div>}
                            {propertyData.location.name.tehsil && <div className="flex flex-row gap-2">
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

                    {/*number of owners */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                        <td className="pt-4 pb-4 text-center" >{propertyData.numberOfOwners}</td>
                    </tr>

                    {/*water source details */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Water Source</td>
                        <td className="flex flex-col gap-2 place-items-center pt-4 pb-4 text-center">
                            {propertyData.waterSource.canal && propertyData.waterSource.canal.length > 0 && <div className="flex flex-row gap-2">
                                <p className="font-semibold">Canal:</p>
                                <div className="flex flex-col">
                                    {propertyData.waterSource.canal.map(canal => {
                                        return <p key={Math.random()}>{canal}</p>
                                    })}
                                </div>
                            </div>}
                            {propertyData.waterSource.river && propertyData.waterSource.river.length > 0 && <div className="flex flex-row gap-2">
                                <p className="font-semibold">River:</p>
                                <div className="flex flex-col">
                                    {propertyData.waterSource.river.map(river => {
                                        return <p key={Math.random()}>{river}</p>
                                    })}
                                </div>
                            </div>}
                            {propertyData.waterSource.tubewells.depth && propertyData.waterSource.tubewells.depth.length > 0 &&
                                <div className="flex flex-row gap-2">
                                    <p className="font-semibold">Tubewell Depth:</p>
                                    <div className="flex flex-col">
                                        {propertyData.waterSource.tubewells.depth.map(depth => {
                                            return <p key={Math.random()}>{depth} feet</p>
                                        })}
                                    </div>
                                </div>}
                        </td>
                    </tr>

                    {/*reservoir */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Reservoir</td>
                        <td className="flex flex-row place-content-center gap-2 flex-wrap pt-4 pb-4 text-center">
                            {!propertyData.reservoir.isReservoir &&
                                <p>No</p>
                            }
                            {propertyData.reservoir.isReservoir &&
                                <div className="flex flex-col gap-1">
                                    {propertyData.reservoir.type && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Type of Reservoir:</p>
                                        {propertyData.reservoir.type?.length > 1 ?
                                            <p>{propertyData.reservoir.type[0]}, {propertyData.reservoir.type[1]}</p> :
                                            <p>{propertyData.reservoir.type[0]}</p>
                                        }
                                    </div>}
                                    {propertyData.reservoir.type && propertyData.reservoir.capacityOfPrivateReservoir && propertyData.reservoir.unitOfCapacityForPrivateReservoir && propertyData.reservoir.type.includes('private') &&
                                        <div className="flex flex-row place-content-center gap-2">
                                            <p className="font-semibold">Capacity:</p>
                                            <p>{propertyData.reservoir.capacityOfPrivateReservoir} {propertyData.reservoir.unitOfCapacityForPrivateReservoir}</p>
                                        </div>
                                    }
                                </div>}
                        </td>

                        {/*irrigation system */}
                    </tr>

                    {/*irrigation system */}
                    {propertyData.irrigationSystem && propertyData.irrigationSystem.length > 0 &&
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Irrigation System</td>
                            <td className="flex flex-col place-items-center gap-0.5 flex-wrap pt-4 pb-4 text-center">
                                {propertyData.irrigationSystem.map(system => {
                                    return <p key={Math.random()}>{system}</p>
                                })}
                            </td>
                        </tr>}

                    {/*price */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                        <td className="pt-4 pb-4 flex flex-col place-items-center gap-2">
                            <div className="flex flex-row place-content-center gap-1">
                                <p className="font-semibold">Rs.</p>
                                <p>{propertyData.price}</p>
                            </div>
                        </td>
                    </tr>

                    {/*crops */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Crops</td>
                        <td className="pt-4 pb-4 flex flex-col place-items-center gap-0.5">
                            {propertyData.crops.map(crop => {
                                return <p key={Math.random()}>{crop}</p>
                            })}
                        </td>
                    </tr>

                    {/*road type */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Road type</td>
                        <td className="pt-4 pb-4 flex flex-col place-items-center gap-2">
                            <p>{propertyData.road.type}</p>
                            {propertyData.road.details && <p className="w-fit p-1 rounded mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{propertyData.road.details}</p>}
                        </td>
                    </tr>

                    {/*legal restrictions */}
                    <tr className="border-2 border-gray-300">
                        <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                        <td className="pt-4 pb-4  flex flex-col place-items-center gap-2">
                            {!propertyData.legalRestrictions.isLegalRestrictions && <p className="text-center">No</p>}
                            {propertyData.legalRestrictions.isLegalRestrictions && <>
                                <p className="text-center">Yes</p>
                                {propertyData.legalRestrictions.details && <p className="p-1 rounded mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 w-fit">{propertyData.legalRestrictions.details}</p>}
                            </>}
                        </td>
                    </tr>

                    {/*nearby town */}
                    {propertyData.nearbyTown && propertyData.nearbyTown.trim() &&
                        <tr className="border-2 border-gray-300">
                            <td className=" pt-4 pb-4 text-lg font-semibold text-center">Nearby town</td>
                            <td className="pt-4 pb-4 text-center">
                                <p>{propertyData.nearbyTown}</p>
                            </td>
                        </tr>}

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
export default AgriculturalPropertyTable