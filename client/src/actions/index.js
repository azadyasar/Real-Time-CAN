import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED,
  CHANGE_ALL_GRAPH_FLOW
} from "../constants/action-types";

export function updateMqttConnection(payload) {
  return {
    type: UPDATE_MQTT_CONNECTION,
    payload
  };
}

export function mqttTextMessageReceived(payload) {
  return {
    type: MQTT_TEXT_MESSAGE_RECEIVED,
    payload
  };
}

export function changeAllGraphFlow(payload) {
  return {
    type: CHANGE_ALL_GRAPH_FLOW,
    payload
  };
}
