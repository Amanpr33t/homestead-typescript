import validator from 'validator'
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from '../AlertModal'
import VerifyPropertyDealerBeforeAddingProperty from './VerifyPropertyDealerBeforeAddingProperty'

//This component is a form used by a field agent to add a property dealer
function AgriculturalPropertyAddForm() {
    const navigate = useNavigate()
    const [propertyDealer, setPropertyDealer] = useState()
    const [isPropertyDealerAvailable, setIsPropertyDealerAvailable] = useState(false)
    const fieldAgentAuthToken = localStorage.getItem('homestead-field-agent-authToken') //This variable is the authentication token stored in local storage
    const propertyDealerSetterFunction = (dealer) => {
        setIsPropertyDealerAvailable(true)
        setPropertyDealer(dealer)
    }

    return (
        <Fragment>

            {!isPropertyDealerAvailable && <VerifyPropertyDealerBeforeAddingProperty propertyDealerSetterFunction={propertyDealerSetterFunction} />}

            {isPropertyDealerAvailable && <div className={`p-1 mb-10 sm:p-0 w-full flex flex-col place-items-center `} >
                <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-10 bg-white sm:bg-transparent'>
                    <button type='button' className="bg-green-500 text-white font-semibold rounded-lg pl-2 pr-2 h-8" onClick={() => navigate('/field-agent')}>Home</button>
                </div>

                <p className="fixed w-full text-center top-28 sm:top-16 pl-4 pr-4 pb-4 sm:pt-4 bg-white  text-xl font-bold">Add an agricultural property by filling the form</p>

                <form className="w-full mt-40 sm:mt-36 sm:w-9/12 md:w-8/12 lg:w-7/12  h-fit p-4 flex flex-col rounded-lg border-2 border-gray-200 shadow-2xl bg-blue-300">
                    
                </form>

            </div>}
        </Fragment>
    )
}
export default AgriculturalPropertyAddForm