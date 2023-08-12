import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";

function EditMessage(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          className="message-input"
          placeholder="Add new message here"
          rows={4}
          onChange={(e) =>
            props.changeValue({ edited_message: e.target.value })
          }
          value={props.value}
        ></textarea>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onSave} variant="primary">
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditMessage;
