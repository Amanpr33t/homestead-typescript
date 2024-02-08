import { ChangeEvent, Fragment, useState } from "react"
import AlertModal from '../AlertModal'
import { useNavigate } from "react-router-dom"

interface PropsType {
    showApprovalForm: boolean,
    hideApprovalForm: () => void,
    propertyType: 'agricultural' | 'residential' | 'commercial',
    propertyId: string
}

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null
    routeTo: string | null
}

//This component is a form used to evaluate a property
const ApprovalForm: React.FC<PropsType> = (props) => {
    const {
        showApprovalForm,
        hideApprovalForm,
        propertyId,
        propertyType
    } = props

    const navigate = useNavigate()

    let index: number = 1//to show index numbers for details of incomplete information

    const authToken: string | null = localStorage.getItem("homestead-city-manager-authToken")

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })
    const [spinner, setSpinner] = useState<boolean>(false)

    const [sendBackToFieldAgent, setSendBackToFieldAgent] = useState<boolean | null>(null)
    const [sendBackToPropertyEvaluator, setSendBackToPropertyEvaluator] = useState<boolean | null>(null)
    const [approveProperty, setApproveProperty] = useState<boolean | null>(null)

    const [incompleteDetailsArray, setIncompleteDetailsArray] = useState<string[]>([])
    const [incompleteDetailsItem, setIncompleteDetailsItem] = useState<string>('')

    const [showDetailsForm, setShowDetailsForm] = useState<boolean>(false)

    const formSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (incompleteDetailsArray.length > 10 || incompleteDetailsArray.length === 0) {
            return
        }
        const bodyData = {
            sendBackToFieldAgent,
            sendBackToPropertyEvaluator,
            approveProperty,
            incompleteDetailsArray: !approveProperty ? incompleteDetailsArray : null
        }
        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/city-manager/approveProperty?propertyType=${propertyType}&propertyId=${propertyId}`, {
                method: 'PATCH',
                body: JSON.stringify(bodyData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                let alertMessage:string=''
                if(sendBackToFieldAgent){
                    alertMessage='Property sent to field agent for reevaluation'
                }else if(sendBackToPropertyEvaluator){
                    alertMessage='Property sent to evaluator for reevaluation'
                }else if(approveProperty){
                    alertMessage='Property has been approved successfully'
                }
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage,
                    routeTo: '/city-manager'
                })
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-city-manager-authToken")
                navigate('/city-manager/signIn', { replace: true })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
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

            {/*The div contains radio buttons to select an option */}
            <div className={`pt-24 pb-10 z-40 w-full fixed top-0 min-h-screen flex justify-center ${showApprovalForm ? '' : 'left-full'} ${alert.isAlertModal || showDetailsForm ? 'blur' : ''} `} onClick={hideApprovalForm}>
                <div className=" relative h-fit w-10/12 sm:w-9/12 md:w-7/12 bg-gray-300 rounded-md overflow-y-auto flex flex-col place-items-center px-2  md:px-0" onClick={e => e.stopPropagation()}>

                    <div className="absolute top-1 right-2 ">
                        {/*button to hide evaluation form*/}
                        <button className="text-3xl font-bold p-1 text-gray-600" onClick={hideApprovalForm}>X</button>
                    </div>

                    <div className="w-full mt-5">
                        {/*heading */}
                        <p className="text-xl font-semibold text-center ">Property Approval Form</p>
                    </div>

                    <form className="w-11/12 sm:w-8/12 flex flex-col rounded " >

                        {/*two radio button to know whether the information is complete or not*/}
                        <div className="flex flex-col gap-3 py-3">

                            {/*Radio button to send the data back to field agent for reevaluation*/}
                            <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 ">
                                <p className="text-xl font-semibold text-gray-500 mb-2 w-60 sm:w-96">Send back to field agent for reevaluation</p>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    <input
                                        className="mr-1 cursor-pointer"
                                        type="radio"
                                        id="sendToFieldAgent"
                                        name="approval-form"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.checked) {
                                                setSendBackToFieldAgent(true)
                                                setSendBackToPropertyEvaluator(false)
                                                setApproveProperty(false)
                                            }
                                        }} />
                                </div>
                            </div>

                            {/*Radio buttons to send the data back to evaluator for reevaluation*/}
                            <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16">
                                <p className="text-xl font-semibold text-gray-500 mb-2 w-60 sm:w-96">Send back to property evaluator</p>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    <input
                                        className="mr-1 cursor-pointer"
                                        type="radio"
                                        id="sendToPropertyEvaluator"
                                        name="approval-form"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.checked) {
                                                setSendBackToFieldAgent(false)
                                                setSendBackToPropertyEvaluator(true)
                                                setApproveProperty(false)
                                            }
                                        }} />
                                </div>
                            </div>

                            {/*Radio buttons to approve property*/}
                            <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16">
                                <p className="text-xl font-semibold text-gray-500 mb-2 w-60 sm:w-96">Approve property</p>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    <input
                                        className="mr-1 cursor-pointer"
                                        type="radio"
                                        id="approveProperty"
                                        name="approval-form"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.checked) {
                                                setSendBackToFieldAgent(false)
                                                setSendBackToPropertyEvaluator(false)
                                                setApproveProperty(true)
                                            }
                                        }} />
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-12 flex justify-center mt-3 px-2">
                            <button
                                type="button"
                                className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1 cursor-pointer '
                                disabled={spinner || alert.isAlertModal}
                                onClick={e => {
                                    e.stopPropagation()
                                    if (sendBackToFieldAgent === null && sendBackToPropertyEvaluator === null && approveProperty === null) {
                                        return
                                    }
                                    setShowDetailsForm(true)
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div >

            {/*a form to get details of incomplete information */}
            {showDetailsForm &&
                <div className={`pt-24 pb-10 z-40 w-full h-screen  fixed top-0 flex justify-center ${alert.isAlertModal ? 'blur' : ''} `} onClick={(e) => {
                    e.stopPropagation()
                    setShowDetailsForm(false)
                }}>

                    <div className="relative max-h-screen w-10/12 sm:w-9/12 md:w-7/12 bg-gray-300 rounded-md overflow-y-auto flex flex-col place-items-center overflow-y-auto px-2 md:px-0" onClick={e => e.stopPropagation()}>

                        <div className="absolute -top-1.5 right-0.5 ">
                            {/*button to hide evaluation form*/}
                            <button className="text-3xl font-bold p-1 text-gray-600" onClick={() => setShowDetailsForm(false)}>X</button>
                        </div>

                        {/*heading */}
                        <p className="text-lg font-semibold w-full text-center mt-4">Add details of incomplete information</p>

                        <form className="w-full sm:w-8/12 flex flex-col rounded mt-4" onSubmit={formSubmit}>
                            <div className="flex flex-row w-full">
                                <textarea
                                    className="w-full h-32 resize-none border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                                    placeholder="Add details here..."
                                    value={incompleteDetailsItem}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                        if (e.target.value.trim().length <= 200) {
                                            setIncompleteDetailsItem(e.target.value)
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="bg-green-500 hover:bg-green-600 text-4xl text-white font-semibold text-center px-2"
                                    onClick={() => {
                                        if (incompleteDetailsItem.trim() && incompleteDetailsItem.trim().length <= 200 && incompleteDetailsArray.length < 10) {
                                            setIncompleteDetailsArray(array => [...array, incompleteDetailsItem])
                                            setIncompleteDetailsItem('')
                                        }
                                    }}>+</button>
                            </div>

                            <div className="flex flex-row place-content-center">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="">You can add a maximum of 10 detail points</p>
                            </div>

                            {/*a list showing all the details */}
                            {incompleteDetailsArray.length > 0 && incompleteDetailsArray.map(detail => {
                                let indexToRemove: number = index - 1
                                return <div key={Math.random()} className="w-full flex flex-row justify-between items-center mt-2 bg-white">
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold pl-1">{index++}.</p>
                                        <p className="max-w-sm overflow-hidden">{detail}</p>
                                    </div>
                                    <div className="flex justify-center items-center h-full">
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white font-semibold text-xl h-fit px-2"
                                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                e.stopPropagation()
                                                const filteredArray = incompleteDetailsArray.filter(item => item !== incompleteDetailsArray[indexToRemove])
                                                setIncompleteDetailsArray(filteredArray)
                                            }}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            })}

                            <button
                                type="submit"
                                className="my-7 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1 cursor-pointer"
                                disabled={spinner || alert.isAlertModal}>
                                {spinner ? (
                                    <div className="spinner absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </form>
                    </div>
                </div >}
        </Fragment >
    )
}
export default ApprovalForm