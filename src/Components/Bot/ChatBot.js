import React, { useState, useEffect, useRef } from "react";
// import moment from 'moment';
import { assertion, koreAnonymousFn } from "./BotInitializer";
import { initializeBot } from "./BotInitializer";
import ChatBotUI from "./ChatBotUI";

const ChatBot = ({ selectedTopic, isMuted }) => {
  const [bot, setBot] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [botMessages, setBotMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const userMessageRef = useRef();

  const initilizeref = useRef(false);

  useEffect(() => {
    const initializeBotAPi = async () => {
      try {
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
        const botInstance = await initializeBot(botOptions);
        setBot(botInstance);

        const message1ToBot = {
          message: { body: "SpecBotAppStart", attachments: [] },
          resourceid: "/bot.message",
          clientMessageId: Date.now(),
        };

        botInstance.sendMessage(message1ToBot, () => {
          console.log("Message sent to the bot");
        });

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
      } catch (err) {
        console.log(err);
      }
    };
    if (!initilizeref.current) {
      initializeBotAPi();
      initilizeref.current = true;
    }

    // Cleanup function when the component is unmounted
    return () => {
      if (bot) {
        bot.destroy();
      }
    };
  }, [
    bot,
    historyLoaded,
    selectedTopic.selectValue,
    selectedTopic.textareaValue,
  ]);

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
      <ChatBotUI
        userMessageRef={userMessageRef}
        selectedTopic={selectedTopic}
        botMessages={botMessages}
        userMessage={userMessage}
        onChangeUserMessage={(e) => setUserMessage(e.target.value)}
        onSendMessage={sendMessageToBot}
        onKeyPress={handleKeyPress}
        isErrorMessage={isErrorMessage}
        isMuted={isMuted}
      />
    </>
  );
};

export default ChatBot;
