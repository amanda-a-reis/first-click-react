import axios from "axios";
import { memo, useCallback, useState } from "react";

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
      <button onClick={handleClick}>Recomeçar</button>

      {error && <p>{error}</p>}
    </>
  );
};

export default memo(ResetRound);
