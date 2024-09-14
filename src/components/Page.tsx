import { useCallback, useEffect, useState } from "react";
import CreateSession from "./CreateSession";
import ConnectButton from "./ConnectButton";
import FirstClickButton from "./FirstClickButton";
import ResetRound from "./ResetRound";
import styled from "styled-components";
import CopyText from "./CopyText";

const Container = styled.div`
  width: 80vw;
  height: 100%;
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
  margin-top: 32px;
`;

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionsContainer = styled.div`
  width: 250px;
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

const apiUrl = "https://positive-sunny-iodine.glitch.me";
const webSocketUrl = "wss://positive-sunny-iodine.glitch.me";

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

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {!isConnected && (
        <>
          <CreateSession handleSessionId={handleSessionId} apiUrl={apiUrl} />

          {sessionId && (
            <ConnectButton
              sessionId={sessionId}
              socket={socket}
              handleIsConnected={handleIsConnected}
              apiUrl={apiUrl}
            />
          )}
        </>
      )}

      {isConnected && sessionId && (
        <Container>
          <Content>
            <SectionsContainer>
              <label>Sessão atual</label>
              <CopyText text={sessionId} />
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
                )
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

          <FirstClickButton
            sessionId={sessionId}
            apiUrl={apiUrl}
            firstPlayer={firstPlayer}
          />
        </Container>
      )}
    </div>
  );
};

export default Page;
