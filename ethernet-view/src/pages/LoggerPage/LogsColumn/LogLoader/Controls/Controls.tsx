import { Button } from "components/FormComponents/Button/Button"
import styles from "./Controls.module.scss"
import { UploadState } from "../LogLoader";

type Props = {
    uploadState: UploadState;
    setUploadState: (newUploadState: UploadState) => void;
    onLoad: () => void;
    onRemove: () => void;
}

export const Controls = ({uploadState, onLoad, onRemove}: Props) => {
    return (
        <div className={styles.controlsWrapper}>

            <Button 
                label="Load"
                color="#317ae7"
                disabled={uploadState !== UploadState.SUCCESS}
                onClick={() => onLoad()}
            />

            <Button
                label="Remove"
                disabled={uploadState !== UploadState.SUCCESS && uploadState !== UploadState.ERROR}
                onClick={() => onRemove() }
            />

        </div>
    )
}
