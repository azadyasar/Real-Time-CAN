import {
  UPDATE_CHART_DATA,
  CHANGE_ALL_GRAPH_FLOW,
  CHANGE_GRAPH_FLOW,
  RESET_ALL_CHART_DATA,
  RESET_CHART_DATA,
  SET_CALLBACK_REGISTER,
  CHANGE_LINE_CHART_RANGE
} from "../constants/action-types";

const initialLineData = {
  labels: [],
  datasets: [
    {
      label: "Vehicle - I",
      borderCapStyle: "butt",
      borderJoinStyle: "miter",
      pointHitRadius: 10,
      data: [],
      fill: 1, // Don't fill area under the line
      borderColor: "green", // Line color
      pointRadius: 5
    },
    {
      label: "Vehicle - II",
      data: [],
      fill: false,
      borderColor: "red"
    }
  ]
};

const initialRpmLineData = {
  labels: [],
  datasets: [
    {
      label: "RPM",
      borderCapStyle: "butt",
      borderJoinStyle: "miter",
      pointHitRadius: 10,
      data: [],
      fill: "origin", // Don't fill area under the line
      borderColor: "blue", // Line color
      pointRadius: 5
    }
  ]
};

const initialFuelDoughnutData = {
  labels: ["Red", "Green", "Yellow", "Profit"],
  datasets: [
    {
      data: [],
      backgroundColor: ["#CCC", "#36A2EB", "#FFCE56", "#8c0b63"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#680849"]
    }
  ]
};

const initialEmissionScatterData = {
  labels: ["CO2"],
  datasets: [
    {
      label: "CO2 Emission",
      fill: false,
      backgroundColor: "rgba(75,192,192,0.4)",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 5,
      pointRadius: 5,
      pointHitRadius: 10,
      showLine: false,
      data: [] /* function() {
        let dataTmp = [];
        for (let i = 0; i < this.dataLengthLimit; i++) {
          dataTmp.push({
            x: getRandomInt(0, 50),
            y: getRandomInt(0, 50)
          });
        }
        return dataTmp;
      }.bind(this)() */
    }
  ]
};

const initialMqttBarData = {
  labels: ["Connected", "Total", "Subscriptions"], //, "Messages"],
  topics: [
    "$SYS/broker/clients/connected",
    "$SYS/broker/clients/total",
    "$SYS/broker/subscriptions/count"
    // "$SYS/broker/publish/messages/sent"
  ],
  datasets: [
    {
      label: "MQTT Broker Info",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: []
    }
  ]
};

/* const chartNameInitialDataDict = {
  speedLineData: Object.assign({}, initialLineData),
  rpmLineData: Object.assign({}, initialRpmLineData),
  fuelDoughnutData: Object.assign({}, initialFuelDoughnutData),
  emissionsScatterData: Object.assign({}, initialEmissionScatterData),
  mqttBarData: Object.assign({}, initialMqttBarData)
}; */

const chartNameInitialDataDict = {
  speedLineData: {
    labels: [],
    datasets: [
      {
        label: "Vehicle - I",
        borderCapStyle: "butt",
        borderJoinStyle: "miter",
        pointHitRadius: 10,
        data: [],
        fill: 1, // Don't fill area under the line
        borderColor: "green", // Line color
        pointRadius: 5
      },
      {
        label: "Vehicle - II",
        data: [],
        fill: false,
        borderColor: "red"
      }
    ]
  },
  rpmLineData: {
    labels: [],
    datasets: [
      {
        label: "RPM",
        borderCapStyle: "butt",
        borderJoinStyle: "miter",
        pointHitRadius: 10,
        data: [],
        fill: "origin", // Don't fill area under the line
        borderColor: "blue", // Line color
        pointRadius: 5
      }
    ]
  },
  fuelDoughnutData: {
    labels: ["Red", "Green", "Yellow", "Profit"],
    datasets: [
      {
        data: [],
        backgroundColor: ["#CCC", "#36A2EB", "#FFCE56", "#8c0b63"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#680849"]
      }
    ]
  },
  emissionsScatterData: {
    labels: ["CO2"],
    datasets: [
      {
        label: "CO2 Emission",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 5,
        pointRadius: 5,
        pointHitRadius: 10,
        showLine: false,
        data: [] /* function() {
          let dataTmp = [];
          for (let i = 0; i < this.dataLengthLimit; i++) {
            dataTmp.push({
              x: getRandomInt(0, 50),
              y: getRandomInt(0, 50)
            });
          }
          return dataTmp;
        }.bind(this)() */
      }
    ]
  },
  mqttBarData: {
    labels: ["Connected", "Total", "Subscriptions"], //, "Messages"],
    topics: [
      "$SYS/broker/clients/connected",
      "$SYS/broker/clients/total",
      "$SYS/broker/subscriptions/count"
      // "$SYS/broker/publish/messages/sent"
    ],
    datasets: [
      {
        label: "MQTT Broker Info",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: []
      }
    ]
  }
};

const initialChartState = {
  isAllGraphFlowPaused: true,
  speedLineData: Object.assign({}, initialLineData),
  rpmLineData: Object.assign({}, initialRpmLineData),
  fuelDoughnutData: Object.assign({}, initialFuelDoughnutData),
  emissionsScatterData: Object.assign({}, initialEmissionScatterData),
  mqttBarData: Object.assign({}, initialMqttBarData),
  lineChartRange: 5,
  chartsDataFlowStatus: {
    speedDataFlowPause: true,
    rpmDataFlowPause: true,
    fuelDataFlowPause: true,
    emissionDataFlowPause: true,
    mqttBarDataFlowPause: true
  },
  callbackRegisterStatus: {
    speedLineData: false,
    rpmLineData: false,
    fuelDoughnutData: false,
    emissionsScatterData: false,
    mqttBarData: true
  }
};

function chartReducer(state = initialChartState, action) {
  switch (action.type) {
    case CHANGE_ALL_GRAPH_FLOW:
      const newChartsDataFlowStatus = {};
      Object.keys(state.chartsDataFlowStatus).forEach(
        key => (newChartsDataFlowStatus[key] = !state.isAllGraphFlowPaused)
      );
      return Object.assign({}, state, {
        isAllGraphFlowPaused: !state.isAllGraphFlowPaused,
        chartsDataFlowStatus: newChartsDataFlowStatus
      });
    case UPDATE_CHART_DATA:
      return Object.assign({}, state, {
        [action.payload.chartName]: action.payload.data
      });
    case CHANGE_GRAPH_FLOW:
      return Object.assign({}, state, {
        chartsDataFlowStatus: {
          ...state.chartsDataFlowStatus,
          [action.payload.chartName]: !state.chartsDataFlowStatus[
            action.payload.chartName
          ]
        }
      });
    case RESET_ALL_CHART_DATA:
      console.log("Initials: ", chartNameInitialDataDict);
      return Object.assign({}, state, {
        speedLineData: chartNameInitialDataDict["speedLineData"],
        rpmLineData: chartNameInitialDataDict["rpmLineData"],
        fuelDoughnutData: chartNameInitialDataDict["fuelDoughnutData"],
        emissionsScatterData: chartNameInitialDataDict["emissionsScatterData"],
        mqttBarData: chartNameInitialDataDict["mqttBarData"]
      });
    case RESET_CHART_DATA:
      console.log(
        "Cleaning: ",
        action,
        ", ",
        state[action.payload.chartName],
        ", ",
        chartNameInitialDataDict[action.payload.chartName]
      );
      console.log("Initials: ", chartNameInitialDataDict);
      return Object.assign({}, state, {
        [action.payload.chartName]: Object.assign(
          {},
          chartNameInitialDataDict[action.payload.chartName]
        )
      });
    case SET_CALLBACK_REGISTER:
      return Object.assign({}, state, {
        callbackRegisterStatus: {
          ...state.callbackRegisterStatus,
          [action.payload.chartName]: action.payload.status
        }
      });
    case CHANGE_LINE_CHART_RANGE:
      return Object.assign({}, state, {
        lineChartRange: action.payload
      });
    default:
      return state;
  }
}

export default chartReducer;
