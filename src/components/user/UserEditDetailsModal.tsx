import React, { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { states } from '../../utils/states';
import { capitalizeFirstLetterOfAString } from '../../utils/stringUtilityFunctions';
import { chooseDistrictsForState } from '../../utils/chooseDistrictsForState';
import { AlertType } from '../../dataTypes/alertType';
import Spinner from '../Spinner';
import { MdOutlineEmail } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';

interface PropsType {
    modalReset: () => void,
    alertSetter: (input: AlertType) => void,
    alert: AlertType
}

const UserEditDetailsModal: React.FC<PropsType> = ({
    modalReset,
    alertSetter,
    alert
}) => {
    const [spinner, setSpinner] = useState<boolean>(true)

    const authToken: string | null = localStorage.getItem("homestead-user-authToken")

    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState(false);

    const [district, setDistrict] = useState<string>('');
    const [districtError, setDistrictError] = useState<boolean>(false)

    const [state, setState] = useState<string>('');
    const [stateError, setStateError] = useState<boolean>(false)

    const [email, setEmail] = useState<string>('')
    const [contactNumber, setContactNumber] = useState<number | ''>('')

    const fetchUserDetails = useCallback(async () => {
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/fetchUserDetials`, {
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
                setDistrict(data.district)
                setState(data.state)
                setEmail(data.email)
                setContactNumber(data.contactNumber)
                setName(data.name)
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem('homestead-user-authToken')
                window.location.reload()
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            alertSetter({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured. Try again later.',
                routeTo: null
            })
            modalReset()
            return
        }
    }, [authToken, alertSetter, modalReset])

    useEffect(() => {
        fetchUserDetails()
    }, [fetchUserDetails])

    //This function is used to submit the form once the save button is clicked
    const formSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!district || !state || !name.trim()) {
            if (!state.trim()) {
                setStateError(true)
            }
            if (!district.trim()) {
                setDistrictError(true)
            }
            if (!name.trim()) {
                setNameError(true)
            }
            return
        }
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/editCustomerDetails`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name,
                    state,
                    district
                }),
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
                alertSetter({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'User details have been updated',
                    routeTo: null
                })
                modalReset()
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem('homestead-user-authToken')
                window.location.reload()
            } else {
                throw new Error('Some error occured')
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

    return (
        <Fragment>
            {spinner && <Spinner />}

            <div className={`w-full h-screen fixed top-0 left-0 z-40 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur py-5 ${alert.isAlertModal && 'transform translate-x-full'}`} onClick={() => {
                modalReset()
            }}>

                <form className="relative max-h-full overflow-y-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-6/12 h-fit py-4 px-4 sm:px-10 flex flex-col gap-5 rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={e => {
                    e.stopPropagation()
                }} onSubmit={formSubmit}>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => {
                        modalReset()
                    }}>
                        <IoClose className="text-3xl" />
                    </button>

                    <p className='text-center text-xl font-bold text-gray-700'>Edit user details</p>

                    <div className='relative'>
                        <MdOutlineEmail className='absolute left-2 top-2 text-2xl text-gray-500' />
                        <input
                            type="email"
                            placeholder='Email address'
                            autoComplete='new-password'
                            className={`w-full border border-gray-300 rounded-md pl-10 pr-2 py-2 text-gray-700 $border-gray-300 cursor-not-allowed`}
                            value={email}
                            disabled={true}
                        />
                    </div>

                    <div className='relative'>
                        <div className='flex flex-row gap-2 items-center absolute left-2 top-2'>
                            <FaPhoneAlt className=' text-lg text-gray-500' />
                            <p className='text-gray-400 '>+91</p>
                        </div>

                        <input
                            autoComplete='new-password'
                            type="tel"
                            placeholder="Contact Number"
                            className={`w-full border border-gray-300 rounded-md  pl-16 pr-2 py-2  text-gray-700 border-gray-300 cursor-not-allowed`}
                            value={contactNumber}
                            disabled={true}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Name"
                        className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 ${nameError ? 'border-red-600' : 'border-gray-300'}`}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            setNameError(false)
                        }}
                    />


                    <div className='flex flex-col sm:flex-row gap-3'>
                        <div className='relative w-full sm:w-1/2 '>
                            <select className={`text-gray-700 w-full  border pl-4 pr-1.5 py-1.5 rounded-lg cursor-pointer ${stateError ? 'border-red-600' : ''}`} value={state} onChange={(e) => {
                                setState(e.target.value)
                                setDistrict('')
                                setStateError(false)
                                setDistrictError(false)
                            }}>
                                <option className='text-gray-300' disabled value="">State</option>
                                {states.map(option => (
                                    <option className="" key={option} value={option}>
                                        {capitalizeFirstLetterOfAString(option)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='relative w-full sm:w-1/2 '>
                            <select className={`w-full  text-gray-700 border pl-4 pr-1.5 py-1.5 rounded-lg ${state ? 'cursor-pointer' : 'cursor-not-allowed'}  ${districtError ? 'border-red-600' : ''}`}
                                value={district}
                                disabled={!state}
                                onChange={(e) => {
                                    setDistrict(e.target.value)
                                    setDistrictError(false)
                                }}>
                                <option disabled value="">District</option>
                                {state && chooseDistrictsForState(state).map(option => {
                                    return <option className="" key={option} value={option}>
                                        {capitalizeFirstLetterOfAString(option)}
                                    </option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="w-full flex gap-4 flex-row place-content-center">
                        <button
                            type='submit'
                            className={`w-full h-12 bg-red-600  text-white font-medium rounded  flex justify-center items-center gap-1 cursor-pointer hover:bg-red-500`}
                        >
                            Edit details
                        </button>
                    </div>

                </form>

            </div >
        </Fragment>
    );
};

export default UserEditDetailsModal