import React from "react";
import PropTypes from "prop-types";

export default function MqttBrokerDetailsModal(props) {
  return (
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
                    value={props.mqttHostValue}
                    onChange={props.onDetailsChange}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="mqttPort">Port</label>
                  <input
                    type="number"
                    className="form-control"
                    id="mqttPort"
                    value={props.mqttPortValue}
                    onChange={props.onDetailsChange}
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
                  value={props.mqttUsernameValue}
                  onChange={props.onDetailsChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="mqttPassword"
                  placeholder="Password (if any)"
                  value={props.mqttPasswordValue}
                  onChange={props.onDetailsChange}
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
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#mqttServerDetailsModal"
              onClick={props.applyBtnClick}
            >
              Save and Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

MqttBrokerDetailsModal.propTypes = {
  onDetailsChange: PropTypes.func.isRequired,
  mqttHostValue: PropTypes.string.isRequired,
  mqttPortValue: PropTypes.number.isRequired,
  mqttUsernameValue: PropTypes.string.isRequired,
  mqttPasswordValue: PropTypes.string.isRequired,
  applyBtnClick: PropTypes.func.isRequired
};
