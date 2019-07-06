import React, { Component } from "react";
import PropTypes from "prop-types";

export default class MqttPubMsgModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pubTopic: "",
      pubMsg: ""
    };
  }

  onInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onPubMsgClick = event => {
    event.preventDefault();
    this.props.onPubMsgSubmit({
      topic: this.state.pubTopic,
      message: this.state.pubMsg
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
                      value={this.state.pubMsg}
                      onChange={this.onInputChange}
                    />
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
                data-dismiss="modal"
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
