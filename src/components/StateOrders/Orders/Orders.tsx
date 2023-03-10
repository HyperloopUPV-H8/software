import styles from "./Orders.module.scss";
import { Order } from "../StateOrdersType"; //TODO: mover modelo a otra parte
import { Button } from "components/Button/Button";
import { useSendOrder } from "./useSendOrder";
type Props = {
    actions: Order[];
};

export const Orders = ({ actions }: Props) => {
    const sendAction = useSendOrder();

    return (
        <div className={styles.actionsWrapper}>
            {actions.map((action) => {
                return (
                    <Button
                        key={action.id}
                        label={action.name}
                        onClick={() => {
                            sendAction({ id: action.id });
                        }}
                    />
                );
            })}
        </div>
    );
};
