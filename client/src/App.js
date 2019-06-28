import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Comp1 from "./components/Comp1";
import NavBar from "./components/NavBar";
import ChartsContainer from "./components/ChartsContainer";
import classNames from "classnames";

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
