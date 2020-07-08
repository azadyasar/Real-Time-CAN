import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ChartSettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineChartRange: this.props.currentLineChartRange
    };
  }

  onLineChartChange = event => {
    this.setState({
      lineChartRange: Number(event.target.value)
    });
  };

  onApplySettingsSubmit = event => {
    event.preventDefault();
    this.props.onApplySettingsSubmit({
      lineChartRange: this.state.lineChartRange
    });

    //eslint-disable-next-line no-undef
    $(`#${this.props.modalId}`).modal("hide");
  };

  render() {
    return (
      <div className="modal fade" id={this.props.modalId}>
        {" "}
        tabIndex="-1" role="dialog" aria-labelledby="chartSettingsModal"
        aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Chart Settings</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {/* MODAL */}
            <div className="modal-body">
              <form
                id="chartSettingsFormId"
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <div className="form-group row">
                  <label
                    htmlFor="customLineChartRange"
                    className="col-sm-3 col-form-label"
                  >
                    Line Graph Range
                  </label>
                  <div className="col-sm-9 pt-3">
                    <span className="font-weight bold indigo-text mr-2 mt-1">
                      5
                    </span>
                    <input
                      type="range"
                      className="custom-range line-chart-range align-bottom "
                      min="5"
                      max="100"
                      id="customLineChartRange"
                      value={this.state.lineChartRange}
                      onChange={this.onLineChartChange}
                    />
                    <span className="font-weight bold indigo-text ml-2 mt-1">
                      100
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* FOOTER */}
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={this.onApplySettingsSubmit}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ChartSettingsModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  currentLineChartRange: PropTypes.number.isRequired,
  onApplySettingsSubmit: PropTypes.func.isRequired
};
