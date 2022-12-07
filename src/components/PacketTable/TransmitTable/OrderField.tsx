import styles from "@components/PacketTable/TransmitTable/OrderField.module.scss";

import { TextInput } from "@components/FormComponents/TextInput";
import { CheckBox } from "@components/FormComponents/CheckBox";
type Props = {
  name: string;
  valueType: string;
  onChange: (isValid: boolean, newValue: boolean | string | number) => void;
};

export const OrderField = ({ name, valueType, onChange }: Props) => {
  return (
    <tr id={styles.wrapper}>
      <td id={styles.name}>{name}</td>
      <td id={styles.formComponent}>{getFormElement(valueType, onChange)}</td>
    </tr>
  );
};

function getFormElement(
  valueType: string,
  onChange: (isValid: boolean, value: string | number | boolean) => void
) {
  switch (valueType) {
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
    case "int8":
    case "int16":
    case "int32":
    case "int64":
    case "float32":
    case "float64":
      return (
        <TextInput
          onChange={(value: string | number) => {
            onChange(true, value);
          }}
          checkInput={() => {
            return true;
          }}
        ></TextInput>
      );
    case "bool":
      return (
        <CheckBox
          onChange={(value: boolean) => {
            onChange(true, value);
          }}
        />
      );
  }
}
