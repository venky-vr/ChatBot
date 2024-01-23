import React from "react";
import styled from "styled-components";
import { Row, Col, Button } from "react-bootstrap";
import { BsFillBellFill, BsX, BsDash, BsArrowsExpand } from "react-icons/bs";

const StyledTitle = styled.h2`
  font-size: 1.8rem;
`;

const ChatBoxHeader = ({
  isMinimized,
  toggleMinimize,
  closeChatbox,
  isMuted,
  toggleMute,
}) => {
  const baseStyles = {
    background: "#fff",
    color: "#000",
    borderBottom: "1px solid #b3e4e5",
    paddingBottom: "6px",
  };

  const minimizedStyles = {
    background: "#15a4a7",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "6px",
  };

  const buttonBaseStyle = {
    color: "#fff",
  };
  const buttonMinimizedStyle = {
    color: "#15a4a7",
  };

  return (
    <Row className={`${isMinimized ? "minimized px-0 py-0" : ""}`}>
      <Col md={12}>
        <div
          className="d-flex justify-content-between align-items-center px-2 py-2"
          style={isMinimized ? minimizedStyles : baseStyles}
        >
          <StyledTitle className="py-2 px-2 mb-0">
            Chat With an Agent
          </StyledTitle>
          <div className="d-flex justify-content-end align-items-center">
            <Button
              variant="link"
              className="text-muted p-0"
              onClick={toggleMute}
            >
              {isMuted ? (
                <BsFillBellFill
                  size={23}
                  style={isMinimized ? buttonBaseStyle : buttonMinimizedStyle}
                />
              ) : (
                <BsFillBellFill size={23} color="orange" />
              )}
            </Button>
            <Button
              variant="link"
              className="text-decoration-none"
              onClick={toggleMinimize}
            >
              {isMinimized ? (
                <BsArrowsExpand
                  size={25}
                  style={isMinimized ? buttonBaseStyle : buttonMinimizedStyle}
                />
              ) : (
                <BsDash size={30} />
              )}
            </Button>
            <Button
              variant="link"
              className="text-decoration-none"
              onClick={closeChatbox}
            >
              <BsX
                size={30}
                style={isMinimized ? buttonBaseStyle : buttonMinimizedStyle}
              />
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ChatBoxHeader;
