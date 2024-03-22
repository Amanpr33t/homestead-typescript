import React, { Fragment, useState } from "react"
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { IoClose } from "react-icons/io5";

interface PropsType {
    imagesUrl: string[]
}

//This component is used to show customer messages to property dealer
const ContractImagesContainer: React.FC<PropsType> = ({ imagesUrl }) => {

    const [indexOfImageToBeShown, setIndexOfImageToBeShown] = useState<number>(0)
    const [showImagesInFullScreen, setShowImagesInFullScreen] = useState<boolean>(false)

    return (
        <Fragment>
            <div className={`${showImagesInFullScreen ? 'w-full h-screen bg-gray-900 fixed top-0 left-0 z-40 ' : 'flex justify-center w-fit h-fit'}`}>
                {showImagesInFullScreen && <p className="z-50 fixed top-3 left-2 text-sm text-white fonxt-semibold">{indexOfImageToBeShown + 1} / {imagesUrl?.length}</p>}
                {showImagesInFullScreen && <IoClose className="z-50 fixed top-2 right-2 text-white text-3xl font-semibold cursor-pointer" onClick={() => setShowImagesInFullScreen(false)} />}

                <div className={`relative ${showImagesInFullScreen ? 'flex items-center justify-center h-screen w-full' : 'w-60 h-40 bg-gray-100 flex justify-center'}`}>
                    <img
                        src={imagesUrl ? imagesUrl[indexOfImageToBeShown] : ''}
                        alt=''
                        className={` cursor-pointer ${showImagesInFullScreen ? 'px-3 sm:px-10 py-10 h-auto max-h-screen w-auto max-w-screen' : 'w-auto max-w-60 h-auto max-h-40'}`}
                        onClick={() => setShowImagesInFullScreen(true)}
                    />

                    {imagesUrl && imagesUrl.length > 1 && indexOfImageToBeShown > 0 && <button
                        className={`text-center absolute top-1/2 left-1 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white bg-opacity-75 p-2 rounded-full font-extrabold ${showImagesInFullScreen && 'text-4xl'}`}
                        disabled={indexOfImageToBeShown === 0}
                        onClick={() => {
                            setIndexOfImageToBeShown(index => index - 1)
                        }}
                    >
                        <MdArrowBackIosNew />
                    </button>}
                    {imagesUrl && imagesUrl.length > 1 && indexOfImageToBeShown + 1 < imagesUrl.length && <button
                        className={`text-center absolute top-1/2 right-1  transform -translate-y-1/2 bg-black hover:bg-gray-800  text-white bg-opacity-75 p-2 rounded-full font-extrabold ${showImagesInFullScreen && 'text-4xl'}`}
                        disabled={indexOfImageToBeShown === imagesUrl.length - 1}
                        onClick={() => {
                            setIndexOfImageToBeShown(index => index + 1)
                        }}
                    >
                        <MdArrowForwardIos />
                    </button>}
                </div>
            </div>

        </Fragment>
    )
}
export default ContractImagesContainer