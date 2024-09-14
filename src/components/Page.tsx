/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CreateSession from "./CreateSession";
import ConnectButton from "./ConnectButton";
import NickName from "./Nickname";
import FirstClickButton from "./FirstClickButton";
import ResetRound from "./ResetRound";

const apiUrl = "https://positive-sunny-iodine.glitch.me";
const webSocketUrl = "wss://positive-sunny-iodine.glitch.me";

const Page = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [firstPlayer, setFirstPlayer] = useState<string>("");

  const [isConnected, setIsConnected] = useState(false);

  const [dataToSend, setDataToSend] = useState({
    sessionId: "",
    nickName: "",
  });

  useEffect(() => {
    const ws = new WebSocket(webSocketUrl);

    setSocket(ws);

    ws.onmessage = (event) => {
      console.log("event.data", event.data);

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

  const isPlayerConnected = isConnected

  return (
    <div>
      {!isPlayerConnected && (
        <>
          <CreateSession setDataToSend={setDataToSend} apiUrl={apiUrl} />

          {dataToSend.sessionId && (
            <>
              <NickName setDataToSend={setDataToSend} />

              <ConnectButton
                dataToSend={dataToSend}
                socket={socket}
                setIsConnected={setIsConnected}
                apiUrl={apiUrl}
              />
            </>
          )}
        </>
      )}

      {isPlayerConnected && dataToSend.sessionId && (
        <>
          <label>{dataToSend.sessionId}</label>

          {players.map((player) => {
            if (player === firstPlayer) {
              return <h1>{player}</h1>;
            } else {
              return <h3>{player}</h3>;
            }
          })}

          <FirstClickButton dataToSend={dataToSend} apiUrl={apiUrl} />

          <ResetRound sessionId={dataToSend.sessionId} apiUrl={apiUrl} />
        </>
      )}
    </div>
  );
};

export default Page;
