import { NewReceiveTable } from "./NewReceiveTable/NewReceiveTable";
import {
    RequestState,
    useFetchPodData,
} from "pages/HomePage/ReceiveColumn/useFetchPodData";

export const ReceiveTableContainer = () => {
    const requestState = useFetchPodData();

    if (requestState == RequestState.PENDING)
        return <div>Loading PodData...</div>;
    if (requestState == RequestState.FULFILLED) return <NewReceiveTable />;

    return <div>Error fetching PodData</div>;
};
