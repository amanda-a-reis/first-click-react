/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

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

  return (
    <>
      <p>Digite seu nickname para conectar: </p>
      
      <input onChange={handleNickName} />

      <p>{nickName}</p>
    </>
  );
};

export default NickName;
