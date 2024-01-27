import { Route, Routes, Navigate } from 'react-router-dom'
import { Fragment } from "react";

//Components imported for field agent
import HomeFieldAgent from "./components/field-agent/HomeFieldAgent";
import NavbarFieldAgent from "./components/field-agent/NavbarFieldAgent"
import PropertyDealerAddForm from "./components/field-agent/addPropertyDealer/PropertyDealerAddForm";
import FieldAgentSignIn from "./components/field-agent/FieldAgentSignIn";
import ListOfAllPropertyDealersAddedByFieldAgent from "./components/field-agent/ListOfAllPropertyDealersAddedByFieldAgent";
import AgriculturalPropertyAddForm from "./components/field-agent/addProperty/agricultural/AgriculturalPropertyAddForm";
import AddProperty from "./components/field-agent/addProperty/AddProperty";
import PropertiesAddedByFieldAgent from "./components/field-agent/listOfPropertiesAdded/PropertiesAddedByFieldAgent";
import CommercialPropertyAddForm from "./components/field-agent/addProperty/commercial/CommercialPropertyAddForm";
import ResidentialPropertyAddForm from "./components/field-agent/addProperty/residential/ResidentialPropertyAddForm";
import ListOfPendingPropertyReevaluations from './components/field-agent/ListOfPendingPropertyReevaluations';
import ReevaluateProperty from './components/field-agent/ReevaluateProperty';

//Components imported for property evaluator
import PropertyEvaluatorSignIn from "./components/propertyEvaluator/SignIn";
import PropertyEvaluatorHomePage from "./components/propertyEvaluator/HomePage";
import NavbarPropertyEvaluator from "./components/propertyEvaluator/Navbar";
import ListOfPropertiesToBeEvaluated from './components/propertyEvaluator/ListOfPropertiesToBeEvaluated';
import EvaluateProperty from './components/propertyEvaluator/EvaluateProperty';
import HomePage from './components/HomePage';

//Components evaluated for property dealer
import PropertyDealerSignIn from './components/property-dealer/SignIn';
import NavbarPropertyDealer from './components/property-dealer/Navbar';
import PropertyDealerHomePage from './components/property-dealer/HomePage';
import PropertyDealerSignUp from './components/property-dealer/SignUp';
import PropertyDealerDetails from './components/property-dealer/PropertyDealerDetails';
import CustomerNotifications from './components/property-dealer/CustomerNotifications';
import PropertiesPreviouslyAdded from './components/property-dealer/PropertiesPreviouslyAdded';
import ListOfPropertiesAddedByFieldAgent from './components/field-agent/listOfPropertiesAdded/ListOfPropertiesAddedByFieldAgent';

function App() {
  console.log('here')
  
  return (
    <Fragment>
      <div className="box-border w-full min-h-screen">

        <Routes>

          <Route path='/' element={<HomePage />}></Route>

          {/*Routes for field agent */}
          <Route path='/field-agent/*'>
            <Route path='' element={<>
              <NavbarFieldAgent />
              <HomeFieldAgent />
            </>}></Route>
            <Route path='signIn' element={<>
              <NavbarFieldAgent />
              <FieldAgentSignIn />
            </>}></Route>
            <Route path='add-property-dealer' element={<>
              <NavbarFieldAgent />
              <PropertyDealerAddForm />
            </>}></Route>
            <Route path='list-of-pending-property-reevaluations' element={<>
              <NavbarFieldAgent />
              <ListOfPendingPropertyReevaluations />
            </>}></Route>
            <Route path='list-of-property-dealers-added-by-field-agent' element={<>
              <NavbarFieldAgent />
              <ListOfAllPropertyDealersAddedByFieldAgent />
            </>
            }></Route>
            <Route path='reevaluate-property' element={<>
              <NavbarFieldAgent />
              <ReevaluateProperty />
            </>
            }></Route>

            {/*routes to add new property */}
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

            {/*routes to get properties previously added */}
            <Route path='properties-added/*' >
              <Route path='' element={<>
                <NavbarFieldAgent />
                <PropertiesAddedByFieldAgent />
              </>}></Route>
              <Route path='agricultural-properties' element={<>
                <NavbarFieldAgent />
                <ListOfPropertiesAddedByFieldAgent />
              </>}></Route>
              <Route path='commercial-properties' element={<>
                <NavbarFieldAgent />
                <ListOfPropertiesAddedByFieldAgent  />
              </>}></Route>
              <Route path='residential-properties' element={<>
                <NavbarFieldAgent />
                <ListOfPropertiesAddedByFieldAgent />
              </>}></Route>
              <Route path='*' element={<Navigate replace to='/field-agent' />}></Route>
            </Route>

            <Route path='*' element={<Navigate replace to='/field-agent' />}>
            </Route>
          </Route>

          {/*Routes for property evaluator */}
          <Route path='/property-evaluator/*'>
            <Route path='' element={<>
              <NavbarPropertyEvaluator />
              <PropertyEvaluatorHomePage />
            </>}></Route>
            <Route path='signIn' element={<>
              <NavbarPropertyEvaluator />
              <PropertyEvaluatorSignIn />
            </>}></Route>
            <Route path='list-of-pending-evaluations' element={<>
              <ListOfPropertiesToBeEvaluated />
              <NavbarPropertyEvaluator />
            </>}></Route>
            {<Route path='evaluate-property' element={<>
              <NavbarPropertyEvaluator />
              <EvaluateProperty />
            </>}></Route>}
            <Route path='*' element={<Navigate replace to='/property-evaluator' />}>
            </Route>
          </Route>

          {/*Routes for property dealer */}
          <Route path='/property-dealer/*'>
            <Route path='' element={<>
              <NavbarPropertyDealer />
              <PropertyDealerHomePage />
            </>}></Route>
            <Route path='signIn' element={<>
              <NavbarPropertyDealer />
              <PropertyDealerSignIn />
            </>}></Route>
            <Route path='signUp' element={<>
              <NavbarPropertyDealer />
              <PropertyDealerSignUp />
            </>}></Route>
            <Route path='details' element={<>
              <NavbarPropertyDealer />
              <PropertyDealerDetails />
            </>}></Route>
            <Route path='customer-notifications' element={<>
              <NavbarPropertyDealer />
              <CustomerNotifications />
            </>}></Route>
            <Route path='properties-added' element={<>
              <NavbarPropertyDealer />
              <PropertiesPreviouslyAdded />
            </>}></Route>
            <Route path='*' element={<Navigate replace to='/property-evaluator' />}>
            </Route>
          </Route>

          <Route path='*' element={<Navigate replace to='/' />}></Route>
        </Routes>

      </div>
    </Fragment>
  );
}

export default App;
