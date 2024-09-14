/* eslint-disable @typescript-eslint/no-explicit-any */
interface ConnectButtonProps {
  dataToSend: {
    sessionId: string;
    nickName: string;
  };
  socket: WebSocket | null;
  setIsConnected: any;
}
const ConnectButton = (props: ConnectButtonProps) => {
  const { dataToSend, socket, setIsConnected } = props;

  const handleConnect = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          sessionId: dataToSend.sessionId,
          nickname: dataToSend.nickName,
        })
      );

      setIsConnected(true);
    }
  };

  return (
    <>
      <button onClick={handleConnect}>Conectar</button>
    </>
  );
};

export default ConnectButton;
