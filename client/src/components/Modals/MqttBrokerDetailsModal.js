import React, { Component } from "react";
import PropTypes from "prop-types";

export default class MqttBrokerDetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: props.mqttHostValue,
      port: props.mqttPortValue,
      username: props.mqttUsernameValue,
      password: props.mqttPasswordValue
    };
  }

  onMqttInfoChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.onMqttDetailsSubmit({ ...this.state });
  };

  render() {
    return (
      <div
        className="modal fade"
        id={this.props.modalId}
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
                      name="host"
                      value={this.state.host}
                      onChange={this.onMqttInfoChange}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="mqttPort">Port</label>
                    <input
                      type="number"
                      className="form-control"
                      id="mqttPort"
                      name="port"
                      value={this.state.port}
                      onChange={this.onMqttInfoChange}
                      placeholder="5555"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="mqttUsername"
                    placeholder="Username (if any)"
                    name="username"
                    value={this.state.username}
                    onChange={this.onMqttInfoChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="mqttPassword"
                    placeholder="Password (if any)"
                    name="password"
                    value={this.state.password}
                    onChange={this.onMqttInfoChange}
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
              <button
                type="button"
                className="btn btn-success"
                data-toggle="modal"
                data-target={`#${this.props.modalId}`}
                onClick={this.onSubmit}
              >
                Save and Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MqttBrokerDetailsModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  mqttHostValue: PropTypes.string.isRequired,
  mqttPortValue: PropTypes.number.isRequired,
  mqttUsernameValue: PropTypes.string.isRequired,
  mqttPasswordValue: PropTypes.string.isRequired,
  onMqttDetailsSubmit: PropTypes.func.isRequired
};
