import { BootloaderResponse } from "services/useBootloader";
import styles from "./ResponseElement.module.scss";

type Props = {
    response: BootloaderResponse;
};

export const ResponseElement = ({ response }: Props) => {
    return (
        <div className={styles.responseElementWrapper}>
            {response == "success" && "Success!"}
            {response == "failure" && "Error!"}
        </div>
    );
};
