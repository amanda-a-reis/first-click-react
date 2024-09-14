import React, { useState } from "react";
import styled from "styled-components";

interface CopyTextProps {
  text: string;
}

const CopiableText = styled.span<{ copied: boolean }>`
  width: 100%;
  cursor: pointer;
  background-color: #f0f0f0;
  color: black;
  position: relative;
  padding: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 8px;

  &:hover {
    background-color: #E8E8F5;
  }
`;

const CopyText: React.FC<CopyTextProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar o texto:", err);
    }
  };

  return (
    <CopiableText copied={copied} onClick={handleCopy}>
      {text}
      {copied && " (Copiado!)"}
    </CopiableText>
  );
};

export default CopyText;
