import { Fragment } from "react"
import ReactPaginate from "react-paginate"

interface PropsType {
    totalPages: number,
    handlePageClick: (selectedPage: { selected: number }) => void
}

//this component is an alert modal
const Pagination: React.FC<PropsType> = ({ totalPages, handlePageClick }) => {

    return (
        <Fragment>
            <ReactPaginate
                //component for pagination
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={`pagination flex justify-center pb-10 `}
                activeClassName=" text-gray-700 px-3 rounded pt-1 hover:bg-gray-200 font-semibold"
                pageClassName="mr-2 cursor-pointer px-3 rounded pt-1 border border-gray-400 hover:bg-gray-300"
                previousClassName="mr-2 cursor-pointer btn-blue bg-gray-500 hover:bg-gray-600 text-white font-semibold px-2 py-1 rounded"
                nextClassName="ml-2 cursor-pointer btn-blue bg-gray-500 hover:bg-gray-600 text-white font-semibold px-2 py-1 rounded"
                disabledClassName="cursor-not-allowed"
            />
        </Fragment>
    )
}
export default Pagination
