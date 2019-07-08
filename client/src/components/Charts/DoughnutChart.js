import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import classNames from "classnames";
import PropTypes from "prop-types";

export default class DoughnutChart extends Component {
  render() {
    return (
      <div className="card chart-card">
        <div className="card-header">{this.props.title}</div>
        <Doughnut data={this.props.data} />
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
          <button
            className="btn m2-2 btn-outline-success"
            onClick={this.props.onHookBtnClick}
            name={this.props.title}
          >
            Hook
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
}

DoughnutChart.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  onGraphFlowBtnClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  graphName: PropTypes.string.isRequired,
  dataFlowPause: PropTypes.bool.isRequired,
  onHookBtnClick: PropTypes.func.isRequired
};
