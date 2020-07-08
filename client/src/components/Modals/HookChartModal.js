import React, { Component } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export default class HookChartModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hookTopicValue: ""
    };
  }

  onHookTopicChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onApplyBtnClick = event => {
    event.preventDefault();
    if (this.state.hookTopicValue === "") {
      toast.warn("You must fill in the topic value.");
      return;
    }

    //eslint-disable-next-line no-undef
    $(`#${this.props.modalId}`).modal("hide");
    this.props.onApplyHookBtnSubmit(this.state.hookTopicValue);
    this.setState({ hookTopicValue: "" });
  };

  render() {
    return (
      <div
        className="modal fade"
        id={this.props.modalId}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="hookChartModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Hook Chart Data</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {/* BODY */}
            <div className="modal-body">
              <form
                id="hookChartFormId"
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <div className="form-group row">
                  <label
                    htmlFor="hookTopicValueId"
                    className="col-sm-3 col-form-label"
                  >
                    MQTT Topic
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      id="hookTopicValueId"
                      placeholder="avl/sensor/speed"
                      name="hookTopicValue"
                      value={this.state.hookTopicValue}
                      onChange={this.onHookTopicChange}
                    />
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
                onClick={this.onApplyBtnClick}
              >
                Hook
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HookChartModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  onApplyHookBtnSubmit: PropTypes.func.isRequired
};
