import styles from "./TubePage.module.scss";
import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { TubeData } from "./TubeData/TubeData";
import { Cameras } from "./Cameras/Cameras";

export const TubePage = () => {
    return (
        <PageWrapper title="Tube">
            <div className={styles.tubePageWrapper}>
                <Cameras />
                <TubeData />
            </div>
        </PageWrapper>
    );
};
