import axios, { AxiosError } from "axios";
import { memo, useCallback } from "react";
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
    display: none;
  }
`;

interface FirstClickButtonProps {
  apiUrl: string;
  sessionId: string;
  firstPlayer: string;
}

const FirstClickButton = (props: FirstClickButtonProps) => {
  const { apiUrl, sessionId, firstPlayer } = props;

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
      const err = error as AxiosError<{ message: string }>;

      if (err.response?.data.message === "disconnected") {
        alert("Você precisa reconectar");

        window.location.reload();
      }
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
    </Container>
  );
};

export default memo(FirstClickButton);
