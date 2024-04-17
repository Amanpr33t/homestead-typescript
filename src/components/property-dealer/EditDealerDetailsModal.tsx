import React, { ChangeEvent, Fragment, useState } from 'react';
import { capitalizeFirstLetterOfAString } from '../../utils/stringUtilityFunctions';
import { useNavigate } from 'react-router-dom';
import { AlertType } from '../../dataTypes/alertType';
import { IoClose } from 'react-icons/io5';
import useUploadImages from '../../custom-hooks/useImageUpload';
import { punjabDistricts } from '../../utils/tehsilsAndDistricts/districts';


interface PropsType {
    hideEditDetailsModal: () => void,
    firmLogoUrl: string,
    about: string,
    address: {
        flatPlotHouseNumber: string,
        areaSectorVillage: string,
        landmark?: string,
        postalCode: number,
        city: string,
        state: string,
        district: string
    },
    alertSetter: (input: AlertType) => void
}

const EditDealerDetailsModal: React.FC<PropsType> = ({ hideEditDetailsModal, firmLogoUrl, about, address, alertSetter }) => {
    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")
    const navigate = useNavigate()

    const [spinner, setSpinner] = useState<boolean>(false)

    const { uploadImages } = useUploadImages()

    const [flatPlotHouseNumber, setFlatPlotHouseNumber] = useState<string>(address.flatPlotHouseNumber) //Used td store flat or house number
    const [flatPlotHouseNumberError, setFlatPlotHouseNumberError] = useState<boolean>(false) //used to show error when flat or house number is not provided

    const [areaSectorVillage, setAreaSectorVillage] = useState<string>(address.areaSectorVillage) //Used to store name of area or village
    const [areaSectorVillageError, setAreaSectorVillageError] = useState<boolean>(false) // Used to show error when area is not provided

    const [landmark, setLandmark] = useState<string>(address.landmark || '') //Used to set landmark

    const [postalCode, setPostalCode] = useState<number | ''>(address.postalCode) //Used to set postal code
    const [postalCodeError, setPostalCodeError] = useState<boolean>(false) //Used to show error when no postal code is provided or postal code is more than 6 characters

    const [city, setCity] = useState<string>(address.city) //Used to set city
    const [cityError, setCityError] = useState<boolean>(false) //Used to show error when no city is provided 

    const [district, setDistrict] = useState<string>(address.district) //Used to set district
    const [districtError, setDistrictError] = useState<boolean>(false) //Used to show error when no district is provided

    const [state, setState] = useState<string>(address.state) //Used to set state
    const [stateError, setStateError] = useState<boolean>(false) //Used to set error when no state is provided
    const states: string[] = ['chandigarh', 'punjab']

    const [dealerAbout, setDealerAbout] = useState<string>(about) //Used to set about

    const [firmLogoImageUpload, setFirmLogoImageUpload] = useState<File | null>(null) //used to store the entire image object to be set to the database
    const [firmLogoImageFile, setFirmLogoImageFile] = useState<string | null>(null) //Used to store image file string

    const imageChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        // Assuming the input accepts only a single file
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            //setFirmLogoImageFileError(false);
            setFirmLogoImageFile(URL.createObjectURL(selectedFile));
            setFirmLogoImageUpload(selectedFile);
        }
    }

    const uploadImagesFunction = async () => {
        try {
            setSpinner(true)
            const uploadedLogoUrl: string[] = await uploadImages([{ upload: firmLogoImageUpload as File, file: '' }])

            if (uploadedLogoUrl) {
                if (uploadedLogoUrl.length === 1) {
                    await editDealerDetails(uploadedLogoUrl[0])
                } else {
                    throw new Error('some error occured')
                }
            }
        } catch (error) {
            setSpinner(false)
            alertSetter({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured',
                routeTo: null
            })
            return
        }
    }

    const editDealerDetails = async (logoUrl?: string) => {
        if (!flatPlotHouseNumber || !areaSectorVillage.trim() || postalCode.toString().length !== 6 || !city.trim() || !state.trim() || !district.trim()) {
            if (!flatPlotHouseNumber) {
                setFlatPlotHouseNumberError(true)
            }
            if (!areaSectorVillage.trim()) {
                setAreaSectorVillageError(true)
            }
            if (postalCode.toString().length !== 6) {
                setPostalCodeError(true)
            }
            if (!city.trim()) {
                setCityError(true)
            }
            if (!state.trim()) {
                setStateError(true)
            }
            if (!district.trim()) {
                setDistrictError(true)
            }
            return
        }
        setSpinner(true)
        let requestBody: any = {
            about: dealerAbout,
            address: {
                flatPlotHouseNumber,
                areaSectorVillage,
                landmark,
                postalCode,
                city,
                state,
                district
            }
        }
        if (logoUrl) {
            requestBody = {
                ...requestBody,
                firmLogoUrl: logoUrl
            }
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/editDealerDetails`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(requestBody)
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                alertSetter({
                    isAlertModal: true,
                    alertMessage: 'Details have been updated successfully',
                    alertType: 'success',
                    routeTo: '/property-dealer'
                })
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            alertSetter({
                isAlertModal: true,
                alertMessage: 'Some error occured. Try again later.',
                alertType: 'warning',
                routeTo: null
            })
            hideEditDetailsModal()
            setSpinner(false)
            return
        }
    }

    return (
        <Fragment>

            <div className="w-full h-screen fixed top-0 z-40 flex justify-center bg-black bg-opacity-70 backdrop-blur-lg py-5 " onClick={hideEditDetailsModal}>

                <form className="relative max-h-full overflow-y-auto w-11/12 sm:w-10/12 md:w-10/12 lg:w-8/12  h-fit p-4 flex flex-col gap-3 rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={(e) => e.stopPropagation()} onSubmit={(e) => {
                    e.preventDefault()
                    if (firmLogoImageUpload) {
                        uploadImagesFunction()
                    } else {
                        editDealerDetails()
                    }
                }}>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={hideEditDetailsModal}>
                        <IoClose className="text-3xl" />
                    </button>

                    {/*address */}
                    <div className="flex flex-col mt-3 mb-1.5">
                        <p className="text-lg font-semibold">Office address</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-2 px-3">
                            {/*Flat number */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" text-gray-600 font-semibold" htmlFor="number">Flat, House no., Building, Company</label>
                                </div>
                                <input
                                    type="text"
                                    id="number"
                                    name="number"
                                    className={`border ${flatPlotHouseNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    autoComplete="new-password"
                                    value={flatPlotHouseNumber}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setFlatPlotHouseNumber(e.target.value)
                                        setFlatPlotHouseNumberError(false)
                                    }} />
                            </div>

                            {/*Area, Street, Sector, Village */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="text-gray-600 font-semibold" htmlFor="area">Area, Street, Sector, Village</label>
                                </div>
                                <input
                                    type="text"
                                    id="area"
                                    name="area"
                                    className={`border ${areaSectorVillageError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    autoComplete="new-password"
                                    value={areaSectorVillage}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setAreaSectorVillage(e.target.value)
                                        setAreaSectorVillageError(false)
                                    }} />
                            </div>

                            {/*landmark */}
                            <div className="flex flex-col">
                                <label className=" text-gray-600 font-semibold" htmlFor="landmark">Landmark</label>
                                <input
                                    type="text"
                                    id="landmark"
                                    name="landmark"
                                    className='border border-gray-400 p-1 rounded'
                                    autoComplete="new-password"
                                    placeholder="E.g. near apollo hospital"
                                    value={landmark}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setLandmark(e.target.value)
                                    }} />
                            </div>

                            {/*pincode */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" text-gray-600 font-semibold" htmlFor="pincode">Pincode</label>
                                </div>
                                <input
                                    type="number"
                                    id="pincode"
                                    name="pincode"
                                    className={`border ${postalCodeError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    autoComplete="new-password"
                                    placeholder="6 digits [0-9] PIN code"
                                    min={100000}
                                    max={999999}
                                    value={postalCode}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        const parsedValue = parseInt(e.target.value, 10); // Parse the input as an integer
                                        if (!isNaN(parsedValue)) {
                                            setPostalCode(parsedValue)
                                            setPostalCodeError(false)
                                        } else {
                                            setPostalCode('')
                                        }
                                    }} />
                            </div>

                            {/*town/city */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" text-gray-600 font-semibold" htmlFor="town">Town/City</label>
                                </div>
                                <input
                                    type="text"
                                    id="town"
                                    name="town"
                                    className={`border ${cityError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    autoComplete="new-password"
                                    value={city}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setCity(e.target.value)
                                        setCityError(false)
                                    }} />
                            </div>

                            {/*state */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="text-gray-600 font-semibold" htmlFor="state">State</label>
                                </div>
                                <select
                                    className={`border ${stateError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    name="state"
                                    id="state"
                                    value={state}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setState(e.target.value)
                                        setStateError(false)
                                        setDistrict('')
                                        setDistrictError(false)
                                    }}>
                                    <option className="text-gray-600 font-semibold" value="" disabled>Select a state</option>
                                    {states.map(state => {
                                        return <option key={state} value={state}>
                                            {capitalizeFirstLetterOfAString(state)}
                                        </option>
                                    })}
                                </select>
                            </div>

                            {/*district */}
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" text-gray-600 font-semibold" htmlFor="district-chandigarh">District</label>
                                </div>
                                <select
                                    className={`border ${districtError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`}
                                    name="district-chandigarh"
                                    id="district-chandigarh"
                                    value={district}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setDistrict(e.target.value)
                                        setDistrictError(false)
                                    }}>
                                    <option className="text-gray-600 font-semibold" value="" disabled>Select a district</option>
                                    {state.toLowerCase() === 'chandigarh' && <option value="chandigarh">Chandigarh</option>}
                                    {state.toLowerCase() === 'punjab' &&
                                        punjabDistricts.map(district => {
                                            return <option key={district} value={district}>
                                                {capitalizeFirstLetterOfAString(district)}
                                            </option>
                                        })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/*about*/}
                    <div className="flex flex-col mb-1.5 ">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="about">About</label>
                        <textarea
                            className={`border border-gray-400 p-1 rounded  w-full  resize-none`}
                            rows={5}
                            autoCorrect="on"
                            autoComplete="new-password"
                            id="about"
                            name="about"
                            value={dealerAbout}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                setDealerAbout(e.target.value)
                            }} />
                    </div>

                    {/*add firm logo*/}
                    <div className="flex flex-col gap-2 mt-3">
                        <div className='flex flex-col md:flex-row gap-3 '>
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <label className="text-lg font-semibold" htmlFor="image">Firm logo/ Dealer photo</label>
                            </div>

                            <input
                                type='file'
                                className='text-transparent'
                                placeholder="image"
                                accept="image/png, image/jpeg"
                                name='image'
                                onChange={imageChangeHandler} />
                            {firmLogoImageFile && <div className='flex justify-center'>
                                <img className='w-28 h-28 border rounded-full' src={firmLogoImageFile} alt="" />
                            </div>}
                            {firmLogoUrl && !firmLogoImageFile && <div className='flex justify-center'>
                                <img className='w-28 h-28 border rounded-full' src={firmLogoUrl} alt="" />
                            </div>}
                        </div>
                    </div>

                    <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                        <button
                            type='submit'
                            className={`w-40 h-12 bg-red-500  text-white font-medium rounded  flex justify-center items-center gap-1  ${spinner ? 'cursor-auto' : 'hover:bg-red-600 cursor-pointer'}`}
                            disabled={spinner}
                        >
                            {spinner ? (
                                <div className=" absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                            ) : (
                                'Save details'
                            )}
                        </button>
                    </div>
                </form>
            </div>

        </Fragment>
    );
};

export default EditDealerDetailsModal
