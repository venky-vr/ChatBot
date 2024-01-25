import React, { useState, useEffect, useRef } from "react";
import { initializeBot } from "./BotInitializer";
import { assertion, koreAnonymousFn } from "./BotInitializer";
import ChatBotUI from "./ChatBotUI";

const ChatBot = ({ selectedTopic, isMuted, options, selectedOption }) => {
  const [bot, setBot] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [botMessages, setBotMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const userMessageRef = useRef();
  const initialized = useRef(false);

  const initializeAndSetBot = async () => {
    try {
      const { profession, trimQuestion } = parseProfessionAndQuestion(
        selectedTopic.textareaValue
      );
      const botInstance = await initializeBot({
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
            Profession: profession,
            "Trim Question": trimQuestion,
          },
          optionsData: selectedOption,
        },
        // JWTUrl: "http://localhost:3001/api/users/sts",
        userIdentity: "sohail.arif@express-scripts.com",
        clientId: "cs-359536f4-eddb-5f23-b3e0-cdbd49c6536f",
        clientSecret: "+QD7kvzQTJhBhN51bUjBE/p+aqRYR8eqkPTjoYCYrN8=",
        loadHistory: false,
      });

      setBot(botInstance);

      const handleIncomingMessage = (msg) => {
        const dataObj = JSON.parse(msg.data);
        if (dataObj.from === "bot" && dataObj.type === "bot_response") {
          setBotMessages((prevMessages) => [
            ...prevMessages,
            dataObj.message[0].cInfo.body,
          ]);
        }
      };

      botInstance.on("history", function (historyRes) {
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

      botInstance.on("message", handleIncomingMessage);
    } catch (error) {
      console.error("Bot initialization failed:", error);
    }
  };

  useEffect(() => {
    if (!initialized.current && !bot) {
      initialized.current = true;
      initializeAndSetBot();
    }

    return () => {
      if (bot) {
        bot.destroy();
      }
    };
  }, [
    bot,
    initialized,
    historyLoaded,
    selectedTopic.selectValue,
    selectedTopic.textareaValue,
    options,
  ]);

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

  const parseProfessionAndQuestion = (text) => {
    const regex = /^(\w+)\s(.+)$/gm;
    const match = regex.exec(text);
    if (match) {
      const [, profession, trimQuestion] = match;
      //console.log("js:profession", profession);
      //console.log("js: trimQuestion", trimQuestion);
      return { profession, trimQuestion };
    }

    return { profession: "", trimQuestion: "" };
  };

  const sendMessageToBot = async () => {
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
