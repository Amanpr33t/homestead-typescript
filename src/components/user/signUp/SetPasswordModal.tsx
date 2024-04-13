import React, { ChangeEvent, useState } from 'react';
import { FaEyeSlash, FaRegEye } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface SetPasswordModalProps {
    passwordSetter: (password: string) => void,
    confirmPasswordSetter: (password: string) => void,
    modalReset: () => void,
    password: string,
    confirmPassword: string,
    formSubmit: () => void,
    isAlert: boolean
}

const SetPasswordModal: React.FC<SetPasswordModalProps> = ({
    modalReset,
    passwordSetter,
    confirmPasswordSetter,
    password,
    confirmPassword,
    formSubmit,
    isAlert
}) => {
    const [error, setError] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className={`${isAlert && 'transform translate-x-full'} px-2 w-full h-screen fixed top-0 left-0 z-40 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur py-5`} onClick={() => {
            modalReset()
            passwordSetter('')
            confirmPasswordSetter('')
        }}>

            <form className="relative max-h-full overflow-y-auto w-96 h-fit py-4 px-4 sm:px-10 flex flex-col rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={e => e.stopPropagation()} onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
                e.preventDefault()
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }

                if (password.length < 6) {
                    setError('Password must be at least 6 characters long');
                    return;
                }
                formSubmit()
            }}>
                <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => {
                    modalReset()
                    passwordSetter('')
                    confirmPasswordSetter('')
                }}>
                    <IoClose className="text-3xl" />
                </button>

                <p className=' text-xl font-bold text-gray-700 text-center mb-6'>Set a password</p>

                <div className='relative mb-3'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        autoComplete='new-password'
                        className={`w-full border border-gray-300 rounded-md pl-3 pr-3 py-2  text-gray-700 border-gray-300`}
                        value={password}
                        onChange={(e) => {
                            passwordSetter(e.target.value)
                            setError('')
                        }}
                        required
                    />

                    {!showPassword ?
                        <div className='absolute inset-y-0 right-0.5 px-2 top-2 h-fit bg-white'>
                            <FaRegEye className=" text-2xl  text-gray-500 cursor-pointer" onClick={() => setShowPassword(true)} />
                        </div>
                        :
                        <div className='absolute inset-y-0 right-0.5 px-2 top-2 h-fit bg-white'>
                            <FaEyeSlash className="text-2xl text-gray-500 cursor-pointer" onClick={() => setShowPassword(false)} />
                        </div>}
                </div>

                <div className='relative mb-1'>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm password'
                        autoComplete='new-password'
                        className={`w-full border border-gray-300 rounded-md pl-3 pr-3 py-2 text-gray-700 border-gray-300`}
                        value={confirmPassword}
                        onChange={(e) => {
                            confirmPasswordSetter(e.target.value)
                            setError('')
                        }}
                        required
                    />

                    {!showConfirmPassword ?
                        <div className='absolute inset-y-0 right-0.5 px-2 top-2 h-fit bg-white'>
                            <FaRegEye className=" text-2xl  text-gray-500 cursor-pointer" onClick={() => setShowConfirmPassword(true)} />
                        </div>
                        :
                        <div className='absolute inset-y-0 right-0.5 px-2 top-2  h-fit bg-white'>
                            <FaEyeSlash className="text-2xl  text-gray-500 cursor-pointer" onClick={() => setShowConfirmPassword(false)} />
                        </div>}
                </div>

                {error && <p className='text-red-500'>{error}</p>}

                <div className="w-full flex gap-4 flex-row place-content-center mt-5">
                    <button
                        type='submit'
                        className={`w-full h-12 bg-red-600  text-white font-medium rounded  flex justify-center items-center gap-1 cursor-pointer hover:bg-red-500`}
                    >
                        Sign up
                    </button>
                </div>
            </form>

        </div >
    );
};

export default SetPasswordModal;





