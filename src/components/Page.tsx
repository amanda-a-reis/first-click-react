import { useCallback, useEffect, useState } from "react";
import CreateSession from "./CreateSession";
import ConnectButton from "./ConnectButton";
import FirstClickButton from "./FirstClickButton";
import ResetRound from "./ResetRound";
import styled from "styled-components";
import CopyText from "./CopyText";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: center;
  padding-top: 16px;
`;

const ContainerNotConnected = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: 5%;
  left: 0;
  padding-bottom: 48px;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const PlayersContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 48px;
  align-items: center;
  justify-content: center;
  padding-bottom: 200px;
`;

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionsContainer = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const Image = styled.img`
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
`;

const BigImage = styled.img`
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

const FirstClickButtonContainer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 8px;
`;

const DisconnectButtonContainer = styled.div`
  width: 100%;
  margin-top: 8px;
`;

const apiUrl = "https://alert-marshy-ticket.glitch.me";
const webSocketUrl = "wss://alert-marshy-ticket.glitch.me";

const Page = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [firstPlayer, setFirstPlayer] = useState<string>("");

  const [isConnected, setIsConnected] = useState(false);

  const [sessionId, setSessionId] = useState("");

  const handleIsConnected = useCallback(() => {
    setIsConnected(true);
  }, []);

  const handleSessionId = useCallback((sessionId: string) => {
    setSessionId(sessionId);
  }, []);

  const clearSession = useCallback(() => {
    setIsConnected(false);
    setSessionId("");
    localStorage.setItem("nickname", "");
    localStorage.setItem("avatar", "");
    localStorage.setItem("sessionId", "");
  }, []);

  const handleDisconnect = useCallback(async () => {
    if (confirm("Tem certeza que deseja desconectar?")) {
      const playerToDisconnect = localStorage.getItem("nickname");

      try {
        await axios.post(
          `${apiUrl}/disconnect`,
          { sessionId, nickname: playerToDisconnect },
          {
            headers: {
              "Content-Type": "application/json",
              "user-agent": "Mozilla",
            },
          }
        );

        clearSession();
      } catch (error) {
        console.log(error);
      }
    }
  }, [sessionId, clearSession]);

  useEffect(() => {
    const ws = new WebSocket(webSocketUrl);

    setSocket(ws);

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      const players = parsedData?.players ?? [];

      setPlayers(players);

      const firstPlayer = parsedData?.firstPlayer ?? "";

      setFirstPlayer(firstPlayer);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setFirstPlayer("");
      setPlayers([])
    };

    ws.onopen = () => {
      setSocket(ws);

      const nickName = localStorage.getItem("nickname");
      const avatar = localStorage.getItem("avatar");
      const sessionId = localStorage.getItem("sessionId");

      if (nickName && avatar && sessionId) {
        ws.send(
          JSON.stringify({
            sessionId,
            nickname: nickName,
            avatar,
          })
        );

        setIsConnected(true);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {!isConnected && (
        <ContainerNotConnected>
          <CreateSession handleSessionId={handleSessionId} apiUrl={apiUrl} />

          {sessionId && (
            <ConnectButton
              sessionId={sessionId}
              socket={socket}
              handleIsConnected={handleIsConnected}
              apiUrl={apiUrl}
            />
          )}
        </ContainerNotConnected>
      )}

      {isConnected && sessionId && (
        <Container>
          <Content>
            <SectionsContainer>
              <label>Sessão atual</label>
              <CopyText text={sessionId} />

              <DisconnectButtonContainer>
                <button onClick={handleDisconnect}>Desconectar</button>
              </DisconnectButtonContainer>
            </SectionsContainer>
            <ResetRound sessionId={sessionId} apiUrl={apiUrl} />
          </Content>

          <PlayersContainer>
            {players.map((player) => {
              if (Object.keys(player)[0] === firstPlayer) {
                return (
                  <PlayerContainer>
                    <BigImage src={Object.values(player)[0]} />
                    <h2>{Object.keys(player)[0]}</h2>
                  </PlayerContainer>
                );
              } else {
                return (
                  <PlayerContainer>
                    <Image src={Object.values(player)[0]} />
                    <h3>{Object.keys(player)[0]}</h3>
                  </PlayerContainer>
                );
              }
            })}
          </PlayersContainer>

          <FirstClickButtonContainer>
            <FirstClickButton
              sessionId={sessionId}
              apiUrl={apiUrl}
              firstPlayer={firstPlayer}
            />
          </FirstClickButtonContainer>
        </Container>
      )}
    </div>
  );
};

export default Page;
