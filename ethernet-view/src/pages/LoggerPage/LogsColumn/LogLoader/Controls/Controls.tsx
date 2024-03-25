import { Button } from "components/FormComponents/Button/Button"
import styles from "./Controls.module.scss"

export const Controls = () => {
    return (
        <div className={styles.controlsWrapper}>

            <Button 
                label="Load"
                color="#317ae7"
            />

            <Button
                label="Remove"
            />

        </div>
    )
}
