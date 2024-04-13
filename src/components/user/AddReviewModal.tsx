import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { AlertType } from '../../dataTypes/alertType';
import { IoClose } from 'react-icons/io5';
import Spinner from '../Spinner';
import AlertModal from '../AlertModal';

interface CustomerReviewType {
    review: string,
    rating: number,
    customerName: string,
    customerId: string,
    date: string,
    _id: string
}

interface PropsType {
    modalReset: () => void,
    dealerId: string,
    customersOwnReview: CustomerReviewType | null,
    customerReviewsSetter: (review: CustomerReviewType[]) => void,
    customersOwnReviewSetter: (reviews: CustomerReviewType | null) => void,
    averageOfRatingsFromCustomerSetter: (rating: number) => void
}

const AddReviewModal: React.FC<PropsType> = ({
    modalReset,
    dealerId,
    customersOwnReview,
    customerReviewsSetter,
    customersOwnReviewSetter,
    averageOfRatingsFromCustomerSetter
}) => {
    const authToken: string | null = localStorage.getItem("homestead-user-authToken")

    const [spinner, setSpinner] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [review, setReview] = useState<string>('') //Used td store flat or house number
    const [rating, setRating] = useState<number | null>(null)

    useEffect(() => {
        if (customersOwnReview) {
            setReview(customersOwnReview.review)
            setRating(customersOwnReview.rating)
        }
    }, [customersOwnReview])

    const addReview = async () => {
        if (!review.trim() || !rating) {
            return
        }
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/addReviewForPropertyDealer?operation=${customersOwnReview ? 'edit' : 'add'}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    review,
                    rating,
                    dealerId
                })
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                customersOwnReviewSetter(data.customersOwnReview)
                customerReviewsSetter(data.reviewsFromOtherCustomers)
                averageOfRatingsFromCustomerSetter(data.averageCustomerRatings)
                setSpinner(false)
                modalReset()
                return     
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-user-authToken")
                modalReset()
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setAlert({
                isAlertModal: true,
                alertMessage: 'Some error occured. Try again.',
                alertType: 'warning',
                routeTo: null
            })
            setSpinner(false)
            return
        }
    }

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

            {spinner && <Spinner />}

            <div className="w-full h-screen fixed top-0 left-0 z-40 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur  py-5" onClick={modalReset}>

                <form className="relative max-h-full overflow-y-auto w-11/12 sm:w-96 h-fit p-4 flex flex-col gap-3 rounded-lg border border-gray-200 shadow-2xl bg-white" onClick={e => e.stopPropagation()} onSubmit={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    addReview()
                }}>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={modalReset}>
                        <IoClose className="text-3xl" />
                    </button>

                    {/*review*/}
                    <div className="flex flex-col mb-1.5 ">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="review">Review</label>
                        <textarea
                            className={`border border-gray-400 p-1 rounded  w-full  resize-none`}
                            rows={5}
                            autoCorrect="on"
                            autoComplete="new-password"
                            id="review"
                            name="review"
                            value={review}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                setReview(e.target.value)
                            }} />
                    </div>

                    <div className='mb-1.5'>
                        <span className='text-lg font-semibold mr-5'>Rating </span>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button type='button' className='text-red-500 text-2xl ' key={value} onClick={(e) => setRating(value)}>
                                {rating && value <= rating ? '★' : '☆'}
                            </button>
                        ))}
                    </div>

                    <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                        <button
                            type='submit'
                            className={`w-40 h-12 bg-blue-600  text-white font-medium rounded  flex justify-center items-center gap-1 cursor-pointer hover:bg-blue-500`}
                            disabled={spinner}
                        >
                            {customersOwnReview ? 'Edit review' : 'Add review'}
                        </button>
                    </div>
                </form>
            </div>

        </Fragment>
    );
};

export default AddReviewModal
