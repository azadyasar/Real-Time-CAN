import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED,
  SUBSCRIBE_TO_TOPIC,
  SET_IS_CONNECTING,
  ADD_OBSERVER
} from "../constants/action-types";

const initialState = {
  mqttClient: null,
  isConnecting: false,
  mqttReceivedTextMessages: [],
  subscribedTopics: ["avl/+/message", "test"],
  mqttObserverCallbacks: {}
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
      if (state.mqttClient) state.mqttClient.subscribe(action.payload);
      return Object.assign({}, state, {
        subscribedTopics: state.subscribedTopics.concat(action.payload)
      });
    case SET_IS_CONNECTING:
      return Object.assign({}, state, {
        isConnecting: action.payload.isConnecting
      });
    case ADD_OBSERVER:
      console.log("add observer: ", action);
      let observerCallbacksCopy = [];
      if (state.mqttObserverCallbacks[action.payload.topicName])
        observerCallbacksCopy = state.mqttObserverCallbacks[
          action.payload.topicName
        ].concat(action.payload.callback);
      else observerCallbacksCopy.push(action.payload.callback);

      return Object.assign({}, state, {
        mqttObserverCallbacks: {
          ...state.mqttObserverCallbacks,
          [action.payload.topicName]: observerCallbacksCopy
        }
      });
    default:
      return state;
  }
}

export default mqttReducer;
