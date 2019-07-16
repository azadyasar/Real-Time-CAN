/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import mqtt from "mqtt";
import { toast } from "react-toastify";
import * as Ladda from "ladda";

import { connect } from "react-redux";
import {
  updateMqttConnection,
  mqttTextMessageReceived,
  subscribeToTopic,
  setIsConnecting,
  deleteMqttMessages
} from "../actions";

import MqttShutdownModal from "./Modals/MqttShutdownModal";
import MqttBrokerDetailsModal from "./Modals/MqttBrokerDetailsModal";
import MqttSubTopicModal from "./Modals/MqttSubTopicModal";
import MqttPubMsgModal from "./Modals/MqttPubMsgModal";
import MqttStatusBar from "./MqttStatusBar";

const mapDispatchToProps = dispatch => {
  return {
    updateMqttConnection: newMqttClient =>
      dispatch(updateMqttConnection(newMqttClient)),
    mqttTextMessageReceived: newMqttTextMessage =>
      dispatch(mqttTextMessageReceived(newMqttTextMessage)),
    subscribeToTopic: topic => dispatch(subscribeToTopic(topic)),
    setIsConnecting: signal => dispatch(setIsConnecting(signal)),
    deleteMqttMessages: signal => dispatch(deleteMqttMessages(signal))
  };
};

const mapStateToProps = state => {
  console.debug("MessagesMQTT mapStateToProps state: ", state);
  return {
    mqttClient: state.mqtt.mqttClient,
    isConnected: state.mqtt.mqttClient
      ? state.mqtt.mqttClient.connected &&
        !(
          state.mqtt.mqttClient.disconnecting ||
          state.mqtt.mqttClient.disconnected
        )
      : false,
    isConnecting: state.mqtt.isConnecting,
    mqttReceivedTextMessages: state.mqtt.mqttReceivedTextMessages,
    subscribedTopics: state.mqtt.subscribedTopics,
    mqttObserverCallbacks: state.mqtt.mqttObserverCallbacks
  };
};

export class ConnectedMessagesMQTT extends Component {
  constructor(props) {
    super(props);
    console.debug("MessagesMQTT constructor");
    this.state = {
      mqttObserverCallbacks: props.mqttObserverCallbacks,
      isConnecting: false
    };

    this.mqttConnectingBlinkInterval = null;
    this.checkIfMqttConnectedTimeout = null;

    this.mqttClient = props.mqttClient;
    if (props.mqttClient && props.mqttClient.connected) {
      this.state.isConnecting = false;
    }

    this.mqttBrokerInfo = props.mqttBrokerInfo;

    this.BOTTOM_TOASTER_TIMEOUT_DURATION = 5 * 1000;
    this.MQTT_CONNECT_TIMEOUT = 10 * 1000;
    this.MQTT_STATUS_BLINK_PERIOD = 500;
  }

  componentDidMount() {
    console.debug("MessagesMQTT mounted");

    this.setState({
      mqttObserverCallbacks: this.props.mqttObserverCallbacks
    });

    if (this.props.isConnecting) {
      this.mqttConnectingBlinkInterval = setInterval(
        this.mqttConnectingBlink,
        this.MQTT_STATUS_BLINK_PERIOD
      );
      this.checkIfMqttConnectedTimeout = setTimeout(
        this.checkIfMqttConnected,
        this.MQTT_CONNECT_TIMEOUT
      );
      this.checkConnectionSpinner(true);
    } else {
      this.stopMqttBlink();
      this.cancelMqttConnectionChecker();
    }

    this.l = Ladda.create(document.getElementById("mqttConnectButton"));
    // eslint-disable-next-line no-undef
    $("[data-toggle=popover]").popover({
      html: true,
      "white-space": "pre-wrap"
    });
  }

  componentWillReceiveProps(nextProps) {
    console.debug("MessagesMQTT received props: ", nextProps);
    this.mqttClient = nextProps.mqttClient;

    this.setState({
      mqttObserverCallbacks: nextProps.mqttObserverCallbacks
    });

    if (nextProps.isConnecting) {
      if (!this.mqttConnectingBlinkInterval) {
        this.mqttConnectingBlinkInterval = setInterval(
          this.mqttConnectingBlinkInterval,
          this.MQTT_STATUS_BLINK_PERIOD
        );
      }
      if (!this.checkIfMqttConnectedTimeout) {
        this.checkIfMqttConnectedTimeout = setInterval(
          this.checkIfMqttConnected,
          this.MQTT_CONNECT_TIMEOUT
        );
      }
      this.checkConnectionSpinner(true);
    } else {
      this.checkConnectionSpinner(false);
      this.stopMqttBlink();
      this.cancelMqttConnectionChecker();
    }
  }

