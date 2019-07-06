import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { connect } from "react-redux";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Comp1 from "./components/Comp1";
import NavBar from "./components/NavBar";
import ChartsContainer from "./components/ChartsContainer";
import MessagesMQTT from "./components/MessagesMQTT";
import ChartsToolbar from "./components/ChartsToolbar";

const mapStateToProps = state => {
  console.debug("App mapStateToProps state: ", state);
  return {
    mqttClient: state.mqttClient
  };
};

export class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pauseAllGraphsFlow: true
    };
  }

  onStartAllGraphFlowBtnClick = event => {
    event.preventDefault();
    this.setState({ pauseAllGraphsFlow: !this.state.pauseAllGraphsFlow });
  };

  render() {
    console.debug("App.js render: this: ", this);
    return (
      <div className="App">
        <ToastContainer position="top-left" autoClose={5000} />
        <NavBar />
        <Switch>
          <Route exact path="/" component={Comp1} />
          <Route
            path="/real-time-stream"
            render={routeProps => (
              <React.Fragment>
                <ChartsContainer
                  {...routeProps}
                  pauseAllGraphsFlow={this.state.pauseAllGraphsFlow}
                />
                <ChartsToolbar
                  pauseAllGraphsFlow={this.state.pauseAllGraphsFlow}
                  onStartAllGraphFlowBtnClick={this.onStartAllGraphFlowBtnClick}
                />
              </React.Fragment>
            )}
          />
          <Route
            path="/messages"
            render={routeProps => <MessagesMQTT {...routeProps} />}
          />
        </Switch>
      </div>
    );
  }
}

const App = connect(mapStateToProps)(ConnectedApp);

export default App;
