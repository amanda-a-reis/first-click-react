import { memo, useCallback, useMemo } from "react";

import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
  align-items: center;
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

const Image = styled.img`
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

interface NickNameProps {
  handleNickName: (nickName: string) => void;
  nickName: string;
  handleAvatar: (nickName: string) => void;
  avatar: string;
}

const NickName = (props: NickNameProps) => {
  const { handleNickName, handleAvatar, avatar } = props;

  const onNickNameInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      handleNickName(value);
    },
    [handleNickName]
  );

  const onAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      handleAvatar(value);
    },
    [handleAvatar]
  );

  const nickNameFromLocalStorage = useMemo(() => {
    const nickNameFromLocalStorage = localStorage.getItem("nickname");

    return nickNameFromLocalStorage;
  }, []);

  return (
    <>
      {!nickNameFromLocalStorage && (
        <>
          <Container>
            <Label>Digite seu nickname para conectar: </Label>

            <Input onChange={onNickNameInputChange} />
          </Container>

          <Container>
            <Label>Escolha seu avatar: </Label>

            <Input onChange={onAvatarChange} />
          </Container>
        </>
      )}

      {nickNameFromLocalStorage && <p>{nickNameFromLocalStorage}</p>}

      {avatar && <Image src={avatar} />}
    </>
  );
};

export default memo(NickName);
