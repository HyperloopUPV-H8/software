import { AuxCamera } from "./AuxCamera/AuxCamera";
import styles from "./SecondaryCameras.module.scss";

type camWithTitle = {
    video: string;
    title: string;
};

type Props = {
    videos: camWithTitle[];
    onClick: (camClicked: number) => void;
};

export const SecondaryCameras = ({ videos, onClick }: Props) => {
    return (
        <div className={styles.secondaryCameras}>
            {videos.map((video, index) => {
                return (
                    <AuxCamera video={video} index={index} onClick={onClick} />
                );
            })}
        </div>
    );
};
