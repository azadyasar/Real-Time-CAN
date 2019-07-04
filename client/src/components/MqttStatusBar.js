import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

export default function MqttStatusBar(props) {
  return (
    <div className="mqtt-connection-status" align="center">
      <div className="btn-group" role="group">
        <button
          type="button"
          className={classNames("btn", {
            "btn-outline-success": props.isConnected,
            "btn-outline-warning": props.isConnecting && !props.isConnected,
            "btn-outline-danger": !props.isConnected && !props.isConnecting
          })}
          data-trigger="focus"
          data-toggle="popover"
          title="MQTT Connection Status"
          data-placement="bottom"
          data-content={props.getMqttBrokerInfoTxt()}
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
          data-content={props.getSubscribedTopicsTxt()}
        >
          <i className="fa fas fa-list" />
        </button>
        <button
          type="button"
          className="btn"
          data-toggle="modal"
          data-target="#mqttDisconnectModal"
        >
          <i className="fa fas fa-plug" />
        </button>
      </div>
    </div>
  );
}

MqttStatusBar.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  isConnecting: PropTypes.bool.isRequired,
  getMqttBrokerInfoTxt: PropTypes.func.isRequired,
  getSubscribedTopicsTxt: PropTypes.func.isRequired
};
