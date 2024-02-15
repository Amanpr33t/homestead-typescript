import { Fragment } from "react"

interface DetailsProps {
    reevaluationDetails: string[],
    detailsModalRemover: () => void,
    showDealerDetails: boolean,
    showReevaluationDetails: boolean,
    dealerInfo: {
        propertyDealerName: string,
        firmName: string,
        email: string,
        contactNumber: number
    }
}

//this component is an alert modal
const DetailsModal: React.FC<DetailsProps> = (props) => {
    const {
        reevaluationDetails,
        detailsModalRemover,
        showDealerDetails,
        showReevaluationDetails,
        dealerInfo
    } = props

    let index: number = 0

    return (
        <Fragment>
            <div className="fixed z-50 top-16 pt-12 bg-transparent h-screen w-full flex justify-center " onClick={detailsModalRemover}>
                <div className="relative w-11/12 sm:w-6/12 h-fit rounded shadow bg-white py-4" onClick={e => e.stopPropagation()}>

                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={detailsModalRemover}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    {showReevaluationDetails && <>
                        <p className="text-center text-xl font-semibold text-gray-500">Reevaluation details</p>
                        <div className="flex flex-col p-6">
                            {reevaluationDetails.map(detail => {
                                index++
                                return <div key={Math.random()} className="flex flex-row gap-2">
                                    <p className="font-bold">{index}.</p>
                                    <p >{detail}</p>
                                </div>
                            })}
                        </div>
                    </>}

                    {showDealerDetails && <>
                        <p className="text-center text-xl font-semibold text-gray-500">Property dealer contact information</p>
                        <div className="flex flex-col gap-2 p-6">
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold text-lg">Firm name:</p>
                                <p className="text-lg">{dealerInfo.firmName}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold text-lg">Dealer name:</p>
                                <p className="text-lg">{dealerInfo.propertyDealerName}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold text-lg">Email:</p>
                                <p className="text-lg">{dealerInfo.email}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold text-lg">Contact number:</p>
                                <p className="text-lg">{dealerInfo.contactNumber}</p>
                            </div>
                        </div>
                    </>}

                    <div className="flex justify-center">
                        <button data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={detailsModalRemover}>Ok</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default DetailsModal