import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import ButtonComponent from "../Common/Button";
import ErrorMessageComponent from "./ErrorMessageComponent";

const BotContent = styled.div`
  height: 500px;
  display: block;
  overflow: auto;
  margin-bottom: 15px;
`;

const BotBody = styled.div`
  background: aliceblue;
  padding: 9px;
  width: 400px;
  border-radius: 6px;
`;

const ChatBotUI = ({
  userMessageRef,
  selectedTopic,
  botMessages,
  userMessage,
  userChat,
  onChangeUserMessage,
  onSendMessage,
  onKeyPress,
  isErrorMessage,
  isMuted,
}) => {
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

  const isFormValid = userMessage.trim() !== "";

  return (
    <>
      <Row className="px-3 py-2">
        <Col md={12} className="p-0">
          <div>
            <b>Topic:</b> {selectedTopic.selectValue}
          </div>
          <div>
            <b>Question:</b> {selectedTopic.textareaValue}
          </div>
          <BotContent ref={userMessageRef}>
            {userChat &&
              userChat.map((message, index) => (
                <div
                  key={index}
                  className="d-flex align-items-end flex-column mb-4"
                >
                  {message.isUserMessage && (
                    <small className="mb-2 text-muted h6">You</small>
                  )}

                  {isErrorMessage(message) ? (
                    <ErrorMessageComponent message={message} />
                  ) : (
                    <BotBody>
                      <p className="m-0 px-1">{message.body}</p>
                      {/* Additional information, if needed */}
                      {/* <small>{moment(message.timestamp).format('YYYY-MM-DD HH:mm:A')}</small> */}
                    </BotBody>
                  )}
                </div>
              ))}

            {botMessages &&
              botMessages.map((message, index) => (
                <div
                  key={index}
                  className="d-flex align-items-end flex-column mb-4"
                >
                  <small className="mb-2 text-muted h6">Bot</small>

                  {isErrorMessage(message) ? (
                    <ErrorMessageComponent message={message} />
                  ) : (
                    <BotBody>
                      <p className="m-0 px-1">{message.body}</p>
                      {/* Additional information, if needed */}
                      {/* <small>{moment(message.timestamp).format('YYYY-MM-DD HH:mm:A')}</small> */}
                    </BotBody>
                  )}
                </div>
              ))}
          </BotContent>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
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
        </Col>
      </Row>
    </>
  );
};

export default ChatBotUI;
