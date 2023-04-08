import styles from "./Fields.module.scss";
import { Field } from "./Field/Field";
import { FieldState, FormField } from "../useFormFields"; //TODO: no acceder al padre

type Props = {
    fields: FormField[];
    updateField: (newField: FormField) => void;
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
                            fieldState: FieldState
                        ) => {
                            //FIXME: make it more obvious that the id is the name of the order or do it another way
                            updateField({
                                ...field,
                                currentValue: newValue,
                                fieldState: fieldState,
                            });
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
