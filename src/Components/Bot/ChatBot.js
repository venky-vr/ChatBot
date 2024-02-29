import React, { useState, useEffect, useRef } from "react";
import { initializeAndSetBot } from "../../api/api";
import ChatBotUI from "./ChatBotUI";
import audio from "../Common/Audio/time-is-now-585.mp3";

const ChatBot = ({
  selectedOption,
  isMuted,
  isChatboxOpen,
  optionsData,
  handleInputChange,
  introFormState,
}) => {
  const [bot, setBot] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [botMessages, setBotMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [updateIntroFormState, setUpdateIntroFormState] = useState({
    selectValue: "",
  });
  const [isChatAgent, setIsChatAgent] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const userMessageRef = useRef();
  const initialized = useRef(false);

  // Initial loader
  useEffect(() => {
    const connectChat = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsConnecting(false);
    };
    connectChat();
  }, []);

  useEffect(() => {
    const initializeBotApi = async () => {
      try {
        await initializeAndSetBot(
          introFormState,
          setBot,
          setBotMessages,
          setHistoryLoaded,
          setShowTopicForm,
          selectedOption,
          setIsChatAgent
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
  }, [bot, historyLoaded, selectedOption, introFormState]);

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

  const parseProfessionAndQuestion = (text, message) => {
    // Replace newline characters with an empty string
    const cleanedText = text.replace(/\n/g, "");
    const combinedText = `${cleanedText} ${message}`;
    const regex = /^(\w+)\s(.+)$/gm;
    const match = regex.exec(combinedText);
    if (match) {
      const [, title, question] = match;
      return { title, question };
    }
    return { title: "", question: "" };
  };

  const { title, question } = parseProfessionAndQuestion(
    introFormState.textareaValue,
    userMessage
  );

  const sendInitialMessage = (botInstance) => {
    if (botInstance) {
      const initialMessageToBot = {
        message: { body: "SpecBotAppStart", attachments: [] },
        resourceid: "/bot.message",
        clientMessageId: Date.now(),
        customData: {
          category: introFormState.selectValue,
          title: title,
          question: question,
        },
      };

      botInstance.sendMessage(initialMessageToBot, () => {
        setLoading(false);
      });
    } else {
      console.error("Bot instance is not available yet. Message not sent.");
    }
  };

  // "https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a"

  const sendMessageToBot = async (templateMessage) => {
    if (isChatboxOpen && !isMuted && botMessages.length > 0) {
      const lastMessage = botMessages[botMessages.length - 1];
      if (!lastMessage.isUserMessage) {
        const audioElement = new Audio(audio);
        audioElement.play();
      }
    }
    if (bot) {
      const reOfferChat = {
        message: userMessage,
        catergory: updateIntroFormState,
        continuedChat: true,
      };
      const timestamp = Date.now();
      const userMessageObject = {
        body: userMessage,
        isUserMessage: true,
        timestamp: timestamp,
      };

      const validMessage = templateMessage
        ? templateMessage
        : userMessageObject;

      setBotMessages((prevMessages) => [...prevMessages, validMessage]);
      setUserMessage("");

      const messageToBot = {
        message: {
          body: showTopicForm ? reOfferChat : validMessage.body,
          attachments: [],
        },
        resourceid: "/bot.message",
        clientMessageId: timestamp,
        timestamp: timestamp,
        customData: {
          category: introFormState.selectValue,
          title: title,
          question: userMessage,
        },
      };

      bot.sendMessage(messageToBot, (botReply) => {
        const botReplyObject = {
          body: botReply.body,
          isUserMessage: false,
          timestamp: botReply.timestamp,
          question: botReply.question,
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

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     sendMessageToBot();
  //   }
  // };

  // const handleBotDropdown = (e) => {
  //   setUpdateIntroFormState(e.target.value);
  // }

  // const handleStartChat = async () => {
  //   // try {
  //   //   await initializeAndSetBot(
  //   //     updateIntroFormState,
  //   //     setBot,
  //   //     setBotMessages,
  //   //     setHistoryLoaded,
  //   //     setShowTopicForm,
  //   //     selectedOption,
  //   //   );
  //   // } catch (err) {
  //   //   console.log(err)
  //   // }
  //   sendMessageToBot();
  // }

  return (
    <>
      <ChatBotUI
        userMessageRef={userMessageRef}
        botMessages={botMessages}
        userMessage={userMessage}
        loading={loading}
        onChangeUserMessage={(e) => setUserMessage(e.target.value)}
        onSendMessage={sendMessageToBot}
        //  onKeyPress={handleKeyPress}
        isErrorMessage={isErrorMessage}
        isMuted={isMuted}
        showTopicForm={showTopicForm}
        optionsData={optionsData}
        handleBotDropdown={(e) => setUpdateIntroFormState(e.target.value)}
        introFormState={introFormState}
        updateIntroFormState={updateIntroFormState}
        setShowTopicForm={setShowTopicForm}
        setUserMessage={setUserMessage}
        isChatAgent={isChatAgent}
        isConnecting={isConnecting}
      />
    </>
  );
};

export default ChatBot;
