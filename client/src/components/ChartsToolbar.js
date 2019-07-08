import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function ChartsToolbar(props) {
  return (
    <div className="toolbar">
      <div className="btn-group-vertical">
        <button type="button" className="btn btn-outline-primary">
          <i className="fa fa-2x fa-car" />
        </button>
        <button type="button" className="btn btn-outline-primary">
          <i className="fa fa-2x fa-cloud" />
        </button>
        <button
          className="btn btn-outline-primary"
          // className={classNames("btn", {
          //   "btn-outline-primary": props.pauseAllGraphsFlow,
          //   "btn-outline-primary": !props.pauseAllGraphsFlow
          // })}
          onClick={props.onStartAllGraphFlowBtnClick}
        >
          <i
            className={classNames({
              "fa fa-2x fa-play-circle": props.pauseAllGraphsFlow,
              "fa fa-2x fa-pause-circle": !props.pauseAllGraphsFlow
            })}
          />
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={props.onCleanAllChartDataBtnClick}
        >
          <i className="fa fa-2x fa-trash" />
        </button>
      </div>
    </div>
  );
}

ChartsToolbar.propTypes = {
  pauseAllGraphsFlow: PropTypes.bool.isRequired,
  onStartAllGraphFlowBtnClick: PropTypes.func.isRequired,
  onCleanAllChartDataBtnClick: PropTypes.func.isRequired
};
