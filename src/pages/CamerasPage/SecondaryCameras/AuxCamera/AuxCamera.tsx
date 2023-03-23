import styles from "./AuxCamera.module.scss";

type camWithTitle = {
    video: string;
    title: string;
};

type Props = {
    video: camWithTitle;
    index: number;
    onClick: (camClicked: number) => void;
};

export const AuxCamera = ({ video, index, onClick }: Props) => {
    return (
        <div className={styles.gradientSecondaryCam}>
            <div
                className={styles.cam}
                onClick={() => {
                    onClick(index + 1);
                }}
            >
                <video
                    className={styles.camera2}
                    // ref={ref} //TODO: ref of the hook for the streaming
                    src={video.video}
                    autoPlay
                    loop
                    muted
                    disablePictureInPicture //TODO: In firefox it is not fixed
                />
                <div className={styles.overlayCam}>
                    <div className={styles.title}>
                        <div className={styles.name}>{video.title}</div>
                        <div className={styles.dot}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
