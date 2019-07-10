import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import classNames from "classnames";
import PropTypes from "prop-types";

const barOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
          // autoSkip: false
        }
      }
    ]
  }
};

export default class BarChart extends Component {
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
    return (
      <div className="card chart-card">
        <div className="card-header">{this.props.title}</div>
        <Bar data={this.props.data} options={barOptions} />
        <div className="card-body">
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
          {this.props.isHookable && (
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
          )}
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

BarChart.propTypes = {
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
  isHookable: PropTypes.bool.isRequired,
  onCleanChartDataBtnClick: PropTypes.func.isRequired
};
