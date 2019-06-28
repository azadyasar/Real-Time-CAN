import React, { Component } from "react";
import moment from "moment";
import "../css/ChartsContainer.css";
import PropTypes from "prop-types";

// Chart Cards
import LineChart from "./Charts/LineChart";
import DoughnutChart from "./Charts/DoughnutChart";
import ScatterChart from "./Charts/ScatterChart";

// eslint-disable-next-line
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class ChartsContainer extends Component {
  constructor(props) {
    super(props);

    this.dataLengthLimit = 15;

    this.chartsDataFlowStatus = {
      speedDataFlowPause: props.pauseAllGraphsFlow || true,
      rpmDataFlowPause: props.pauseAllGraphsFlow || true,
      fuelDataFlowPause: props.pauseAllGraphsFlow || true,
      emissionDataFlowPause: props.pauseAllGraphsFlow || true
    };
    this.graphNameGeneratorMap = {
      speedDataFlowPause: this.generateLineData,
      rpmDataFlowPause: this.generateRPMLineData,
      fuelDataFlowPause: this.generateFuelData,
      emissionDataFlowPause: this.generateEmissionScatterData
    };
    this.state = {
      chartsDataFlowStatus: {
        speedDataFlowPause: props.pauseAllGraphsFlow || true,
        rpmDataFlowPause: props.pauseAllGraphsFlow || true,
        fuelDataFlowPause: props.pauseAllGraphsFlow || true,
        emissionDataFlowPause: props.pauseAllGraphsFlow || true
      },
      lineData: {
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
      },
      rpmData: {
        labels: [],
        datasets: [
          {
            label: "RPM",
            borderCapStyle: "butt",
            borderJoinStyle: "miter",
            pointHitRadius: 10,
            data: [],
            fill: false, // Don't fill area under the line
            borderColor: "blue", // Line color
            pointRadius: 5
          }
        ]
      },
      fuelData: {
        labels: ["Red", "Green", "Yellow", "Profit"],
        datasets: [
          {
            data: this.getDoughnutData(),
            backgroundColor: ["#CCC", "#36A2EB", "#FFCE56", "#8c0b63"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#680849"]
          }
        ]
      },
      emissionScatterData: {
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
            data: function() {
              let dataTmp = [];
              for (let i = 0; i < this.dataLengthLimit; i++) {
                dataTmp.push({
                  x: getRandomInt(0, 50),
                  y: getRandomInt(0, 50)
                });
              }
              return dataTmp;
            }.bind(this)()
          }
        ]
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
              unit: "second"
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
    if (this.chartsDataFlowStatus.speedDataFlowPause) return;
    let tempDataCopy = this.state.lineData.datasets[0].data.concat(
      10 + Math.random() * 10
    );
    let humDataCopy = this.state.lineData.datasets[1].data.concat(
      10 + Math.random() * 10
    );
    let labelsCopy = this.state.lineData.labels.concat(moment().format());

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

    const lineDataCopy = Object.assign({}, this.state.lineData);
    lineDataCopy.labels = labelsCopy;
    lineDataCopy.datasets[0].data = tempDataCopy;
    lineDataCopy.datasets[1].data = humDataCopy;
    this.setState({ lineData: lineDataCopy });
    setTimeout(this.generateLineData, Math.random() * 3 * 1000);
  };

  generateRPMLineData = () => {
    if (this.chartsDataFlowStatus.rpmDataFlowPause) return;
    let rpmDataDatasetCopy = this.state.rpmData.datasets[0].data.concat(
      10 + Math.random() * 10
    );
    let rmpDataLabelsCopy = this.state.rpmData.labels.concat(moment().format());

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

    const rpmDataCopy = Object.assign({}, this.state.rpmData);
    rpmDataCopy.labels = rmpDataLabelsCopy;
    rpmDataCopy.datasets[0].data = rpmDataDatasetCopy;
    this.setState({ rpmData: rpmDataCopy });
    setTimeout(this.generateRPMLineData, Math.random() * 4 * 1000);
  };

  generateFuelData = () => {
    if (this.chartsDataFlowStatus.fuelDataFlowPause) return;
    const fuelDataCopy = Object.assign({}, this.state.fuelData);
    fuelDataCopy.datasets[0].data = this.getDoughnutData();
    this.setState({ fuelData: fuelDataCopy });
    setTimeout(this.generateFuelData, Math.random() * 2.5 * 1000);
  };

  generateEmissionScatterData = () => {
    if (this.chartsDataFlowStatus.emissionDataFlowPause) return;
    const emissionScatterDataCopy = Object.assign(
      {},
      this.state.emissionScatterData
    );
    emissionScatterDataCopy.datasets[0].data = this.getScatterDataSet();
    this.setState({ emissionScatterData: emissionScatterDataCopy });
    setTimeout(this.generateEmissionScatterData, Math.random() * 6 * 1000);
  };

  componentDidMount() {
    Object.keys(this.graphNameGeneratorMap).forEach(key => {
      this.graphNameGeneratorMap[key]();
    });
  }

  componentWillReceiveProps(props) {
    Object.keys(this.chartsDataFlowStatus).forEach(key => {
      this.chartsDataFlowStatus[key] = props.pauseAllGraphsFlow;
    });

    Object.keys(this.graphNameGeneratorMap).forEach(key => {
      this.graphNameGeneratorMap[key]();
    });

    this.setState({
      chartsDataFlowStatus: Object.assign({}, this.chartsDataFlowStatus, {
        speedDataFlowPause: props.pauseAllGraphsFlow,
        rpmDataFlowPause: props.pauseAllGraphsFlow,
        fuelDataFlowPause: props.pauseAllGraphsFlow,
        emissionDataFlowPause: props.pauseAllGraphsFlow
      })
    });
  }

  componentWillUnmount() {
    Object.keys(this.chartsDataFlowStatus).forEach(key => {
      this.chartsDataFlowStatus[key] = true;
    });
  }

  /*  onLineGraphBtnClick = event => {
    event.preventDefault();

    this.chartsDataFlowStatus.speedDataFlowPause = !this.chartsDataFlowStatus
      .speedDataFlowPause;
    this.generateLineData();

    this.setState({
      chartsDataFlowStatus: Object.assign({}, this.state.chartsDataFlowStatus, {
        speedDataFlowPause: !this.state.chartsDataFlowStatus.speedDataFlowPause
      })
    });
  };

  onRPMGraphBtnClick = event => {
    event.preventDefault();

    this.chartsDataFlowStatus.rpmDataFlowPause = !this.chartsDataFlowStatus
      .rpmDataFlowPause;
    this.generateRPMLineData();

    this.setState({
      chartsDataFlowStatus: Object.assign({}, this.state.chartsDataFlowStatus, {
        rpmDataFlowPause: !this.state.chartsDataFlowStatus.rpmDataFlowPause
      })
    });
  };

  onFuelGraphBtnClick = event => {
    event.preventDefault();

    this.chartsDataFlowStatus.fuelDataFlowPause = !this.chartsDataFlowStatus
      .fuelDataFlowPause;
    this.generateFuelData();

    this.setState({
      chartsDataFlowStatus: Object.assign({}, this.state.chartsDataFlowStatus, {
        fuelDataFlowPause: !this.state.chartsDataFlowStatus.fuelDataFlowPause
      })
    });
  }; */

  onGraphFlowBtnClick = event => {
    console.log(event.target);
    event.preventDefault();

    this.chartsDataFlowStatus[event.target.name] = !this.chartsDataFlowStatus[
      event.target.name
    ];
    this.graphNameGeneratorMap[event.target.name]();
    this.setState({
      chartsDataFlowStatus: Object.assign({}, this.state.chartsDataFlowStatus, {
        [event.target.name]: !this.state.chartsDataFlowStatus[event.target.name]
      })
    });
  };

  render() {
    return (
      <div className="charts-container ">
        <div className="row  justify-content-center">
          {/* Speed Graph */}
          <div className="col-xl-4 col-lg-6 col-md-6 m-4 h-100" align="center">
            <LineChart
              title="Speed"
              graphName="speedDataFlowPause"
              data={this.state.lineData}
              options={this.lineGraphOptions}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.state.chartsDataFlowStatus.speedDataFlowPause}
            />
          </div>
          {/* RPM Graph */}
          <div className="col-xl-4 col-lg-6 col-md-6 m-4 h-100" align="center">
            <LineChart
              title="RPM"
              graphName="rpmDataFlowPause"
              data={this.state.rpmData}
              options={this.lineGraphOptions}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.state.chartsDataFlowStatus.rpmDataFlowPause}
            />
          </div>
          {/* </div>
        <div className="row justify-content-center"> */}
          {/* Doughnut Chart */}
          <div className="col-xl-4 col-lg-6 col-md-6 m-4 h-100" align="center">
            <DoughnutChart
              title="Fuel Usage"
              graphName="fuelDataFlowPause"
              data={this.state.fuelData}
              options={this.lineGraphOptions}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={this.state.chartsDataFlowStatus.fuelDataFlowPause}
            />
          </div>
          {/* Scatter Chart (Emissions) */}
          <div className="col-xl-4 col-lg-6 col-md-6 m-4 h-100" align="center">
            <ScatterChart
              title="Emission"
              graphName="emissionDataFlowPause"
              data={this.state.emissionScatterData}
              onGraphFlowBtnClick={this.onGraphFlowBtnClick}
              dataFlowPause={
                this.state.chartsDataFlowStatus.emissionDataFlowPause
              }
            />
          </div>
        </div>
      </div>
    );
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

ChartsContainer.propTypes = {
  pauseAllGraphsFlow: PropTypes.bool
};
