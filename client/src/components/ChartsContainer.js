import React, { Component } from "react";
import moment from "moment";
import "../css/ChartsContainer.css";

import { connect } from "react-redux";
import {
  updateChartData,
  changeGraphFlow,
  changeAllGraphFlow,
  resetAllChartData,
  resetChartData,
  addObserver,
  setCallbackRegister,
  subscribeToTopic,
  removeObserver,
  changeLineChartRange
} from "../actions";

import HookChartModal from "./Modals/HookChartModal";
import ChartsToolbar from "./ChartsToolbar";
import ChartSettingsModal from "./Modals/ChartSettingsModal";
// Chart Cards
import LineChart from "./Charts/LineChart";
import DoughnutChart from "./Charts/DoughnutChart";
import ScatterChart from "./Charts/ScatterChart";
import BarChart from "./Charts/BarChart";
import { toast } from "react-toastify";

// eslint-disable-next-line
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const mapStateToProps = state => {
  return {
    speedLineData: state.chart.speedLineData,
    rpmLineData: state.chart.rpmLineData,
    fuelDoughnutData: state.chart.fuelDoughnutData,
    emissionsScatterData: state.chart.emissionsScatterData,
    mqttBarData: state.chart.mqttBarData,
    chartsDataFlowStatus: state.chart.chartsDataFlowStatus,
    isAllGraphFlowPaused: state.chart.isAllGraphFlowPaused,
    callbackRegisterStatus: state.chart.callbackRegisterStatus,
    lineChartRange: state.chart.lineChartRange
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateChartData: newLineData => dispatch(updateChartData(newLineData)),
    changeGraphFlow: signal => dispatch(changeGraphFlow(signal)),
    changeAllGraphFlow: signal => dispatch(changeAllGraphFlow(signal)),
    resetAllChartData: signal => dispatch(resetAllChartData(signal)),
    addObserver: observerInfo => dispatch(addObserver(observerInfo)),
    removeObserver: observerInfo => dispatch(removeObserver(observerInfo)),
    setCallbackRegister: (chartName, status) =>
      dispatch(setCallbackRegister({ chartName, status })),
    subscribeToTopic: topic => dispatch(subscribeToTopic(topic)),
    resetChartData: chartName => dispatch(resetChartData(chartName)),
    changeLineChartRange: newLineChartRange =>
      dispatch(changeLineChartRange(newLineChartRange))
  };
};

