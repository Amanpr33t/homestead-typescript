
import { Fragment, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from '../AlertModal'
import VerifyPropertyDealerBeforeAddingProperty from './VerifyPropertyDealerBeforeAddingProperty'
import { punjabDistricts, haryanaDistricts } from '../../utils/tehsilsAndDistricts/districts'
import PunjabTehsilsDropdown from "./tehsilsDropdown/Punjab"

//This component is a form used by a field agent to add a property dealer
function AgriculturalPropertyAddForm() {
    const navigate = useNavigate()
    const [propertyDealer, setPropertyDealer] = useState()
    const [isPropertyDealerAvailable, setIsPropertyDealerAvailable] = useState(false)
    const fieldAgentAuthToken = localStorage.getItem('homestead-field-agent-authToken') //This variable is the authentication token stored in local storage
    const propertyDealerSetterFunction = (dealer) => {
        setIsPropertyDealerAvailable(true)
        setPropertyDealer(dealer)
    }

    const [landSize, setLandSize] = useState('')
    const [landSizeUnit, setLandSizeUnit] = useState('')
    const [landSizeDetails, setLandSizeDetails] = useState('')
    const [landSizeError, setLandSizeError] = useState(false)

    const [state, setState] = useState('')
    const [stateError, setStateError] = useState(false)
    const [district, setDistrict] = useState('')
    const [districtError, setDistrictError] = useState(false)
    const [city, setCity] = useState('')
    const [tehsil, setTehsil] = useState('')
    const [village, setVillage] = useState('')

    const [agricultureLandImageUpload, setAgricultureLandImageUpload] = useState([])
    const [agriculturalLandImageFile, setAgriculturalLandImageFile] = useState([])
    const [agriculturalLandImageFileError, setAgriculturalLandImageFileError] = useState(false)

    const [contractImageUpload, setContractImageUpload] = useState([])
    const [contractImageFile, setContractImageFile] = useState([])
    const [contractImageFileError, setContractImageFileError] = useState(false)

    const [numberOfOwners, setNumberOfOwners] = useState(1)
    const [numberOfOwnersError, setNumberOfOwnersError] = useState(false)

    const [isCanal, setIsCanal] = useState(false)
    const [canalNameArray, setCanalNameArray] = useState([])
    const [newCanal, setNewCanal] = useState('')
    const [isRiver, setIsRiver] = useState(false)
    const [riverNameArray, setRiverNameArray] = useState([])
    const [newRiver, setNewRiver] = useState('')
    const [isTubeWell, setIsTubewell] = useState(false)
    const [tubewellDepthArray, setTubewellDepthArray] = useState([])
    const [newTubewell, setNewTubewell] = useState('')
    const [waterSourceError, setWaterSourceError] = useState(false)

    const [isReservoir, setIsReservoir] = useState()
    const [typeOfReservoir, setTypeOfReservoir] = useState([])
    const [unitOfCapacityForPrivateReservoir, setUnitOfCapacityForPrivateReservoir] = useState('')
    const [capacityOfPrivateReservoir, setCapacityOfPrivateReservoir] = useState('')
    const [reservoirError, setReservoirError] = useState(false)
    const [typeOfReservoirError, setTypeOfReservoirError] = useState(false)
    const [capacityAndUnitOfReservoirError, setCapacityAndUnitOfReservoirError] = useState(false)

    console.log(typeof landSize)

    const states = ['Chandigarh', 'Punjab', 'Haryana']

    const agriculturalLandImageHandler = (event) => {
        setAgriculturalLandImageFileError(false)
        setAgriculturalLandImageFile(array => [...array, URL.createObjectURL(event.target.files[0])])
        setAgricultureLandImageUpload(array => [...array, event.target.files[0]])
    }

    const contractImageHandler = (event) => {
        setContractImageFileError(false)
        setContractImageFile(array => [...array, URL.createObjectURL(event.target.files[0])])
        setContractImageUpload(array => [...array, event.target.files[0]])
    }

    const arrayOfTenNumbers = Array.apply(null, Array(11))
        .map(function (y, i) { return i })

    const arrayOfNumbersFromOneToTen = Array.apply(null, Array(10))
        .map(function (y, i) { return i + 1 })

    const formSubmit = (e) => {
        e.preventDefault()
        if (!district.trim()) {
            setDistrictError(true)
        }
        if (!state.trim()) {
            setStateError(true)
        }
        if (!landSize || +landSize === 0 || !landSizeUnit) {
            setLandSizeError(true)
        }
        if (!isCanal && !isRiver && !isTubeWell) {
            setWaterSourceError(true)
        }
        if (!canalNameArray.length || !riverNameArray.length || !tubewellDepthArray.length) {
            setWaterSourceError(true)
        }
        if (isReservoir === undefined) {
            setReservoirError(true)
        }
        if (isReservoir) {
            if (!typeOfReservoir.length) {
                setTypeOfReservoirError(true)
            } else if (typeOfReservoir.includes('private')) {
                if (!capacityOfPrivateReservoir || !unitOfCapacityForPrivateReservoir || +capacityOfPrivateReservoir === 0) {
                    setCapacityAndUnitOfReservoirError(true)
                }
            }
        }
    }

    return (
        <Fragment>
            {/*!isPropertyDealerAvailable && <VerifyPropertyDealerBeforeAddingProperty propertyDealerSetterFunction={propertyDealerSetterFunction} />*/}

            {<div className={`pl-2 pr-2 mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center`} >

                <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
                    <button type='button' className="bg-green-500 text-white font-semibold rounded-lg pl-2 pr-2 h-8" onClick={() => navigate('/field-agent')}>Home</button>
                </div>

                <p className="fixed w-full text-center top-28 sm:top-16 pl-4 pr-4 pb-4 sm:pt-4 bg-white  text-xl font-bold z-10">Add an agricultural property by filling the form</p>

                <form className="w-full min-h-screen mt-48 sm:mt-36 md:w-10/12 lg:w-8/12  h-fit pt-4 pb-4 flex flex-col rounded-lg border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

                    <div className="flex flex-col md:flex-row place-items-center md:place-content-center  gap-3 mb-10 ">
                        <p className="text-3xl font-bold text-gray-500 w-fit text-center">ABCD private limited</p>
                        <img className="w-20 h-auto " src={''} alt='' />
                    </div>

                    {/* contract*/}
                    <div className="flex flex-col p-2 bg-gray-100">
                        <div className="flex flex-row gap-5">
                            <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Upload images of contract between seller and dealer (optional)</label>
                            <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={contractImageHandler} onClick={e => e.target.value = null} />
                        </div>
                        {contractImageFile.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
                            {contractImageFile.map(image => {
                                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                                    <img className='relative w-auto h-60' src={image} alt="" />
                                    <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                                        const updatedState = contractImageFile.filter(file => file !== image)
                                        setContractImageFile(updatedState)
                                    }}>X</div>
                                </div>
                            })}
                        </div>}
                        {contractImageFileError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
                    </div>

                    {/*location */}
                    <div className="flex flex-col p-2">
                        <p className="text-xl font-semibold text-gray-500" htmlFor="location">Property location</p>
                        <div className="flex flex-col place-self-center w-11/12 gap-2">

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="village">Village</label>
                                <input type="text" id="village" name="village"
                                    className='border-2 border-gray-500  p-1 rounded-lg' autoComplete="new-password" value={village} onChange={e => {
                                        setVillage(e.target.value.toUpperCase())
                                    }} />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="city">City/Town</label>
                                <input type="text" id="city" name="city"
                                    className='border-2 border-gray-500 p-1 rounded-lg' autoComplete="new-password" value={city} onChange={e => {
                                        setCity(e.target.value.toUpperCase())
                                    }} />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="state">State:</label>
                                <select className='border-2 border-gray-500 p-1 rounded-lg' name="state" id="state" value={state} onChange={e => {
                                    setStateError(false)
                                    setState(e.target.value.toUpperCase())
                                    setDistrict('')
                                    setTehsil('')
                                }}>
                                    <option className="text-gray-500 font-semibold" value="" disabled>Select a state:</option>
                                    {states.map(state => {
                                        return <option key={state} value={state}>{state}</option>
                                    })}
                                </select>
                                {stateError && <p className="text-red-500">Select a state</p>}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="district">District:</label>
                                <select className={`border-2 border-gray-500 p-1 rounded-lg`} name="district" id="district" value={district} disabled={state ? false : true} onChange={e => {
                                    setDistrictError(false)
                                    setDistrict(e.target.value.toUpperCase())
                                    setTehsil('')
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a district</option>
                                    {state === 'Punjab' && punjabDistricts.map(district => {
                                        return <option key={district} value={district}>{district}</option>
                                    })}
                                    {state === 'Chandigarh' &&
                                        <option value="Chandigarh">Chandigarh</option>}
                                </select>
                                {districtError && <p className="text-red-500">Select a district</p>}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="state">Tehsil</label>
                                <select className='border-2 border-gray-500 p-1 rounded-lg' name="state" id="state" disabled={state && district ? false : true} value={tehsil} onChange={e => {
                                    setTehsil(e.target.value.toUpperCase())
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a tehsil</option>
                                    {state === 'Chandigarh' && district === 'Chandigarh' &&
                                        <option value='Chandigarh'>Chandigarh</option>}
                                    {state === 'Punjab' && <>
                                        <PunjabTehsilsDropdown district={district} />
                                    </>}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Number of owners*/}
                    <div className="flex flex-col p-2 bg-gray-100">
                        {numberOfOwnersError && <p className="text-red-500">Select a value</p>}
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500" htmlFor="owners">Number of owners</label>
                            <select className="border-2 border-gray-400 p-1 rounded-lg cursor-pointer bg-white text-center" name="owners" id="owners" value={numberOfOwners} onChange={e => {
                                setNumberOfOwners(e.target.value)
                            }}>
                                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
                            </select>
                        </div>
                    </div>

                    {/*land size*/}
                    <div className="flex flex-col p-2 ">
                        {landSizeError && <p className="text-red-500 -mt-1">Provide land size</p>}
                        <div className="flex flex-row gap-5 sm:gap-16">
                            <label className="text-lg font-bold text-gray-500 whitespace-nowrap" htmlFor="size">Land size</label>

                            <div className="flex flex-col gap-5">
                                <div className="flex flex-row gap-1">
                                    <input id="land-size" type="number" name='land-size' className="border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-24" placeholder="Size" value={landSize} onChange={e => {
                                        setLandSizeError(false)
                                        setLandSize(e.target.value)
                                    }} />
                                    <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center h-fit " name="unit-dropdown" id="unit-dropdown" value={landSizeUnit} onChange={e => {
                                        setLandSizeError(false)
                                        setLandSizeUnit(e.target.value)
                                    }}>
                                        <option value='' disabled>Select unit</option>
                                        <option value='metre-square'>Metre Square</option>
                                        <option value='acre' >Acre</option>
                                    </select>
                                </div>
                                <textarea className="border-2 border-gray-400 rounded-lg h-20 sm:w-80 p-1 resize-none" id="size" name="size" autoCorrect="on" autoComplete="new-password" placeholder="Add details regarding land size" value={landSizeDetails} onChange={e => {
                                    setLandSizeDetails(e.target.value)
                                }} />
                            </div>
                        </div>
                    </div>

                    {/*water source */}
                    <div className="p-2 bg-gray-100">
                        {waterSourceError && <p className="text-red-500">Provide atleast one water source</p>}
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                            <p className="text-xl font-semibold text-gray-500">Water source</p>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
                                <div className="flex flex-col">
                                    <div>
                                        <input className="mr-1 cursor-pointer" type="checkbox" id="canal" name="canal" onChange={e => {
                                            setWaterSourceError(false)
                                            if (e.target.checked) {
                                                setIsCanal(true)
                                            } else {
                                                setIsCanal(false)
                                                setCanalNameArray([])
                                                setNewCanal('')
                                            }
                                        }} />
                                        <label htmlFor="canal">Canal</label>
                                    </div>
                                    {isCanal && <table className="table-auto bg-white border border-gray-300 ml-5 sm:ml-0">
                                        <thead>
                                            <tr className="border border-gray-300">
                                                <th className="pl-1 pr-1">Canal name</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border border-gray-300 text-center ">
                                            {canalNameArray.length > 0 && canalNameArray.map((canal) => {
                                                return <tr className="border border-gray-300">
                                                    <td className="pt-1 pb-">{canal}</td>
                                                </tr>
                                            })}
                                            <tr className="border border-gray-300">
                                                <td className="flex flex-row place-content-center p-1">
                                                    <input type="text" id="depth" name="depth"
                                                        className='w-28 border border-gray-500 pl-1 pr-1' autoComplete="new-password" value={newCanal} onChange={e => setNewCanal(e.target.value)} />
                                                    <button className="pl-1.5 pr-1.5 bg-gray-700 text-white text-xl font-semibold" onClick={() => {
                                                        setCanalNameArray(canalNameArray => [...canalNameArray, newCanal])
                                                        setNewCanal('')
                                                    }}>+</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>}
                                </div>

                                <div className="flex flex-col">
                                    <div>
                                        <input className="mr-1 cursor-pointer" type="checkbox" id="river" name="river" onChange={e => {
                                            setWaterSourceError(false)
                                            if (e.target.checked) {
                                                setIsRiver(true)
                                            } else {
                                                setIsRiver(false)
                                                setRiverNameArray([])
                                                setNewRiver('')
                                            }
                                        }} />
                                        <label htmlFor="river">River</label>
                                    </div>
                                    {isRiver && <table className="table-auto bg-white border border-gray-300 ml-5 sm:ml-0">
                                        <thead>
                                            <tr className="border border-gray-300">
                                                <th className="pl-1 pr-1">River name</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border border-gray-300 text-center ">
                                            {riverNameArray.length > 0 && riverNameArray.map((river) => {
                                                return <tr className="border border-gray-300">
                                                    <td className="pt-1 pb-">{river}</td>
                                                </tr>
                                            })}
                                            <tr className="border border-gray-300">
                                                <td className="flex flex-row place-content-center p-1">
                                                    <input type="text" id="depth" name="depth"
                                                        className='w-24 border border-gray-500 pl-1 pr-1' autoComplete="new-password" value={newRiver} onChange={e => setNewRiver(e.target.value)} />
                                                    <button className="pl-1.5 pr-1.5 bg-gray-700 text-white text-xl font-semibold" onClick={() => {
                                                        setRiverNameArray(riverNameArray => [...riverNameArray, newRiver])
                                                        setNewRiver('')
                                                    }}>+</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>}
                                </div>

                                <div className="">
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="tubewell" name="tubewell" value="tubewell" onChange={e => {
                                        setWaterSourceError(false)
                                        if (e.target.checked) {
                                            setIsTubewell(true)
                                        } else {
                                            setIsTubewell(false)
                                            setTubewellDepthArray([])
                                            setNewTubewell('')
                                        }
                                    }} />
                                    <label htmlFor="tubewell">Tubewell</label>
                                    <div className="">
                                        {isTubeWell && <table className="table-auto bg-white border border-gray-300 ml-5 sm:ml-0">
                                            <thead>
                                                <tr className="border border-gray-300">
                                                    <th className="pl-1 pr-1">Depth (feet)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="border border-gray-300 text-center ">
                                                {tubewellDepthArray.length > 0 && tubewellDepthArray.map((tubewell) => {
                                                    return <tr className="border border-gray-300">
                                                        <td className="pt-1 pb-">{tubewell}</td>
                                                    </tr>
                                                })}
                                                <tr className="border border-gray-300">
                                                    <td className="flex flex-row place-content-center pt-1 pb-1">
                                                        <input type="number" id="depth" name="depth"
                                                            className='w-12 border border-gray-500 text-center pl-1 pr-1' autoComplete="new-password" value={newTubewell} onChange={e => setNewTubewell(e.target.value)} />
                                                        <button className="pl-1.5 pr-1.5 bg-gray-700 text-white text-xl font-semibold" onClick={() => {
                                                            setTubewellDepthArray(tubewellDepthArray => [...tubewellDepthArray, newTubewell])
                                                            setNewTubewell('')
                                                        }}>+</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* reservoir*/}
                    <div className="p-2">
                        {reservoirError && <p className="text-red-500 -mt-1">Select an option</p>}
                        <div className="flex flex-col sm:flex-row  sm:gap-10 lg:gap-16 mb-2">
                            <p className="text-xl font-semibold text-gray-500">Does the land have access to a reservoir</p>
                            <div className="flex flex-row place-content-center gap-4 pt-1">
                                <div className="flex flex-row h-fit">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex flex-row">
                                            <input className="mr-1 cursor-pointer" type="radio" id="yes-reservoir" name="reservoir" onChange={e => {
                                                setReservoirError(false)
                                                setTypeOfReservoirError(false)
                                                setCapacityAndUnitOfReservoirError(false)
                                                setTypeOfReservoir([])
                                                if (e.target.checked) {
                                                    setIsReservoir(true)
                                                } else {
                                                    setIsReservoir(false)
                                                }
                                            }} />
                                            <label htmlFor="yes-reservoir">Yes</label>
                                        </div>

                                        {isReservoir && <>
                                            <div className="bg-gray-200 p-2 rounded w-fit">
                                                <p className="font-semibold mb-1">Type of reservoir</p>
                                                <div className="flex flex-row h-fit">
                                                    <input className="mr-1 cursor-pointer" type="checkbox" id="public-reservoir" name="public-reservoir" onChange={e => {
                                                        setTypeOfReservoirError(false)
                                                        if (e.target.checked) {
                                                            setTypeOfReservoir(array => [...array, 'public'])
                                                        } else {
                                                            if (typeOfReservoir.length === 1) {
                                                                setTypeOfReservoir([])
                                                            } else {
                                                                setTypeOfReservoir(['private'])
                                                            }
                                                        }
                                                    }} />
                                                    <label htmlFor="public-reservoir">Public Reservoir</label>
                                                </div>
                                                <div className="flex flex-row h-fit">
                                                    <input className="mr-1 cursor-pointer" type="checkbox" id="reservoir" name="private-reservoir" onChange={e => {
                                                        setTypeOfReservoirError(false)
                                                        if (e.target.checked) {
                                                            setCapacityOfPrivateReservoir('')
                                                            setUnitOfCapacityForPrivateReservoir('')
                                                            setTypeOfReservoir(array => [...array, 'private'])
                                                        } else {
                                                            if (typeOfReservoir.length === 1) {
                                                                setTypeOfReservoir([])
                                                            } else {
                                                                setTypeOfReservoir(['public'])
                                                            }
                                                        }
                                                    }} />
                                                    <label htmlFor="private-reservoir">Private Reservoir</label>
                                                </div>
                                            </div>
                                            {typeOfReservoirError && <p className="text-red-500 -mt-1">Select atleast one type</p>}

                                            {typeOfReservoir.length > 0 && typeOfReservoir.includes('private') &&
                                                <><div className="bg-gray-200 p-2 rounded flex flex-col">
                                                    <p className="font-semibold mb-1">Capacity of private reservoir</p>
                                                    <div className="flex flex-row gap-1">
                                                        <input id="resercoir-capacity" type="number" name='reservoir-capacity' className="border-2 border-gray-400 rounded bg-white w-24 p-1" min="0" placeholder="Capacity" value={capacityOfPrivateReservoir} onChange={e => {
                                                            setCapacityAndUnitOfReservoirError(false)
                                                            setCapacityOfPrivateReservoir(e.target.value)
                                                        }} />
                                                        <select className="border-2 border-gray-400  rounded cursor-pointer bg-white text-center h-fit p-1 pb-1.5" name="reservoir-capacity-dropdown" id="reservoir-capacity-dropdown" value={unitOfCapacityForPrivateReservoir} onChange={e => {
                                                            setCapacityAndUnitOfReservoirError(false)
                                                            setUnitOfCapacityForPrivateReservoir(e.target.value)
                                                        }}>
                                                            <option value='' disabled>Select a unit</option>
                                                            <option value='cusec'>Cusec</option>
                                                            <option value='litre' >Litre</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                    {capacityAndUnitOfReservoirError && <p className="text-red-500 -mt-1">Provide capacity and select a unit</p>}
                                                </>}</>}
                                    </div>
                                </div>

                                <div className="flex flex-row h-fit">
                                    <input className="mr-1 cursor-pointer" type="radio" id="no-reservoir" name="reservoir" onChange={e => {
                                        setReservoirError(false)
                                        if (e.target.checked) {
                                            setIsReservoir(false)
                                        } else {
                                            setIsReservoir(true)
                                        }
                                    }} />
                                    <label htmlFor="no-reservoir">No</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* irrigation system*/}
                    <div className="p-2 bg-gray-100">
                        <p className="text-red-500">Select atleast one option</p>
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                            <p className="text-xl font-semibold text-gray-500">Irrigation system</p>
                            <div className="flex flex-col gap-1.5 mt-1">
                                <div >
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="sprinkler" name="sprinkler" value="sprinkler" />
                                    <label htmlFor="sprinkler">Sprinkler</label>
                                </div>

                                <div >
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="drip" name="drip" value="drip" />
                                    <label htmlFor="drip">Drip</label>
                                </div>

                                <div className="flex content-start">
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="underground-pipeline" name="underground-pipeline" value="underground-pipeline" />
                                    <label htmlFor="underground-pipeline">Underground pipelines</label>
                                </div>

                                <div >
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="none" name="none" value="none" />
                                    <label htmlFor="none">None of the above</label>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/*crop */}
                    <div className="p-2 ">
                        <p className="text-red-500">Select atleast one property type</p>
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                            <p className="text-xl font-semibold text-gray-500">Suitable for crops</p>
                            <div className="flex flex-col gap-1.5 mt-1">
                                <div >
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="rice" name="rice" value="rice" />
                                    <label htmlFor="rice">Rice</label>
                                </div>

                                <div >
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="wheat" name="wheat" value="wheat" />
                                    <label htmlFor="wheat">Wheat</label>
                                </div>

                                <div >
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="maize" name="maize" value="maize" />
                                    <label htmlFor="maize">Maize</label>
                                </div>

                                <div >
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="cotton" name="cotton" value="cotton" />
                                    <label htmlFor="cotton">Cotton</label>
                                </div>
                                <div className="flex flex-row gap-1">
                                    <p className='w-28 border-2 border-gray-500  p-1 rounded'  >Bajra</p>
                                    <button className="pl-2 pr-2 rounded bg-red-400 text-white text-xl font-semibold">X</button>
                                </div>
                                <div className="flex flex-row gap-1">
                                    <input type="text" id="other-1" name="other-1"
                                        className='w-28 border-2 border-gray-500  p-1 rounded' autoComplete="new-password" placeholder="crop" />
                                    <button className="pl-2 pr-2 rounded bg-gray-800 text-white text-xl font-semibold">+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*road type */}
                    <div className="flex flex-col p-2 bg-gray-100">
                        <p className="text-red-500 -mt-1">Select atleast one road type</p>
                        <div className="flex flex-col gap-5 sm:flex-row">
                            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                                <p className="text-xl font-semibold text-gray-500">Road connectivity</p>
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <div >
                                        <input className="mr-1 cursor-pointer" type="radio" id="kutcha-road" name="road" value="kutcha-road" />
                                        <label htmlFor="road">Kutcha road</label>
                                    </div>

                                    <div>
                                        <input className="mr-1 cursor-pointer" type="radio" id="village-road" name="road" value="village road" />
                                        <label htmlFor="road">Village road</label>
                                    </div>

                                    <div>
                                        <input className="mr-1 cursor-pointer" type="radio" id="district-road" name="road" value="district road" />
                                        <label htmlFor="road">District road</label>
                                    </div>

                                    <div>
                                        <input className="mr-1 cursor-pointer" type="radio" id="state-highway" name="road" value="state highway" />
                                        <label htmlFor="road">State highway</label>
                                    </div>

                                    <div>
                                        <input className="mr-1 cursor-pointer" type="radio" id="national-highway" name="road" value="national highway" />
                                        <label htmlFor="road">National highway</label>
                                    </div>

                                </div>
                            </div>
                            <div className="text-center">
                                <textarea className="border-2 border-gray-400 p-1 rounded-lg h-20 sm:h-28  w-60 md:w-68 lg:w-80 resize-none" id="road-remark" name="road-remark" autoCorrect="on" autoComplete="new-password" placeholder="Add details about road here" />
                            </div>
                        </div>
                    </div>





                    {/*laws */}
                    <div className="p-2  flex flex-col">
                        <p className="text-red-500">Select atleast one property type</p>
                        <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
                            <p className="text-xl font-semibold text-gray-500 mb-2">Is the land under any restrictions under any laws</p>
                            <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                <div className="flex flex-row h-fit">
                                    <input className="mr-1 cursor-pointer" type="radio" id="yes-restrictions" name="restrictions" value="yes-restrictions" />
                                    <label htmlFor="yes-restrictions">Yes</label>
                                </div>

                                <div className="flex flex-row h-fit">
                                    <input className=" mr-1 cursor-pointer" type="radio" id="no-restrictions" name="restrictions" value="no-restrictions" />
                                    <label htmlFor="no-restrictions">No</label>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <textarea className="border-2 border-gray-400 rounded-lg h-20 w-80 p-1 resize-none" id="restrictions" name="restrictions" autoCorrect="on" autoComplete="new-password" placeholder="Add details about restrictions" />
                        </div>
                    </div>

                    {/*elctricity connecitiosn */}
                    <div className="flex flex-col p-2 bg-gray-100">
                        <p className="text-red-500">Select atleast one property type</p>
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500 w-64 sm:w-fit" htmlFor="tubewell-connections">Number of tubewell electricity connections</label>
                            <select className="border-2 border-gray-400 p-1 rounded-lg cursor-pointer bg-white text-center h-fit mt-2 sm:mt-0 -ml-12 sm:ml-0" name="tubewell-connections" id="tubewell-connections" >
                                {arrayOfTenNumbers.map(number => <option key={number} value={number}>{number}</option>)}
                            </select>
                        </div>
                    </div>



                    {/* tubewells*/}
                    <div className="flex flex-col p-2 ">
                        <p className="text-red-500">Select atleast one property type</p>
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500" htmlFor="tubewell">Number of tubewells</label>
                            <select className="border-2 border-gray-400 p-1 rounded-lg cursor-pointer bg-white text-center" name="tubewell" id="tubewell" >
                                {arrayOfTenNumbers.map(number => <option key={number} value={number}>{number}</option>)}
                            </select>
                        </div>
                    </div>


                    {/*nearby town */}
                    <div className="flex flex-col p-2 bg-gray-100">
                        <p className="text-red-500">Select atleast one property type</p>
                        <div className="flex flex-col sm:flex-row sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500 pb-1" htmlFor="nearby-town">Nearby town</label>
                            <input type="text" id="nearby-town" name="nearby-town"
                                className='sm:w-72 border-2 border-gray-500  p-1 rounded-lg' autoComplete="new-password" />
                        </div>
                    </div>

                    {/*images */}
                    <div className="flex flex-col p-2">
                        <div className="flex flex-row gap-5">
                            <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Add property image</label>
                            <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={agriculturalLandImageHandler} onClick={e => e.target.value = null} />
                        </div>
                        {agriculturalLandImageFile.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
                            {agriculturalLandImageFile.map(image => {
                                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                                    <img className='relative w-auto h-60' src={image} alt="" />
                                    <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                                        const updatedState = agriculturalLandImageFile.filter(file => file !== image)
                                        setAgriculturalLandImageFile(updatedState)
                                    }}>X</div>
                                </div>
                            })}
                        </div>}
                        {agriculturalLandImageFileError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
                    </div>







                    <div className="flex justify-center mt-4 p-2">
                        <button type='submit' className="w-full bg-green-500 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">Save</button>
                    </div>

                </form>

            </div >}
        </Fragment >
    )
}
export default AgriculturalPropertyAddForm