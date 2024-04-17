import { Route, Routes, Navigate } from 'react-router-dom'
import { Fragment } from "react";

//Components imported for field agent
import HomeFieldAgent from "./components/field-agent/HomeFieldAgent";
import NavbarFieldAgent from "./components/field-agent/NavbarFieldAgent"
import PropertyDealerAddForm from "./components/field-agent/addPropertyDealer/PropertyDealerAddForm";
import AgriculturalPropertyAddForm from "./components/field-agent/addProperty/agricultural/AgriculturalPropertyAddForm";
import CommercialPropertyAddForm from "./components/field-agent/addProperty/commercial/CommercialPropertyAddForm";
import ResidentialPropertyAddForm from "./components/field-agent/addProperty/residential/ResidentialPropertyAddForm";
import PropertiesToBeReconsidered from './components/field-agent/reconsiderPropertyDetails/PropertiesToBeReconsidered';
import ListOfPropertiesToBeReconsidered from './components/field-agent/reconsiderPropertyDetails/ListOfPropertiesToBeReconsidered';
import ReconsiderCommercialPropertyDetails from './components/field-agent/reconsiderPropertyDetails/commercial/ReconsiderCommercialPropertyDetails';
import ReconsiderResidentialPropertyDetails from './components/field-agent/reconsiderPropertyDetails/residential/ReconsiderResidentialPropertyDetails';
import ReconsiderAgriculturalPropertyDetails from './components/field-agent/reconsiderPropertyDetails/agricultural/ReconsiderAgriculturalPropertyDetails';
import AddProperty from './components/field-agent/addProperty/AddProperty';

//Components imported for property evaluator
import PropertyEvaluatorHomePage from "./components/propertyEvaluator/HomePage";
import NavbarPropertyEvaluator from "./components/propertyEvaluator/Navbar";
import EvaluateProperty from './components/propertyEvaluator/evaluate-property/EvaluateProperty';
import PropertiesToBeEvaluated from './components/propertyEvaluator/evaluate-property/PropertiesToBeEvaluated';
import PropertiesToBeReevaluated from './components/propertyEvaluator/reevaluate-property/PropertiesToBeReevaluated';
import ListOfPropertiesToBeEvaluatedByEvaluator from './components/propertyEvaluator/evaluate-property/ListOfPropertiesToBeEvaluatedByEvaluator';
import ListOfPropertiesToBeReevaluatedByEvaluator from './components/propertyEvaluator/reevaluate-property/ListOfPropertiesToBeReevaluatedByEvaluator';
import ReevaluateProperty from './components/propertyEvaluator/reevaluate-property/ReevaluateProperty';

//Components imported for property dealer
import NavbarPropertyDealer from './components/property-dealer/Navbar';
import PropertyDealerHomePage from './components/property-dealer/HomePage';
import CustomerNotifications from './components/property-dealer/CustomerNotifications/CustomerNotifications';
import ReviewProperty from './components/property-dealer/reviewProperty/ReviewProperty';

//components imported for city manager
import NavbarCityManager from './components/city-manager/Navbar';
import CityManagerHomePage from './components/city-manager/HomePage';
import PropertiesPendingForApproval from './components/city-manager/PropertiesPendingForApproval';
import ApproveProperty from './components/city-manager/ApproveProperty';

import ListOfRequestsToAddProperty from './components/field-agent/requestsToAddNewProperty/ListOfRequestsToAddNewProperty';
import DealerDetails from './components/property-dealer/DealerDetails';


import NavbarUser from './components/user/Navbar';
import UserHomePage from './components/user/HomePage';
import DealerPage from './components/user/DealerPage';
import PropertyDetails from './components/user/reviewProperty/PropertyDetails';
import CommonSignInModal from './components/commonSignIn/SignIn';

