import styles from "./OrderFields.module.scss";
import { OrderField } from "./OrderField/OrderField";
import { FieldState, FormField } from "../useFormFields"; //TODO: no acceder al padre

type Props = {
    fields: FormField[];
    updateField: (newField: FormField) => void;
};

export const OrderFields = ({ fields, updateField }: Props) => {
    return (
        <div className={styles.wrapper}>
            {fields.map((field) => {
                return (
                    <OrderField
                        key={field.name}
                        name={field.name}
                        field={field}
                        onChange={(
                            newValue: string | number | boolean,
                            fieldState: FieldState
                        ) => {
                            //FIXME: make it more obvious that the id is the name of the order or do it another way
                            updateField({
                                ...field,
                                currentValue: newValue,
                                fieldState: fieldState,
                            });
                        }}
                    />
                );
            })}
        </div>
    );
};
