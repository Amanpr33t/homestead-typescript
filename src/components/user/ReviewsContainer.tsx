import { Fragment, useState } from "react"
import { formatDate } from "../../utils/dateFunctions";
import { useLocation } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import AddReviewModal from "../user/AddReviewModal";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface CustomerReviewType {
    review: string,
    rating: number,
    customerName: string,
    customerId: string,
    date: string,
    _id: string
}

interface PropsType {
    dealerLogoUrl?: string,
    customerReviews: CustomerReviewType[],
    customersOwnReview: CustomerReviewType | null,
    customerReviewsSetter: (review: CustomerReviewType[]) => void,
    customersOwnReviewSetter: (reviews: CustomerReviewType | null) => void,
    averageOfRatingsFromCustomer: number,
    averageOfRatingsFromCustomerSetter: (rating: number) => void,
    dealerId: string
}

//This component is the home page for property dealer
const ReviewsContainer: React.FC<PropsType> = ({
    dealerLogoUrl,
    customerReviews,
    averageOfRatingsFromCustomer,
    averageOfRatingsFromCustomerSetter,
    dealerId,
    customersOwnReview,
    customerReviewsSetter,
    customersOwnReviewSetter
}) => {
    const authToken: string | null = localStorage.getItem("homestead-user-authToken")

    const [indexUntilWhichReviewsToBeShown, setIndexUntilWhicReviewsToBeShown] = useState<number>(3)

    const [showAddReviewModal, setShowAddReviewModal] = useState<boolean>(false)

    const renderStarRating = (rating: number) => {
        const filledStars = Math.round(rating);
        const stars = [];

        for (let i = 0; i < 5; i++) {
            if (i < filledStars) {
                stars.push(<span className="text-2xl text-yellow-500" key={i}>&#9733;</span>); // Filled star
            } else {
                stars.push(<span className="text-2xl text-yellow-500" key={i}>&#9734;</span>); // Empty star
            }
        }
        return stars;
    }

    return (
        <Fragment>
            {showAddReviewModal &&
                <AddReviewModal
                    modalReset={() => setShowAddReviewModal(false)}
                    dealerId={dealerId}
                    customersOwnReview={customersOwnReview}
                    customerReviewsSetter={customerReviewsSetter}
                    customersOwnReviewSetter={customersOwnReviewSetter}
                    averageOfRatingsFromCustomerSetter={averageOfRatingsFromCustomerSetter}
                />}

            <div className="w-full bg-white flex flex-col gap-3 rounded-2xl shadow p-5" >
                <div className="flex flex-col gap-3 sm:flex-row justify-between">

                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-xl text-gray-800">Reviews</p>
                        <div className="flex items-center justify-start gap-3">
                            <img className="rounded-full w-16 h-16 border-2 border-gray-300" src={dealerLogoUrl} alt='' />
                            <div className="flex flex-row gap-1">
                                {!customersOwnReview && customerReviews.length === 0 &&
                                    <p className="font-semibold text-gray-700 text-lg">0 reviews</p>}
                                {(customersOwnReview || customerReviews.length > 0) && <span className="text-2xl text-yellow-500 -mt-1">&#9733;</span>}
                                {(customersOwnReview || customerReviews.length > 0) && <div className="flex flex-row gap-1">
                                    <p className="font-semibold text-gray-700 text-lg">{averageOfRatingsFromCustomer}</p>
                                    <p className="font-semibold text-gray-500  text-lg ">({customersOwnReview ? customerReviews.length + 1 : customerReviews.length} reviews)</p>
                                </div>}
                            </div>
                        </div>
                    </div>

                    {!customersOwnReview && authToken &&
                        <div className="flex sm:justify-center">
                            <button className="h-fit flex flex-row justify-between items-center px-5 py-2 gap-20 border border-gray-500 hover:border-gray-900 hover:bg-gray-50 rounded-lg shadow" onClick={() => setShowAddReviewModal(true)}>
                                <p>Write a review</p>
                                <IoIosArrowForward />
                            </button>
                        </div>}

                </div>

                {customersOwnReview &&
                    <div key={customersOwnReview._id} className="relative bg-gray-800 text-white p-3 rounded-xl">
                        <FaEdit className="absolute right-2 top-1 text-xl hover:text-2xl cursor-pointer" onClick={() => setShowAddReviewModal(true)} />

                        <div className="flex flex-row">
                            {renderStarRating(customersOwnReview.rating)}
                            <p className="ml-2 mt-1.5  font-semibold">{customersOwnReview.rating}.0</p>
                        </div>
                        <p className="mb-2  font-semibold">{formatDate(customersOwnReview.date)}</p>
                        <p>{customersOwnReview.review}</p>
                    </div>}

                {customerReviews.length > 0 && customerReviews.slice(0, indexUntilWhichReviewsToBeShown).map(item => {
                    return <div key={item._id} className="bg-gray-100 p-3 rounded-xl">
                        <div className="flex flex-row">
                            {renderStarRating(item.rating)}
                            <p className="ml-2 mt-1.5 text-gray-700 font-semibold">{item.rating}.0</p>
                        </div>
                        <p className="mb-2 text-gray-700 font-semibold">{formatDate(item.date)}</p>
                        <p>{item.review}</p>
                    </div>
                })}
                {customerReviews.length > 3 &&
                    <div className="flex justify-center mt-2">
                        <button
                            className="border p-3 rounded-lg border-gray-500 font-semibold hover:border-gray-800 hover:bg-gray-100 text-gray-700"
                            onClick={() => {
                                if (indexUntilWhichReviewsToBeShown === 3) {
                                    setIndexUntilWhicReviewsToBeShown(customerReviews.length)
                                } else {
                                    setIndexUntilWhicReviewsToBeShown(3)
                                }
                            }}>
                            {indexUntilWhichReviewsToBeShown === 3 ? `Show all ${customerReviews.length} reviews` : 'Show less reviews'}
                        </button>
                    </div>}

            </div>
        </Fragment >
    )
}
export default ReviewsContainer