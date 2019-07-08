import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED,
  CHANGE_ALL_GRAPH_FLOW,
  UPDATE_CHART_DATA,
  CHANGE_GRAPH_FLOW,
  SUBSCRIBE_TO_TOPIC,
  RESET_ALL_CHART_DATA
} from "../constants/action-types";

// MQTT
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

export function subscribeToTopic(payload) {
  return {
    type: SUBSCRIBE_TO_TOPIC,
    payload
  };
}

// CHARTS

export function changeAllGraphFlow(payload) {
  return {
    type: CHANGE_ALL_GRAPH_FLOW,
    payload
  };
}

/**
 *
 * @param {Object} payload - Should include `chartName` and `data`
 */
export function updateChartData(payload) {
  return {
    type: UPDATE_CHART_DATA,
    payload
  };
}

/**
 *
 * @param {Object} payload - Should include `chartName`
 */
export function changeGraphFlow(payload) {
  return {
    type: CHANGE_GRAPH_FLOW,
    payload
  };
}

export function resetAllChartData(payload) {
  return {
    type: RESET_ALL_CHART_DATA,
    payload
  };
}
