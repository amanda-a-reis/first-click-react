import axios from "axios";
import { useState } from "react";

interface FirstClickButton {
  apiUrl: string;
  dataToSend: {
    sessionId: string;
    nickName: string;
  };
}

const FirstClickButton = (props: FirstClickButton) => {
  const { apiUrl, dataToSend } = props;

  const [error, setError] = useState("");

  const handleClick = async () => {
    console.log("dataToSend", dataToSend);

    const nickNameFromLocalStorage = localStorage.getItem("nickname");

    try {
      await axios.post(
        `${apiUrl}/click`,
        { sessionId: dataToSend.sessionId, nickname: nickNameFromLocalStorage },
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
      <button onClick={handleClick}>Clicar</button>

      {error && <p>{error}</p>}
    </>
  );
};

export default FirstClickButton;
