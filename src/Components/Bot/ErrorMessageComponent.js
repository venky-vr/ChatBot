import React from "react";

const ErrorMessageComponent = ({ message }) => {
  const parsedMessage = JSON.parse(message);

  return (
    <div style={{ color: parsedMessage.payload.color }}>
      {parsedMessage.payload.text}
    </div>
  );
};

export default ErrorMessageComponent;