export class ConnectedChartsContainer extends Component {
  constructor(props) {
    super(props);
    console.debug("ChartContainer constructer");

    // this.props.lineChartRange = 15;
    console.log("lineChartRange: ", this.props.lineChartRange);

    this.currentObserverTopic = null;

    this.graphGeneratorAttributes = {
      speedLineData: {
        generator: this.generateLineData,
        callback: this.callbackSpeedLineData, // () => console.error("Implement me!!"),
        pause: "speedDataFlowPause",
        generatorInterval: null
      },
      rpmLineData: {
        generator: this.generateRPMLineData,
        callback: this.callbackRPMLineData,
        pause: "rpmDataFlowPause",
        generatorInterval: null
      },
      fuelDoughnutData: {
        generator: this.generateFuelData,
        callback: () => console.error("Implement me!!"),
        pause: "fuelDataFlowPause",
        generatorInterval: null
      },
      emissionsScatterData: {
        generator: this.generateEmissionScatterData,
        callback: () => console.error("Implement me!!"),
        pause: "emissionDataFlowPause",
        generatorInterval: null
      },
      mqttBarData: {
        generator: this.generateMqttBarData,
        callback: this.callbackMqttBarData,
        pause: "mqttBarDataFlowPause",
        generatorInterval: null
      }
    };

    this.lineGraphOptions = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false
              // autoSkip: false
            }
          }
        ],
        xAxes: [
          {
            type: "time",
            time: {
              unit: "second",
              displayFormats: {
                second: "HH:mm:ss"
              }
            },
            scaleLabel: {
              display: true,
              labelString: "Time"
            }
          }
        ]
      },
      title: {
        display: false,
        text: "Real-Time Data"
      }
    };
  }

  generateLineData = () => {
    console.debug("generateLineData");
    if (this.props.chartsDataFlowStatus.speedDataFlowPause) return;
    let tempDataCopy = this.props.speedLineData.datasets[0].data.concat(
      10 + Math.random() * 10
    );
    let humDataCopy = this.props.speedLineData.datasets[1].data.concat(
      10 + Math.random() * 10
    );
    let labelsCopy = this.props.speedLineData.labels.concat(moment().format());

    if (tempDataCopy.length > this.props.lineChartRange)
      tempDataCopy = tempDataCopy.slice(
        tempDataCopy.length - this.props.lineChartRange,
        tempDataCopy.length
      );
    if (humDataCopy.length > this.props.lineChartRange)
      humDataCopy = humDataCopy.slice(
        humDataCopy.length - this.props.lineChartRange,
        humDataCopy.length
      );
    if (labelsCopy.length > this.props.lineChartRange)
      labelsCopy = labelsCopy.slice(
        labelsCopy.length - this.props.lineChartRange,
        labelsCopy.length
      );

    const lineDataCopy = Object.assign({}, this.props.speedLineData);
    lineDataCopy.labels = labelsCopy;
    lineDataCopy.datasets[0].data = tempDataCopy;
    lineDataCopy.datasets[1].data = humDataCopy;
    this.props.updateChartData({
      data: lineDataCopy,
      chartName: "speedLineData"
    });
  };

  callbackSpeedLineData = (topic, message) => {
    console.log("Callback speedline data...");
    if (this.props.chartsDataFlowStatus.speedDataFlowPause) return;
    console.log("+");

    const incomingValue = Number(message.toString());
    console.log("callbackSpeed incoming value: ", incomingValue);
    if (!Number.isNaN(incomingValue)) {
      let tempDataCopy = this.props.speedLineData.datasets[0].data.concat(
        incomingValue
      );
      let humDataCopy = this.props.speedLineData.datasets[1].data.concat(
        100 - incomingValue
      );
      let labelsCopy = this.props.speedLineData.labels.concat(
        moment().format()
      );
      if (tempDataCopy.length > this.props.lineChartRange)
        tempDataCopy = tempDataCopy.slice(
          tempDataCopy.length - this.props.lineChartRange,
          tempDataCopy.length
        );
      if (humDataCopy.length > this.props.lineChartRange)
        humDataCopy = humDataCopy.slice(
          humDataCopy.length - this.props.lineChartRange,
          humDataCopy.length
        );
      if (labelsCopy.length > this.props.lineChartRange)
        labelsCopy = labelsCopy.slice(
          labelsCopy.length - this.props.lineChartRange,
          labelsCopy.length
        );

      const lineDataCopy = Object.assign({}, this.props.speedLineData);
      lineDataCopy.labels = labelsCopy;
      lineDataCopy.datasets[0].data = tempDataCopy;
      lineDataCopy.datasets[1].data = humDataCopy;
      this.props.updateChartData({
        data: lineDataCopy,
        chartName: "speedLineData"
      });
    } else {
      toast.warn(
        "Received message contains a non-numeric value: " + message.toString()
      );
    }
  };

  generateRPMLineData = () => {
    console.debug("generateRPMLineData");
    if (this.props.chartsDataFlowStatus.rpmDataFlowPause) return;
    let rpmDataDatasetCopy = this.props.rpmLineData.datasets[0].data.concat(
      10 + Math.random() * 10
    );
    let rmpDataLabelsCopy = this.props.rpmLineData.labels.concat(
      moment().format()
    );

    if (rpmDataDatasetCopy.length > this.props.lineChartRange)
      rpmDataDatasetCopy = rpmDataDatasetCopy.slice(
        rpmDataDatasetCopy.length - this.props.lineChartRange,
        rpmDataDatasetCopy.length
      );

    if (rmpDataLabelsCopy.length > this.props.lineChartRange)
      rmpDataLabelsCopy = rmpDataLabelsCopy.slice(
        rmpDataLabelsCopy.length - this.props.lineChartRange,
        rmpDataLabelsCopy.length
      );

    const rpmDataCopy = Object.assign({}, this.props.rpmLineData);
    rpmDataCopy.labels = rmpDataLabelsCopy;
    rpmDataCopy.datasets[0].data = rpmDataDatasetCopy;
    this.props.updateChartData({ data: rpmDataCopy, chartName: "rpmLineData" });
  };

  callbackRPMLineData = (topic, message) => {
    console.debug("callbackRPMLineData");
    if (this.props.chartsDataFlowStatus.rpmDataFlowPause) return;
    const incomingValue = Number(message.toString());
    if (!Number.isNaN(incomingValue)) {
      let rpmDataDatasetCopy = this.props.rpmLineData.datasets[0].data.concat(
        incomingValue
      );
      let rmpDataLabelsCopy = this.props.rpmLineData.labels.concat(
        moment().format()
      );
      if (rpmDataDatasetCopy.length > this.props.lineChartRange)
        rpmDataDatasetCopy = rpmDataDatasetCopy.slice(
          rpmDataDatasetCopy.length - this.props.lineChartRange,
          rpmDataDatasetCopy.length
        );

      if (rmpDataLabelsCopy.length > this.props.lineChartRange)
        rmpDataLabelsCopy = rmpDataLabelsCopy.slice(
          rmpDataLabelsCopy.length - this.props.lineChartRange,
          rmpDataLabelsCopy.length
        );
      const rpmDataCopy = Object.assign({}, this.props.rpmLineData);
      rpmDataCopy.labels = rmpDataLabelsCopy;
      rpmDataCopy.datasets[0].data = rpmDataDatasetCopy;
      this.props.updateChartData({
        data: rpmDataCopy,
        chartName: "rpmLineData"
      });
    } else {
      toast.warn(
        "Received message contains a non-numeric value: " + message.toString()
      );
    }
  };

  generateFuelData = () => {
    console.debug("generateFuelData");
    if (this.props.chartsDataFlowStatus.fuelDataFlowPause) return;

    const newFuelDoughnutData = Object.assign({}, this.props.fuelDoughnutData);
    let fuelDataCopy = this.getDoughnutData();
    const newDatasets = [];
    newFuelDoughnutData.datasets.forEach(ds =>
      newDatasets.push(
        Object.assign({}, ds, {
          data: Object.assign({}, ds.data)
        })
      )
    );
    newDatasets[0].data = fuelDataCopy;

    newFuelDoughnutData.datasets = newDatasets;
    this.props.updateChartData({
      data: newFuelDoughnutData,
      chartName: "fuelDoughnutData"
    });
  };

  generateEmissionScatterData = () => {
    console.debug("generateEmissionScatterData");
    if (this.props.chartsDataFlowStatus.emissionDataFlowPause) return;
    const emissionScatterDataCopy = Object.assign(
      {},
      this.props.emissionsScatterData
    );

    const newDatasets = [];
    emissionScatterDataCopy.datasets.forEach(ds =>
      newDatasets.push(
        Object.assign({}, ds, {
          data: Object.assign({}, ds.data)
        })
      )
    );
    newDatasets[0].data = this.getScatterDataSet();
    emissionScatterDataCopy.datasets = newDatasets;

    this.props.updateChartData({
      data: emissionScatterDataCopy,
      chartName: "emissionsScatterData"
    });
  };

  generateMqttBarData = () => {
    console.debug("generateMqttBarData");
    if (this.props.chartsDataFlowStatus.mqttBarDataFlowPause) return;
    const mqttBarChartCopy = Object.assign({}, this.props.mqttBarData);
    let newData = [];
    for (let i = 0; i < this.props.mqttBarData.labels.length; i++)
      newData.push((Math.random() + 5) * 10);
    mqttBarChartCopy.datasets[0].data = newData;
    this.props.updateChartData({
      data: mqttBarChartCopy,
      chartName: "mqttBarData"
    });
  };

  callbackMqttBarData = (topic, message) => {
    console.debug("cbMqttBarData");
    if (this.props.chartsDataFlowStatus.mqttBarDataFlowPause) return;

    const incomingValue = Number(message.toString());
    if (Number.isNaN(incomingValue)) {
      toast.warn(
        "Received message contains a non-numeric value: " + message.toString()
      );
      return;
    }

    const mqttBarChartCopy = Object.assign({}, this.props.mqttBarData);
    let newData = mqttBarChartCopy.datasets[0].data.concat();
    newData[mqttBarChartCopy.topics.indexOf(topic)] = incomingValue;
    mqttBarChartCopy.datasets[0].data = newData;
    this.props.updateChartData({
      data: mqttBarChartCopy,
      chartName: "mqttBarData"
    });
  };

  componentDidMount() {
    console.debug("ChartContainer did mount");
    Object.keys(this.graphGeneratorAttributes).forEach(key => {
      this.shouldGenerateData(key);
    });

    this.props.mqttBarData.topics.forEach(topic => {
      this.props.addObserver({
        topicName: topic,
        chartName: "mqttBarData",
        callback: this.graphGeneratorAttributes["mqttBarData"].callback
      });
      this.props.subscribeToTopic(topic);
    });
  }

  componentWillReceiveProps(newProps) {
    console.log("Charts container will receive props: ", newProps);
    Object.keys(this.graphGeneratorAttributes).forEach(key => {
      this.shouldGenerateData(key, newProps);
    });
  }

  componentWillUnmount() {
    Object.keys(this.graphGeneratorAttributes).forEach(key => {
      if (this.graphGeneratorAttributes[key].generatorInterval) {
        clearInterval(this.graphGeneratorAttributes[key].generatorInterval);
        this.graphGeneratorAttributes[key].generatorInterval = null;
      }
    });
  }

  onGraphFlowBtnClick = event => {
    console.log(event.target);
    event.preventDefault();

    this.props.changeGraphFlow({ chartName: event.target.name });
  };

  onStartAllGraphFlowBtnClick = event => {
    event.preventDefault();
    this.props.changeAllGraphFlow(null);
  };

  onCleanAllChartDataBtnClick = event => {
    event.preventDefault();
    this.props.resetAllChartData(null);
  };

  onCleanChartDataBtnClick = event => {
    console.debug("clean chart:", event.target);
    event.preventDefault();
    this.props.resetChartData({ chartName: event.target.name });
  };

  onHookChartDataBtnClick = event => {
    if (event.isAlreadyHooked) {
      toast.info(event.graphTarget + " detached.");
      this.props.setCallbackRegister(event.graphTarget, false);
      this.props.removeObserver({
        chartName: event.graphTarget,
        callback: this.graphGeneratorAttributes[event.graphTarget].callback
      });
    } else {
      this.observerChartName = event.graphTarget;
    }
  };

  onHookChartDataSubmit = topicName => {
    toast.info("Hooked " + this.observerChartName + " to " + topicName);
    this.props.addObserver({
      topicName: topicName,
      chartName: this.observerChartName,
      callback: this.graphGeneratorAttributes[this.observerChartName].callback
    });
    this.props.setCallbackRegister(this.observerChartName, true);
    this.props.subscribeToTopic(topicName);
    this.observerChartName = null;
  };

  onChartSettingsApply = newSettings => {
    toast.info("Settings changed.");
    this.props.changeLineChartRange(newSettings.lineChartRange);
    // LAUNCH SETTINGS MODAL
  };

  mqttCb(msg) {
    console.log("Observer received: " + msg.toString());
  }

  render() {
    return (
      <div className="charts-container ">
        <ChartsToolbar
          pauseAllGraphsFlow={this.props.isAllGraphFlowPaused}
          onStartAllGraphFlowBtnClick={this.onStartAllGraphFlowBtnClick}
          onCleanAllChartDataBtnClick={this.onCleanAllChartDataBtnClick}
          chartSettingsModalId="chartSettingsModalId"
        />
        <HookChartModal
          modalId="hookChartModalId"
          onApplyHookBtnSubmit={this.onHookChartDataSubmit}
        />
        <ChartSettingsModal
          modalId="chartSettingsModalId"
          currentLineChartRange={this.props.lineChartRange}
          onApplySettingsSubmit={this.onChartSettingsApply}
        />
        <div className="row  justify-content-center">
          {/* Speed Graph */}
          <div className="col-xl-4  col-md-5 mx-2 my-4 h-100" align="center">
            <LineChart
              title="Speed"
              graphName="speedDataFlowPause"
              graphTarget="speedLineData"
              data={this.props.speedLineData}
              options={this.lineGraphOptions}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.props.chartsDataFlowStatus.speedDataFlowPause}
              onHookBtnClick={this.onHookChartDataBtnClick}
              target="hookChartModalId"
              isHooked={this.props.callbackRegisterStatus["speedLineData"]}
              onCleanChartDataBtnClick={this.onCleanChartDataBtnClick}
            />
          </div>
          {/* RPM Graph */}
          <div className="col-xl-4  col-md-5 mx-2 my-4 h-100" align="center">
            <LineChart
              title="RPM"
              graphName="rpmDataFlowPause"
              graphTarget="rpmLineData"
              data={this.props.rpmLineData}
              options={Object.assign({}, this.lineGraphOptions, { fill: true })}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.props.chartsDataFlowStatus.rpmDataFlowPause}
              onHookBtnClick={this.onHookChartDataBtnClick}
              target="hookChartModalId"
              isHooked={this.props.callbackRegisterStatus["rpmLineData"]}
              onCleanChartDataBtnClick={this.onCleanChartDataBtnClick}
            />
          </div>
          {/* Doughnut Chart */}
          <div className="col-xl-4  col-md-5 mx-2 my-4 h-100" align="center">
            <DoughnutChart
              title="Fuel Usage"
              graphName="fuelDataFlowPause"
              graphTarget="fuelDoughnutData"
              data={this.props.fuelDoughnutData}
              options={this.lineGraphOptions}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.props.chartsDataFlowStatus.fuelDataFlowPause}
              onHookBtnClick={this.onHookChartDataBtnClick}
              isHooked={this.props.callbackRegisterStatus["fuelDoughnutData"]}
              target="hookChartModalId"
              onCleanChartDataBtnClick={this.onCleanChartDataBtnClick}
            />
          </div>
          {/* Bar Chart */}
          <div className="col-xl-4  col-md-5 mx-2 my-4 h-100" align="center">
            <BarChart
              title="BarChart"
              graphName="mqttBarDataFlowPause"
              graphTarget="mqttBarData"
              data={this.props.mqttBarData}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={
                this.props.chartsDataFlowStatus.mqttBarDataFlowPause
              }
              onHookBtnClick={this.onHookChartDataBtnClick}
              isHooked={this.props.callbackRegisterStatus["mqttBarData"]}
              target="hookChartModalId"
              isHookable={false}
              onCleanChartDataBtnClick={this.onCleanChartDataBtnClick}
            />
          </div>
          {/* Scatter Chart (Emissions) */}
          <div className="col-xl-4  col-md-5 mx-2 my-4 h-100" align="center">
            <ScatterChart
              title="Emission"
              graphName="emissionDataFlowPause"
              graphTarget="emissionsScatterData"
              data={this.props.emissionsScatterData}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={
                this.props.chartsDataFlowStatus.emissionDataFlowPause
              }
              onHookBtnClick={this.onHookChartDataBtnClick}
              isHooked={
                this.props.callbackRegisterStatus["emissionsScatterData"]
              }
              target="hookChartModalId"
              onCleanChartDataBtnClick={this.onCleanChartDataBtnClick}
            />
          </div>
        </div>
      </div>
    );
  }

  shouldGenerateData(key, newProps = undefined) {
    if (!newProps) newProps = this.props;
    if (
      newProps.chartsDataFlowStatus[this.graphGeneratorAttributes[key].pause] ||
      this.props.callbackRegisterStatus[key]
    ) {
      if (this.graphGeneratorAttributes[key].generatorInterval) {
        clearInterval(this.graphGeneratorAttributes[key].generatorInterval);
        this.graphGeneratorAttributes[key].generatorInterval = null;
      }
    } else if (!this.graphGeneratorAttributes[key].generatorInterval) {
      console.debug(
        "Starting data generation for: ",
        this.graphGeneratorAttributes[key].pause
      );
      this.graphGeneratorAttributes[key].generatorInterval = setInterval(
        this.graphGeneratorAttributes[key].generator,
        (Math.random() + 1) * 2 * 1000
      );
    }
  }

  /**
   *
   * @param {boolean} status
   */
  getContinuePauseText(status) {
    return status ? "Continue" : "Pause";
  }

  getDoughnutData = () => {
    return [
      getRandomInt(50, 200),
      getRandomInt(100, 150),
      getRandomInt(150, 250),
      getRandomInt(100, 300)
    ];
  };

  getScatterDataSet = (length = 10) => {
    let dataTmp = [];
    for (let i = 0; i < length; i++) {
      dataTmp.push({
        x: getRandomInt(0, 50),
        y: getRandomInt(0, 50)
      });
    }
    return dataTmp;
  };
}

const ChartsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedChartsContainer);

export default ChartsContainer;
