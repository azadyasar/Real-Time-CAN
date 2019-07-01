/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import classNames from "classnames";
import mqtt from "mqtt";
import { toast } from "react-toastify";
import pahoMqtt from "paho-mqtt";

export default class MessagesMQTT extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mqttBrokerInfo: {
        mqttHost: "mqtt://m24.cloudmqtt.com",
        mqttPort: 39392,
        mqttUsername: "iwqksryy",
        mqttPassword: "	Z8EH2QkXg4ni"
      },
      isConnected: false,
      isConnecting: false
    };

    this.mqttClient = null;
    this.BOTTOM_TOASTER_TIMEOUT_DURATION = 5 * 1000;
  }

  componentWillUnmount() {
    if (this.mqttClient) this.mqttClient.end();
  }

  connectToMqttBroker = () => {
    const mqttConnectionOptions = {
      clientId:
        "Nodejs_Client" +
        Math.random()
          .toString(16)
          .substr(2, 8),
      host: this.state.mqttBrokerInfo.mqttHost,
      port: this.state.mqttBrokerInfo.mqttPort,
      keepalive: 60,
      reconnectPeriod: 1000,
      protocolId: "MQIsdp",
      protocolVersion: 3,
      clean: true,
      encoding: "utf8"
    };

    if (this.state.mqttBrokerInfo.mqttUsername !== "")
      mqttConnectionOptions.username = this.state.mqttBrokerInfo.mqttUsername;
    if (this.state.mqttBrokerInfo.mqttPassword !== "")
      mqttConnectionOptions.password = this.state.mqttBrokerInfo.mqttPassword;

    console.log("Mqtt Options: ", mqttConnectionOptions);

    this.mqttClient = mqtt.connect(
      this.state.mqttBrokerInfo.mqttHost,
      mqttConnectionOptions
    );
    this.mqttClient.on("connect", this.mqttCallbackOnConnect);
    this.mqttClient.on("error", this.mqttCallbackOnError);
    this.mqttClient.on("disconnect", this.mqttCallbackOnDisconnect);
  };

  connectToPahoMqtt = () => {
    const client = new pahoMqtt.Client(
      this.state.mqttBrokerInfo.mqttHost,
      this.state.mqttBrokerInfo.mqttPort,
      "",
      "browser_mqtt_client"
    );
    const options = {
      userName: this.state.mqttBrokerInfo.mqttUsername,
      password: this.state.mqttBrokerInfo.mqttPassword
    };
    client.connect(options);
  };

  mqttCallbackOnConnect = () => {
    console.log("Mqtt connected succesfully");
    this.mqttClient.subscribe("+/test", this.mqttCallbackOnTestMsg);
  };

  mqttCallbackOnTestMsg = (topic, message) => {
    console.log("Message received. Topic: ", topic, " Message: ", message);
  };

  mqttCallbackOnError = error => {
    console.error("Mqtt connection failed with error: ", error);
  };

  mqttCallbackOnDisconnect = () => {
    console.log("Mqtt client disconnected.");
  };

  onMQTTBrokerDetailsSaveBtnClick = event => {
    event.preventDefault();

    console.debug("State: ", this.state);

    this.connectToMqttBroker();
    // this.connectToPahoMqtt();

    const mqttServerModalElement = document.getElementById(
      "mqttServerDetailsModal"
    );
    if (mqttServerModalElement)
      mqttServerModalElement.toggleAttribute("aria-hidden");
    this.bottomToast("Connecting to the server...");
    this.setState({
      isConnected: false,
      isConnecting: true
    });

    // REPLACE
    setTimeout(() => {
      this.setState({
        isConnected: true,
        isConnecting: false
      });
    }, 5000);
  };

  onMqttServerDetailsChange = event => {
    event.preventDefault();

    const mqttBrokerInfoCopy = Object.assign({}, this.state.mqttBrokerInfo);
    mqttBrokerInfoCopy[event.target.id] = event.target.value;
    this.setState({
      mqttBrokerInfo: mqttBrokerInfoCopy
    });
  };

  render() {
    return (
      <div className="mqtt-container">
        {/* Toast Container */}
        <div id="toast">
          <div id="img">
            <i className="fa fas fa-signal" />
          </div>
          <div id="desc" className="desc" />
        </div>
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
            <i className="fa fas fa-signal" />
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
                        value={this.state.mqttBrokerInfo.mqttHost}
                        onChange={this.onMqttServerDetailsChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="mqttPort">Port</label>
                      <input
                        type="number"
                        className="form-control"
                        id="mqttPort"
                        value={this.state.mqttBrokerInfo.mqttPort}
                        onChange={this.onMqttServerDetailsChange}
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
                      value={this.state.mqttBrokerInfo.mqttUsername}
                      onChange={this.onMqttServerDetailsChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="mqttPassword"
                      placeholder="Password (if any)"
                      value={this.state.mqttBrokerInfo.mqttPassword}
                      onChange={this.onMqttServerDetailsChange}
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
                  onClick={this.onMQTTBrokerDetailsSaveBtnClick}
                >
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

  bottomToast = text => {
    toast.success("Connected");
    const toastElement = document.getElementById("toast");
    if (!toastElement) {
      console.error("toastElement not found");
      return;
    }
    const toastText = toastElement.getElementsByClassName("desc")[0];
    if (toastText) toastText.textContent = text;
    toastElement.className = "show";
    setTimeout(() => {
      toastElement.className = toastElement.className.replace("show", "");
    }, this.BOTTOM_TOASTER_TIMEOUT_DURATION);
  };
}
