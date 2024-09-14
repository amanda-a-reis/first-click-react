/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface CreateSessionProps {
  setDataToSend: any;
  apiUrl: string;
}

const CreateSession = (props: CreateSessionProps) => {
  const { setDataToSend, apiUrl } = props;

  const [sessionId, setSessionId] = useState();

  const create = async () => {
    const response = await fetch(`${apiUrl}/create-session`, {
      method: "POST",
      headers: {
        "user-agent": "Mozilla",
      },
    });

    const data = await response.json();

    const sessionId = data.sessionId;

    setDataToSend((prev: any) => ({ ...prev, sessionId }));

    setSessionId(sessionId);
  };

  return (
    <>
      {!sessionId && <button onClick={create}>Criar sessão</button>}

      {sessionId && <h2>Sessão criada: {sessionId}</h2>}
    </>
  );
};

export default CreateSession;
