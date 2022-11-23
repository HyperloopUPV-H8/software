import styles from "@components/PacketTable/TransmitTable/OrderField.module.scss";

import { TextInput } from "@components/FormComponents/TextInput";
import { CheckBox } from "@components/FormComponents/CheckBox";
type Props = {
  name: string;
  valueType: string;
  onChange: (isValid: boolean, newValue: boolean | string | number) => void;
};

export const OrderField = ({ name, valueType, onChange }: Props) => {
  //FIXME: hacer con desplazamiento
  const isValueValid = (value: string | number): boolean => {
    //   switch (valueType) {
    // case "uint8": return (Number.isInteger(value) && value >= 0 && value <= 255)
    // case "uint16": return (Number.isInteger(value) && value >= 0 && value <= 65535)
    // case "uint32": return (Number.isInteger(value) && value >= 0 && value <= 4294967295)
    // case "uint64": return (Number.isInteger(value) && value >= 0 && value <= 1.8446744e+19)
    // case "int8": return (Number.isInteger(value) && value >= -128 && value <= 127)
    // case "int16": return (Number.isInteger(value) && value >= -32768 && value <= 32767)
    // case "int32": return (Number.isInteger(value) && value >= -9.223372e+18 && value <= 9.223372e+18)
    // case "int64":
    // case "float32":
    // case "float64":
    // case "bool":
    return true;
  };

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
    case "boolean":
      return (
        <CheckBox
          onChange={(value: boolean) => {
            onChange(true, value);
          }}
        />
      );
  }
}
