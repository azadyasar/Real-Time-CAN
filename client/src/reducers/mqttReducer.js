import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED,
  SUBSCRIBE_TO_TOPIC,
  SET_IS_CONNECTING
} from "../constants/action-types";

const initialState = {
  mqttClient: null,
  isConnecting: false,
  mqttReceivedTextMessages: [],
  subscribedTopics: ["avl/+/message"]
};

function mqttReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MQTT_CONNECTION:
      return Object.assign({}, state, {
        mqttClient: action.payload
      });
    case MQTT_TEXT_MESSAGE_RECEIVED:
      return Object.assign({}, state, {
        mqttReceivedTextMessages: state.mqttReceivedTextMessages.concat(
          action.payload
        )
      });
    case SUBSCRIBE_TO_TOPIC:
      return Object.assign({}, state, {
        subscribedTopics: state.subscribedTopics.concat(action.payload)
      });
    case SET_IS_CONNECTING:
      return Object.assign({}, state, {
        isConnecting: action.payload.isConnecting
      });
    default:
      return state;
  }
}

export default mqttReducer;
