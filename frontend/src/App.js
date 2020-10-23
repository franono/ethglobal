import React from 'react';
import './App.css';
import 'react-banner/dist/style.css'
import Header from "components/Header/Header.js";

/*
  Importing pages to be rendered here
*/
import LandingPage from "views/LandingPage/LandingPage.js";
import Standard from "views/Pages/Standard/Standard.js";
import Secret from "views/Pages/Secret/Secret.js";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const dashboardRoutes = [];

class App extends React.Component {
 // const App = props => (
 render() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={LandingPage}/>
        <Route exact path="/Secret" component={Secret}/>
      </Switch>
    </div>
  );
  }
}
 
export default App;

