import React, { Component } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import classNames from "classnames";

export default class MqttPubMsgModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pubTopic: "",
      pubMsg: "",
      mqttQos: 0,
      retain: false
    };
  }

  onInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onQosChange = event => {
    this.setState({
      [event.target.name]: Number(event.target.value)
    });
  };

  onRetainToggleClick = event => {
    event.preventDefault();
    this.setState({
      retain: !this.state.retain
    });
  };

  onPubMsgClick = event => {
    event.preventDefault();

    if (this.state.pubTopic === "" || this.state.pubMsg === "") {
      toast.warn("You must fill in the topic and message input.");
      return;
    }

    // eslint-disable-next-line no-undef
    $(`#${this.props.modalId}`).modal("hide");

    this.props.onPubMsgSubmit({
      topic: this.state.pubTopic,
      message: this.state.pubMsg,
      qos: this.state.mqttQos,
      retain: this.state.retain
    });
    this.setState({ pubMsg: "", pubTopic: "" });
  };

  render() {
    return (
      <div
        className="modal fade"
        id={this.props.modalId}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="publishMsgModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="pubMessageModalHeader">
                MQTT Publish Message
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form
                id="mqttPubMsgForm"
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <div className="form-group row">
                  <label
                    htmlFor="mqttPubTopicName"
                    className="col-sm-2 col-form-label"
                  >
                    Topic:
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="mqttPubTopicName"
                      placeholder="avl/nodejs/sensor"
                      name="pubTopic"
                      required={true}
                      value={this.state.pubTopic}
                      onChange={this.onInputChange}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="mqttMessage"
                    className="col-sm-2 col-form-label"
                  >
                    Message:
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="mqttMessage"
                      placeholder="Message"
                      name="pubMsg"
                      required={true}
                      value={this.state.pubMsg}
                      onChange={this.onInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <fieldset className="form-group">
                      <div className="row">
                        <legend className="col-form-label col-sm-4 pt-0">
                          QOS
                        </legend>
                        <div className="col-sm-8" id="qosRadioField">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="mqttQos"
                              id="gridRadios1"
                              value="0"
                              checked={this.state.mqttQos === 0}
                              onChange={this.onQosChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="gridRadios1"
                            >
                              0
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="mqttQos"
                              id="gridRadios2"
                              value="1"
                              checked={this.state.mqttQos === 1}
                              onChange={this.onQosChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="gridRadios2"
                            >
                              1
                            </label>
                          </div>
                          <div className="form-check disabled">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="mqttQos"
                              id="gridRadios3"
                              value="2"
                              checked={this.state.mqttQos === 2}
                              onChange={this.onQosChange}
                              // disabled
                            />
                            <label
                              className="form-check-label"
                              htmlFor="gridRadios3"
                            >
                              2
                            </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="col-sm-6">
                    <button
                      type="button"
                      className={classNames("btn", {
                        "btn-outline-success": this.state.retain,
                        "btn-outline-danger": !this.state.retain
                      })}
                      // data-dismiss="modal"
                      onClick={this.onRetainToggleClick}
                    >
                      Retain
                    </button>
                  </div>
                </div>
              </form>
            </div>

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
                // data-dismiss="modal"
                onClick={this.onPubMsgClick}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MqttPubMsgModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  onPubMsgSubmit: PropTypes.func.isRequired
};
