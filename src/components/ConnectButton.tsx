import axios, { AxiosError } from "axios";
import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ConnectButtonProps {
  dataToSend: {
    sessionId: string;
    nickName: string;
  };
  socket: WebSocket | null;
  setIsConnected: any;
  apiUrl: string;
}
const ConnectButton = (props: ConnectButtonProps) => {
  const { dataToSend, socket, setIsConnected, apiUrl } = props;

  const [errorMsg, setErrorMsg] = useState("");

  const handleConnect = (nickName: string) => {
    if (socket) {
      socket.send(
        JSON.stringify({
          sessionId: dataToSend.sessionId,
          nickname: nickName,
        })
      );

      localStorage.setItem("nickname", nickName);

      setIsConnected(true);
    }
  };

  const handleNickNameValidation = async () => {
    const nickNameFromLocalStorage = localStorage.getItem("nickname");

    console.log("nickNameFromLocalStorage", nickNameFromLocalStorage)

    if (nickNameFromLocalStorage) {
      setErrorMsg("");

      handleConnect(nickNameFromLocalStorage);

      return;
    }

    const nickName = dataToSend.nickName;

    try {
      await axios.post(
        `${apiUrl}/validate-nickname`,
        {
          sessionId: dataToSend.sessionId,
          nickName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "user-agent": "Mozilla",
          },
        }
      );

      handleConnect(nickName);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      const errMsg = err.response?.data.message ?? "";

      setErrorMsg(errMsg);
    }
  };

  return (
    <>
      <button onClick={handleNickNameValidation}>Conectar</button>

      {!!errorMsg && <p>{errorMsg}</p>}
    </>
  );
};

export default ConnectButton;
