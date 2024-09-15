import axios from "axios";
import { memo, useCallback, useState } from "react";
import styled from "styled-components";

const ResetButtonContainer = styled.div`
  height: 40px;
`;

interface ResetRoundProps {
  apiUrl: string;
  sessionId: string;
}

const ResetRound = (props: ResetRoundProps) => {
  const { apiUrl, sessionId } = props;

  const [error, setError] = useState("");

  const handleClick = useCallback(async () => {
    try {
      await axios.post(
        `${apiUrl}/reset`,
        { sessionId },
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
    <>
      <ResetButtonContainer>
        <button onClick={handleClick}>Recomeçar</button>
      </ResetButtonContainer>

      {error && <p>{error}</p>}
    </>
  );
};

export default memo(ResetRound);
