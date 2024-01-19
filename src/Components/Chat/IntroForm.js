import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import DynamicForm from "./DynamicForm";
import ChatBot from "../Bot/ChatBot";

const StyledChatBox = styled.div`
  width: 500px;
  border: 1px solid #15a4a7;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgb(0, 0, 0, 0.1);
  z-index: 1000;
`;

const IntroForm = () => {
  const topics = [
    { value: "General Question", key: "gen" },
    { value: "Order Status", key: "orders" },
    { value: "Shipment Inquiry", key: "ship" },
    { value: "PA/PLA Questions", key: "papla" },
    { value: "Drug Coverage/Pricing", key: "drugcov" },
    { value: "Billing and CoPay", key: "billcopay" },
    { value: "FAQ", key: "faq" },
  ];

  const [formSubmit, setFormSubmit] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState({});

  // useEffect(() => {
  //   axios
  //     .get(
  //       `https://cai-speciality-provider-services-api-1-dev.apps-3.hs-4-nonprod.openshift.evernorthcloud.com/cai-speciality-provider-services/v1/api/interactions/getCategories`
  //     )
  //     .then((response) => {
  //       setOptions(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching options:", error);
  //     });
  // }, []);

  const renderChatBot = (obj) => {
    setSelectedTopic(obj);
    setFormSubmit(true);
  };

  return (
    <StyledChatBox className="position-fixed bottom-0 end-0 m-3">
      {!formSubmit ? (
        <DynamicForm optionsData={topics} renderChatBot={renderChatBot} />
      ) : (
        <ChatBot selectedTopic={selectedTopic} />
      )}
    </StyledChatBox>
  );
};

export default IntroForm;
