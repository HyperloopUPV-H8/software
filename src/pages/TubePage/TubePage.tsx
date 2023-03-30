import styles from "./TubePage.module.scss";
import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { TubeData } from "./TubeData/TubeData";
import { CamerasContainer } from "./CamerasContainer/CamerasContainer";

export const TubePage = () => {
    return (
        <PageWrapper title="Tube">
            <div className={styles.tubePageWrapper}>
                <CamerasContainer />
                <TubeData />
            </div>
        </PageWrapper>
    );
};
