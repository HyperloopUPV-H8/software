import styles from "./AirgapRow.module.scss";
import { ImageTag } from "components/ImageTag/ImageTag";
import emsUrl from "assets/images/EMS.png";
import hemsUrl from "assets/images/HEMS.png";
import { NumericMeasurement } from "common";

type Props = {
    ems1: NumericMeasurement;
    hems1: NumericMeasurement;
    hems2: NumericMeasurement;
    ems2: NumericMeasurement;
};

const HEMS_IMAGE_WIDTH = "6rem";
const HEMS_IMAGE_HEIGHT = "2.5rem";

const EMS_IMAGE_WIDTH = "6rem";
const EMS_IMAGE_HEIGHT = "2.6rem";

export const AirgapRow = ({ hems1, ems1, ems2, hems2 }: Props) => {
    return (
        <div className={styles.airgapRowWrapper}>
            <ImageTag
                imageUrl={emsUrl}
                width={EMS_IMAGE_WIDTH}
                height={EMS_IMAGE_HEIGHT}
                measurement={ems1}
            />
            <ImageTag
                imageUrl={hemsUrl}
                width={HEMS_IMAGE_WIDTH}
                height={HEMS_IMAGE_HEIGHT}
                measurement={hems1}
            />
            <ImageTag
                imageUrl={hemsUrl}
                width={HEMS_IMAGE_WIDTH}
                height={HEMS_IMAGE_HEIGHT}
                measurement={hems2}
            />
            <ImageTag
                imageUrl={emsUrl}
                width={EMS_IMAGE_WIDTH}
                height={EMS_IMAGE_HEIGHT}
                measurement={ems2}
            />
        </div>
    );
};
