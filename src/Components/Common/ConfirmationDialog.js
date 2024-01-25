import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import ButtonComponent from "./Button";

const ConfirmationTitle = styled.h2`
  line-height: 1.5;
`;

const CancelButton = styled(ButtonComponent)`
  background-color: white !important;
  color: #15a4a7;
`;

const ConfirmationDialog = ({ onConfirm, onCancel }) => {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "520px" }}
    >
      <Row className="my-auto">
        <Col>
          <ConfirmationTitle className="text-center mt-5 fw-normal px-5">
            Are you sure you want to end this chat?
          </ConfirmationTitle>
        </Col>
      </Row>
      <Row className="mt-auto w-100">
        <Col>
          <CancelButton onClick={onCancel} className="w-100">
            Cancel
          </CancelButton>
        </Col>
        <Col>
          <ButtonComponent onClick={onConfirm} className="w-100">
            End Chat
          </ButtonComponent>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmationDialog;
