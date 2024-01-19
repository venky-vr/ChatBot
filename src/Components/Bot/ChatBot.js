import React, { useState, useEffect, useRef } from "react";
// import moment from 'moment';
import { Form, Row, Col } from "react-bootstrap";
import { assertion, koreAnonymousFn, initializeBot } from "./BotInitializer";
import ErrorMessageComponent from "./ErrorMessageComponent";
import ButtonComponent from "../Common/Button";

const ChatBot = ({ selectedTopic }) => {
  const [bot, setBot] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [botMessages, setBotMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const userMessageRef = useRef();

  useEffect(() => {
    const botOptions = {
      koreAPIUrl: "https://cai-dev.express-scripts.com/api/",
      logLevel: "debug",
      koreSpeechAPIUrl: "",
      ttsSocketUrl: "",
      assertionFn: assertion,
      koreAnonymousFn: koreAnonymousFn,
      botInfo: {
        chatBot: "CAISpecialtyProviderBusinessBot",
        taskBotId: "st-855d08e1-df09-5d12-a6e9-a45fa0510dba",
        customData: {
          category: selectedTopic.selectValue,
          Question: selectedTopic.textareaValue,
        },
      },
      // JWTUrl: "http://localhost:3001/api/users/sts",
      userIdentity: "sohail.arif@express-scripts.com",
      clientId: "cs-359536f4-eddb-5f23-b3e0-cdbd49c6536f",
      clientSecret: "+QD7kvzQTJhBhN51bUjBE/p+aqRYR8eqkPTjoYCYrN8=",
      loadHistory: false,
    };

    // Initialize the bot
    const botInstance = initializeBot(botOptions);
    setBot(botInstance);

    const sendMessgeToBot = setTimeout(() => {
      const message1ToBot = {
        message: { body: "SpecBotAppStart", attachments: [] },
        resourceid: "/bot.message",
        clientMessageId: Date.now(),
      };

      botInstance.sendMessage(message1ToBot, () => {
        console.log("Message sent to the bot");
      });
    }, 1000);

    // Listen to messages from the server
    const handleIncomingMessage = (msg) => {
      const dataObj = JSON.parse(msg.data);
      if (dataObj.from === "bot" && dataObj.type === "bot_response") {
        // Handle bot response message
        setBotMessages((prevMessages) => [
          ...prevMessages,
          dataObj.message[0].cInfo.body,
        ]);
      }
    };

    if (!historyLoaded) {
      botInstance.on("history", function (historyRes) {
        // Assuming historyRes.messages is an array of messages
        if (historyRes.messages && Array.isArray(historyRes.messages)) {
          const historyMessages = historyRes.messages.flatMap((message) =>
            message.message.map((msg) => msg.cInfo.body)
          );
          setBotMessages((prevMessages) => [
            ...prevMessages,
            ...historyMessages,
          ]);
        }
        setHistoryLoaded(true);
      });
    }

    // Attach the event listener for incoming messages
    botInstance.on("message", handleIncomingMessage);

    // Cleanup function when the component is unmounted
    return () => {
      if (botInstance) {
        botInstance.destroy();
      }
      clearTimeout(sendMessgeToBot);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [userMessage, botMessages]);

  const scrollToBottom = () => {
    if (userMessageRef.current) {
      userMessageRef.current.scrollTop = userMessageRef.current.scrollHeight;
    }
  };

  const sendMessageToBot = () => {
    if (bot) {
      const messageToBot = {
        message: { body: userMessage, attachments: [] },
        resourceid: "/bot.message",
        clientMessageId: Date.now(),
      };
      setBotMessages((prevMessages) => [...prevMessages, userMessage]);

      setUserMessage(""); // Clear the input field
      // Send a message to the bot
      bot.sendMessage(messageToBot, () => {
        console.log("Message sent to the bot");
      });
    }
  };

  // Check if the message represents an error
  const isErrorMessage = (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      return parsedMessage && parsedMessage.type === "error";
    } catch (error) {
      return false;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessageToBot();
    }
  };

  return (
    <>
      <Row className="px-3 py-2">
        <Col md={12}>
          <div
            style={{
              height: "500px",
              display: "block",
              overflow: "auto",
              marginBottom: "15px",
            }}
            ref={userMessageRef}
          >
            <div>
              <b>Topic:</b> {selectedTopic.selectValue}
            </div>
            <div>
              <b>Question:</b> {selectedTopic.textareaValue}
            </div>
            {botMessages &&
              botMessages?.map((message, index) => (
                <div key={index}>
                  {isErrorMessage(message) ? (
                    <ErrorMessageComponent message={message} />
                  ) : (
                    <>
                      <div
                        style={{
                          marginBottom: "8px",
                          background: "aliceblue",
                          padding: "9px",
                        }}
                      >
                        <p>{message}</p>
                        {/* <small>{moment(message.timestamp).format('YYYY-MM-DD HH:mm:A')}</small> */}
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Control
              as="textarea"
              rows={3}
              name="message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              autoFocus="autofocus"
              autoComplete="off"
              placeholder="Enter your message for the agent here..."
              onKeyUp={handleKeyPress}
            />
          </Form.Group>
          <ButtonComponent
            className="py-2 w-100 my-2"
            onClick={sendMessageToBot}
          >
            Send Message
          </ButtonComponent>
        </Col>
      </Row>
    </>
  );
};

export default ChatBot;
