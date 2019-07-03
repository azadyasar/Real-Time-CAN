import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import classNames from "classnames";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Comp1 from "./components/Comp1";
import NavBar from "./components/NavBar";
import ChartsContainer from "./components/ChartsContainer";
import MessagesMQTT from "./components/MessagesMQTT";

export default class App extends Component {
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
    return (
      <div className="App">
        <ToastContainer position="top-left" autoClose={5000} />
        <NavBar />
        <Switch>
          <Route exact path="/" component={Comp1} />
          <Route
            path="/real-time-stream"
            render={routeProps => (
              <ChartsContainer
                {...routeProps}
                pauseAllGraphsFlow={this.state.pauseAllGraphsFlow}
              />
            )}
          />
          <Route
            path="/messages"
            render={routeProps => (
              <MessagesMQTT {...routeProps} propTest="test" />
            )}
          />
        </Switch>
        <div className="toolbar">
          <div className="item">
            <button className="btn">
              <i className="fa fa-2x fa-car" />
            </button>
          </div>
          <div className="item">
            <button className="btn">
              <i className="fa fa-2x fa-cloud" />
            </button>
          </div>
          <div className="item">
            <button
              className={classNames("btn", {
                "btn-primary": this.state.pauseAllGraphsFlow,
                "btn-secondary": !this.state.pauseAllGraphsFlow
              })}
              onClick={this.onStartAllGraphFlowBtnClick}
            >
              <i
                className={classNames({
                  "fa fa-2x fa-play-circle": this.state.pauseAllGraphsFlow,
                  "fa fa-2x fa-pause-circle": !this.state.pauseAllGraphsFlow
                })}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