const App: React.FC = () => {

  return (
    <Fragment>
      <div className="box-border w-full min-h-screen">

        <Routes>

          <Route path='/' element={<>
            <NavbarUser />
            <UserHomePage />
          </>}></Route>
          <Route path='/dealer-details' element={<>
            <NavbarUser />
            <DealerPage />
          </>}></Route>
          <Route path='/property' element={<>
            <NavbarUser />
            <PropertyDetails />
          </>}></Route>

          <Route path='/user' element={<>
            <CommonSignInModal />
          </>}></Route>

          {/*Routes for field agent */}
          <Route path='/field-agent/*'>

            <Route path='' element={<>
              <NavbarFieldAgent />
              <HomeFieldAgent />
            </>}></Route>
            <Route path='add-property-dealer' element={<>
              <NavbarFieldAgent />
              <PropertyDealerAddForm />
            </>}></Route>

            {/**routes to reconsider property details */}
            <Route path='reconsider-property-details/*' >
              <Route path='' element={<>
                <NavbarFieldAgent />
                <PropertiesToBeReconsidered />
              </>
              }></Route>
              <Route path='commercial' element={<>
                <NavbarFieldAgent />
                < ReconsiderCommercialPropertyDetails />
              </>
              }></Route>
              <Route path='residential' element={<>
                <NavbarFieldAgent />
                < ReconsiderResidentialPropertyDetails />
              </>
              }></Route>
              <Route path='agricultural' element={<>
                <NavbarFieldAgent />
                < ReconsiderAgriculturalPropertyDetails />
              </>
              }></Route>
              <Route path='commercial-properties' element={<>
                <NavbarFieldAgent />
                <ListOfPropertiesToBeReconsidered />
              </>}></Route>
              <Route path='agricultural-properties' element={<>
                <NavbarFieldAgent />
                <ListOfPropertiesToBeReconsidered />
              </>}></Route>
              <Route path='residential-properties' element={<>
                <NavbarFieldAgent />
                <ListOfPropertiesToBeReconsidered />
              </>}></Route>
              <Route path='*' element={<Navigate replace to='/field-agent' />}>
              </Route>
            </Route>

            {/*routes to add property */}
            <Route path='add-property/*' >
              <Route path='' element={<>
                <AddProperty />
                <NavbarFieldAgent />
              </>}></Route>
              <Route path='agricultural' element={<>
                <NavbarFieldAgent />
                <AgriculturalPropertyAddForm />
              </>}></Route>
              <Route path='commercial' element={<>
                <NavbarFieldAgent />
                <CommercialPropertyAddForm />
              </>}></Route>
              <Route path='residential' element={<>
                <NavbarFieldAgent />
                <ResidentialPropertyAddForm />
              </>}></Route>
              <Route path='*' element={<Navigate replace to='/field-agent' />}></Route>
            </Route>

            <Route path='requests-to-add-new-property' element={<>
              <NavbarFieldAgent />
              <ListOfRequestsToAddProperty />
            </>}></Route>

            <Route path='*' element={<Navigate replace to='/field-agent' />}>
            </Route>
          </Route>

          {/*Routes for property evaluator */}
          <Route path='/property-evaluator/*'>
            <Route path='' element={<>
              <NavbarPropertyEvaluator />
              <PropertyEvaluatorHomePage />
            </>}></Route>
            <Route path='properties-pending-for-evaluation' element={<>
              <PropertiesToBeEvaluated />
              <NavbarPropertyEvaluator />
            </>}></Route>
            <Route path='commercial-properties-to-be-evaluated' element={<>
              <ListOfPropertiesToBeEvaluatedByEvaluator />
              <NavbarPropertyEvaluator />
            </>}></Route>
            <Route path='agricultural-properties-to-be-evaluated' element={<>
              <ListOfPropertiesToBeEvaluatedByEvaluator />
              <NavbarPropertyEvaluator />
            </>}></Route>
            <Route path='residential-properties-to-be-evaluated' element={<>
              <ListOfPropertiesToBeEvaluatedByEvaluator />
              <NavbarPropertyEvaluator />
            </>}></Route>

            <Route path='properties-pending-for-reevaluation' element={<>
              <PropertiesToBeReevaluated />
              <NavbarPropertyEvaluator />
            </>}></Route>
            <Route path='commercial-properties-to-be-reevaluated' element={<>
              <ListOfPropertiesToBeReevaluatedByEvaluator />
              <NavbarPropertyEvaluator />
            </>}></Route>
            <Route path='agricultural-properties-to-be-reevaluated' element={<>
              <ListOfPropertiesToBeReevaluatedByEvaluator />
              <NavbarPropertyEvaluator />
            </>}></Route>
            <Route path='residential-properties-to-be-reevaluated' element={<>
              <ListOfPropertiesToBeReevaluatedByEvaluator />
              <NavbarPropertyEvaluator />
            </>}></Route>
            <Route path='reevaluate-property' element={<>
              <NavbarPropertyEvaluator />
              < ReevaluateProperty />
            </>}></Route>

            <Route path='evaluate-property' element={<>
              <NavbarPropertyEvaluator />
              <EvaluateProperty />
            </>}></Route>
            <Route path='*' element={<Navigate replace to='/property-evaluator' />}>
            </Route>
          </Route>

          {/*Routes for city manager */}
          <Route path='/city-manager/*'>
            <Route path='' element={<>
              <NavbarCityManager />
              <CityManagerHomePage />
            </>}></Route>
            <Route path='agricultural-properties-pending-for-approval' element={<>
              <NavbarCityManager />
              <PropertiesPendingForApproval />
            </>}></Route>
            <Route path='residential-properties-pending-for-approval' element={<>
              <NavbarCityManager />
              <PropertiesPendingForApproval />
            </>}></Route>
            <Route path='commercial-properties-pending-for-approval' element={<>
              <NavbarCityManager />
              <PropertiesPendingForApproval />
            </>}></Route>
            <Route path='approve-property' element={<>
              <NavbarCityManager />
              <ApproveProperty />
            </>}></Route>
            <Route path='*' element={<Navigate replace to='/city-manager' />}>
            </Route>
          </Route>

          {/*Routes for property dealer */}
          <Route path='/property-dealer/*'>
            <Route path='' element={<>
              <NavbarPropertyDealer />
              <PropertyDealerHomePage />
            </>}></Route>
            <Route path='review-property' element={<>
              <NavbarPropertyDealer />
              <ReviewProperty />
            </>}></Route>
            <Route path='customer-notifications' element={<>
              <NavbarPropertyDealer />
              <CustomerNotifications />
            </>}></Route>
            <Route path='dealer-details' element={<>
              <NavbarPropertyDealer />
              <DealerDetails />
            </>}></Route>
            <Route path='*' element={<Navigate replace to='/property-dealer' />}>
            </Route>
          </Route>

          <Route path='*' element={<Navigate replace to='/' />}></Route>
        </Routes>

      </div>
    </Fragment>
  );
}

export default App;
