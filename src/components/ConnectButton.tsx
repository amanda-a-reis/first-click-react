import axios, { AxiosError } from "axios";
import { memo, useCallback, useState } from "react";
import NickName from "./Nickname";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
`;

interface ConnectButtonProps {
  apiUrl: string;
  sessionId: string;
  socket: WebSocket | null;
  handleIsConnected: () => void;
}

const ConnectButton = (props: ConnectButtonProps) => {
  const { sessionId, socket, handleIsConnected, apiUrl } = props;

  const [errorMsg, setErrorMsg] = useState("");

  const [nickName, setNickName] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleNickName = useCallback(
    (nickName: string) => {
      if (errorMsg) {
        setErrorMsg("");
      }

      setNickName(nickName);
    },
    [errorMsg]
  );

  const handleAvatar = useCallback((avatar: string) => {
    setAvatar(avatar);
  }, []);

  const handleConnect = useCallback(
    (nickName: string) => {
      const avatarPlaceholder =
        "https://s3.amazonaws.com/comicgeeks/characters/avatars/14250.jpg?t=1659767317";

      let playerAvatar = avatar;

      if (!avatar) {
        playerAvatar = avatarPlaceholder;
        handleAvatar(avatarPlaceholder);
      }

      if (socket) {
        socket.send(
          JSON.stringify({
            sessionId,
            nickname: nickName,
            avatar: playerAvatar,
          })
        );

        localStorage.setItem("nickname", nickName);
        localStorage.setItem("avatar", playerAvatar);

        handleIsConnected();

        setErrorMsg("");
      }
    },
    [avatar, socket, handleAvatar, sessionId, handleIsConnected]
  );

  const handleNickNameAndConnect = useCallback(async () => {
    const nickNameFromLocalStorage = localStorage.getItem("nickname");

    if (nickNameFromLocalStorage) {
      handleConnect(nickNameFromLocalStorage);

      return;
    }

    try {
      await axios.post(
        `${apiUrl}/validate-nickname`,
        {
          sessionId,
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
  }, [apiUrl, sessionId, nickName, handleConnect]);

  return (
    <Container>
      <NickName
        nickName={nickName}
        handleNickName={handleNickName}
        handleAvatar={handleAvatar}
        avatar={avatar}
      />

      <ButtonContainer>
        <button onClick={handleNickNameAndConnect}>Conectar</button>
      </ButtonContainer>

      {!!errorMsg && <p>{errorMsg}</p>}
    </Container>
  );
};

export default memo(ConnectButton);
