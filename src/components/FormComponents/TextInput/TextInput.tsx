import styles from "@components/FormComponents/TextInput/TextInput.module.scss";
import { ChangeEvent, useState } from "react";
type Props = {
  placeholder: string;
  onChange: (value: string, isValid: boolean) => void;
  isRequired: boolean;
  checkInput: (input: string) => boolean;
};

enum State {
  Valid,
  Invalid,
}

export const TextInput = ({
  onChange,
  isRequired,
  checkInput,
  placeholder,
}: Props) => {
  let [state, setState] = useState(State.Invalid);
  return (
    <input
      type="text"
      name=""
      className={`${styles.textInput} ${
        state == State.Valid ? styles.valid : styles.invalid
      }`}
      placeholder={placeholder}
      required={isRequired}
      onChange={(ev: ChangeEvent<HTMLInputElement>) => {
        setState(() => {
          return checkInput(ev.target.value) ? State.Valid : State.Invalid;
        });
        onChange(ev.target.value, checkInput(ev.target.value));
      }}
    />
  );
};
