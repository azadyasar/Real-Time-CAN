import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED
} from "../constants/action-types";

const initialState = {
  mqttClient: null,
  mqttReceivedTextMessages: []
};

function rootReducer(state = initialState, action) {
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
    default:
      console.warn("Unrecognized action.type: ", action.type);
      return state;
  }
}

export default rootReducer;

/* import { combineReducers } from "redux";
import anotherReducer from "./anotherReducer";

const rootReducer = combineReducers({
  another: anotherReducer
});

export default rootReducer;
 */
