import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import Spinner from "../Spinner"
import AlertModal from "../AlertModal"
//This component is the navigation bar

//This component shows a list of property dealers added by the field agent
function ReevaluateProperty() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-field-agent-authToken") //This variable stores the authToken present in local storage

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate])

    // Get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);

    // Get individual query parameters
    const propertyId = queryParams.get('id');
    const propertyType = queryParams.get('type');

    const [spinner, setSpinner] = useState(true)

    const [error, setError] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    const [newImagesToBeUploaded, setNewImagesToBeUploaded] = useState([])
    const [urlOfImagesPreviouslyUploaded, setUrlOfImagesPreviouslyFetched] = useState([])
    const [urlOfNewImagesUploaded, setUrlOfNewImagesUploaded] = useState(null)

    const [selectedProperty, setSelectedProperty] = useState()

    useEffect(() => {
        if (selectedProperty) {
            setUrlOfImagesPreviouslyFetched(selectedProperty.propertyImagesUrl)
        }
    }, [selectedProperty])

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const imageHandler = (event) => {
        setNewImagesToBeUploaded(array => [...array, {
            file: URL.createObjectURL(event.target.files[0]),
            upload: event.target.files[0]
        }])
    }

    const fetchPropertyDetailsToBeReevaluated = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/getPropertyData?type=${propertyType}&id=${propertyId}`, {
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
            if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                setSelectedProperty(data.propertyData)
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate, propertyId, propertyType])

    useEffect(() => {
        fetchPropertyDetailsToBeReevaluated()
    }, [fetchPropertyDetailsToBeReevaluated])

    //The function is used to upload the images to the server
    const uploadImages = async () => {
        if (!newImagesToBeUploaded.length) {
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'No images have been added by you',
                routeTo: null
            })
            return
        }
        try {
            setSpinner(true)
            let urlOfImages = []
            newImagesToBeUploaded.length && newImagesToBeUploaded.forEach(async (image) => {
                const formData = new FormData()
                formData.append('file', image.upload)
                formData.append('upload_preset', 'homestead')
                formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'post',
                    body: formData
                })
                const data = await response.json()
                if (data && data.error) {
                    throw new Error('Some error occured')
                } else {
                    urlOfImages.push(data.secure_url)
                    if (urlOfImages.length === newImagesToBeUploaded.length) {
                        setUrlOfNewImagesUploaded(urlOfImages)
                    }
                }
            })
        } catch (error) {
            setUrlOfNewImagesUploaded(null)
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured',
                routeTo: null
            })
            return
        }
    }


    const submitReevaluationData = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/reevaluatePropertyData?type=${propertyType}&id=${propertyId}`, {
                method: 'POST',
                body: JSON.stringify({
                    imagesUrl: [...urlOfImagesPreviouslyUploaded, ...urlOfNewImagesUploaded]
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
            if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'Re-evaluation done successfully',
                    routeTo: '/field-agent'
                })
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate, propertyId, propertyType, urlOfImagesPreviouslyUploaded, urlOfNewImagesUploaded])


    useEffect(() => {
        if (urlOfNewImagesUploaded && urlOfNewImagesUploaded.length && urlOfNewImagesUploaded.length === newImagesToBeUploaded.length) {
            submitReevaluationData()
        }
    }, [urlOfNewImagesUploaded, newImagesToBeUploaded, submitReevaluationData])

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {alert.isAlertModal && !error && !spinner && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}

            {error && !spinner && <div className="fixed top-36 w-full flex flex-col place-items-center">
                <p>Some error occured</p>
                <p className="text-red-500 cursor-pointer" onClick={fetchPropertyDetailsToBeReevaluated}>Try again</p>
            </div>}

            {!spinner && selectedProperty && <div className={`w-full flex flex-row gap-2 z-20 fixed top-16 pt-3 pb-3 pl-3 bg-white ${alert.isAlertModal ? 'blur' : ''}`}>
                <Link to='/field-agent/list-of-pending-property-reevaluations' className="bg-blue-500 text-white font-semibold p-1 rounded">Back</Link>
            </div>}

            {selectedProperty && !error && <div className={`pl-2 pr-2 h-fit  mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center ${alert.isAlertModal || spinner ? 'blur' : ''} `} >
                <p className="w-full mt-32 bg-white mb-4 text-2xl font-bold text-center">Re-evaluate property</p>

                <div className="w-full  md:w-10/12 lg:w-8/12  h-fit  flex flex-col rounded border-2 border-gray-200 shadow" >

                    {/*photographs complete*/}
                    {selectedProperty && !selectedProperty.evaluationData.photographs
                        .arePhotographsComplete &&
                        <div className="p-2 flex flex-col pb-5 pt-5 ">
                            <p className="text-xl font-semibold text-gray-500 mb-1">Details about incomplete information on property images</p>
                            <p className=" p-2 mb-2">{selectedProperty.evaluationData.photographs
                                .details}</p>
                            <div className="w-full flex gap-2 justify-center flex-wrap mb-4">
                                {urlOfImagesPreviouslyUploaded && urlOfImagesPreviouslyUploaded.map(image => {
                                    return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                                        <img className='relative w-auto h-44' src={image} alt="" />
                                        <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                                            const updatedState = urlOfImagesPreviouslyUploaded.filter(file => file !== image)
                                            setUrlOfImagesPreviouslyFetched(updatedState)
                                        }}>X</div>
                                    </div>
                                })}
                            </div>

                            {newImagesToBeUploaded.length > 0 && <div className="w-full flex flex-col place-items-center gap-2 pt-4 pb-4 pl-2 pr-2 mb-4 bg-gray-100">
                                <p className="text-xl font-semibold text-gray-500">New images added</p>
                                <div className="flex flex-row place-content-center flex-wrap gap-3">
                                    {newImagesToBeUploaded.map(image => {
                                        return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                                            <img className='relative w-auto h-56' src={image.file} alt="" />
                                            <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                                                const updatedState = newImagesToBeUploaded.filter(item => item.file !== image.file)
                                                setNewImagesToBeUploaded(updatedState)
                                            }}>X</div>
                                        </div>
                                    })}
                                </div>
                            </div>}

                            <div className="flex flex-row gap-5">
                                <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Add Image</label>
                                <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={imageHandler} onClick={e => e.target.value = null} />
                            </div>

                        </div>}
                </div>
                {!alert.isAlertModal && <div className="flex justify-center mt-4 p-2">
                    <button type='submit' className="text-lg bg-green-500 text-white font-medium rounded pl-4 pr-4 pt-0.5 h-8" onClick={uploadImages}>Save data</button>
                </div>}
            </div >}

        </Fragment>
    )
}
export default ReevaluateProperty