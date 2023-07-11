import { FieldEvent, Field as FieldType } from "../../../../../..";
import styles from "./Field.module.scss";
import { Input } from "./Input/Input";

type Props<T extends FieldType> = {
    field: T;
    onChange: (ev: FieldEvent) => void;
};

export const Field = <T extends FieldType>({ field, onChange }: Props<T>) => {
    return (
        <div className={styles.field}>
            <div className={styles.name}>{field.name}</div>
            <Input
                input={{ ...field }}
                onChange={(ev) => onChange({ id: field.id, ev: ev })}
            />
        </div>
    );
};
