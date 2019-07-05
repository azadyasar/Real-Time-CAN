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

    this.state = {
      subscribeTopics: ["avl/+/message"],
      mqttClientId: null,
      isConnected: false,
      isConnecting: false
    };

    this.timeoutFunctions = [];
    this.mqttConnectingBlinkInterval = null;

    this.mqttClient = props.mqttClient;
    if (this.mqttClient && this.mqttClient.connected) {
      this.state.isConnected = true;
      this.state.isConnecting = false;
    }

    this.mqttBrokerInfo = props.mqttBrokerInfo;

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
  }

  componentWillReceiveProps(nextProps) {
    console.debug("MessagesMQTT received props: ", nextProps);
    this.mqttClient = nextProps.mqttClient;
    this.mqttBrokerInfo = nextProps.mqttBrokerInfo || this.mqttBrokerInfo;
    if (this.mqttClient && this.mqttClient.connected)
      this.setState({
        isConnected: true,
        isConnecting: false,
        mqttClientId: nextProps.mqttClientId || this.mqttClientId
      });
    else
      this.setState({
        isConnected: false,
        isConnecting: false,
        mqttClientId: nextProps.mqttClientId || this.mqttClientId
      });
  }

  componentWillUpdate(props) {
    console.debug("MessagesMQTT will update. Props: ", props);
  }

  componentWillUnmount() {
    this.timeoutFunctions.forEach(timeoutFunction =>
      clearInterval(timeoutFunction)
    );
  }

  connectToMqttBroker = mqttBrokerInfo => {
    const mqttClientId =
      "AVL_Nodejs_Client_" +
      Math.random()
        .toString(16)
        .substr(2, 8);
    this.setState({
      mqttClientId
    });
    const mqttConnectionOptions = {
      clientId: mqttClientId,
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
      /* this.mqttConnectingBlinkInterval = setInterval(
        this.mqttConnectingBlink,
        this.MQTT_STATUS_BLINK_PERIOD
      );
      this.timeoutFunctions.push(this.mqttConnectingBlinkInterval); */
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
    toast.info("Message received. Topic: " + topic);
    console.log(
      "Message received. Topic: ",
      topic,
      " Message: ",
      message.toString()
    );
    this.props.mqttTextMessageReceived({ topic, message });
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
    this.props.updateMqttConnection(null);
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

    if (this.mqttConnectingBlinkInterval) {
      clearInterval(this.mqttConnectingBlinkInterval);
      this.mqttConnectingBlinkInterval = null;
    }
    if (
      this.mqttClient &&
      (this.mqttClient.connected || this.mqttClient.reconnecting)
    ) {
      this.mqttClient.end();
      this.props.updateMqttConnection(null);
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
    console.debug(
      "MessagesMQTT render: state:",
      this.state,
      ", props: ",
      this.props,
      ", this: ",
      this
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
            isConnected={this.state.isConnected}
            isConnecting={this.state.isConnecting}
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
    const { connected: isConnected, reconnecting: isConnecting } =
      this.props.mqttClient || {};

    let options;
    if (this.props.mqttClient) options = this.props.mqttClient.options;

    const { clientId, hostname, port } = options || {};

    if (this.props.mqttClient && isConnected)
      return (
        "Connected to " + hostname + ":" + port + " Client ID: " + clientId
      );
    else if (this.props.mqttClient && isConnecting)
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
