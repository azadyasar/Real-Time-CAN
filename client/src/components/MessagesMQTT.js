/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import mqtt from "mqtt";
import { toast } from "react-toastify";

import { connect } from "react-redux";
import { updateMqttConnection, mqttTextMessageReceived } from "../actions";

import MqttShutdownModal from "./MqttShutdownModal";
import MqttBrokerDetailsModal from "./MqttBrokerDetailsModal";
import MqttSubTopicModal from "./MqttSubTopicModal";
import MqttStatusBar from "./MqttStatusBar";

const mapDispatchToProps = dispatch => {
  return {
    updateMqttConnection: newMqttClient =>
      dispatch(updateMqttConnection(newMqttClient)),
    mqttTextMessageReceived: newMqttTextMessage =>
      dispatch(mqttTextMessageReceived(newMqttTextMessage))
  };
};

const mapStateToProps = state => {
  console.debug("MessagesMQTT mapStateToProps state: ", state);
  return {
    mqttClient: state.mqttClient,
    mqttReceivedTextMessages: state.mqttReceivedTextMessages
  };
};

export class ConnectedMessagesMQTT extends Component {
  constructor(props) {
    super(props);
    console.debug("MessagesMQTT constructor");
    this.state = {
      subscribeTopics: ["avl/+/message"],
      mqttClientId: null,
      isConnecting: false
    };

    this.mqttConnectingBlinkInterval = null;
    this.checkIfMqttConnectedTimeout = null;

    this.mqttClient = props.mqttClient;
    if (props.mqttClient && props.mqttClient.connected) {
      this.state.isConnected = true;
      this.state.isConnecting = false;
    }

    this.mqttBrokerInfo = props.mqttBrokerInfo;

    this.BOTTOM_TOASTER_TIMEOUT_DURATION = 5 * 1000;
    this.MQTT_CONNECT_TIMEOUT = 10 * 1000;
    this.MQTT_STATUS_BLINK_PERIOD = 500;
  }

  componentDidMount() {
    console.debug(
      "MessagesMQTT mounted state: ",
      this.state,
      ", props: ",
      this.props
    );

    let isConnecting;
    if (this.mqttClient)
      isConnecting =
        this.mqttClient.reconnecting !== undefined
          ? this.mqttClient.reconnecting
          : false;
    else isConnecting = this.state.isConnecting;
    console.debug("isConnecting: ", isConnecting);

    if (isConnecting) {
      this.mqttConnectingBlinkInterval = setInterval(
        this.mqttConnectingBlink,
        this.MQTT_STATUS_BLINK_PERIOD
      );
      this.checkIfMqttConnectedTimeout = setTimeout(
        this.checkIfMqttConnected,
        this.MQTT_CONNECT_TIMEOUT
      );
    }
    // eslint-disable-next-line no-undef
    $("[data-toggle=popover]").popover({
      html: true,
      "white-space": "pre-wrap"
    });
  }

  componentWillReceiveProps(nextProps) {
    console.debug("MessagesMQTT received props: ", nextProps);
    this.mqttClient = nextProps.mqttClient;

    let isConnecting;
    if (!nextProps.mqttClient) isConnecting = false;
    else
      isConnecting =
        (nextProps.mqttClient != null
          ? nextProps.mqttClient.reconnecting
          : false) || this.state.isConnecting;

    console.debug("MessagesMQTT isConnecting: ", isConnecting);
    if (nextProps.mqttClient && nextProps.mqttClient.connected)
      this.setState({
        isConnecting: false
      });
    else
      this.setState({
        isConnecting
      });
  }

  componentWillUpdate(props) {
    console.debug("MessagesMQTT will update. Props: ", props);
  }

  componentWillUnmount() {
    console.debug("MessagesMQTT will unmount");
    if (this.mqttConnectingBlinkInterval) {
      clearInterval(this.mqttConnectingBlinkInterval);
      this.mqttConnectingBlinkInterval = null;
    }
    if (this.checkIfMqttConnectedTimeout) {
      clearTimeout(this.checkIfMqttConnectedTimeout);
      this.checkIfMqttConnectedTimeout = null;
    }
  }

