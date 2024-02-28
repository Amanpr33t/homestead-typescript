import React, { Fragment, useState } from "react"
import { GoDotFill } from "react-icons/go";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { IoClose } from "react-icons/io5";

interface PropsType {
    propertyImagesUrl: string[],
    isSold: boolean
}

//This component is used to show customer messages to property dealer
const ImageContainer: React.FC<PropsType> = ({ isSold, propertyImagesUrl }) => {

    const [indexOfImageToBeShown, setIndexOfImageToBeShown] = useState<number>(0)
    const [showImagesInFullScreen, setShowImagesInFullScreen] = useState<boolean>(false)
    return (
        <Fragment>
            <div>
                <div className={`w-full  ${showImagesInFullScreen ? 'bg-gray-900 h-screen fixed top-0 z-50 px-10' : 'bg-gray-100 pt-16 md:pt-20 h-fit flex justify-center'}`}>
                    {showImagesInFullScreen && <p className="fixed top-3 left-3 text-sm text-white fonxt-semibold">{indexOfImageToBeShown + 1} / {propertyImagesUrl?.length}</p>}
                    {showImagesInFullScreen && <IoClose className="fixed top-2 right-2 text-white text-3xl font-semibold cursor-pointer" onClick={() => setShowImagesInFullScreen(false)} />}
                    <div className={`relative ${showImagesInFullScreen ? 'h-full py-10' : 'w-full md:w-11/12 lg:w-9/12 '}`}>
                        <img
                            src={propertyImagesUrl ? propertyImagesUrl[indexOfImageToBeShown] : ''}
                            alt=''
                            className={`w-full cursor-pointer ${showImagesInFullScreen ? 'h-full' : 'max-h-80  h-auto sm:max-h-none sm:h-96 '}`}
                            onClick={() => setShowImagesInFullScreen(true)}
                        />

                        {isSold && !showImagesInFullScreen && <p className="absolute top-5 left-5 px-1 py-0.5 bg-white rounded-lg font-semibold text-gray-800 text-sm flex flex-row"><GoDotFill className="mt-1 text-yellow-500" />Closed</p>}

                        {propertyImagesUrl && propertyImagesUrl.length > 1 && <button
                            className={`text-center absolute top-1/2 left-1 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full font-extrabold ${showImagesInFullScreen && 'text-4xl'}`}
                            disabled={indexOfImageToBeShown === 0}
                            onClick={() => {
                                setIndexOfImageToBeShown(index => index - 1)
                            }}
                        >
                            <MdArrowBackIosNew />
                        </button>}
                        {propertyImagesUrl && propertyImagesUrl.length > 1 && <button
                            className={`text-center absolute top-1/2 right-1 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full font-extrabold ${showImagesInFullScreen && 'text-4xl'}`}
                            disabled={indexOfImageToBeShown === propertyImagesUrl.length - 1}
                            onClick={() => {
                                setIndexOfImageToBeShown(index => index + 1)
                            }}
                        >
                            <MdArrowForwardIos />
                        </button>}
                    </div>
                </div>
            </div>

        </Fragment>
    )
}
export default ImageContainer