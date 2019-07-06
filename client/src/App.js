import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { connect } from "react-redux";
import { changeAllGraphFlow } from "./actions";

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
    mqttClient: state.mqttClient,
    isAllGraphFlowPaused: state.isAllGraphFlowPaused
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeAllGraphFlow: signal => dispatch(changeAllGraphFlow(signal))
  };
};

export class ConnectedApp extends Component {
  onStartAllGraphFlowBtnClick = event => {
    event.preventDefault();
    this.props.changeAllGraphFlow(null);
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
                  pauseAllGraphsFlow={this.props.isAllGraphFlowPaused}
                />
                <ChartsToolbar
                  pauseAllGraphsFlow={this.props.isAllGraphFlowPaused}
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

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedApp);

export default App;
