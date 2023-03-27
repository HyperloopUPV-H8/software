import { ButtonTag } from "components/ButtonTag/ButtonTag";
import { PlayButton } from "components/PlayButton/PlayButton";
import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ToggleInput } from "components/ToggleInput/ToggleInput";
import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { FaPlane, FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import style from "./TestingPage.module.scss";

export function TestingPage() {
    return (
        <PageWrapper title="Testing">
            <div className={style.mainWrapper}>
                <div className={style.playWrapper}>
                    <PlayButton variant="play" />
                    <PlayButton variant="disabled" />
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.title}>Controls</div>
                    <div className={style.controlsWrapper}>
                        <ToggleButton
                            label="levitation"
                            icon={<FaPlaneDeparture />}
                        />
                        <ToggleButton label="propulsion" icon={<FaPlane />} />
                        <ToggleButton label="brake" icon={<FaPlaneArrival />} />
                    </div>
                    <div className={style.inputWrapper}>
                        <ToggleInput
                            label="unit 0"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 1"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 2"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 3"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 4"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 5"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 6"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 7"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="force x"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                    </div>
                    <ButtonTag label="Disturb" icon={<FaPlaneDeparture />} />
                </div>
            </div>
        </PageWrapper>
    );
}
