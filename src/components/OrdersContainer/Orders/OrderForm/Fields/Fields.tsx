import styles from "./Fields.module.scss";
import { Field } from "./Field/Field";
import { FieldState, FormField } from "../useFormFields"; //TODO: no acceder al padre

type Props = {
    fields: FormField[];
    updateField: (
        name: string,
        value: boolean | string | number,
        isValid: boolean
    ) => void;
    changeEnabled: (name: string, isEnabled: boolean) => void;
};

export const Fields = ({ fields, updateField, changeEnabled }: Props) => {
    return (
        <div className={styles.fieldsWrapper}>
            {fields.map((field) => {
                return (
                    <Field
                        key={field.name}
                        name={field.name}
                        field={field}
                        onChange={(
                            newValue: string | number | boolean,
                            isValid: boolean
                        ) => {
                            updateField(field.name, newValue, isValid);
                        }}
                        changeEnabled={(value) =>
                            changeEnabled(field.name, value)
                        }
                    />
                );
            })}
        </div>
    );
};
