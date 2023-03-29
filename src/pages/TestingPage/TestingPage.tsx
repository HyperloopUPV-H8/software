import { ButtonTag } from "components/ButtonTag/ButtonTag";
import { PlayButton } from "components/PlayButton/PlayButton";
import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ToggleInput } from "components/ToggleInput/ToggleInput";
import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import style from "./TestingPage.module.scss";
import { TestControls } from "./TestControls/TestControls";

export function TestingPage() {
    return (
        <PageWrapper title="Testing">
            <div className={style.testingPageWrapper}>
                <TestControls />
                <div className={style.threeJSAndgraphics}>
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
