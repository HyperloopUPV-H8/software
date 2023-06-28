import { Field } from "./Field/Field";
import { Button, Form as FormType, useForm } from "common";
import styles from "./Form.module.scss";

type Props = {
    initialForm: Omit<FormType, "isValid">;
    onSubmit: (form: FormType) => void;
};

export const Form = ({ initialForm, onSubmit }: Props) => {
    const [form, handleEvent] = useForm(initialForm);

    return (
        <div className={styles.form}>
            <div className={styles.title}>{form.name}</div>
            {form.fields.length > 0 && (
                <div className={styles.fields}>
                    {form.fields.map((field) => (
                        <Field
                            key={field.id}
                            field={field}
                            onChange={handleEvent}
                        />
                    ))}
                </div>
            )}
            <Button
                label="Send"
                disabled={!form.isValid}
                onClick={() => onSubmit(form)}
            />
        </div>
    );
};
