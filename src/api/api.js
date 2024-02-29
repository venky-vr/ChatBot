import axios from "axios";
import config from "./aws_var/configSelector";

const authApiCall = window?.envVars?.authApiCall;
const authGenerateJwtUrl = window?.envVars?.authGenerateJwtUrl;
const authGenerateTokenUrl = window?.envVars?.authGenerateTokenUrl;
const generateJwtUrl = window?.envVars?.generateJwtUrl;
const { REACT_APP_AUTHINATOR_API_CALL } = config;

console.log(REACT_APP_AUTHINATOR_API_CALL, "REACT_APP_AUTHINATOR_API_CALL");

const commonOptions = {
  clientId: "cs-572cf3db-f952-5b8e-9ad1-aaefda7869c8",
  clientSecret: "wIvpQqDlIfEaukv55InP25/V5T8u+4A3tLuxoWL7ZEQ=",
};

//console.log("-----------------retirve CUP services using configmap authurl" + AUTH_URL);

//console.log("-----------------retirve CUP services using configmap authurl" + authUrl);

const JWT_TOKEN_URL =
  "https://cai-speciality-provider-services-api-1-dev.apps-3.hs-4-nonprod.openshift.evernorthcloud.com/cai-speciality-provider-services/v1/api/interactions/123/generateJWT";

// const parseProfessionAndQuestion = (text) => {
//   const regex = /^(\w+)\s(.+)$/gm;
//   const match = regex.exec(text);
//   if (match) {
//     const [, title, question] = match;
//     return { title, question };
//   }
//   return { title: "", question: "" };
// };

const accessTokenUrl =
  "https://api-dev.express-scripts.io/v1/auth/oauth2/token";

export const accessToken = async () => {
  try {
    const accessTokenReqObj = {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      url: accessTokenUrl,
      data: {
        grant_type: "client_credentials",
        client_id: "1eacd19b-d144-64e3-9be2-eeee0af1a303",
        client_secret: "VrXAwcms43r1WNarMZ8G9WPz/Aw=",
      },
    };
    const authTokenRes = await axios(accessTokenReqObj);
    return authTokenRes.data.access_token;
  } catch (err) {
    console.error("Error fetching token:", err);
    throw err;
  }
};

// export const fetchOptionsData = async () => {
//   try {
//     const response = await axios.get(
//       "https://api-dev.express-scripts.io/cai-speciality-provider-services/v1/api/interactions/getCategories"
//     );
//     return response.data;
//   } catch (err) {
//     console.error("Error fetching options:", err);
//     throw err;
//   }
// };

export const generateJwtToken = async () => {
  try {
    const jsonData = {
      clientId: commonOptions.clientId,
      clientSecret: commonOptions.clientSecret,
      identity: "123",
    };

    // request object for direct generate JWT URL
    console.log("-------------in generateJwtToken" + authApiCall);
    if (authApiCall === "true") {
      console.log(
        "-------------in generateJwtToken true condition" + authApiCall
      );
      const authTokenReqObj = {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: authGenerateTokenUrl,
        data: {
          grant_type: "client_credentials",
          client_id: "1eacd19b-d144-64e3-9be2-eeee0af1a303",
          client_secret: "VrXAwcms43r1WNarMZ8G9WPz/Aw=",
        },
      };
      const authTokenRes = await axios(authTokenReqObj);
      const authToken = authTokenRes.data.access_token;

      const generateJwtReqObj = {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${authToken}`,
        },
        url: authGenerateJwtUrl,
        data: {
          identity: "123",
          clientId: "cs-572cf3db-f952-5b8e-9ad1-aaefda7869c8",
          clientSecret: "wIvpQqDlIfEaukv55InP25/V5T8u+4A3tLuxoWL7ZEQ=",
        },
      };

      const response = await axios(generateJwtReqObj);
      return response.data.jwtToken;
    } else {
      //if(!window.envVars.authApiCall) {
      console.log("inside else condition " + !authApiCall);
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
    }
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
  introFormState,
  setBot,
  setBotMessages,
  setHistoryLoaded,
  setShowTopicForm,
  selectedOption,
  setIsChatAgent
) => {
  const jwtToken = await generateJwtToken({});
  try {
    // const { title, question } = parseProfessionAndQuestion(
    //   introFormState.textareaValue
    // );
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
        chatBot: "CAIChatMain",
        taskBotId: "st-0f59bcde-1204-545a-a299-ba3611718e54",
        // customData: {
        //   category: introFormState.selectValue,
        //   title: title,
        //   question: question
        // },
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
          dataObj.message[0].cInfo,
        ]);
        const welcomeChatAgent = dataObj.message.find(
          (msg) => msg.cInfo.body.trim() === "Welcome User"
        );
        if (welcomeChatAgent) {
          setIsChatAgent(true);
        }
        if (
          dataObj.message.some(
            (msg) =>
              msg.cInfo.body.trim() === "Have a good one!" ||
              msg.cInfo.body.trim() === "OK, bye for now!"
          )
        ) {
          setShowTopicForm(true);
        }
      }
    };

    botInstance.on("history", function (historyRes) {
      if (historyRes.messages && Array.isArray(historyRes.messages)) {
        const historyMessages = historyRes.messages.flatMap((message) =>
          message.message.map((msg) => msg.cInfo)
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
