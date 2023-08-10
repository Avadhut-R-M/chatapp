import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function NewGroup() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>NewGroup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
            <label>Group Name:</label>
            <input></input>
            </div>

            <select placeholder='select' multiple option={[{'lable':1, 'value':2}]}>
                {/* <option>abc</option>
                <option>abcd</option>
                <option>abc</option>
                <option>abcd</option>
                <option>abc</option>
                <option>abcd</option>
                <option>abc</option>
                <option>abcd</option> */}
            </select>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewGroup;