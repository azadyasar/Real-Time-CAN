import { combineReducers } from "redux";
import mqttReducer from "./mqttReducer";
import chartReducer from "./chartReducer";

const rootReducer = combineReducers({
  mqtt: mqttReducer,
  chart: chartReducer
});

export default rootReducer;

/* import {
  UPDATE_MQTT_CONNECTION,
  MQTT_TEXT_MESSAGE_RECEIVED,
  CHANGE_ALL_GRAPH_FLOW,
  UPDATE_LINE_DATA
} from "../constants/action-types";

const initialLineData = {
  labels: [],
  datasets: [
    {
      label: "Temperature",
      borderCapStyle: "butt",
      borderJoinStyle: "miter",
      pointHitRadius: 10,
      data: [],
      fill: false, // Don't fill area under the line
      borderColor: "green", // Line color
      pointRadius: 5
    },
    {
      label: "Humidity",
      data: [],
      fill: false,
      borderColor: "red"
    }
  ]
};

const initialState = {
  mqttClient: null,
  mqttReceivedTextMessages: [],
  isAllGraphFlowPaused: true,
  lineData: initialLineData
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
    case CHANGE_ALL_GRAPH_FLOW:
      return Object.assign({}, state, {
        isAllGraphFlowPaused: !state.isAllGraphFlowPaused
      });
    case UPDATE_LINE_DATA:
      return Object.assign({}, state, {
        lineData: action.payload
      });
    default:
      console.warn("Unrecognized action.type: ", action.type);
      return state;
  }
}

export default rootReducer; */

/* import { combineReducers } from "redux";
import anotherReducer from "./anotherReducer";

const rootReducer = combineReducers({
  another: anotherReducer
});

export default rootReducer;
 */
