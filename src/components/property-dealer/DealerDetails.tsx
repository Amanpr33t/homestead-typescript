import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { capitalizeFirstLetterOfAString } from '../../utils/stringUtilityFunctions';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner';
import { IoMdArrowRoundBack } from 'react-icons/io';
import EditDealerDetailsModal from './EditDealerDetailsModal';
import AlertModal from '../AlertModal';
import { AlertType } from '../../dataTypes/alertType';

interface DealerDetailsType {
    firmName: string,
    propertyDealerName: string,
    firmLogoUrl?: string,
    about?: string,
    experience: number,
    address: {
        flatPlotHouseNumber: string,
        areaSectorVillage: string,
        landmark?: string,
        postalCode: number,
        city: string,
        state: string,
        district: string
    },
    gstNumber: number,
    reraNumber: number,
    email: string,
    contactNumber: number,
    uniqueId: string
}

const DealerDetails: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [dealerInfo, setDealerInfo] = useState<DealerDetailsType>()

    const [editDetails, setEditDetails] = useState<boolean>(false)

    const fetchDealerDetails = useCallback(async () => {
        setSpinner(true)
        setError(false)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/getDealerDetails`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                setDealerInfo(data.details)
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
            return
        }
    }, [authToken, navigate])

    useEffect(() => {
        fetchDealerDetails()
    }, [fetchDealerDetails])

    return (
        <Fragment>
            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    routeTo={alert.routeTo}
                    alertModalRemover={() => {
                        setAlert({
                            isAlertModal: false,
                            alertType: null,
                            alertMessage: null,
                            routeTo: null
                        })
                    }} />}

            {spinner && !error && <Spinner />}

            {error && !spinner &&
                < div className="fixed top-36 w-full flex flex-col place-items-center ">
                    <p>Some error occured</p>
                    <button type='button' className="text-red-500" onClick={fetchDealerDetails}>Try again</button>
                </div>}

            {!spinner && <div className='cursor-pointer pl-1.5 sm:px-5 md:px-10 lg:px-20 pt-20 mt-2 flex flex-row text-gray-600 hover:text-gray-800 w-fit' onClick={() => navigate('/property-dealer')}>
                <IoMdArrowRoundBack className='mt-1 mr-1' />
                Home
            </div>}

            {!spinner && !error && dealerInfo && <div className="mt-4 sm:mt-2 pb-8 border-b shadow-b border-gray-300 px-1.5 w-full sm:w-9/12 md:w-8/12 lg:w-7/12 mx-auto ">

                <p className="text-xl font-semibold text-gray-800 mb-5">Dealer information</p>
                <table className="">
                    <thead>
                        <tr>
                            <th className="bg-red-500 w-28 sm:w-36"></th>
                            <th ></th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Dealer Id</td>
                            <td className="py-3 text-gray-600 text-center">
                                {dealerInfo.uniqueId}
                            </td>
                        </tr>
                        {dealerInfo.firmLogoUrl && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Firm logo/ Dealer photo</td>
                            <td className="relative py-3 text-gray-600 flex justify-center">
                                <img className='w-32 h-32 rounded-full' src={dealerInfo.firmLogoUrl} alt='' />
                            </td>
                        </tr>}
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Firm name</td>
                            <td className="py-3 text-gray-600 text-center">
                                {capitalizeFirstLetterOfAString(dealerInfo?.firmName)}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Dealer name</td>
                            <td className="py-3 text-gray-600 text-center">
                                {capitalizeFirstLetterOfAString(dealerInfo?.propertyDealerName)}
                            </td>
                        </tr>
                        {dealerInfo.about && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">About</td>
                            <td className="py-3 text-gray-600 text-center">
                                {capitalizeFirstLetterOfAString(dealerInfo?.about)}
                            </td>
                        </tr>}
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Experience</td>
                            <td className="py-3 text-gray-600 text-center">
                                {dealerInfo.experience}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Address</td>
                            <td className="py-3 text-gray-600 text-center">
                                {capitalizeFirstLetterOfAString(dealerInfo.address.areaSectorVillage)}, {capitalizeFirstLetterOfAString(dealerInfo.address.flatPlotHouseNumber)},
                                {dealerInfo.address.landmark && ` near ${capitalizeFirstLetterOfAString(dealerInfo.address.landmark)},`} {capitalizeFirstLetterOfAString(dealerInfo.address.city)}, {capitalizeFirstLetterOfAString(dealerInfo.address.district)}, {capitalizeFirstLetterOfAString(dealerInfo.address.state)}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">GST number</td>
                            <td className="py-3 text-gray-600 text-center">
                                {dealerInfo.gstNumber}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">RERA number</td>
                            <td className="py-3 text-gray-600 text-center">
                                {dealerInfo.reraNumber}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Email</td>
                            <td className="py-3 text-gray-600 text-center">
                                {dealerInfo.email}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Contact number</td>
                            <td className="py-3 text-gray-600 text-center">
                                {dealerInfo.contactNumber}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex justify-center mt-5'>
                    <button className='border border-black py-3 px-5 rounded-lg bg-black text-white hover:bg-gray-100 hover:text-black' onClick={() => setEditDetails(true)}>Edit details</button>
                </div>
            </div>}

            {editDetails && dealerInfo?.firmLogoUrl && dealerInfo?.about &&
                <EditDealerDetailsModal
                    hideEditDetailsModal={() => setEditDetails(false)}
                    firmLogoUrl={dealerInfo?.firmLogoUrl}
                    about={dealerInfo?.about}
                    address={dealerInfo?.address}
                    alertSetter={(input) => setAlert(input)}
                />}
        </Fragment>
    );
};

export default DealerDetails
