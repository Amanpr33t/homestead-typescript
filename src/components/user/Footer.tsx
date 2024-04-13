import React, { Fragment } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {


    return (
        <Fragment>
            <div className="w-full px-5 sm:px-20 py-10 border-t border-gray-300 bg-gray-100">
                <div className='flex flex-row justify-between mb-10'>
                    <div className='flex flex-row text-2xl gap-3 text-gray-600'>
                        <FaFacebook className='cursor-pointer hover:text-gray-800' />
                        <FaTwitter className='cursor-pointer hover:text-gray-800' />
                        <FaInstagram className='cursor-pointer hover:text-gray-800' />
                        <FaYoutube className='cursor-pointer hover:text-gray-800' />
                    </div>
                    <p className='hover:underline text-gray-500 font-semibold hover:text-gray-800 cursor-pointer'>Contact us</p>
                </div>
                <p className='text-sm text-gray-700'>realestate.com.au is owned and operated by ASX-listed REA Group Ltd (REA:ASX) © REA Group Ltd.</p>
            </div>

        </Fragment>
    );
};

export default Footer
