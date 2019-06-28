import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css";

export default class NavBar extends Component {
  onSearchSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="mx-auto d-sm-flex d-block flex-sm-nowrap">
            <Link className="navbar-brand" to="/">
              <img
                src={require("../img/avl_logo_svg.svg")}
                width="60"
                height="50"
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
            <div
              className="collapse navbar-collapse text-center"
              id="navbarNav"
            >
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
                    Disabled
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
                    Dropdown Link
                  </Link>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <Link className="dropdown-item" to="/messages">
                      MQTT
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Another Action
                    </Link>
                    <Link className="dropdown-item" to="#">
                      3rd Action
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
          </div>
        </nav>
      </div>
    );
  }
}
