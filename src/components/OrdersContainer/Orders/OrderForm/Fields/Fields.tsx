import styles from "./Fields.module.scss";
import { Field } from "./Field/Field";
import { FieldState, FormField } from "../useForm"; //TODO: no acceder al padre

type Props = {
    fields: FormField[];
    updateField: (
        id: string,
        value: boolean | string | number,
        isValid: boolean
    ) => void;
    changeEnabled: (id: string, isEnabled: boolean) => void;
};

export const Fields = ({ fields, updateField, changeEnabled }: Props) => {
    return (
        <div className={styles.fieldsWrapper}>
            {fields.map((field) => {
                return (
                    <Field
                        key={field.id}
                        name={field.id}
                        field={field}
                        onChange={(
                            newValue: string | number | boolean,
                            isValid: boolean
                        ) => {
                            updateField(field.id, newValue, isValid);
                        }}
                        changeEnabled={(value) =>
                            changeEnabled(field.id, value)
                        }
                    />
                );
            })}
        </div>
    );
};
