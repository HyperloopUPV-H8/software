import styles from "@components/TransmitTable/OrderFields/OrderFields.module.scss";
import { OrderField } from "@components/TransmitTable/OrderField/OrderField";
import { Field } from "@components/TransmitTable/OrderForm/useFormFields";
type Props = {
  fields: Field[];
  updateField: (newField: Field) => void;
};

export const OrderFields = ({ fields, updateField }: Props) => {
  return (
    <div className={styles.wrapper}>
      {fields.map((field) => {
        return (
          <OrderField
            key={field.name}
            name={field.name}
            fieldDescription={field.description}
            onChange={(
              newValue: string | number | boolean,
              isValid: boolean
            ) => {
              //FIXME: make it more obvious that the id is the name of the order or do it another way
              updateField({
                name: field.name,
                description: field.description,
                isValid,
                currentValue: newValue,
              });
            }}
          />
        );
      })}
    </div>
  );
};
