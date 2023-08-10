import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function New() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{display: 'flex', justifyContent:'space-around'}}>
                <Button variant="primary">Group</Button>
                <Button variant="primary">Chat</Button>
                <Button variant="primary">User</Button>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default New;