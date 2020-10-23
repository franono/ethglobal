import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Header from "./components/Header/header";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import HomePage from "./views/HomePage/homepage";
import Secret from "views/Secret/secret";
import ParticlesContainer from "./assets/jsassets/particles";

const routing = (
    <Router>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
      >
        <Header />
        <hr />
        <Switch>
            <Route path="/" component={Secret} />
        </Switch>
        <ParticlesContainer />
      </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
