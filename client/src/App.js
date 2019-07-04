import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Comp1 from "./components/Comp1";
import NavBar from "./components/NavBar";
import ChartsContainer from "./components/ChartsContainer";
import MessagesMQTT from "./components/MessagesMQTT";
import ChartsToolbar from "./components/ChartsToolbar";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pauseAllGraphsFlow: true,
      mqttClient: null,
      mqttClientId: "",
      mqttBrokerInfo: null
    };
  }

  onStartAllGraphFlowBtnClick = event => {
    event.preventDefault();
    this.setState({ pauseAllGraphsFlow: !this.state.pauseAllGraphsFlow });
  };

  /**
   * `mqttConnectionObject` contains
   * - mqttClient
   * - mqttCliendId
   * - mqttBrokerInfo
   */
  onMqttConnection = mqttConnectionObject => {
    this.setState({
      mqttClient: mqttConnectionObject.mqttClient,
      mqttClientId: mqttConnectionObject.mqttClientId,
      mqttBrokerInfo: mqttConnectionObject.mqttBrokerInfo
    });
  };

  forceUpdateApp = () => {
    this.forceUpdate();
  };

  render() {
    console.debug("App.js render: ", this.state);
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
                  mqttClient={this.state.mqttClient}
                  mqttClientId={this.state.mqttClientId}
                  mqttBrokerInfo={this.state.mqttBrokerInfo}
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
            render={routeProps => (
              <MessagesMQTT
                {...routeProps}
                mqttClient={this.state.mqttClient}
                mqttClientId={this.state.mqttClientId}
                mqttBrokerInfo={this.state.mqttBrokerInfo}
                onMqttConnection={this.onMqttConnection}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}
