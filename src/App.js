import React, { lazy, Suspense, useEffect, useState } from "react";
import fetchVariables from "./fetchVariables";

import "./App.css";
// import ChatContainer from "./Components/ChatContainer";
// Create a reference to the lazy-loaded component
const ChatContainer = lazy(() => import("./Components/ChatContainer"));

const App = () => {
  const [awsVar, setAwsVar] = useState(null);

  useEffect(() => {
    const fetchAwsVar = async () => {
      try {
        const response = await fetchVariables();
        setAwsVar(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAwsVar();
  }, []);
  console.log(awsVar, "GetValriables");

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatContainer />
      </Suspense>
    </>
  );
};

export default App;
