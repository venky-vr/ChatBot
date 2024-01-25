import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import ChatBoxHeader from "./Common/ChatBotHeader";
import IntroForm from "./Chat/IntroForm";
import ChatBot from "./Bot/ChatBot";
import ConfirmationDialog from "./Common/ConfirmationDialog";

const StyledChatBox = styled.div`
  width: 450px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: -5px -5px 30px 0 rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const ChatContainer = () => {
  // const topics = [
  //   { value: "General Question", key: "gen" },
  //   { value: "Order Status", key: "orders" },
  //   { value: "Shipment Inquiry", key: "ship" },
  //   { value: "PA/PLA Questions", key: "papla" },
  //   { value: "Drug Coverage/Pricing", key: "drugcov" },
  //   { value: "Billing and CoPay", key: "billcopay" },
  //   { value: "FAQ", key: "faq" },
  // ];

  const [formSubmit, setFormSubmit] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [isMinimized, setIsMinimized] = useState(false);
  const [isChatboxOpen, setIsChatboxOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const initialized = useRef(false);

  const chatBoxHeight = {
    height: isChatboxOpen ? (isMinimized ? "auto" : "615px") : "0",
  };

  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        const response = await axios.get(
          `https://cai-speciality-provider-services-api-1-dev.apps-3.hs-4-nonprod.openshift.evernorthcloud.com/cai-speciality-provider-services/v1/api/interactions/getCategories`
        );
        setOptions(response.data);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    if (!initialized.current) {
      fetchOptionsData();
      initialized.current = true;
    }
  }, []);

  const renderChatBot = (obj) => {
    setSelectedTopic(obj);
    const selectedOption = options[obj.selectValue];
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
              renderChatBot={renderChatBot}
            />
          ) : (
            <ChatBot
              selectedTopic={selectedTopic}
              isMuted={isMuted}
              selectedOption={selectedOption}
            />
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
        />
      )}
    </StyledChatBox>
  );
};

export default ChatContainer;
