import { IconTag } from "components/IconTag/IconTag";
import { MultipleTags } from "components/MultipleTags/MultipleTags";
import { ReactComponent as Yaw } from "assets/svg/yaw_icon.svg";
import { ReactComponent as Pitch } from "assets/svg/pitch_icon.svg";
import { ReactComponent as Roll } from "assets/svg/roll_icon.svg";
import { NumericMeasurement } from "common";

type Props = {
    rot1: NumericMeasurement;
    rot2: NumericMeasurement;
    rot3: NumericMeasurement;
    className?: string;
};

export const Rotations = ({ rot1, rot2, rot3, className = "" }: Props) => {
    return (
        <MultipleTags
            className={className}
            tags={[
                <IconTag
                    icon={<Yaw />}
                    measurement={rot1}
                />,
                <IconTag
                    icon={<Pitch />}
                    measurement={rot2}
                />,
                <IconTag
                    icon={<Roll />}
                    measurement={rot3}
                />,
            ]}
        />
    );
};
