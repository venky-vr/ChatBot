import React, { lazy, Suspense } from "react";

import "./App.css";
// import ChatContainer from "./Components/ChatContainer";
// Create a reference to the lazy-loaded component
const ChatContainer = lazy(() => import("./Components/ChatContainer"));

const App = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatContainer />
      </Suspense>
    </>
  );
};

export default App;
