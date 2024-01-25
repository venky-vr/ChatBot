// api.js
import axios from "axios";

const commonOptions = {
  clientId: "cs-359536f4-eddb-5f23-b3e0-cdbd49c6536f",
  clientSecret: "+QD7kvzQTJhBhN51bUjBE/p+aqRYR8eqkPTjoYCYrN8=",
};

const JWT_TOKEN_URL =
  "https://cai-speciality-provider-services-api-1-dev.apps-3.hs-4-nonprod.openshift.evernorthcloud.com/cai-speciality-provider-services/v1/api/interactions/123/generateToken";

export const generateJwtToken = async () => {
  try {
    const jsonData = {
      clientId: commonOptions.clientId,
      clientSecret: commonOptions.clientSecret,
      identity: "123",
    };

    const requestObj = {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      url: JWT_TOKEN_URL,
      data: new URLSearchParams(jsonData).toString(),
      responseType: "json",
    };

    const response = await axios(requestObj);
    return response.data.jwtToken;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

export const koreAnonymousFn = () => {
  // Implement your logic for anonymous function
  // ...
};

export const initializeBot = (botOptions) => {
  /*global requireKr*/
  const bot = requireKr("/KoreBot.js").instance();
  bot.init(botOptions);
  return bot;
};

export const initializeBotAPi = async (
  selectedTopic,
  setBot,
  setBotMessages,
  setHistoryLoaded,
  historyLoaded,
  initilizeref
) => {
  try {
    const jwtToken = await generateJwtToken({});
    const botOptions = {
      koreAPIUrl: "https://cai-dev.express-scripts.com/api/",
      logLevel: "debug",
      koreSpeechAPIUrl: "",
      ttsSocketUrl: "",
      assertionFn: (options, callback) => {
        options.assertion = jwtToken;
        callback(null, options);
      },
      koreAnonymousFn: koreAnonymousFn,
      botInfo: {
        chatBot: "CAISpecialtyProviderBusinessBot",
        taskBotId: "st-855d08e1-df09-5d12-a6e9-a45fa0510dba",
        customData: {
          category: selectedTopic.selectValue,
          Question: selectedTopic.textareaValue,
        },
      },
      userIdentity: "sohail.arif@express-scripts.com",
      clientId: commonOptions.clientId,
      clientSecret: commonOptions.clientSecret,
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
    initilizeref.current = true;
    // onApiCallComplete();
  } catch (err) {
    console.log(err);
  }
};
