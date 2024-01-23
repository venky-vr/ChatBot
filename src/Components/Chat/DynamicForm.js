import React, { useState } from "react";
import styled from "styled-components";
import { Form, Row, Col } from "react-bootstrap";
import ButtonComponent from "../Common/Button";

const StyledDiv = styled.div`
  margin-bottom: 230px;
`;

const DynamicForm = ({ optionsData, renderChatBot }) => {
  const [formData, setFormData] = useState({
    selectValue: "",
    textareaValue: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData, "formData");
    renderChatBot(formData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const isFormValid =
    formData.selectValue.trim() !== "" && formData.textareaValue.trim() !== "";

  return (
    <>
      <Row className="py-3 px-3">
        <Col md={12}>
          <h3>Hello, !</h3>
          <p>We're glad to chat with you today. How can we help you?</p>
        </Col>
        <Col md={12}>
          <Form onSubmit={handleSubmit}>
            <StyledDiv>
              <Form.Group className="mb-4">
                <Form.Label>Choose a topic</Form.Label>
                <Form.Select
                  name="selectValue"
                  size="lg"
                  value={formData.selectValue}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {/* {Object.keys(optionsData).map((key) => (
                    <option key={key} value={optionsData[key]}>
                      {optionsData[key]}
                    </option>
                  ))} */}
                  {optionsData.map((option) => (
                    <option key={option.key}>{option.value}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-5">
                <Form.Label>Enter your job title and question</Form.Label>
                <Form.Control
                  as="textarea"
                  name="textareaValue"
                  placeholder="Leave a comment here"
                  rows={3}
                  value={formData.textareaValue}
                  onChange={handleInputChange}
                  onKeyUp={handleKeyPress}
                />
              </Form.Group>
            </StyledDiv>
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

export default DynamicForm;
