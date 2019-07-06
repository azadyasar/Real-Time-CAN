import React, { Component } from "react";
import PropTypes from "prop-types";

export default class MqttSubTopicModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subTopicValue: ""
    };
  }

  onSubTopicNameChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubscribeBtnClick = event => {
    event.preventDefault();
    this.setState({ subTopicValue: "" });
    this.props.onSubTopicSubmit(this.state.subTopicValue);
  };

  render() {
    return (
      <div
        className="modal fade"
        id={this.props.modalId}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="subscribeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="subscribeModalLHeader">
                MQTT Topic Name
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
                id="mqttSubTopicForm"
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <div className="form-group row">
                  <label
                    htmlFor="mqttTopicName"
                    className="col-sm-2 col-form-label"
                  >
                    Topic
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="mqttSubTopicName"
                      placeholder="avl/sensor/speed"
                      name="subTopicValue"
                      value={this.state.subTopicValue}
                      onChange={this.onSubTopicNameChange}
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
                onClick={this.onSubscribeBtnClick}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MqttSubTopicModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  onSubTopicSubmit: PropTypes.func.isRequired
};
