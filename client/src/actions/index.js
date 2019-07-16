import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED,
  CHANGE_ALL_GRAPH_FLOW,
  UPDATE_CHART_DATA,
  CHANGE_GRAPH_FLOW,
  SUBSCRIBE_TO_TOPIC,
  RESET_ALL_CHART_DATA,
  RESET_CHART_DATA,
  SET_IS_CONNECTING,
  ADD_OBSERVER,
  SET_CALLBACK_REGISTER,
  REMOVE_OBSERVER,
  CHANGE_LINE_CHART_RANGE
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

export function setIsConnecting(payload) {
  return {
    type: SET_IS_CONNECTING,
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

export function resetChartData(payload) {
  return {
    type: RESET_CHART_DATA,
    payload
  };
}

export function changeLineChartRange(payload) {
  return {
    type: CHANGE_LINE_CHART_RANGE,
    payload
  };
}

/**
 *
 * @param {Object} payload - Should include `topicName` to subscribe to and `callback` function to call to
 * upon message retrieval.
 */
export function addObserver(payload) {
  return {
    type: ADD_OBSERVER,
    payload
  };
}

/**
 *
 * @param {Object} payload - Should include `chartName` of target chart which will be used to retrieve
 * the latest topic the corresponding chart subscribed to and `callback` to filter callback array
 */
export function removeObserver(payload) {
  return {
    type: REMOVE_OBSERVER,
    payload
  };
}

export function setCallbackRegister(payload) {
  return {
    type: SET_CALLBACK_REGISTER,
    payload
  };
}
