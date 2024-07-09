import { ReactComponent as Thunder } from "assets/icons/thunder.svg";
import { useGlobalTicker } from "common";
import { useState } from "react";

type Props = { 
    name: string; 
    getUpdate: () => number 
};

export const BatteryTag = ({name, getUpdate}: Props) => {

    const [value, setValue] = useState(getUpdate());

    useGlobalTicker(() => {
        setValue(getUpdate());
    })

    return (
        <div className={"battery-tag"}>
            <h3>{name}</h3>
            <div>
                <Thunder />
                <p>{value.toFixed(2)} W</p>
            </div>
        </div>
    );
};
