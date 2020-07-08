import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED,
  SUBSCRIBE_TO_TOPIC,
  SET_IS_CONNECTING,
  ADD_OBSERVER,
  REMOVE_OBSERVER,
  DELETE_MQTT_MESSAGES
} from "../constants/action-types";

const initialState = {
  mqttClient: null,
  isConnecting: false,
  mqttReceivedTextMessages: [],
  subscribedTopics: ["avl/+/message", "test"],
  hookedChartDict: {},
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
      const filteredTopics = state.subscribedTopics.filter(
        topic => topic === action.payload
      );
      if (filteredTopics.length !== 0) return state;

      if (state.mqttClient) state.mqttClient.subscribe(action.payload);
      return Object.assign({}, state, {
        subscribedTopics: state.subscribedTopics.concat(action.payload)
      });
    case SET_IS_CONNECTING:
      return Object.assign({}, state, {
        isConnecting: action.payload.isConnecting
      });
    case ADD_OBSERVER:
      let observerCallbacksCopy = [];
      if (state.mqttObserverCallbacks[action.payload.topicName])
        observerCallbacksCopy = state.mqttObserverCallbacks[
          action.payload.topicName
        ].concat(action.payload.callback);
      else observerCallbacksCopy.push(action.payload.callback);
      let hookedChartDictCopy = Object.assign({}, state.hookedChartDict, {
        [action.payload.chartName]: action.payload.topicName
      });
      return Object.assign({}, state, {
        mqttObserverCallbacks: {
          ...state.mqttObserverCallbacks,
          [action.payload.topicName]: observerCallbacksCopy
        },
        hookedChartDict: hookedChartDictCopy
      });
    case REMOVE_OBSERVER:
      const topicName = state.hookedChartDict[action.payload.chartName];
      console.debug(
        "Removing observer(" + topicName + `) from ${action.payload.chartName}`
      );
      // TODO: Should we clean hookedChartDict?
      let removedObserverCallbacks = [];
      if (
        state.mqttObserverCallbacks[topicName] &&
        state.mqttObserverCallbacks[topicName].length > 0
      )
        removedObserverCallbacks = state.mqttObserverCallbacks[
          topicName
        ].filter(cb => cb !== action.payload.callback);
      return Object.assign({}, state, {
        mqttObserverCallbacks: {
          ...state.mqttObserverCallbacks,
          [topicName]: removedObserverCallbacks
        }
      });
    case DELETE_MQTT_MESSAGES:
      return Object.assign({}, state, {
        mqttReceivedTextMessages: []
      });
    default:
      return state;
  }
}

export default mqttReducer;
