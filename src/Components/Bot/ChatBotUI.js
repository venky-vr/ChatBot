import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import styled from "styled-components";
import ButtonComponent from "../Common/Button";
import ConfirmationDialog from "../Common/ConfirmationDialog";
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

const ChatAgentDIv = styled.div`
  p {
    background-color: #3498db;
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: bold;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  }
`;

const StyledSpinner = styled(Spinner)`
  color: #15a4a7;
`;

const ChatBotUI = ({
  userMessageRef,
  botMessages,
  userMessage,
  onChangeUserMessage,
  onSendMessage,
  isErrorMessage,
  onKeyPress,
  handleInputChange,
  optionsData,
  showTopicForm,
  introFormState,
  handleStartChat,
  updateIntroFormState,
  handleBotDropdown,
  setShowTopicForm,
  setUserMessage,
  isChatAgent,
  isConnecting,
}) => {
  // const [modalVisible, setModalVisible] = useState(false);
  // const [formVisible, setFormVisible] = useState(false);

  // const [lastMessageIndex, setLastMessageIndex] = useState(null);

  const isFormValid = showTopicForm
    ? userMessage.trim() !== "" && updateIntroFormState.selectValue !== ""
    : userMessage.trim() !== "";
  const initialBg = true;

  const BotBodyBg = {
    backgroundColor: initialBg ? "#c7e9ea" : "#F8F8F8",
  };

  // useEffect(() => {
  //   if (botMessages && botMessages.length > 0) {
  //     setLastMessageIndex(botMessages.length - 1);
  //   }
  // }, [botMessages]);

  // useEffect(() => {
  //   if (showTopicForm) {
  //     setModalVisible(true);
  //   }
  // }, [showTopicForm]);

  // const handleYesButtonClick = () => {
  //   setShowTopicForm(true);
  //   setModalVisible(false);
  // };

  // const handleNoButtonClick = () => {
  //   setModalVisible(false);
  //   setShowTopicForm(false);
  // };

  const handleHidedropDown = () => {
    onSendMessage();
    setShowTopicForm(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showTopicForm) {
        handleHidedropDown();
      } else {
        onSendMessage();
      }
    }
  };

  const hndleYesorNo = (buttonTitle) => {
    setUserMessage(buttonTitle);
    // Set the buttonTitle as the userMessage
    // onSendMessage({ target: { value: buttonTitle } });
    const botReplyTimestamp = Date.now();
    const templateMessage = {
      body: buttonTitle,
      isUserMessage: true,
      timestamp: botReplyTimestamp,
    };

    onSendMessage(templateMessage);
  };

  return (
    <>
      <Row className="px-3 py-2">
        <Col md={12} className="p-0">
          {/* {showTopicForm ? (
            <>
              {modalVisible && (
                <ConfirmationDialog
                  dialogTtitle='Are you sure you want to end this chat?'
                  concellabel='No'
                  confirmLabel='Yes'
                  onConfirm={handleYesButtonClick}
                  onCancel={handleNoButtonClick}
                />
              )}
            </>
          ) : null
          } */}
          <BotContent ref={userMessageRef}>
            <div className="d-flex flex-column mb-3 align-items-end">
              <ConverSationTitle className="mb-0 h6">You</ConverSationTitle>
              <BotBody style={BotBodyBg}>
                <p className="m-0">{introFormState.textareaValue}</p>
              </BotBody>
            </div>
            <ChatAgentDIv className="d-flex justify-content-center align-items-center">
              {isConnecting ? (
                <StyledSpinner animation="border" role="status" size="md">
                  <span className="visually-hidden">Loading...</span>
                </StyledSpinner>
              ) : (
                isChatAgent && <p className="m-0">Agent is connected!</p>
              )}
            </ChatAgentDIv>
            {botMessages &&
              botMessages?.map((message, index) => {
                const isUserMessage = message.isUserMessage;

                let isButtonTemplate = false;
                let buttonText = "";

                try {
                  let parseBody;
                  if (message.body) {
                    if (message.body && typeof message.body === "string") {
                      parseBody = JSON.stringify(message.body);
                    }
                    if (
                      parseBody &&
                      parseBody.type === "template" &&
                      parseBody.payload?.template_type === "button"
                    ) {
                      const body = JSON.parse(message.body);
                      isButtonTemplate = true;
                      buttonText = body.payload.text;
                    }
                  }
                } catch (error) {
                  console.error(error);
                }

                return (
                  <div
                    key={index}
                    className={`d-flex flex-column mb-3 ${
                      isUserMessage ? "align-items-end" : "align-items-start"
                    }`}
                  >
                    <ConverSationTitle className="mb-0 h6">
                      {isUserMessage
                        ? `You`
                        : isChatAgent
                        ? "ChatAgent"
                        : "Specialty Provider Chat Bot"}
                    </ConverSationTitle>
                    {isErrorMessage(message) ? (
                      <ErrorMessageComponent message={message.body} />
                    ) : (
                      <div>
                        {isButtonTemplate ? (
                          <Card>
                            <Card.Header
                              style={{
                                backgroundColor: "#c7e9ea",
                                fontSize: "1.3rem",
                              }}
                            >
                              {buttonText}
                            </Card.Header>
                            <Card.Body className="px-2 py-2">
                              {JSON.parse(message.body).payload.buttons.map(
                                (button, btnIndex) => (
                                  <ButtonComponent
                                    key={btnIndex}
                                    onClick={() => hndleYesorNo(button.title)}
                                    className="px-4 m-2"
                                  >
                                    {button.title}
                                  </ButtonComponent>
                                )
                              )}
                            </Card.Body>
                          </Card>
                        ) : (
                          <BotBody
                            style={{
                              backgroundColor: isUserMessage
                                ? "#c7e9ea"
                                : "#F8F8F8",
                            }}
                          >
                            <p className="m-0">{message.body}</p>
                          </BotBody>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

            {showTopicForm && (
              <>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Choose a topic</Form.Label>
                  <Form.Select
                    name="botDropdown"
                    size="lg"
                    value={updateIntroFormState.selectValue}
                    onChange={(e) => handleBotDropdown(e)}
                    autoFocus
                  >
                    <option value="">Select</option>
                    {Object.keys(optionsData).map((key) => (
                      <option key={key} value={optionsData[key]}>
                        {optionsData[key]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Enter your question
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="message"
                    value={userMessage}
                    onChange={onChangeUserMessage}
                    autoComplete="off"
                    placeholder="Enter your question..."
                    onKeyUp={handleKeyPress}
                  />
                </Form.Group>
              </>
            )}
          </BotContent>
        </Col>
        <Col md={12}>
          <StyledDiv>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={showTopicForm ? "" : userMessage}
                onChange={showTopicForm ? null : onChangeUserMessage}
                autoFocus="autofocus"
                autoComplete="off"
                placeholder={
                  isChatAgent
                    ? "Enter your message for the agent here..."
                    : "Enter your message for the specialty provider chat bot"
                }
                onKeyUp={handleKeyPress}
                disabled={showTopicForm ? isFormValid : ""}
              />
            </Form.Group>
            <ButtonComponent
              className="py-2 w-100 my-2"
              onClick={showTopicForm ? handleHidedropDown : onSendMessage}
              disabled={!isFormValid}
            >
              {showTopicForm ? "Continue Chat" : "Send Message"}
            </ButtonComponent>
          </StyledDiv>
        </Col>
      </Row>
    </>
  );
};

export default ChatBotUI;
