
interface Props {
    logNames: string[];
}

export const LogList = ({logNames}: Props) => {
    return (
        <div>
            {logNames.map((logName) => (
                <div key={logName}>{logName}</div>
            ))}
        </div>
    )
}
