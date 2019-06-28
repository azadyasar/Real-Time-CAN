import React, { Component } from "react";
import classNames from "classnames";
import mqtt from "mqtt";

export default class MessagesMQTT extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mqttHost: "",
      mqttPort: 111,
      isConnected: false,
      isConnecting: false
    };
  }

  render() {
    return (
      <div className="mqtt-container">
        {/* MQTT Connection Status */}
        <div className="mqtt-connection-status" align="center">
          <button
            type="button"
            className={classNames("btn", {
              "btn-success": this.state.isConnected,
              "btn-danger": !this.state.isConnected && !this.state.isConnecting,
              "btn-warning": this.state.isConnecting && !this.state.isConnected
            })}
          >
            Connection <i className="fa fas fa-signal" />
          </button>
        </div>
        <div
          className="modal fade"
          id="mqttServerDetailsModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="mqttServerModal"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  MQTT Broker Details
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* SERVER INFO FORM */}
                <form>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="mqttHost">Host</label>
                      <input
                        type="text"
                        className="form-control"
                        id="mqttHost"
                        placeholder="m12.cloudmqtt.com"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="mqttPort">Port</label>
                      <input
                        type="number"
                        className="form-control"
                        id="mqttPort"
                        placeholder="5555"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Username (if any)"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password (if any)"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center m-5">
          <div className="col-3" align="center">
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#mqttServerDetailsModal"
            >
              Connect
            </button>
          </div>
        </div>
        <div className="row justify-content-center m-5">
          <div className="col-6" align="center">
            <h2>Messaging over MQTT</h2>
          </div>
        </div>
      </div>
    );
  }
}
