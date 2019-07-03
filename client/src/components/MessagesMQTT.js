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
      subscribeTopics: ["avl/+/message"],
      isConnected: false,
      isConnecting: false
    };

    this.mqttBrokerInfo = null;

    this.timeoutFunctions = [];
    this.mqttConnectingBlinkInterval = null;

    this.mqttClient = null;
    this.BOTTOM_TOASTER_TIMEOUT_DURATION = 5 * 1000;
    this.MQTT_CONNECT_TIMEOUT = 10 * 1000;
    this.MQTT_STATUS_BLINK_PERIOD = 500;
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    $("[data-toggle=popover]").popover({
      html: true,
      "white-space": "pre-wrap"
    });
    // eslint-disable-next-line no-undef
    // $("#subTopicPopoverBtn").popover({
    //   html: true,
    //   content: this.getSubscribedTopicsHTML
    // });
  }

  componentWillUnmount() {
    if (this.mqttClient) this.mqttClient.end();

    this.timeoutFunctions.forEach(timeoutFunction =>
      clearInterval(timeoutFunction)
    );
  }

  connectToMqttBroker = mqttBrokerInfo => {
    const mqttConnectionOptions = {
      clientId:
        "AVL_Nodejs_Client_" +
        Math.random()
          .toString(16)
          .substr(2, 8),
      host: mqttBrokerInfo.host,
      port: mqttBrokerInfo.port,
      reconnectPeriod: 1000,
      connectTimeout: 10 * 1000,
      protocolId: "MQTT",
      protocolVersion: 4,
      encoding: "utf8",
      protocol: "wss"
    };

    if (mqttBrokerInfo.username !== "")
      mqttConnectionOptions.username = mqttBrokerInfo.username;
    if (mqttBrokerInfo.password !== "")
      mqttConnectionOptions.password = mqttBrokerInfo.password.replace(
        /\s/g,
        ""
      );

    console.log("Mqtt Options: ", mqttConnectionOptions);

    try {
      this.mqttClient = mqtt.connect(
        mqttBrokerInfo.host,
        mqttConnectionOptions
      );
      this.timeoutFunctions.push(
        setTimeout(this.checkIfMqttConnected, this.MQTT_CONNECT_TIMEOUT)
      );
      this.mqttConnectingBlinkInterval = setInterval(
        this.mqttConnectingBlink,
        this.MQTT_STATUS_BLINK_PERIOD
      );
      this.timeoutFunctions.push(this.mqttConnectingBlinkInterval);
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occured while connecting to " + mqttBrokerInfo.host
      );
      this.setState({
        isConnected: false,
        isConnecting: false
      });
    }

    if (this.mqttClient) {
      this.mqttClient.on("connect", this.mqttCallbackOnConnect);
      this.mqttClient.on("message", this.mqttCallbackOnMessage);
      this.mqttClient.on("error", this.mqttCallbackOnError);
      this.mqttClient.on("disconnect", this.mqttCallbackOnDisconnect);
    }
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

  onMQTTBrokerDetailsSubmit = mqttBrokerInfo => {
    this.connectToMqttBroker(mqttBrokerInfo);
    this.mqttBrokerInfo = mqttBrokerInfo;

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

    const subTopicsCopy = this.state.subscribeTopics.concat(subTopicName);
    this.setState({
      subscribeTopics: subTopicsCopy
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
          modalId="mqttServerDetailsModal"
          mqttHostValue="mqtt://m24.cloudmqtt.com"
          mqttPortValue={39392}
          mqttUsernameValue="iwqksryy"
          mqttPasswordValue="	Z8EH2QkXg4ni"
          onMqttDetailsSubmit={this.onMQTTBrokerDetailsSubmit}
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
            <div className="btn-group" role="group">
              <button
                type="button"
                className={classNames("btn", {
                  "btn-outline-success": this.state.isConnected,
                  "btn-outline-warning":
                    this.state.isConnecting && !this.state.isConnected,
                  "btn-outline-danger":
                    !this.state.isConnected && !this.state.isConnecting
                })}
                data-trigger="focus"
                data-toggle="popover"
                title="MQTT Connection Status"
                data-placement="bottom"
                data-content={this.getMqttBrokerInfoTxt()}
              >
                <i className="fa fas fa-signal" />
              </button>
              <button
                type="button"
                id="subTopicPopoverBtn"
                className="btn"
                data-trigger="focus"
                data-html="true"
                data-toggle="popover"
                title="Subscribed Topics"
                data-placement="bottom"
                data-content={this.getSubscribedTopicsTxt()}
              >
                <i className="fa fas fa-list" />
              </button>
              <button
                type="button"
                className={classNames("btn", {
                  "btn-light": this.state.isConnected
                })}
                data-toggle="modal"
                data-target="#mqttDisconnectModal"
              >
                <i className="fa fas fa-plug" />
              </button>
            </div>
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

  mqttConnectingBlink = () => {
    this.setState({
      isConnecting: !this.state.isConnecting
    });
  };

  checkIfMqttConnected = () => {
    if (this.mqttClient && !this.mqttClient.connected) {
      this.mqttClient.end();
      let errorToastText;
      if (this.mqttBrokerInfo)
        errorToastText =
          "Can't connect to MQTT-Broker on " +
          this.mqttBrokerInfo.host +
          ":" +
          this.mqttBrokerInfo.port;
      else errorToastText = "MQTT Connection Timeout Error";
      toast.error(errorToastText);
      this.mqttClient = null;
      this.mqttBrokerInfo = null;
      this.setState({
        isConnected: false,
        isConnecting: false
      });
    }
    if (this.mqttConnectingBlinkInterval) {
      clearInterval(this.mqttConnectingBlinkInterval);
      this.mqttConnectingBlinkInterval = null;
    }
  };

  getMqttBrokerInfoTxt = () => {
    if (this.mqttClient && this.mqttBrokerInfo) {
      if (this.mqttClient.connected)
        return (
          "Connected to " +
          this.mqttBrokerInfo.host +
          ":" +
          this.mqttBrokerInfo.port
        );
      else
        return (
          "Connecting to " +
          this.mqttBrokerInfo.host +
          ":" +
          this.mqttBrokerInfo.port
        );
    } else return "Not connected to any MQTT Broker";
  };

  getSubscribedTopicsTxt = () => {
    let subTopicsTxt = "";
    this.state.subscribeTopics.map((subTopic, index) => {
      subTopicsTxt += `${index + 1} - ${subTopic}
      `;
    });
    return subTopicsTxt;
  };
}
