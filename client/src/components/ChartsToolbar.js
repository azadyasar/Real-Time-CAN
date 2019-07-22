import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function ChartsToolbar(props) {
  // eslint-disable-next-line no-undef
  $(function() {
    // eslint-disable-next-line no-undef
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
  });
  return (
    <div className="toolbar">
      <div className="btn-group">
        <button type="button" className="btn toolbar-btn">
          <i className="fa fa-lg fa-car" />
        </button>
        <button type="button" className="btn toolbar-btn">
          <i className="fa fa-lg fa-cloud" />
        </button>
        <button
          className="btn toolbar-btn"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Toggle data generation"
          onClick={props.onStartAllGraphFlowBtnClick}
        >
          <i
            className={classNames({
              "fa fa-lg fa-play-circle": props.pauseAllGraphsFlow,
              "fa fa-lg fa-pause-circle": !props.pauseAllGraphsFlow
            })}
          />
        </button>
        <button
          type="button"
          className="btn toolbar-btn"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Reset graph data"
          onClick={props.onCleanAllChartDataBtnClick}
        >
          <i className="fa fa-lg fa-trash" />
        </button>
        <button
          type="button"
          className="btn toolbar-btn"
          data-toggle="modal"
          data-target={`#${props.chartSettingsModalId}`}
          onClick={props.onSettingsBtnClick}
        >
          <i className="fa fa-lg fa-cog" />
        </button>
      </div>
    </div>
  );
}

ChartsToolbar.propTypes = {
  pauseAllGraphsFlow: PropTypes.bool.isRequired,
  onStartAllGraphFlowBtnClick: PropTypes.func.isRequired,
  onCleanAllChartDataBtnClick: PropTypes.func.isRequired,
  chartSettingsModalId: PropTypes.string.isRequired
};
