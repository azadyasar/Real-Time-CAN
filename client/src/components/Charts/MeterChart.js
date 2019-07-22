import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import classNames from "classnames";
import PropTypes from "prop-types";

export default class MeterChart extends Component {
  onHookBtnClick = event => {
    if (this.props.isHooked)
      // eslint-disable-next-line no-undef
      $(`#${this.props.target}`).modal("hide");
    // eslint-disable-next-line no-undef
    else $(`#${this.props.target}`).modal();
    event.preventDefault();
    event.graphTarget = this.props.graphTarget;
    event.isAlreadyHooked = this.props.isHooked;
    this.props.onHookBtnClick(event);
  };

  render() {
    const currentSpeed = this.props.data.datasets[0].data[0];
    let whiteArea = 240 - currentSpeed;
    whiteArea = whiteArea > 0 ? whiteArea : 0;
    const newSpeedometerData = [currentSpeed, whiteArea];

    const currentRpm = this.props.data.datasets[1].data[0];
    whiteArea = 300 - currentRpm;
    whiteArea = whiteArea > 0 ? whiteArea : 0;
    const newRpmData = [currentRpm, whiteArea];

    const newData = Object.assign({}, this.props.data, {
      datasets: [
        Object.assign({}, this.props.data.datasets[0], {
          data: newSpeedometerData
        }),
        Object.assign({}, this.props.data.datasets[1], {
          data: newRpmData
        })
      ]
    });

    console.log(newData);

    return (
      <div className="card chart-card h-100">
        <div className="card-header">{this.props.title}</div>

        <div className="card-body p-0 pt-2">
          <Doughnut
            data={newData}
            options={{
              rotation: 1 * Math.PI,
              circumference: 1 * Math.PI,
              legend: {
                position: "top"
              },
              title: { display: false, text: "Gauge" }
              // tooltips: {
              //   callbacks: {
              //     label: (item, data) => {
              //       console.log("cb ttip", item, data);
              //       return (
              //         data.datasets[item.datasetIndex].label +
              //         ": " +
              //         data.datasets[item.datasetIndex].data[0]
              //       );
              //     }
              //   }
              // }
            }}
          />
          <h5 className="display-5 speedmeter">
            Speed: {currentSpeed.toFixed(0)}
          </h5>
          <h5 className="display-5 rpmmeter">RPM: {currentRpm.toFixed(0)}</h5>
        </div>
        <div className="card-footer p-0 py-1">
          <button
            className={classNames("btn m-2", {
              "btn-outline-primary": this.props.dataFlowPause,
              "btn-outline-secondary": !this.props.dataFlowPause
            })}
            name={this.props.graphName}
            onClick={this.props.onGraphFlowBtnClick}
          >
            {this.getContinuePauseText(this.props.dataFlowPause)}
          </button>
          <button
            className={classNames("btn m-2", {
              "btn-outline-success": !this.props.isHooked,
              "btn-outline-danger": this.props.isHooked
            })}
            name={this.props.title}
            // data-toggle="modal"
            data-target={`#${this.props.target}`}
            onClick={this.onHookBtnClick}
          >
            {this.getHookDetachText(this.props.isHooked)}
          </button>
          <button
            type="button"
            className="btn m-2 btn-outline-primary"
            name={this.props.graphTarget}
            onClick={this.props.onCleanChartDataBtnClick}
          >
            {" "}
            <i className="fa  fa-trash" name={this.props.graphTarget} />
          </button>
        </div>
      </div>
    );
  }

  /**
   *
   * @param {boolean} isFlowPaused
   */
  getContinuePauseText(isFlowPaused) {
    return isFlowPaused ? "Continue" : "Pause";
  }

  getHookDetachText(isHooked) {
    return isHooked ? "Detach" : "Hook";
  }
}

MeterChart.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  onGraphFlowBtnClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  graphName: PropTypes.string.isRequired,
  dataFlowPause: PropTypes.bool.isRequired,
  target: PropTypes.string.isRequired,
  onHookBtnClick: PropTypes.func.isRequired,
  graphTarget: PropTypes.string.isRequired,
  isHooked: PropTypes.bool.isRequired,
  onCleanChartDataBtnClick: PropTypes.func.isRequired
};
