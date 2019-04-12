import React, { StatelessComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';

type AuthModalProps = {
  title: string;
  body: string;
  show: boolean;
  onClose: () => void;
};

const AuthModal: StatelessComponent<AuthModalProps> = ({
  title,
  body,
  show,
  onClose
}) => (
  <Modal show={show}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{body}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AuthModal;
