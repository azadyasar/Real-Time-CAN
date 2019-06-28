import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import classNames from "classnames";
import PropTypes from "prop-types";

export default class LineChart extends Component {
  render() {
    return (
      <div className="card chart-card">
        <div className="card-header">{this.props.title}</div>
        <Line data={this.props.data} options={this.props.options} />
        <div className="card-body">
          <button
            className={classNames("btn mt-2", {
              "btn-primary": this.props.dataFlowPause,
              "btn-secondary": !this.props.dataFlowPause
            })}
            name={this.props.graphName}
            onClick={this.props.onGraphFlowBtnClick}
          >
            {this.getContinuePauseText(this.props.dataFlowPause)}
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

LineChart.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  onGraphFlowBtnClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  graphName: PropTypes.string.isRequired,
  dataFlowPause: PropTypes.bool.isRequired
};
