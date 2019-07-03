import React from "react";
import PropTypes from "prop-types";

export default function MqttShutdownModal(props) {
  return (
    <div
      className="modal fade top"
      id={props.modalId}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="shutdownModalLbl"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-frame modal-top" role="document">
        <div className="modal-content">
          {/* <div clasName="modal-header" align="center">
            <h5 className="modal-title">Shutdown Connection</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div> */}

          <div className="modal-body">
            <div className="row d-flex justify-content-center align-items-center">
              <p>Do you want to close the MQTT connection?</p>
            </div>
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
              type="submit"
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={props.onShutdownBtnClick}
            >
              Shutdown
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

MqttShutdownModal.propTypes = {
  onShutdownBtnClick: PropTypes.func.isRequired,
  modalId: PropTypes.string.isRequired
};
