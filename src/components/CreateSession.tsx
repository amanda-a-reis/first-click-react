import axios, { AxiosError } from "axios";
import { memo, useCallback, useState } from "react";
import styled from "styled-components";
import CopyText from "./CopyText";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
`;

const SectionsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const CreateSectionContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const EnterSectionContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Input = styled.input`
  width: 280px;
  height: 28px;
  padding: 8px;
  border-radius: 8px;
  border: solid white 1px;
  font-size: 16px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 800;
`;

const Divider = styled.div`
  width: 280px;
  border: solid gray 1px;
`;

const CurrentSessionContainer = styled.div`
  width: 100%;
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 24px;

  &.isBold {
    font-weight: 800;
  }
`;

interface CreateSessionProps {
  handleSessionId: (sessionId: string) => void;
  apiUrl: string;
}

const CreateSession = (props: CreateSessionProps) => {
  const { handleSessionId, apiUrl } = props;

  const [sessionIdForm, setSessionIdForm] = useState<string>();
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSuccess = useCallback(
    (sessionId: string) => {
      handleSessionId(sessionId);
      setSessionIdForm(sessionId);

      setErrorMsg("");
      setHasSession(true);
    },
    [handleSessionId]
  );

  const handleError = useCallback((error: unknown) => {
    const err = error as AxiosError<{ message: string }>;

    const errorMsg = err.response?.data?.message ?? "";

    setErrorMsg(errorMsg);
    setHasSession(false);
  }, []);

  const createSession = useCallback(async () => {
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

        const createdSessionId = response.data.sessionId;

        handleSuccess(createdSessionId);
      } catch (error) {
        handleError(error);
      }
    }
  }, [apiUrl, handleError, handleSuccess, hasSession]);

  const enterExistentSession = useCallback(async () => {
    try {
      await axios.post(
        `${apiUrl}/enter-session`,
        {
          sessionId: sessionIdForm,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "user-agent": "Mozilla",
          },
        }
      );

      if (sessionIdForm) {
        handleSuccess(sessionIdForm);
      }
    } catch (error) {
      handleError(error);
    }
  }, [apiUrl, handleError, handleSuccess, sessionIdForm]);

  const onSessionIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) {
      setErrorMsg("");
    }

    setSessionIdForm(e.target.value);
  };

  return (
    <Container>
      {!hasSession && (
        <SectionsContainer>
          <CreateSectionContainer>
            <Label>Crie uma nova sessão </Label>
            <button onClick={createSession}>Criar sessão</button>
          </CreateSectionContainer>

          <Divider />

          <EnterSectionContainer>
            <Label>Ou então digite a sessão para entrar: </Label>
            <Input onChange={onSessionIdInputChange} />
            <button onClick={enterExistentSession}>Entrar</button>
          </EnterSectionContainer>
        </SectionsContainer>
      )}

      {!!errorMsg && <p>{errorMsg}</p>}

      {hasSession && !!sessionIdForm && (
        <CurrentSessionContainer>
          <Text>Sessão atual</Text>
          <CopyText text={sessionIdForm} />
        </CurrentSessionContainer>
      )}
    </Container>
  );
};

export default memo(CreateSession);
