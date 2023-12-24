import { Route, Routes, Navigate } from 'react-router-dom'
import { Fragment } from "react";

//Components imported for field agent
import HomeFieldAgent from "./components/field-agent/HomeFieldAgent";
import NavbarFieldAgent from "./components/field-agent/NavbarFieldAgent"
import PropertyDealerAddForm from "./components/field-agent/PropertyDealerAddForm";
import FieldAgentSignIn from "./components/field-agent/FieldAgentSignIn";
import ListOfAllPropertyDealersAddedByFieldAgent from "./components/field-agent/ListOfAllPropertyDealersAddedByFieldAgent";
import AgriculturalPropertyAddForm from "./components/field-agent/AgriculturalPropertyAddForm";
import AddProperty from "./components/field-agent/AddProperty";
import ListOfPropertiesAddedByFieldAgent from "./components/field-agent/ListOfPropertiesAddedByFieldAgent";
import AgriculturalPropertiesAddedByFieldAgent from "./components/field-agent/AgriculturalPropertiesAddedByFieldAgent";
import CommercialPropertiesAddedByFieldAgent from "./components/field-agent/CommercialPropertiesAddedByFieldAgent";
import ResidentialPropertiesAddedByFieldAgent from "./components/field-agent/ResidentialPropertiesAddedByFieldAgent";
import CommercialPropertyAddForm from "./components/field-agent/CommercialPropertyAddForm";
import ResidentialPropertyAddForm from "./components/field-agent/ResidentialPropertyAddForm";
import ListOfPendingPropertyReevaluations from './components/field-agent/ListOfPendingPropertyReevaluations';
import ReevaluateProperty from './components/field-agent/ReevaluateProperty';

//Components imported for property evaluator
import PropertyEvaluatorSignIn from "./components/propertyEvaluator/SignIn";
import PropertyEvaluatorHomePage from "./components/propertyEvaluator/HomePage";
import NavbarPropertyEvaluator from "./components/propertyEvaluator/Navbar";
import ListOfPropertiesToBeEvaluated from './components/propertyEvaluator/ListOfPropertiesToBeEvaluated';
import EvaluateProperty from './components/propertyEvaluator/EvaluateProperty';


function App() {
  const currentUrl = window.location.href

  return (
    <Fragment>
      <div className="box-border w-full min-h-screen">
        {currentUrl.includes('field-agent') && <NavbarFieldAgent />}
        {currentUrl.includes('property-evaluator') && <NavbarPropertyEvaluator />}

        <Routes>

          {/*Routes for field agent */}
          <Route path='/field-agent/*'>
            <Route path='' element={<HomeFieldAgent />}></Route>
            <Route path='signIn' element={<FieldAgentSignIn />}></Route>
            <Route path='add-property-dealer' element={<PropertyDealerAddForm />}></Route>
            <Route path='list-of-pending-property-reevaluations' element={<ListOfPendingPropertyReevaluations />}></Route>
            <Route path='list-of-property-dealers-added-by-field-agent' element={<ListOfAllPropertyDealersAddedByFieldAgent />}></Route>
            <Route path='reevaluate-property' element={<ReevaluateProperty />}></Route>

            {/*routes to add new property */}
            <Route path='add-property/*' >
              <Route path='' element={<AddProperty />}></Route>
              <Route path='agricultural' element={<AgriculturalPropertyAddForm />}></Route>
              <Route path='commercial' element={<CommercialPropertyAddForm />}></Route>
              <Route path='residential' element={<ResidentialPropertyAddForm />}></Route>
              <Route path='*' element={<Navigate replace to='/field-agent' />}></Route>
            </Route>

            {/*routes to get proeprties previously added */}
            <Route path='properties-added/*' >
              <Route path='' element={<ListOfPropertiesAddedByFieldAgent />}></Route>
              <Route path='agricultual-properties' element={<AgriculturalPropertiesAddedByFieldAgent />}></Route>
              <Route path='commercial-properties' element={<CommercialPropertiesAddedByFieldAgent />}></Route>
              <Route path='residential-properties' element={<ResidentialPropertiesAddedByFieldAgent />}></Route>
              <Route path='*' element={<Navigate replace to='/field-agent' />}></Route>
            </Route>

            <Route path='*' element={<Navigate replace to='/field-agent' />}>
            </Route>
          </Route>

          {/*Routes for property evaluator */}
          <Route path='/property-evaluator/*'>
            <Route path='' element={<PropertyEvaluatorHomePage />}></Route>
            <Route path='signIn' element={<PropertyEvaluatorSignIn />}></Route>
            <Route path='list-of-pending-evaluations' element={<ListOfPropertiesToBeEvaluated />}></Route>
            {<Route path='evaluate-property' element={<EvaluateProperty />}></Route>}
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
