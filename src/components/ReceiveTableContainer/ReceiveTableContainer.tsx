import { NewReceiveTable } from "./NewReceiveTable/NewReceiveTable";
import {
    RequestState,
    useFetchPodData,
} from "pages/HomePage/ReceiveColumn/useFetchPodData";

export const ReceiveTableContainer = () => {
    const requestState = useFetchPodData();

    if (requestState == RequestState.PENDING) {
        return <div>Loading PodData...</div>;
    } else if (requestState == RequestState.FULFILLED) {
        return <NewReceiveTable />;
    } else {
        return <div>Error fetching PodData</div>;
    }
};
