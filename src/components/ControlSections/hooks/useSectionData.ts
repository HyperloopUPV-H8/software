import {
    ModelNameMap,
    SectionData,
    isAdditionalValues,
} from "components/ControlSections/types/SectionData";
import { useState } from "react";
import { PodData } from "models/PodData/PodData";
import { Measurement } from "models/PodData/Measurement";
import { getMeasurement } from "models/PodData/PodData";
import { getDefaultMeasurement } from "models/PodData/Measurement";

export function useSectionData<Properties extends string>(
    nameMap: ModelNameMap<Properties>
): [SectionData<Properties>, (boards: PodData["boards"]) => void] {
    const [sectionData, setSectionData] = useState<SectionData<Properties>>(
        getDefaultData()
    );

    function getDefaultData(): SectionData<Properties> {
        const defaultData: { [key: string]: Measurement | Measurement[] } = {};
        Object.keys(nameMap).map((guiName) => {
            if (!isAdditionalValues(guiName)) {
                defaultData[guiName] = getDefaultMeasurement();
            } else {
                defaultData["additionalValues"] = [];
            }
        });

        return defaultData as SectionData<Properties>;
    }

    function setSectionDataFromBoards(boards: PodData["boards"]): void {
        const sectionData = {} as { [key: string]: any };

        for (const [guiName, measurementNameOrArray] of Object.entries(
            nameMap
        )) {
            if (!isAdditionalValues(guiName)) {
                sectionData[guiName] = getMeasurement(
                    boards,
                    measurementNameOrArray as string
                );
            } else {
                sectionData["additionalValues"] = getAdditionalMeasurements(
                    measurementNameOrArray as string[],
                    boards
                );
            }
        }
        setSectionData(sectionData as SectionData<Properties>);
    }

    function getAdditionalMeasurements(
        additionalProperties: string[],
        boards: PodData["boards"]
    ): Measurement[] {
        console.log(additionalProperties);
        return additionalProperties.map((additionalMeasurementName) => {
            return getMeasurement(boards, additionalMeasurementName);
        });
    }

    return [sectionData, setSectionDataFromBoards];
}
