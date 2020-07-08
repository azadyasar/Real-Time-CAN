import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
import PropTypes from "prop-types";

import ChartsToolbar from "./ChartsToolbar";

import { connect } from "react-redux";
import { changeAllGraphFlow, resetAllChartData } from "../actions";

const mapStateToProps = state => {
  return {
    isAllGraphFlowPaused: state.chart.isAllGraphFlowPaused
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeAllGraphFlow: signal => dispatch(changeAllGraphFlow(signal)),
    resetAllChartData: signal => dispatch(resetAllChartData(signal))
  };
};

class WithRouterNavBar extends Component {
  constructor(props) {
    super(props);
    console.debug("Navbar constructor props:", props);
  }

  onSearchSubmit = event => {
    event.preventDefault();
  };

  // CHARTS TOOLBAR
  onStartAllGraphFlowBtnClick = event => {
    event.preventDefault();
    this.props.changeAllGraphFlow(null);
  };

  onCleanAllChartDataBtnClick = event => {
    event.preventDefault();
    this.props.resetAllChartData(null);
  };

  render() {
    const { location } = this.props;

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          {/* <div className="mx-auto d-sm-flex d-block flex-sm-nowrap"> */}
          <Link className="navbar-brand align-self-start" align="left" to="/">
            <img
              src={require("../img/avl_logo_svg.svg")}
              width="60"
              height="60"
              alt=""
            />{" "}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse text-center" id="navbarNav">
            <ul className="navbar-nav ">
              <li className="nav-item active">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/real-time-stream">
                  Real-Time Stream
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link disabled" to="/disabled">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/"
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Connections
                </Link>
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link className="dropdown-item" to="/messages">
                    MQTT
                  </Link>
                  <Link className="dropdown-item disabled" to="#">
                    WebSocket
                  </Link>
                  <Link className="dropdown-item disabled" to="#">
                    HTTP
                  </Link>
                </div>
              </li>
            </ul>
            <form
              className="form-inline my-2 my-lg-0 ml-4"
              onSubmit={this.onSearchSubmit}
            >
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                className="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
          {/* </div> */}
          {this.getAdditionalNavbarContent(location)}
        </nav>{" "}
      </div>
    );
  }

  getAdditionalNavbarContent = location => {
    console.debug("getAdditionalNavbarContent location: ", location);
    switch (location.pathname) {
      case "/real-time-stream":
        console.debug("Returning real-time-stream");
        return (
          <ChartsToolbar
            pauseAllGraphsFlow={this.props.isAllGraphFlowPaused}
            onStartAllGraphFlowBtnClick={this.onStartAllGraphFlowBtnClick}
            onCleanAllChartDataBtnClick={this.onCleanAllChartDataBtnClick}
            chartSettingsModalId="chartSettingsModalId"
          />
        );
      default:
        break;
    }
  };
}

WithRouterNavBar.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const ConnectedNavBar = withRouter(WithRouterNavBar);
const NavBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedNavBar);
export default NavBar;
