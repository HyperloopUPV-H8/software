import { TagType } from "../models/TagType.ts";
import { ReactComponent as EMSIcon } from "assets/icons/ems.svg";
import { ReactComponent as HEMSIcon } from "assets/icons/hems.svg";
import { useGlobalTicker } from "common";
import { useState } from "react";

type Props = { getUpdate: () => number; name: string; type: TagType };

export const LevitationUnitTag = ({getUpdate, name, type}: Props) => {

    const [value, setValue] = useState(getUpdate());
    useGlobalTicker(() => {
        setValue(getUpdate());
    })

    const getIcon = () =>
        type === TagType.HEMS ? (
            <HEMSIcon className={"lev-icon"} />
        ) : (
            <EMSIcon className={"lev-icon"} />
        );

    return (
        <div className={"levitation-unit-tag"}>
            <span>{getIcon()}</span>
            <div>
                <h3>{name}</h3>
                <p>{value.toFixed(2)} W</p>
            </div>
        </div>
    );
};
