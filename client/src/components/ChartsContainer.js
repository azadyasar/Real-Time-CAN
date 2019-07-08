import React, { Component } from "react";
import moment from "moment";
import "../css/ChartsContainer.css";

import { connect } from "react-redux";
import {
  updateChartData,
  changeGraphFlow,
  changeAllGraphFlow,
  resetAllChartData
} from "../actions";

import ChartsToolbar from "./ChartsToolbar";
// Chart Cards
import LineChart from "./Charts/LineChart";
import DoughnutChart from "./Charts/DoughnutChart";
import ScatterChart from "./Charts/ScatterChart";

// eslint-disable-next-line
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const mapStateToProps = state => {
  return {
    lineData: state.chart.lineData,
    rpmData: state.chart.rpmData,
    fuelData: state.chart.fuelData,
    emissionsData: state.chart.emissionsData,
    chartsDataFlowStatus: state.chart.chartsDataFlowStatus,
    isAllGraphFlowPaused: state.chart.isAllGraphFlowPaused
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateChartData: newLineData => dispatch(updateChartData(newLineData)),
    changeGraphFlow: signal => dispatch(changeGraphFlow(signal)),
    changeAllGraphFlow: signal => dispatch(changeAllGraphFlow(signal)),
    resetAllChartData: signal => dispatch(resetAllChartData(signal))
  };
};

export class ConnectedChartsContainer extends Component {
  constructor(props) {
    super(props);
    console.debug("ChartContainer constructer");

    this.dataLengthLimit = 15;

    this.graphGeneratorAttributes = {
      speedLineData: {
        generator: this.generateLineData,
        pause: "speedDataFlowPause",
        generatorInterval: null
      },
      rpmLineData: {
        generator: this.generateRPMLineData,
        pause: "rpmDataFlowPause",
        generatorInterval: null
      },
      fuelDoughnutData: {
        generator: this.generateFuelData,
        pause: "fuelDataFlowPause",
        generatorInterval: null
      },
      emissionsScatterData: {
        generator: this.generateEmissionScatterData,
        pause: "emissionDataFlowPause",
        generatorInterval: null
      }
    };
    this.graphGenerators = [
      this.generateLineData,
      this.generateRPMLineData,
      this.generateFuelData,
      this.generateEmissionScatterData
    ];

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
    let tempDataCopy = this.props.lineData.datasets[0].data.concat(
      10 + Math.random() * 10
    );
    let humDataCopy = this.props.lineData.datasets[1].data.concat(
      10 + Math.random() * 10
    );
    let labelsCopy = this.props.lineData.labels.concat(moment().format());

    if (tempDataCopy.length > this.dataLengthLimit)
      tempDataCopy = tempDataCopy.slice(
        tempDataCopy.length - this.dataLengthLimit,
        tempDataCopy.length
      );
    if (humDataCopy.length > this.dataLengthLimit)
      humDataCopy = humDataCopy.slice(
        humDataCopy.length - this.dataLengthLimit,
        humDataCopy.length
      );
    if (labelsCopy.length > this.dataLengthLimit)
      labelsCopy = labelsCopy.slice(
        labelsCopy.length - this.dataLengthLimit,
        labelsCopy.length
      );

    const lineDataCopy = Object.assign({}, this.props.lineData);
    lineDataCopy.labels = labelsCopy;
    lineDataCopy.datasets[0].data = tempDataCopy;
    lineDataCopy.datasets[1].data = humDataCopy;
    this.props.updateChartData({ data: lineDataCopy, chartName: "lineData" });
  };

  generateRPMLineData = () => {
    console.debug("generateRPMLineData");
    if (this.props.chartsDataFlowStatus.rpmDataFlowPause) return;
    let rpmDataDatasetCopy = this.props.rpmData.datasets[0].data.concat(
      10 + Math.random() * 10
    );
    let rmpDataLabelsCopy = this.props.rpmData.labels.concat(moment().format());

    if (rpmDataDatasetCopy.length > this.dataLengthLimit)
      rpmDataDatasetCopy = rpmDataDatasetCopy.slice(
        rpmDataDatasetCopy.length - this.dataLengthLimit,
        rpmDataDatasetCopy.length
      );

    if (rmpDataLabelsCopy.length > this.dataLengthLimit)
      rmpDataLabelsCopy = rmpDataLabelsCopy.slice(
        rmpDataLabelsCopy.length - this.dataLengthLimit,
        rmpDataLabelsCopy.length
      );

    const rpmDataCopy = Object.assign({}, this.props.rpmData);
    rpmDataCopy.labels = rmpDataLabelsCopy;
    rpmDataCopy.datasets[0].data = rpmDataDatasetCopy;
    this.props.updateChartData({ data: rpmDataCopy, chartName: "rpmData" });
  };

