import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED,
  CHANGE_ALL_GRAPH_FLOW,
  UPDATE_LINE_DATA
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

export function updateLineData(payload) {
  return {
    type: UPDATE_LINE_DATA,
    payload
  };
}
