import React, { useState } from "react";
import styled from "styled-components";
import ChatBoxHeader from "./Common/ChatBotHeader";
import ChatBot from "./Bot/ChatBot";
import ConfirmationDialog from "./Common/ConfirmationDialog";
import IntroForm from "./Chat/IntroForm";

const StyledChatBox = styled.div`
  width: 450px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: -5px -5px 30px 0 rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const ChatContainer = () => {
  const [formSubmit, setFormSubmit] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [isMinimized, setIsMinimized] = useState(false);
  const [isChatboxOpen, setIsChatboxOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [introFormState, setIntroFormState] = useState({
    selectValue: "",
    textareaValue: "",
  });

  const chatBoxHeight = {
    height: isChatboxOpen ? (isMinimized ? "auto" : "615px") : "0",
  };

  const renderChatBot = (obj) => {
    setIntroFormState(obj);
    const selectedOption = options[obj?.selectValue];
    setSelectedOption(selectedOption);
    setFormSubmit(true);
  };

  const toggleMinimize = () => {
    setIsMinimized((prevIsMinimized) => !prevIsMinimized);
  };

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  const handleToggleConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    setIsChatboxOpen(false);
    setIsMinimized(false);
  };

  const handleCancelClose = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIntroFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <StyledChatBox
      className="position-fixed bottom-0 end-0 m-3"
      style={chatBoxHeight}
    >
      {isChatboxOpen && (
        <ChatBoxHeader
          toggleMinimize={toggleMinimize}
          toggleMute={toggleMute}
          isMinimized={isMinimized}
          isMuted={isMuted}
          handleToggleConfirmation={handleToggleConfirmation}
        />
      )}
      {isChatboxOpen && (
        <div className={`${isMinimized || showConfirmation ? "d-none" : ""}`}>
          {!formSubmit ? (
            <IntroForm
              optionsData={Object.keys(options)}
              setOptionsData={setOptions}
              renderChatBot={renderChatBot}
              introFormState={introFormState}
              handleInputChange={handleInputChange}
            />
          ) : (
            <ChatBot
              isMuted={isMuted}
              selectedOption={selectedOption}
              isChatboxOpen={isChatboxOpen}
              optionsData={Object.keys(options)}
              handleInputChange={handleInputChange}
              introFormState={introFormState}
            />
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          dialogTtitle="Are you sure you want to end this chat?"
          concellabel="Cancel"
          confirmLabel="End Chat"
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
        />
      )}
    </StyledChatBox>
  );
};

export default ChatContainer;
