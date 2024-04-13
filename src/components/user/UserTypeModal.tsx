import React from 'react';
import { IoClose } from 'react-icons/io5';

interface UserTypeModalProps {
    selectUserTypeModalSetter: (input: boolean) => void,
    selectedUserTypeSetter: (input: 'dealer' | 'customer' | null) => void,
    operationSetter: () => void,
    selectedUserType: 'dealer' | 'customer' | null
}

const UserTypeModal: React.FC<UserTypeModalProps> = ({
    selectUserTypeModalSetter,
    selectedUserTypeSetter,
    operationSetter,
    selectedUserType
}) => {

    return (
        <div className="px-2 w-full h-screen fixed top-0 left-0 z-40 flex justify-center bg-black bg-opacity-50 backdrop-blur  py-10" onClick={() => {
            selectUserTypeModalSetter(false)
            selectedUserTypeSetter(null)
        }}>

            <form className="relative max-h-full overflow-y-auto w-96 h-fit py-4 px-4 sm:px-10 flex flex-col gap-3 rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={e => e.stopPropagation()} >
                <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => {
                    selectUserTypeModalSetter(false)
                    selectedUserTypeSetter(null)
                }}>
                    <IoClose className="text-3xl" />
                </button>

                <p className=' text-xl font-bold text-gray-700 text-center mb-3'>Select a user type</p>

                <div className="flex items-center">
                    <input
                        id="dealer"
                        type="radio"
                        name="options"
                        value="dealer"
                        onChange={(e) => {
                            selectedUserTypeSetter('dealer')
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="dealer" className="ml-3 block text font-medium text-gray-700">
                        Property dealer
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        id="customer"
                        type="radio"
                        name="options"
                        value="customer"
                        onChange={(e) => {
                            selectedUserTypeSetter('customer')
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="customer" className="ml-3 block text font-medium text-gray-700">
                        Customer
                    </label>
                </div>


                <div className="w-full flex gap-4 flex-row place-content-center mt-5">
                    <button
                        type='button'
                        className={`w-full h-12 bg-red-600  text-white font-medium rounded  flex justify-center items-center gap-1 cursor-pointer hover:bg-red-500`}
                        onClick={() => {
                            if (selectedUserType) {
                                operationSetter()
                                selectUserTypeModalSetter(false)
                            }
                        }}
                    >
                        Continue
                    </button>
                </div>
            </form>

        </div >
    );
};

export default UserTypeModal;
