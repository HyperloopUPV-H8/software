import { useState } from "react";
import { FieldEvent, Form, areFieldsValid } from ".";

export function useForm(initialForm: Omit<Form, "isValid">) {
    const [form, setForm] = useState<Form>({
        ...initialForm,
        isValid: areFieldsValid(initialForm.fields),
    });

    function handleEvent(ev: FieldEvent) {
        setForm((prev) => {
            const field = form.fields.find((field) => field.id == ev.id);

            if (!field) {
                console.error("invalid form id", ev.id);
                return prev;
            }

            const newFields = prev.fields.map((field) => {
                if (field.id == ev.id) {
                    if (field.type == "boolean" && ev.ev.type == "boolean") {
                        return { ...field, value: ev.ev.value };
                    } else if (field.type == "enum" && ev.ev.type == "enum") {
                        return { ...field, value: ev.ev.value };
                    } else if (
                        field.type == "numeric" &&
                        ev.ev.type == "numeric"
                    ) {
                        return {
                            ...field,
                            value: ev.ev.value,
                            isValid: field.validator?.(ev.ev.value) ?? true,
                        };
                    } else {
                        console.log(
                            `field ${field.id} type (${field.type}) and event type (${ev.ev.type}) don't match`
                        );
                    }
                }
                return field;
            });

            return {
                ...prev,
                fields: newFields,
                isValid: areFieldsValid(newFields),
            };
        });
    }

    return [form, handleEvent] as const;
}
