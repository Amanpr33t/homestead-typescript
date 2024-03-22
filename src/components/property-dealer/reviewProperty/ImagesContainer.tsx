import React, { Fragment, useState } from "react"
import { GoDotFill } from "react-icons/go";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { IoClose } from "react-icons/io5";

interface PropsType {
    imagesUrl: string[],
    isClosed?: boolean,
    isLive?: boolean
}

//This component is used to show customer messages to property dealer
const ImageContainer: React.FC<PropsType> = ({ isClosed, imagesUrl, isLive }) => {

    const [indexOfImageToBeShown, setIndexOfImageToBeShown] = useState<number>(0)
    const [showImagesInFullScreen, setShowImagesInFullScreen] = useState<boolean>(false)

    return (
        <Fragment>

            <div className={`w-full ${showImagesInFullScreen ? 'h-screen bg-gray-900 fixed top-0 left-0 z-40 ' : 'bg-gray-100 pt-20 md:pt-20  flex justify-center h-fit w-full'}`}>

                {showImagesInFullScreen && <p className="z-50 fixed top-3 left-2 text-sm text-white fonxt-semibold">{indexOfImageToBeShown + 1} / {imagesUrl?.length}</p>}
                {showImagesInFullScreen && <IoClose className="z-50 fixed top-2 right-2 text-white text-3xl font-semibold cursor-pointer" onClick={() => {
                    setShowImagesInFullScreen(false)
                }} />}

                <div className={`relative  ${showImagesInFullScreen ? 'flex items-center justify-center h-screen w-full' : 'w-full md:w-11/12 lg:w-9/12 h-fit bg-red-500'}`}>
                    <img
                        src={imagesUrl ? imagesUrl[indexOfImageToBeShown] : ''}
                        alt=''
                        className={`${showImagesInFullScreen ? 'px-3 sm:px-10 py-10 h-auto max-h-screen w-auto max-w-screen' : 'w-full h-60 sm:h-80 md:h-96  cursor-pointer'}`}
                        onClick={() => setShowImagesInFullScreen(true)}
                    />

                    {isClosed && !isLive && !showImagesInFullScreen && <p className="absolute top-5 left-5 px-1 py-0.5 bg-white rounded-lg font-semibold text-gray-800 text-sm flex flex-row"><GoDotFill className="mt-1 text-yellow-500" />Closed</p>}

                    {!isClosed && isLive && !showImagesInFullScreen && <p className="absolute top-5 left-5 px-1 py-0.5 bg-white rounded-lg font-semibold text-gray-800 text-sm flex flex-row"><GoDotFill className="mt-1 text-red-600" />Live</p>}

                    {imagesUrl && imagesUrl.length > 1 && indexOfImageToBeShown > 0 && <button
                        className={`text-center absolute top-1/2 left-1 sm:left-5 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white p-2 rounded-full font-extrabold ${showImagesInFullScreen && 'text-4xl'}`}
                        disabled={indexOfImageToBeShown === 0}
                        onClick={() => {
                            setIndexOfImageToBeShown(index => index - 1)
                        }}
                    >
                        <MdArrowBackIosNew className="text-3xl"/>
                    </button>}
                    {imagesUrl && imagesUrl.length > 1 && indexOfImageToBeShown + 1 < imagesUrl.length && <button
                        className={`text-center absolute top-1/2 right-1 sm:right-5 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white p-2 rounded-full font-extrabold ${showImagesInFullScreen && 'text-4xl'}`}
                        disabled={indexOfImageToBeShown === imagesUrl.length - 1}
                        onClick={() => {
                            setIndexOfImageToBeShown(index => index + 1)
                        }}
                    >
                        <MdArrowForwardIos className="text-3xl"/>
                    </button>}
                </div>
            </div>

        </Fragment>
    )
}
export default ImageContainer