import styles from "components/ControlSections/NavigationSection/NavigationSection.module.scss";
import { NavigationData } from "components/ControlSections/NavigationSection/NavigationData";

type Props = {
    navigationData: NavigationData;
};

export const NavigationSection = ({ navigationData }: Props) => {
    return <div>{JSON.stringify(navigationData)}</div>;
};