  componentWillUnmount() {
    console.debug("MessagesMQTT will unmount");
    this.stopMqttBlink();
    this.cancelMqttConnectionChecker();
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

    let mqttClient;
    try {
      mqttClient = mqtt.connect(
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
        "An error occured while connecting to " +
          targetMqttBrokerInfo.host +
          "."
      );
    }

    if (mqttClient) {
      mqttClient.on("connect", this.mqttOnConnect);
      mqttClient.on("message", this.mqttOnMessage);
      mqttClient.on("packetsend", this.mqttOnPacketSend);
      mqttClient.on("packetreceive", this.mqttOnPacketReceive);
      mqttClient.on("error", this.mqttOnError);
      mqttClient.on("disconnect", this.mqttOnDisconnect);
      mqttClient.on("offline", this.mqttOnOffline);
      mqttClient.on("end", this.mqttOnEnd);
      mqttClient.on("close", this.mqttOnClose);
    }
    this.props.updateMqttConnection(mqttClient);
  };

  mqttOnConnect = () => {
    toast.success("Connected!");
    this.stopMqttBlink();
    this.cancelMqttConnectionChecker();

    this.props.setIsConnecting({ isConnecting: false });
    console.log("Mqtt connected succesfully");

    if (this.mqttClient)
      this.props.subscribedTopics.forEach(topic =>
        this.mqttClient.subscribe(topic, console.log)
      );
    this.props.updateMqttConnection(this.mqttClient);
  };

  mqttOnMessage = (topic, message) => {
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
    this.props.distributeMqttMessage(topic, message);
  };

  mqttOnError = error => {
    toast.error(
      "MQTT connection error occured. \nDetails: " + error.toString(),
      {
        autoClose: 7500
      }
    );
    this.cancelMqttConnectionChecker();
    this.stopMqttBlink();
    if (this.mqttClient) this.mqttClient.end();
    else this.props.updateMqttConnection(null);
    console.error("Mqtt connection failed with error: ", error);
  };

  mqttOnDisconnect = () => {
    toast.error("Disconnected from the broker.");
    if (this.mqttClient) this.mqttClient.end();
    else this.props.updateMqttConnection(null);
    console.log("Mqtt client disconnected.");
  };

  mqttOnClose = () => {
    console.debug("mqttOnClose");
  };

  mqttOnOffline = () => {
    console.debug("mqttOnOffline");
    toast.warn(
      "Make sure that you have internet access or that you are not behind a firewall.",
      {
        autoClose: 6000
      }
    );
  };

  mqttOnEnd = () => {
    // toast.info("MQTT Connection Ended");
    console.debug("mqttOnEnd");
    toast.info("MQTT connection is closed.");
    this.checkConnectionSpinner(false);
    this.stopMqttBlink();
    this.cancelMqttConnectionChecker();
    this.props.setIsConnecting({ isConnecting: false });
    this.props.updateMqttConnection(this.mqttClient);
  };

  mqttOnPacketSend = packet => {
    // toast.info("mqttOnPacketSend");
    console.debug("mqttOnPacketSend packet: ", packet);
  };

  mqttOnPacketReceive = packet => {
    // toast.info("mqttOnPacketReceive");
    console.debug("mqttOnPacketReceive packet: ", packet);
  };

  onMQTTBrokerDetailsSubmit = targetMqttBrokerInfo => {
    this.connectToMqttBroker(targetMqttBrokerInfo);

    this.checkConnectionSpinner(true);
    this.bottomToast("Connecting to the broker...");
    this.props.setIsConnecting({ isConnecting: true });
    this.setState({
      isConnecting: true
    });
  };

  onShutdownMQTTConnectionBtnClick = event => {
    event.preventDefault();

    this.stopMqttBlink();
    this.cancelMqttConnectionChecker();

    this.setState({
      isConnecting: false
    });

    if (
      this.mqttClient &&
      (this.mqttClient.connected || this.mqttClient.reconnecting) &&
      !this.mqttClient.disconnecting
    ) {
      this.mqttClient.end();
    } else {
      toast.warn("MQTT client is not connected.");
      this.props.updateMqttConnection(null);
    }
  };

