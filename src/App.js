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
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import { Fragment, useEffect } from "react";
import CommercialPropertyAddForm from "./components/field-agent/CommercialPropertyAddForm";
import ResidentialPropertyAddForm from "./components/field-agent/ResidentialPropertyAddForm";


function App() {
  const navigate = useNavigate()
  const authToken = localStorage.getItem("homestead-field-agent-authToken")

  useEffect(() => {
    if (!authToken) {
      navigate('/field-agent/signIn')
    }
  }, [authToken, navigate])

  return (
    <Fragment>
      <div className="box-border w-full min-h-screen">
        <NavbarFieldAgent />

        <Routes>

          <Route path='/field-agent/*'>
            <Route path='' element={<HomeFieldAgent />}></Route>
            <Route path='signIn' element={<FieldAgentSignIn />}></Route>
            <Route path='add-property-dealer' element={<PropertyDealerAddForm />}></Route>
            <Route path='list-of-property-dealers-added-by-field-agent' element={<ListOfAllPropertyDealersAddedByFieldAgent />}></Route>

            <Route path='add-property/*' >
              <Route path='' element={<AddProperty />}></Route>
              <Route path='agricultural' element={<AgriculturalPropertyAddForm />}></Route>
              <Route path='commercial' element={<CommercialPropertyAddForm />}></Route>
              <Route path='residential' element={<ResidentialPropertyAddForm />}></Route>
              <Route path='*' element={<Navigate replace to='/field-agent' />}></Route>
            </Route>

            <Route path='properties-added/*' >
              <Route path='' element={<ListOfPropertiesAddedByFieldAgent />}></Route>
              <Route path='agricultual-properties' element={<AgriculturalPropertiesAddedByFieldAgent />}></Route>
              <Route path='commercial-properties' element={<CommercialPropertiesAddedByFieldAgent />}></Route>
              <Route path='residential-properties' element={<ResidentialPropertyAddForm />}></Route>
              <Route path='*' element={<Navigate replace to='/field-agent' />}></Route>
            </Route>

            <Route path='*' element={<Navigate replace to='/field-agent' />}>
            </Route>
          </Route>

          <Route path='*' element={<Navigate replace to='/' />}></Route>
        </Routes>

      </div>
    </Fragment>
  );
}

export default App;
