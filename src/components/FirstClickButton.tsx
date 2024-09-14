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

    try {
      const response = await fetch(`${apiUrl}/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-agent": "Mozilla",
        },
        body: JSON.stringify({
          sessionId: dataToSend.sessionId,
          nickname: dataToSend.nickName,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }
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