  generateFuelData = () => {
    console.debug("generateFuelData");
    if (this.props.chartsDataFlowStatus.fuelDataFlowPause) return;
    const fuelDataCopy = Object.assign({}, this.props.fuelData);
    fuelDataCopy.datasets[0].data = this.getDoughnutData();
    this.props.updateChartData({ data: fuelDataCopy, chartName: "fuelData" });
  };

  generateEmissionScatterData = () => {
    console.debug("generateEmissionScatterData");
    if (this.props.chartsDataFlowStatus.emissionDataFlowPause) return;
    const emissionScatterDataCopy = Object.assign({}, this.props.emissionsData);
    emissionScatterDataCopy.datasets[0].data = this.getScatterDataSet();
    this.props.updateChartData({
      data: emissionScatterDataCopy,
      chartName: "emissionsData"
    });
  };

  componentDidMount() {
    console.debug("ChartContainer did mount");
    Object.keys(this.graphGeneratorAttributes).forEach(key => {
      this.shouldGenerateData(this.graphGeneratorAttributes[key]);
    });
  }

  componentWillReceiveProps(newProps) {
    console.log("Charts container will receive props: ", newProps);
    Object.keys(this.graphGeneratorAttributes).forEach(key => {
      this.shouldGenerateData(this.graphGeneratorAttributes[key], newProps);
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

  render() {
    return (
      <div className="charts-container ">
        <ChartsToolbar
          pauseAllGraphsFlow={this.props.isAllGraphFlowPaused}
          onStartAllGraphFlowBtnClick={this.onStartAllGraphFlowBtnClick}
          onCleanAllChartDataBtnClick={this.onCleanAllChartDataBtnClick}
        />
        <div className="row  justify-content-center">
          {/* Speed Graph */}
          <div className="col-xl-4 col-lg-6 col-md-6 m-4 h-100" align="center">
            <LineChart
              title="Speed"
              graphName="speedDataFlowPause"
              data={this.props.lineData}
              options={this.lineGraphOptions}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.props.chartsDataFlowStatus.speedDataFlowPause}
            />
          </div>
          {/* RPM Graph */}
          <div className="col-xl-4 col-lg-6 col-md-6 m-4 h-100" align="center">
            <LineChart
              title="RPM"
              graphName="rpmDataFlowPause"
              data={this.props.rpmData}
              options={this.lineGraphOptions}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.props.chartsDataFlowStatus.rpmDataFlowPause}
            />
          </div>
          {/* Doughnut Chart */}
          <div className="col-xl-4 col-lg-6 col-md-6 m-4 h-100" align="center">
            <DoughnutChart
              title="Fuel Usage"
              graphName="fuelDataFlowPause"
              data={this.props.fuelData}
              options={this.lineGraphOptions}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.props.chartsDataFlowStatus.fuelDataFlowPause}
            />
          </div>
          {/* Scatter Chart (Emissions) */}
          <div className="col-xl-4 col-lg-6 col-md-6 m-4 h-100" align="center">
            <ScatterChart
              title="Emission"
              graphName="emissionDataFlowPause"
              data={this.props.emissionsData}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={
                this.props.chartsDataFlowStatus.emissionDataFlowPause
              }
            />
          </div>
        </div>
      </div>
    );
  }

  shouldGenerateData(dataGeneratorAttribute, newProps = undefined) {
    if (!newProps) newProps = this.props;
    if (newProps.chartsDataFlowStatus[dataGeneratorAttribute.pause]) {
      if (dataGeneratorAttribute.generatorInterval) {
        clearInterval(dataGeneratorAttribute.generatorInterval);
        dataGeneratorAttribute.generatorInterval = null;
      }
    } else if (!dataGeneratorAttribute.generatorInterval) {
      console.debug(
        "Starting data generation for: ",
        dataGeneratorAttribute.pause
      );
      dataGeneratorAttribute.generatorInterval = setInterval(
        dataGeneratorAttribute.generator,
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