  onMqttSubTopicSubmit = subTopicName => {
    console.debug("onMqttSubTopicSubmit: ", subTopicName);
    const subToastId = toast("Subscribing to " + subTopicName, {
      autoClose: false
    });

    if (this.mqttClient) {
      this.mqttClient.subscribe(subTopicName);
    }

    this.props.subscribeToTopic(subTopicName);

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

  onMqttPubMsgSubmit = payload => {
    const pubMsgToastId = toast(
      "Sending message: " + payload.message + " with topic " + payload.topic,
      {
        autoClose: false
      }
    );

    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.publish(
        payload.topic,
        payload.message,
        {
          qos: payload.qos,
          retain: payload.retain
        },
        err => {
          console.log("publish cb ", err);
        }
      );
      toast.update(pubMsgToastId, {
        render: "Message is sent.",
        type: toast.TYPE.SUCCESS,
        autoClose: 1500,
        className: "rotateY"
      });
    } else {
      toast.update(pubMsgToastId, {
        render: "Cannot publish a message. Connect to your MQTT broker first!",
        type: toast.TYPE.ERROR,
        autoClose: 3000,
        className: "rotateX animared"
      });
    }
  };

  onDeleteMqttMessagesBtnClick = event => {
    event.preventDefault();
    this.props.deleteMqttMessages(null);
  };

  render() {
    let isConnected = false;
    if (this.props.mqttClient)
      isConnected =
        this.props.mqttClient.connected &&
        !(
          this.props.mqttClient.disconnecting ||
          this.props.mqttClient.disconnected
        );

    let { isConnecting } = this.state;
    // isConnecting = isConnecting && !this.props.mqttClient.disconnecting;

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

        <MqttPubMsgModal
          modalId="mqttPubMsgModal"
          onPubMsgSubmit={this.onMqttPubMsgSubmit}
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
          <div className="row justify-content-center m-3 w-50">
            <div className="col-6 m-2" align="center">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn ladda-button"
                  data-color="green"
                  data-style="expand-left"
                  id="mqttConnectButton"
                  data-toggle="modal"
                  data-size="m"
                  data-target="#mqttServerDetailsModal"
                >
                  <span className="ladda-label">Connect</span>
                  {/*             
                  <span
                    className="spinner-border spinner-border-sm mx-1"
                    role="status"
                    aria-hidden="true"
                    hidden={true}
                  /> 
                  Connect*/}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-toggle="modal"
                  data-target="#mqttSubscribeTopics"
                >
                  Subscribe
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-toggle="modal"
                  data-target="#mqttPubMsgModal"
                >
                  Publish
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={this.onDeleteMqttMessagesBtnClick}
                >
                  <i className="fa  fa-trash" />
                </button>
              </div>
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
      this.stopMqttBlink();
      let errorToastText;
      if (hostname)
        errorToastText =
          "Can't connect to MQTT Broker at " + hostname + ":" + port;
      else errorToastText = "MQTT Connection Timeout Error";
      toast.error(errorToastText);
      if (this.mqttClient) this.mqttClient.end();
      else {
        this.props.updateMqttConnection(null);
        this.props.setIsConnecting({ isConnecting: false });
      }
    }
  };

  getMqttBrokerInfoTxt = () => {
    let { connected: isConnected } = this.mqttClient || {};

    let options;
    if (this.mqttClient) options = this.mqttClient.options;

    const { clientId, hostname, port } = options || {};

    if (this.mqttClient && isConnected)
      return (
        "Connected to " + hostname + ":" + port + " Client ID: " + clientId
      );
    else if (this.mqttClient && this.props.isConnecting)
      return (
        "Connecting to " + hostname + ":" + port + " \nClient ID: " + clientId
      );
    else return "Not connected to any broker";
  };

  getSubscribedTopicsTxt = () => {
    let subTopicsTxt = "";
    // eslint-disable-next-line
    this.props.subscribedTopics.map((subTopic, index) => {
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

  stopMqttBlink() {
    if (this.mqttConnectingBlinkInterval) {
      clearInterval(this.mqttConnectingBlinkInterval);
      this.mqttConnectingBlinkInterval = null;
    }
  }

  cancelMqttConnectionChecker() {
    if (this.checkIfMqttConnectedTimeout) {
      console.debug("Cancelling connection checker");
      clearTimeout(this.checkIfMqttConnectedTimeout);
      this.checkIfMqttConnectedTimeout = null;
    }
  }

  checkConnectionSpinner(shouldShow) {
    const connectBtnElement = document.getElementById("mqttConnectButton");
    let spinnerElement;
    if (connectBtnElement)
      if (shouldShow) connectBtnElement.setAttribute("disabled", true);
      else connectBtnElement.removeAttribute("disabled");
    // spinnerElement = connectBtnElement.getElementsByClassName(
    //   "spinner-border"
    // )[0];
    if (shouldShow) {
      this.l.start();
    } else this.l.stop();
    // if (spinnerElement) {
    //   if (shouldShow) spinnerElement.removeAttribute("hidden");
    //   else spinnerElement.setAttribute("hidden", "true");
    // }
  }
}

const MessagesMQTT = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedMessagesMQTT);

export default MessagesMQTT;
