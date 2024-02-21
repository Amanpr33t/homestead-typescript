import React from 'react';
import { formatDate } from '../../utils/dateFunctions';
import { capitalizeFirstLetterOfAString } from '../../utils/stringUtilityFunctions';
import { useNavigate } from 'react-router-dom';

interface FetchedPropertyType {
  _id: string,
  location: {
    name: {
      plotNumber?: number | null,
      village: string | null,
      city: string | null,
      tehsil: string | null,
      district: string,
      state: string
    }
  },
  isApprovedByCityManager: {
    isApproved: boolean
  },
  isLive: boolean,
  createdAt: string
}

interface PropsType {
  propertyData: FetchedPropertyType[],
  selectedPropertyType:'agricultural' | 'residential' | 'commercial'
}

const TableProperty: React.FC<PropsType> = ({ propertyData,selectedPropertyType }) => {
  let index: number = 0
  const navigate=useNavigate()

  const statusSetter = (isApproved: boolean, isLive: boolean): string | undefined => {
    if (!isApproved) {
      return 'Approval pending'
    } else if (isLive) {
      return 'Live'
    } else if (!isLive) {
      return 'Inactive'
    }
  }

  const statusColorSetter = (isApproved: boolean, isLive: boolean): string | undefined => {
    if (!isApproved) {
      return 'text-orange-500'
    } else if (isLive) {
      return 'text-green-500'
    } else if (!isLive) {
      return 'text-gray-600'
    }
  }

  return (
    <table className="w-full sm:w-10/12 lg:w-8/12 divide-y divide-gray-200 ">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-0.5 sm:px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          <th scope="col" className="text-center px-1.5 sm:px-3 md:px-6 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Location
          </th>
          <th scope="col" className="hidden sm:flex sm:justify-center px-1.5 sm:px-3 md:px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Added on
          </th>
          <th scope="col" className="px-1.5 sm:px-3 md:px-6 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" className="px-1.5 sm:px-3 md:px-6 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {propertyData.map((data) => {
          index++
          return <tr key={Math.random()}>
            <td className="px-0.5 sm:px-3 py-4 whitespace-nowrap ">{index}</td>
            <td className="px-1.5 sm:px-3 md:px-6 sm:px-6  py-4">
              <div className='flex flex-col place-items-center'>
                {data.location.name.plotNumber && <div className='flex flex-row gap-1'>
                  <p className='font-semibold hidden sm:block'>Plot no.-</p>
                  <p className='text-center'>{data.location.name.plotNumber}</p>
                </div>}
                {data.location.name.village && <div className='flex flex-row gap-1'>
                  <p className='font-semibold hidden sm:block'>Village-</p>
                  <p className='text-center'>{capitalizeFirstLetterOfAString(data.location.name.village)}</p>
                </div>}
                {data.location.name.city && <div className='flex flex-row gap-1'>
                  <p className='font-semibold hidden sm:block'>City-</p>
                  <p className='text-center'>{capitalizeFirstLetterOfAString(data.location.name.city)}</p>
                </div>}
                {data.location.name.tehsil && <div className='flex flex-row gap-1'>
                  <p className='font-semibold hidden sm:block'>Tehisil-</p>
                  <p className='text-center'>{capitalizeFirstLetterOfAString(data.location.name.tehsil)}</p>
                </div>}
                {data.location.name.district && <div className='flex flex-row gap-1'>
                  <p className='font-semibold hidden sm:block'>District-</p>
                  <p className='text-center'>{capitalizeFirstLetterOfAString(data.location.name.district)}</p>
                </div>}
                {data.location.name.state && <div className='flex flex-row gap-1'>
                  <p className='font-semibold hidden sm:block'>State-</p>
                  <p className='text-center'>{capitalizeFirstLetterOfAString(data.location.name.state)}</p>
                </div>}
              </div>
            </td>
            <td className="px-1.5 sm:px-3 md:px-6 py-4 text-center hidden sm:block whitespace-nowrap h-full">
              {formatDate(data.createdAt)}
            </td>
            <td className={`px-1.5 sm:px-3 md:px-6 py-4 text-center  sm:text-lg sm:font-semibold ${statusColorSetter(data.isApprovedByCityManager.isApproved, data.isLive)}`}>{statusSetter(data.isApprovedByCityManager.isApproved, data.isLive)}</td>
            <td className="px-1.5 sm:px-3 md:px-6 py-4 whitespace-nowrap">
              <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out" onClick={() => {
                navigate(`/property-dealer/review-property?type=${selectedPropertyType}&id=${data._id}`)
              }}>
                Open
              </button>
            </td>
          </tr>
        })}
      </tbody>
    </table>
  );
};

export default TableProperty
