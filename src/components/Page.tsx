import { useEffect, useState } from "react";
import CreateSession from "./CreateSession";
import ConnectButton from "./ConnectButton";
import NickName from "./Nickname";
import FirstClickButton from "./FirstClickButton";

const apiUrl = "https://simplistic-stormy-brontomerus.glitch.me";
const webSocketUrl = "wss://simplistic-stormy-brontomerus.glitch.me";

const Page = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [data, setData] = useState("");

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

      setData(event.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {!isConnected && (
        <>
          <CreateSession setDataToSend={setDataToSend} apiUrl={apiUrl} />

          {dataToSend.sessionId && (
            <>
              <NickName setDataToSend={setDataToSend} />

              <ConnectButton
                dataToSend={dataToSend}
                socket={socket}
                setIsConnected={setIsConnected}
              />
            </>
          )}
        </>
      )}

      {isConnected && dataToSend.sessionId && (
        <>
          {data && <h3>{data}</h3>}

          <FirstClickButton dataToSend={dataToSend} apiUrl={apiUrl} />
        </>
      )}
    </div>
  );
};

export default Page;
