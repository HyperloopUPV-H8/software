import styles from "./EmergencyButton.module.scss";

function getLighterHSl(color: string): string {
    const matches = color
        .replaceAll(" ", "")
        .match(/hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/)!;
    const h = matches[1];
    const s = matches[2];
    const l = matches[3];
    const newLightness = Math.min(parseInt(l) + 35, 100);
    return `hsl(${h}, ${s}%, ${newLightness}%)`;
}

type Props = {
    label: string;
    color: string;
    icon: React.ReactNode;
};

export const EmergencyButton = ({ label, color, icon }: Props) => {
    return (
        <div
            className={styles.emergencyButtonWrapper}
            style={{ backgroundColor: getLighterHSl(color) }}
        >
            {icon}
            <div className={styles.content}>
                <span
                    className={styles.label}
                    style={{ color: color }}
                >
                    {label}
                </span>
            </div>
        </div>
    );
};
