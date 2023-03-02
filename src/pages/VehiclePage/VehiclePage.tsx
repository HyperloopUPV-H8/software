import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { useMeasurements } from "./useMeasurements";

export const VehiclePage = () => {
    const measurements = useMeasurements();
    return <PageWrapper title="Vehicle"></PageWrapper>;
};
