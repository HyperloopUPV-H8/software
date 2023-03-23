import { BootloaderResponse } from "services/useBootloader";
import styles from "./ResponseElement.module.scss";
import { HiCheckCircle } from "react-icons/hi";
import { MdCancel } from "react-icons/md";
type Props = {
    response: BootloaderResponse;
};

export const ResponseElement = ({ response }: Props) => {
    return (
        <div className={styles.responseElementWrapper}>
            {response == "success" && (
                <>
                    <HiCheckCircle
                        className={`${styles.icon} ${styles.successIcon}`}
                    />
                    Success!
                </>
            )}
            {response == "failure" && (
                <>
                    <MdCancel
                        className={`${styles.icon} ${styles.failureIcon}`}
                    />
                    Error!
                </>
            )}
        </div>
    );
};
