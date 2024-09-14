import axios from "axios";
import { memo, useCallback, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoundRedButton = styled.button`
  background-color: #db2e28;
  color: white;
  border: none;
  border-radius: 8px;
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: darkred;
  }

  &.disabled {
    background-color: #e8e8f5;
    color: black;
    cursor: unset;
  }
`;

interface FirstClickButtonProps {
  apiUrl: string;
  sessionId: string;
  firstPlayer: string;
}

const FirstClickButton = (props: FirstClickButtonProps) => {
  const { apiUrl, sessionId, firstPlayer } = props;

  const [error, setError] = useState("");

  const handleClick = useCallback(async () => {
    const nickNameFromLocalStorage = localStorage.getItem("nickname");

    try {
      await axios.post(
        `${apiUrl}/click`,
        { sessionId, nickname: nickNameFromLocalStorage },
        {
          headers: {
            "Content-Type": "application/json",
            "user-agent": "Mozilla",
          },
        }
      );
    } catch (error) {
      if (error) setError("Erro na requisição");
    }
  }, [apiUrl, sessionId]);

  return (
    <Container>
      <RoundRedButton
        onClick={handleClick}
        className={firstPlayer ? "disabled" : ""}
        disabled={!!firstPlayer}
      >
        EU SEI A RESPOSTA!
      </RoundRedButton>

      {error && <p>{error}</p>}
    </Container>
  );
};

export default memo(FirstClickButton);
