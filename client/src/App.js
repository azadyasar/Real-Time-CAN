import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { connect } from "react-redux";
import { changeAllGraphFlow } from "./actions";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "ladda/dist/ladda.min.css";

import Landing from "./components/Landing";
import NavBar from "./components/NavBar";
import ChartsContainer from "./components/ChartsContainer";
import MessagesMQTT from "./components/MessagesMQTT";

const mapStateToProps = state => {
  console.debug("App mapStateToProps state: ", state);
  return {
    mqttClient: state.mqtt.mqttClient,
    isAllGraphFlowPaused: state.chart.isAllGraphFlowPaused,
    mqttObserverCallbacks: state.mqtt.mqttObserverCallbacks
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

  onMqttMessageReceived = (topic, message) => {
    console.debug("App onMqttMessageReceived: ", topic + " " + message);
    console.log(this.props);
    if (this.props.mqttObserverCallbacks[topic]) {
      this.props.mqttObserverCallbacks[topic].forEach(cb => cb(topic, message));
    }
  };

  render() {
    console.debug("App.js render: this: ", this);
    return (
      <div className="App">
        <ToastContainer position="top-left" autoClose={5000} />
        <NavBar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route
            path="/real-time-stream"
            render={routeProps => (
              <React.Fragment>
                <ChartsContainer
                  {...routeProps}
                  pauseAllGraphsFlow={this.props.isAllGraphFlowPaused}
                />
              </React.Fragment>
            )}
          />
          <Route
            path="/messages"
            render={routeProps => (
              <MessagesMQTT
                {...routeProps}
                distributeMqttMessage={this.onMqttMessageReceived}
              />
            )}
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
