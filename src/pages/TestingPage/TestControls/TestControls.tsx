import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ToggleInput } from "components/ToggleInput/ToggleInput";
import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import { PlayButton } from "components/PlayButton/PlayButton";
import { ButtonTag } from "components/ButtonTag/ButtonTag";
import style from "./TestControls.module.scss";
import {
    FormEvent,
    ReactNode,
    RefObject,
    useEffect,
    useRef,
    useState,
} from "react";
import { InputValue, TestAttributes } from "./TestAttributes";
import { useControlForm } from "./useControlForm";

export const TestControls = () => {
    //const formRef = useRef<HTMLInputElement>(null);
    //TODO: https://medium.com/programming-essentials/how-to-access-data-from-a-child-form-component-with-react-hooks-fab5dd5ed5f0
    const [testAttributes, setTestAttributes] = useState<TestAttributes>({});

    const initializeTestAttributes = () => {
        const newMap = {
            ...testAttributes,
            ["unit0"]: {
                label: "unit0",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
            ["unit1"]: {
                label: "unit1",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
            ["unit2"]: {
                label: "unit2",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
            ["unit3"]: {
                label: "unit3",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
            ["unit4"]: {
                label: "unit4",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
            ["unit5"]: {
                label: "unit5",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
            ["unit6"]: {
                label: "unit6",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
            ["unit7"]: {
                label: "unit7",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
            ["force 2"]: {
                label: "force 2",
                type: "number",
                min: -10.0,
                max: 10.0,
                step: 0.01,
            },
        };
        setTestAttributes(newMap);
        console.log("Hola");
    };

    useEffect(initializeTestAttributes, []);

    const getData = (label: string, value: InputValue) => {
        //TODO: Esta función era para recibir info de los hijos, ahora se hace con el useControlForm
        setTestAttributes((prev) => {
            const currentAttributes = { ...prev };
            currentAttributes[label].value = value;
            return currentAttributes;
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        Object.entries(testAttributes).map((testAttribute) => {});
        // const { name, value } = e.target;
        // setValues({
        //   ...values,
        //   [name]: value
        // });
    };

    const [FormData, ChangeValue, ChangeEnable, SubmitHandler] =
        useControlForm();

    return (
        <div className={style.testControlsWrapper}>
            <div className={style.playWrapper}>
                <PlayButton variant="play" />
                <PlayButton variant="disabled" />
            </div>
            <div className={style.sectionWrapper}>
                <div className={style.title}>Controls</div>
                <div className={style.body}>
                    <div className={style.controlsWrapper}>
                        <ToggleButton
                            label="levitation"
                            icon={<LevitateIcon />}
                        />
                        <ToggleButton
                            label="propulsion"
                            icon={<PropulseIcon />}
                        />
                        <ToggleButton label="brake" icon={<BreakIcon />} />
                    </div>
                    <form
                        className={style.inputWrapper}
                        onSubmit={handleSubmit} //Is it needed? The type submit is outside the form
                    >
                        {Object.entries(testAttributes).map((testAttribute) => {
                            return (
                                <ToggleInput
                                    key={testAttribute[0]}
                                    label={testAttribute[1].label}
                                    type={testAttribute[1].type}
                                    min={testAttribute[1].min}
                                    max={testAttribute[1].max}
                                    step={testAttribute[1].step}
                                    onToggle={(state) => {
                                        ChangeEnable(
                                            testAttribute[1].label,
                                            state
                                        );
                                    }}
                                    onChange={(state) => {
                                        ChangeValue(
                                            testAttribute[1].label,
                                            state
                                        );
                                    }}
                                    //data={getData}
                                    // ref={formRef}
                                />
                            );
                        })}
                    </form>
                    <ButtonTag type="submit" icon={<PerturbationIcon />} />
                </div>
            </div>
        </div>
    );
};
//label=""
