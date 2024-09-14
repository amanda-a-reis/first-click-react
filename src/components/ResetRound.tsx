import axios from "axios";
import { useState } from "react";

interface ResetRoundProps {
  apiUrl: string;
  sessionId: string;
}

const ResetRound = (props: ResetRoundProps) => {
  const { apiUrl, sessionId } = props;

  const [error, setError] = useState("");

  const handleClick = async () => {
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
  };

  return (
    <>
      <button onClick={handleClick}>Resetar</button>

      {error && <p>{error}</p>}
    </>
  );
};

export default ResetRound;
