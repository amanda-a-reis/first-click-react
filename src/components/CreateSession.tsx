/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { useState } from "react";

interface CreateSessionProps {
  setDataToSend: any;
  apiUrl: string;
}

const CreateSession = (props: CreateSessionProps) => {
  const { setDataToSend, apiUrl } = props;

  const [sessionId, setSessionId] = useState<string>();

  const [errorMsg, setErrorMsg] = useState<string>("");

  const [hasSession, setHasSession] = useState<boolean>(false);

  const create = async () => {
    if (!hasSession) {
      try {
        const response = await axios.post(
          `${apiUrl}/create-session`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "user-agent": "Mozilla",
            },
          }
        );

        const data = response.data;

        const sessionId = data.sessionId;

        setDataToSend((prev: any) => ({ ...prev, sessionId }));

        setSessionId(sessionId);

        setHasSession(true);

        setErrorMsg("");
      } catch (error) {
        console.log(error);

        setHasSession(false);
      }
    }
  };

  const handleExistentSession = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sessionId = e.target.value;

    setSessionId(sessionId);
  };

  const enterExistentSession = async () => {
    try {
      await axios.post(
        `${apiUrl}/enter-session`,
        {
          sessionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "user-agent": "Mozilla",
          },
        }
      );

      setDataToSend((prev: any) => ({ ...prev, sessionId }));

      setHasSession(true);

      setErrorMsg("");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      const errorMsg = err.response?.data?.message ?? "";

      setErrorMsg(errorMsg);

      setHasSession(false);
    }
  };

  return (
    <>
      {!hasSession && (
        <>
          <button onClick={create}>Criar sessão</button>

          <label>Digite a sessão para entrar: </label>
          <input onChange={handleExistentSession} />
          <button onClick={enterExistentSession}>Entrar</button>
        </>
      )}

      {!!errorMsg && <p>{errorMsg}</p>}

      {hasSession && <h2>Sessão criada: {sessionId}</h2>}
    </>
  );
};

export default CreateSession;
