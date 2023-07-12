import "./Bar.scss";
import { RangeBar } from "./RangeBar/RangeBar";
import { BoolBar } from "./BoolBar/BoolBar";
export type BarType = "range" | "temp" | "bool";

type Props =
    | {
          type: "range" | "temp";
          value: number;
          min: number;
          max: number;
      }
    | {
          type: "bool";
          value: boolean;
      };

export const Bar = (props: Props) => {
    switch (props.type) {
        case "range":
        case "temp":
            return (
                <RangeBar
                    type={props.type}
                    value={props.value}
                    min={props.min}
                    max={props.max}
                />
            );
        case "bool":
            return <BoolBar isOn={props.value} />;
    }
};
