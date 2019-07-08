import {
  UPDATE_LINE_DATA,
  CHANGE_ALL_GRAPH_FLOW
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

const initialChartState = {
  isAllGraphFlowPaused: true,
  lineData: initialLineData
};

function chartReducer(state = initialChartState, action) {
  switch (action.type) {
    case CHANGE_ALL_GRAPH_FLOW:
      return Object.assign({}, state, {
        isAllGraphFlowPaused: !state.isAllGraphFlowPaused
      });
    case UPDATE_LINE_DATA:
      return Object.assign({}, state, {
        lineData: action.payload
      });
    default:
      return state;
  }
}

export default chartReducer;
