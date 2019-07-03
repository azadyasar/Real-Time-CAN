import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function ChartsToolbar(props) {
  return (
    <div className="toolbar">
      <div className="item">
        <button className="btn">
          <i className="fa fa-2x fa-car" />
        </button>
      </div>
      <div className="item">
        <button className="btn">
          <i className="fa fa-2x fa-cloud" />
        </button>
      </div>
      <div className="item">
        <button
          className={classNames("btn", {
            "btn-primary": props.pauseAllGraphsFlow,
            "btn-secondary": !props.pauseAllGraphsFlow
          })}
          onClick={props.onStartAllGraphFlowBtnClick}
        >
          <i
            className={classNames({
              "fa fa-2x fa-play-circle": props.pauseAllGraphsFlow,
              "fa fa-2x fa-pause-circle": !props.pauseAllGraphsFlow
            })}
          />
        </button>
      </div>
    </div>
  );
}

ChartsToolbar.propTypes = {
  pauseAllGraphsFlow: PropTypes.bool.isRequired,
  onStartAllGraphFlowBtnClick: PropTypes.func.isRequired
};
