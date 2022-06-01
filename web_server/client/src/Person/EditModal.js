import React from 'react'
import { useState } from 'react';
import {Modal, Button, Form} from 'react-bootstrap'
import Auth from '../Auth/Auth';
import { IP } from '../const';


const EditModal = ({update, attr}) => {
    
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    

    const updateTest = (user_info, attr) => {
        let url = `http://${IP}:3000/news/update/` + Auth.getEmail()
        
        console.log("hhhh",user_info, attr)
        let request = new Request(encodeURI(url), {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            body: JSON.stringify({
                user_info: user_info,
                attr: attr,
            })
        });

        fetch(request)
    }
    const handleChange = (event) =>{
        setUserInfo(event.target.value)
    }

    const save = () => {
        console.log(userInfo)
        console.log(attr)
        updateTest(userInfo, attr)

        handleClose()
        window.location.reload(false);
    }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update {attr}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{attr}</Form.Label>
              <Form.Control
                autoFocus
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={save}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditModal