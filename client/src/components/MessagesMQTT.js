/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import classNames from "classnames";
import mqtt from "mqtt";
import { toast } from "react-toastify";

import MqttShutdownModal from "./MqttShutdownModal";
import MqttBrokerDetailsModal from "./MqttBrokerDetailsModal";
import MqttSubTopicModal from "./MqttSubTopicModal";

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
      subscribeTopics: ["avl/+/message"],
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
        "AVL_Nodejs_Client_" +
        Math.random()
          .toString(16)
          .substr(2, 8),
      host: this.state.mqttBrokerInfo.mqttHost,
      port: this.state.mqttBrokerInfo.mqttPort,
      reconnectPeriod: 1000,
      protocolId: "MQTT",
      protocolVersion: 4,
      encoding: "utf8",
      protocol: "wss"
    };

    if (this.state.mqttBrokerInfo.mqttUsername !== "")
      mqttConnectionOptions.username = this.state.mqttBrokerInfo.mqttUsername;
    if (this.state.mqttBrokerInfo.mqttPassword !== "")
      mqttConnectionOptions.password = this.state.mqttBrokerInfo.mqttPassword.replace(
        /\s/g,
        ""
      );

    console.log("Mqtt Options: ", mqttConnectionOptions);

    this.mqttClient = mqtt.connect(
      this.state.mqttBrokerInfo.mqttHost,
      mqttConnectionOptions
    );
    console.log(this.mqttClient.connected);
    console.log(this.mqttClient.disconnected);
    this.mqttClient.on("connect", this.mqttCallbackOnConnect);
    this.mqttClient.on("message", this.mqttCallbackOnMessage);
    this.mqttClient.on("error", this.mqttCallbackOnError);
    this.mqttClient.on("disconnect", this.mqttCallbackOnDisconnect);
  };

  mqttCallbackOnConnect = () => {
    toast.success("Connected");
    this.setState({
      isConnected: true,
      isConnecting: false
    });
    console.log("Mqtt connected succesfully");
    console.log(this.mqttClient.connected);
    this.mqttClient.subscribe("avl/message/#", console.log);
  };

  mqttCallbackOnMessage = (topic, message) => {
    toast.info("Message received. Topic: ", topic);
    console.log(
      "Message received. Topic: ",
      topic,
      " Message: ",
      message.toString()
    );
  };

  mqttCallbackOnError = error => {
    toast.error("MQTT connection error occured.");
    this.setState({
      isConnected: false,
      isConnecting: false
    });
    console.error("Mqtt connection failed with error: ", error);
  };

  mqttCallbackOnDisconnect = () => {
    toast.error("Disconnected from the broker.");
    this.setState({
      isConnected: false,
      isConnecting: false
    });
    console.log("Mqtt client disconnected.");
  };

  onMQTTBrokerDetailsSaveBtnClick = event => {
    event.preventDefault();

    this.connectToMqttBroker();

    const mqttServerModalElement = document.getElementById(
      "mqttServerDetailsModal"
    );
    if (mqttServerModalElement)
      mqttServerModalElement.toggleAttribute("aria-hidden");

    this.bottomToast("Connecting to the broker...");
    this.setState({
      isConnected: false,
      isConnecting: true
    });
  };

  onMqttServerDetailsChange = event => {
    event.preventDefault();

    const mqttBrokerInfoCopy = Object.assign({}, this.state.mqttBrokerInfo);
    mqttBrokerInfoCopy[event.target.id] = event.target.value;
    this.setState({
      mqttBrokerInfo: mqttBrokerInfoCopy
    });
  };

  onShutdownMQTTConnectionBtnClick = event => {
    event.preventDefault();

    if (
      this.mqttClient &&
      (this.mqttClient.connected || this.mqttClient.reconnecting)
    ) {
      this.mqttClient.end();
      this.mqttClient = null;
      toast.info("MQTT connection is shutdown");
    } else toast.warn("MQTT client is not connected");
    this.setState({
      isConnected: false,
      isConnecting: false
    });
  };

  onMqttSubTopicSubmit = subTopicName => {
    console.debug("onMqttSubTopicSubmit: ", subTopicName);
    const subToastId = toast("Subscribing to " + subTopicName, {
      autoClose: false
    });

    // REPLACE
    setTimeout(() => {
      toast.update(subToastId, {
        render: `Subscribed to ${subTopicName}`,
        type: toast.TYPE.SUCCESS,
        autoClose: 1000,
        className: "rotateY animated"
      });
    }, 1500);
    // toast.info("Subscribing to => " + subTopicName);
  };

  render() {
    return (
      <div className="container-flud">
        {/* MQTT DISCONNECT POPUP */}
        <MqttShutdownModal
          onShutdownBtnClick={this.onShutdownMQTTConnectionBtnClick}
          modalId="mqttDisconnectModal"
        />
        <MqttBrokerDetailsModal
          onDetailsChange={this.onMqttServerDetailsChange}
          mqttHostValue={this.state.mqttBrokerInfo.mqttHost}
          mqttPortValue={this.state.mqttBrokerInfo.mqttPort}
          mqttUsernameValue={this.state.mqttBrokerInfo.mqttUsername}
          mqttPasswordValue={this.state.mqttBrokerInfo.mqttPassword}
          applyBtnClick={this.onMQTTBrokerDetailsSaveBtnClick}
        />
        <MqttSubTopicModal
          modalId="mqttSubscribeTopics"
          onSubTopicSubmit={this.onMqttSubTopicSubmit}
        />

        <div className="mqtt-container" align="center">
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
                "btn-outline-success": this.state.isConnected,
                "btn-outline-warning":
                  this.state.isConnecting && !this.state.isConnected,
                "btn-outline-danger":
                  !this.state.isConnected && !this.state.isConnecting
              })}
              data-toggle="modal"
              data-target="#mqttDisconnectModal"
            >
              <i className="fa fas fa-signal" />
            </button>
          </div>

          <div className="row justify-content-center m-5 w-25">
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
            <div className="col-3" align="center">
              <button
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#mqttSubscribeTopics"
              >
                Subscribe
              </button>
            </div>
          </div>

          <div className="row justify-content-center m-5">
            <div className="col-6" align="center">
              <h2>Messages over MQTT</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  bottomToast = text => {
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
