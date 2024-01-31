import React, { useState, useEffect, useRef } from "react";
import { initializeAndSetBot } from "../../api/api";
import ChatBotUI from "./ChatBotUI";
// import audio from "../Common/Audio/time-is-now-585.mp3";

const ChatBot = ({ selectedTopic, isMuted, selectedOption, isChatboxOpen }) => {
  const [bot, setBot] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [botMessages, setBotMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const userMessageRef = useRef();
  const initialized = useRef(false);

  useEffect(() => {
    const initializeBotApi = async () => {
      try {
        await initializeAndSetBot(
          selectedTopic,
          setBot,
          setBotMessages,
          setHistoryLoaded,
          selectedOption
        );
      } catch (error) {
        console.error("Bot initialization failed:", error);
      }
    };
    if (!initialized.current && !bot) {
      initialized.current = true;
      initializeBotApi();
    }

    return () => {
      if (bot) {
        bot.destroy();
      }
    };
  }, [bot, historyLoaded, selectedOption, selectedTopic]);

  useEffect(() => {
    const handleOpen = () => {
      if (bot) {
        sendInitialMessage(bot);
        bot.removeListener("open", handleOpen);
      }
    };

    if (bot) {
      bot.on("open", handleOpen);
    }

    return () => {
      if (bot) {
        bot.removeListener("open", handleOpen);
        bot.destroy();
      }
    };
  }, [bot]);

  useEffect(() => {
    scrollToBottom();
  }, [userMessage, botMessages]);

  const scrollToBottom = () => {
    if (userMessageRef.current) {
      userMessageRef.current.scrollTop = userMessageRef.current.scrollHeight;
    }
  };

  const sendInitialMessage = (botInstance) => {
    if (botInstance) {
      const initialMessageToBot = {
        message: { body: "SpecBotAppStart", attachments: [] },
        resourceid: "/bot.message",
        clientMessageId: Date.now(),
      };

      botInstance.sendMessage(initialMessageToBot, () => {
        setLoading(false);
      });
    } else {
      console.error("Bot instance is not available yet. Message not sent.");
    }
  };

  // "https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a"

  const sendMessageToBot = async () => {
    if (isChatboxOpen && !isMuted && botMessages.length > 0) {
      const lastMessage = botMessages[botMessages.length - 1];
      if (!lastMessage.isUserMessage) {
        const audioElement = new Audio(
          "https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a"
        );
        audioElement.play();
      }
    }
    if (bot) {
      const timestamp = Date.now();
      const userMessageObject = {
        body: userMessage,
        isUserMessage: true,
        timestamp: timestamp,
      };
      setBotMessages((prevMessages) => [...prevMessages, userMessageObject]);
      setUserMessage("");

      const messageToBot = {
        message: { body: userMessage, attachments: [] },
        resourceid: "/bot.message",
        clientMessageId: timestamp,
        timestamp: timestamp,
      };

      bot.sendMessage(messageToBot, (botReply) => {
        const botReplyObject = {
          body: botReply.body,
          isUserMessage: false,
          timestamp: botReply.timestamp,
        };
        setBotMessages((prevMessages) => [...prevMessages, botReplyObject]);
      });
    }
  };

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
        loading={loading}
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
