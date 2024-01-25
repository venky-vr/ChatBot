import axios from "axios";

export const assertion = (options, callback) => {
  var jsonData = {
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    // "identity": options.userIdentity,
    // "aud": "",
    // "isAnonymous": false
    identity: "123",
    //botId: 'specialtywebchat',
    //chatId: '123',
  };
  //console.log(jsonData);

  const requestObj = {
    method: "post",
    headers: {
      // "Accept": "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // url: "http://localhost:3000/api/users/sts",
    url: "https://cai-speciality-provider-services-api-1-dev.apps-3.hs-4-nonprod.openshift.evernorthcloud.com/cai-speciality-provider-services/v1/api/interactions/123/generateJWT",
    //url: "https://cai-speciality-provider-services-api-1-dev.apps-3.hs-4-nonprod.openshift.evernorthcloud.com/cai-speciality-provider-services/v1/api/interactions/123/generateToken",
    data: new URLSearchParams(jsonData).toString(),
    responseType: "json",
  };

  axios(requestObj)
    .then((data) => {
      options.assertion = data?.data?.jwtToken;
      callback(null, options);
    })
    .catch((err) => {
      console.error("Error in JWT get: " + JSON.stringify(err));
    });
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
