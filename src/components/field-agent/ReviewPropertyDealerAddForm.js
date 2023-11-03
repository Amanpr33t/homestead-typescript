import { Fragment, useEffect } from "react"
//import Spinner from "../Spinner"
//This component is tde navigation bar

function ReviewPropertyDealerAddForm(props) {
    const {
        firmName,
        propertyDealerName,
        experience,
        propertyType,
        addressArray,
        gstNumber,
        about,
        imageFile,
        email,
        contactNumber,
        blurReset,
        reviewFormHide
    } = props
    //const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [])

    const saveDetails = () => {

    }

    return (
        <Fragment>
            <div className=" w-full mt-20 mb-10 flex flex-col place-items-center" onClick={blurReset}>
                <div className="w-full flex justify-center mb-4">
                    <p className="text-2xl font-bold">Review the details before saving</p>
                </div>

                <table className="w-7/12  table-auto bg-white " onClick={e => e.stopPropagation()}>
                    <thead >
                        <tr className="bg-gray-200 border-2 border-gray-200">
                            <th className="w-40 text-xl pt-2 pb-2">Field</th>
                            <th className="text-xl ">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Firm name</td>
                            <td className=" pt-2 pb-2 text-center">{firmName}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Property dealer</td>
                            <td className="pt-2 pb-2 text-center">{propertyDealerName}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Experience</td>
                            <td className="pt-2 pb-2 text-center">{experience}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">GST Number</td>
                            <td className="pt-2 pb-2 text-center" >{gstNumber}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">property type</td>
                            <td className="flex flex-col pt-2 pb-2 text-center">
                                {propertyType.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Address</td>
                            <td className="flex flex-row place-content-center gap-2 flex-wrap pt-2 pb-2 text-center">
                                {addressArray.map(address => {
                                    return <div key={address.id} className="bg-gray-200 border-gray-200 rounded-lg w-60 p-1">
                                        <p className="">{address.flatPlotHouseNumber}, {address.areaSectorVillage}, near {address.landmark}, {address.city}, {address.state}</p>
                                        <p>Pincode: {address.postalCode}</p>
                                    </div>
                                })}
                            </td>
                        </tr>
                        {about && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">About</td>
                            <td className="pt-2 pb-2 text-center">{about}</td>
                        </tr>}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Email</td>
                            <td className="pt-2 pb-2 text-center">{email}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 border-2 border-gray-200 pt-2 pb-2 text-lg font-semibold">Contact Number</td>
                            <td className="pt-2 pb-2 text-center">{contactNumber}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Dealers Image</td>
                            <td className="pt-2 pb-2 flex justify-center">
                                <img style={{ width: '100px' }} src={imageFile} alt="" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="w-full flex gap-4 flex-row place-content-center pt-4">
                    <button type='button' className="bg-green-500 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={saveDetails}>Save</button>
                    <button type='button' className="bg-orange-400 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={reviewFormHide}>Edit</button>
                </div>
            </div>

        </Fragment >
    )
}
export default ReviewPropertyDealerAddForm