/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

interface NickNameProps {
  setDataToSend: any;
}

const NickName = (props: NickNameProps) => {
  const { setDataToSend } = props;
  const [nickName, setNickName] = useState("");

  const handleNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setNickName(value);

    setDataToSend((prev: any) => ({ ...prev, nickName: value }));
  };

  const nickNameFromLocalStorage = useMemo(() => {
    const nickNameFromLocalStorage = localStorage.getItem("nickname");

    return nickNameFromLocalStorage;
  }, []);

  return (
    <>
      {!nickNameFromLocalStorage && (
        <>
          <p>Digite seu nickname para conectar: </p>

          <input onChange={handleNickName} />
        </>
      )}

      {!nickNameFromLocalStorage && <p>{nickName}</p>}

      {nickNameFromLocalStorage && <p>{nickNameFromLocalStorage}</p>}
    </>
  );
};

export default NickName;