  connectToMqttBroker = targetMqttBrokerInfo => {
    const mqttClientId =
      "AVL_Nodejs_Client_" +
      Math.random()
        .toString(16)
        .substr(2, 8);

    const mqttConnectionOptions = {
      clientId: mqttClientId,
      host: targetMqttBrokerInfo.host,
      port: targetMqttBrokerInfo.port,
      reconnectPeriod: 1000,
      connectTimeout: 10 * 1000,
      protocolId: "MQTT",
      protocolVersion: 4,
      encoding: "utf8",
      protocol: "wss"
    };

    if (targetMqttBrokerInfo.username !== "")
      mqttConnectionOptions.username = targetMqttBrokerInfo.username;
    if (targetMqttBrokerInfo.password !== "")
      mqttConnectionOptions.password = targetMqttBrokerInfo.password.replace(
        /\s/g,
        ""
      );

    console.log("Mqtt Options: ", mqttConnectionOptions);

    try {
      this.mqttClient = mqtt.connect(
        targetMqttBrokerInfo.host,
        mqttConnectionOptions
      );

      this.checkIfMqttConnectedTimeout = setTimeout(
        this.checkIfMqttConnected,
        this.MQTT_CONNECT_TIMEOUT
      );

      this.mqttConnectingBlinkInterval = setInterval(
        this.mqttConnectingBlink,
        this.MQTT_STATUS_BLINK_PERIOD
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occured while connecting to " + targetMqttBrokerInfo.host
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
      this.mqttClient.on("offline", this.mqttOnOffline);
      this.mqttClient.on("end", this.mqttOnEnd);
      this.mqttClient.on("close", this.mqttOnClose);
    }
    this.props.updateMqttConnection(this.mqttClient);
  };

  mqttCallbackOnConnect = () => {
    toast.success("Connected");
    this.setState({
      isConnected: true,
      isConnecting: false
    });
    if (this.mqttConnectingBlinkInterval) {
      clearInterval(this.mqttConnectingBlinkInterval);
      this.mqttConnectingBlinkInterval = null;
    }
    console.log("Mqtt connected succesfully");

    this.state.subscribeTopics.forEach(topic =>
      this.mqttClient.subscribe(topic, console.log)
    );
    this.props.updateMqttConnection(this.mqttClient);
  };

  mqttCallbackOnMessage = (topic, message) => {
    toast.info("Message received. Topic: " + topic, {
      autoClose: 2000
    });
    console.log(
      "Message received. Topic: ",
      topic,
      " Message: ",
      message.toString()
    );
    this.props.mqttTextMessageReceived({ topic, message });
  };

  mqttCallbackOnError = error => {
    toast.error(
      "MQTT connection error occured. \nDetails: " + error.toString(),
      {
        autoClose: 7500
      }
    );
    if (this.checkIfMqttConnectedTimeout) {
      clearTimeout(this.checkIfMqttConnectedTimeout);
      this.checkIfMqttConnectedTimeout = null;
    }
    if (this.mqttConnectingBlinkInterval) {
      clearInterval(this.mqttConnectingBlinkInterval);
      this.mqttConnectingBlinkInterval = null;
    }
    if (this.mqttClient) this.mqttClient.end();
    this.props.updateMqttConnection(null);
    console.error("Mqtt connection failed with error: ", error);
  };

  mqttCallbackOnDisconnect = () => {
    toast.error("Disconnected from the broker.");
    this.setState({
      isConnecting: false
    });
    this.props.updateMqttConnection(null);
    console.log("Mqtt client disconnected.");
  };

  mqttOnClose = () => {
    toast.info("MQTT connection is closed.");
    console.debug("mqttOnClose");
  };

  mqttOnOffline = () => {
    console.debug("mqttOnOffline");
    toast.error("Make sure that you have internet access");
    if (this.mqttConnectingBlinkInterval) {
      clearInterval(this.mqttConnectingBlinkInterval);
      this.mqttConnectingBlinkInterval = null;
    }
    if (this.checkIfMqttConnectedTimeout) {
      clearTimeout(this.checkIfMqttConnectedTimeout);
      this.checkIfMqttConnectedTimeout = null;
    }
    this.mqttClient.end();
    this.props.updateMqttConnection(null);
  };

  mqttOnEnd = () => {
    // toast.info("MQTT Connection Ended");
    console.debug("mqttOnEnd");
  };

  onMQTTBrokerDetailsSubmit = targetMqttBrokerInfo => {
    this.connectToMqttBroker(targetMqttBrokerInfo);

    this.bottomToast("Connecting to the broker...");
    this.setState({
      isConnecting: true
    });
  };

  onShutdownMQTTConnectionBtnClick = event => {
    event.preventDefault();

    if (this.mqttConnectingBlinkInterval) {
      console.debug("Clearing blinkInterval");
      clearInterval(this.mqttConnectingBlinkInterval);
      this.mqttConnectingBlinkInterval = null;
    }
    if (this.checkIfMqttConnectedTimeout) {
      console.debug("Clearing checkIfTimeout");
      clearTimeout(this.checkIfMqttConnectedTimeout);
      this.checkIfMqttConnectedTimeout = null;
    }

    this.setState({
      isConnecting: false
    });

    if (
      this.mqttClient &&
      (this.mqttClient.connected || this.mqttClient.reconnecting)
    ) {
      this.mqttClient.end();
      this.props.updateMqttConnection(null);
      toast.info("Closing the MQTT connection...");
    } else toast.warn("MQTT client is not connected");
  };

  onMqttSubTopicSubmit = subTopicName => {
    console.debug("onMqttSubTopicSubmit: ", subTopicName);
    const subToastId = toast("Subscribing to " + subTopicName, {
      autoClose: false
    });

    if (this.mqttClient) {
      this.mqttClient.subscribe(subTopicName);
    }

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
    const { connected: isConnected } = this.props.mqttClient || {
      connected: false
    };

    const { isConnecting } = this.state;

    console.debug(
      "MessagesMQTT render: state:",
      this.state,
      ", props: ",
      this.props,
      ", this: ",
      this
    );
    console.debug(
      "MessagesMQTT render: connected: ",
      isConnected,
      ", connecting: ",
      isConnecting
    );
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
          <MqttStatusBar
            isConnected={isConnected}
            isConnecting={isConnecting}
            getMqttBrokerInfoTxt={this.getMqttBrokerInfoTxt}
            getSubscribedTopicsTxt={this.getSubscribedTopicsTxt}
          />
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
              <ul className="p-4 " align="left">
                {this.getReceivedMessagesHTML()}
              </ul>
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
    console.debug("Checkifmqttconnected: this: ", this);
    const { connected: isConnected } = this.mqttClient || { connected: false };

    let options;
    if (this.mqttClient) options = this.mqttClient.options;

    const { hostname, port } = options || {};

    if (!this.mqttClient || !isConnected) {
      if (this.mqttClient) this.mqttClient.end();
      if (this.mqttConnectingBlinkInterval) {
        clearInterval(this.mqttConnectingBlinkInterval);
        this.mqttConnectingBlinkInterval = null;
      }
      let errorToastText;
      if (hostname)
        errorToastText =
          "Can't connect to MQTT Broker at " + hostname + ":" + port;
      else errorToastText = "MQTT Connection Timeout Error";
      toast.error(errorToastText);
      this.props.updateMqttConnection(null);
    }
  };

  getMqttBrokerInfoTxt = () => {
    const { connected: isConnected, reconnecting: isConnecting } =
      this.mqttClient || {};

    let options;
    if (this.mqttClient) options = this.mqttClient.options;

    const { clientId, hostname, port } = options || {};

    if (this.mqttClient && isConnected)
      return (
        "Connected to " + hostname + ":" + port + " Client ID: " + clientId
      );
    else if (this.mqttClient && isConnecting)
      return (
        "Connecting to " + hostname + ":" + port + " Client ID:" + clientId
      );
    else return "Not connected to any broker";
  };

  getSubscribedTopicsTxt = () => {
    let subTopicsTxt = "";
    // eslint-disable-next-line
    this.state.subscribeTopics.map((subTopic, index) => {
      subTopicsTxt += `${index + 1} - ${subTopic}
      `;
    });
    return subTopicsTxt;
  };

  getReceivedMessagesHTML = () => {
    return this.props.mqttReceivedTextMessages.map((message, index) => {
      return (
        <li key={index}>
          <strong>{message.topic}:</strong> {message.message.toString()}
        </li>
      );
    });
  };
}

const MessagesMQTT = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedMessagesMQTT);

export default MessagesMQTT;
