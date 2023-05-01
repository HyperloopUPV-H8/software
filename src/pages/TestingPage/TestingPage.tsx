import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import style from "./TestingPage.module.scss";
import { TestControls } from "./TestControls/TestControls";

export function TestingPage() {
    return (
        <PageWrapper title="Testing">
            <div className={style.testingPageWrapper}>
                <TestControls />
                <div className={style.podRepresentation}>
                    <div className={style.threeJSAndInfo}>
                        <div className={style.threeJS}></div>
                        <div className={style.info}></div>
                    </div>
                    <div className={style.graphics}></div>
                </div>
            </div>
        </PageWrapper>
    );
}
