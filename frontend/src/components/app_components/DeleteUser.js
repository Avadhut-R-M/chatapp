import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteUser(props) {

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={props.handleSave}>
            Delete Member
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteUser;