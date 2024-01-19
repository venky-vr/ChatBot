import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const StyledButton = styled(Button)`
  background-color: #15a4a7 !important;
  font-weight: bold;
  font-size: 1.3rem;
  color: #fff;
  border-color: #15a4a7;
  &:disabled {
    background-color: #edeeef !important;
    color: #747981;
    border-color: #edeeef;
  }
  &:hover {
    background-color: #007c89 !important;
    border-color: #15a4a7;
  }
`;

const ButtonComponent = (props) => {
  return <StyledButton {...props} />;
};

export default ButtonComponent;
