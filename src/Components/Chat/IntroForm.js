import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { fetchOptionsData } from "../../api/api";
import ButtonComponent from "../Common/Button";

const MarginDiv = styled.div`
  margin-bottom: 155px;
`;

const IntroForm = ({ renderChatBot, setOptionsData, optionsData }) => {
  // const topics = [
  //   { value: "General Question", key: "gen" },
  //   { value: "Order Status", key: "orders" },
  //   { value: "Shipment Inquiry", key: "ship" },
  //   { value: "PA/PLA Questions", key: "papla" },
  //   { value: "Drug Coverage/Pricing", key: "drugcov" },
  //   { value: "Billing and CoPay", key: "billcopay" },
  //   { value: "FAQ", key: "faq" },
  // ];

  const [introFormState, setIntroFormState] = useState({
    selectValue: "",
    textareaValue: "",
  });

  const initialized = useRef(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const getOptionsData = await fetchOptionsData();
        setOptionsData(getOptionsData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    if (!initialized.current) {
      initialized.current = true;
      fetchOptions();
    }
  }, [setOptionsData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIntroFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    renderChatBot(introFormState);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (isFormValid) handleSubmit(e);
    }
  };
  const isFormValid =
    introFormState.selectValue.trim() !== "" &&
    introFormState.textareaValue.trim() !== "";

  return (
    <>
      <Row className="py-3 px-3">
        <Col md={12}>
          <h3 className="fw-normal">Hello, !</h3>
          <p>We're glad to chat with you today. How can we help you?</p>
        </Col>
        <Col md={12}>
          <Form onSubmit={handleSubmit}>
            <MarginDiv>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Choose a topic</Form.Label>
                <Form.Select
                  name="selectValue"
                  size="lg"
                  value={introFormState.selectValue}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {Object.keys(optionsData).map((key) => (
                    <option key={key} value={optionsData[key]}>
                      {optionsData[key]}
                    </option>
                  ))}
                  {/* {optionsData.map((option) => (
                    <option key={option.key}>{option.value}</option>
                  ))} */}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-5">
                <Form.Label className="fw-bold">
                  Enter your job title and question
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="textareaValue"
                  placeholder="Enter your Job Title followed by question"
                  rows={3}
                  value={introFormState.textareaValue}
                  onChange={handleInputChange}
                  onKeyUp={handleKeyPress}
                />
              </Form.Group>
            </MarginDiv>
            <ButtonComponent
              className="w-100 py-2 my-2"
              type="submit"
              disabled={!isFormValid}
            >
              Start Chat
            </ButtonComponent>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default IntroForm;
