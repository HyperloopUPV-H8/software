import styles from "@layouts/TabLayout/Tab/Tab.module.scss";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
    name: string;
    className?: string;
    icon?: React.ReactNode;
    onClick: () => void;
};
export const Tab = ({ name, icon, onClick, className = "" }: Props) => {
    return (
        <div className={`${styles.wrapper} ${className}`} onClick={onClick}>
            <AiOutlineUnorderedList className={styles.icon} />
            <div className={styles.name}>{name}</div>
        </div>
    );
};
