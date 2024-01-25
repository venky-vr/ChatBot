import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import ButtonComponent from "../Common/Button";
import ErrorMessageComponent from "./ErrorMessageComponent";

const BotContent = styled.div`
  height: 322px;
  display: block;
  overflow: auto;
  margin-bottom: 15px;
  padding: 8px 8px 0px 8px;
`;

const BotBody = styled.div`
  padding: 5px;
  width: 350px;
  border-radius: 6px;
  color: #515761;
`;

const StyledDiv = styled.div`
  margin-top: 30px;
`;

const ConverSationTitle = styled.small`
  color: #51576180;
`;

const ChatBotUI = ({
  userMessageRef,
  selectedTopic,
  botMessages,
  userMessage,
  onChangeUserMessage,
  onSendMessage,
  onKeyPress,
  isErrorMessage,
  isMuted,
}) => {
  const isFormValid = userMessage.trim() !== "";

  const initialBg = true;

  const BotBodyBg = {
    backgroundColor: initialBg ? "#c7e9ea" : "#F8F8F8",
  };

  useEffect(() => {
    const playAudio = () => {
      if (!isMuted) {
        const audioElement = new Audio("https://dummyurl.com/audio1.mp3"); // Replace with the path to your audio file
        audioElement.play();
      }
    };

    // Check if there are new bot messages
    if (botMessages.length > 0) {
      playAudio();
    }
  }, [botMessages, isMuted]);

  return (
    <>
      <Row className="px-3 py-2">
        <Col md={12} className="p-0">
          <BotContent ref={userMessageRef}>
            <div className="d-flex flex-column mb-3 align-items-end">
              <ConverSationTitle className="mb-0 h6">You</ConverSationTitle>
              <BotBody style={BotBodyBg}>
                <p className="m-0">{selectedTopic.textareaValue}</p>
              </BotBody>
            </div>
            {botMessages &&
              botMessages?.map((message, index) => {
                const isUserMessage = message.isUserMessage;
                return (
                  <div
                    key={index}
                    className={`d-flex flex-column mb-3 ${
                      isUserMessage ? "align-items-end" : "align-items-start"
                    }`}
                  >
                    <ConverSationTitle className="mb-0 h6">
                      {isUserMessage ? `You` : "ChatAgent"}
                    </ConverSationTitle>
                    {isErrorMessage(message) ? (
                      <ErrorMessageComponent message={message} />
                    ) : (
                      <BotBody
                        style={{
                          backgroundColor: isUserMessage
                            ? "#c7e9ea"
                            : "#F8F8F8",
                        }}
                      >
                        <p className="m-0">
                          {isUserMessage ? message.body : message}
                        </p>
                      </BotBody>
                    )}
                  </div>
                );
              })}
          </BotContent>
        </Col>
        <Col md={12}>
          <StyledDiv>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={userMessage}
                onChange={onChangeUserMessage}
                autoFocus="autofocus"
                autoComplete="off"
                placeholder="Enter your message for the agent here..."
                onKeyUp={onKeyPress}
              />
            </Form.Group>
            <ButtonComponent
              className="py-2 w-100 my-2"
              onClick={onSendMessage}
              disabled={!isFormValid}
            >
              Send Message
            </ButtonComponent>
          </StyledDiv>
        </Col>
      </Row>
    </>
  );
};

export default ChatBotUI;
