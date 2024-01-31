import axios from "axios";

const commonOptions = {
  clientId: "cs-359536f4-eddb-5f23-b3e0-cdbd49c6536f",
  clientSecret: "+QD7kvzQTJhBhN51bUjBE/p+aqRYR8eqkPTjoYCYrN8=",
};

const JWT_TOKEN_URL =
  "https://cai-speciality-provider-services-api-1-dev.apps-3.hs-4-nonprod.openshift.evernorthcloud.com/cai-speciality-provider-services/v1/api/interactions/123/generateJWT";

const parseProfessionAndQuestion = (text) => {
  const regex = /^(\w+)\s(.+)$/gm;
  const match = regex.exec(text);
  if (match) {
    const [, title, question] = match;
    return { title, question };
  }
  return { title: "", question: "" };
};

export const fetchOptionsData = async () => {
  try {
    const response = await axios.get(
      "https://cai-speciality-provider-services-api-1-dev.apps-3.hs-4-nonprod.openshift.evernorthcloud.com/cai-speciality-provider-services/v1/api/interactions/getCategories"
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching options:", err);
    throw err;
  }
};

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
};

export const initializeBot = (botOptions) => {
  /*global requireKr*/
  const bot = requireKr("/KoreBot.js").instance();
  bot.init(botOptions);
  return bot;
};

export const initializeAndSetBot = async (
  selectedTopic,
  setBot,
  setBotMessages,
  setHistoryLoaded,
  selectedOption
) => {
  const jwtToken = await generateJwtToken({});
  try {
    const { title, question } = parseProfessionAndQuestion(
      selectedTopic.textareaValue
    );

    const botInstance = await initializeBot({
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
          Title: title,
          Question: question,
        },
        optionsData: selectedOption,
      },
      userIdentity: "sohail.arif@express-scripts.com",
      clientId: commonOptions.clientId,
      clientSecret: commonOptions.clientSecret,
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
        setBotMessages((prevMessages) => [...prevMessages, ...historyMessages]);
      }
      setHistoryLoaded(true);
    });

    botInstance.on("message", handleIncomingMessage);
  } catch (error) {
    console.error("Bot initialization failed:", error);
  }
};
