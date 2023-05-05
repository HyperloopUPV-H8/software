import { store } from "store";
import { ReceiveTable } from "./ReceiveTable/ReceiveTable";
import {
    RequestState,
    useFetchPodData,
} from "pages/HomePage/ReceiveColumn/useFetchPodData";

export const ReceiveTableContainer = () => {
    const requestState = useFetchPodData();

    if (requestState == RequestState.PENDING)
        return <div>Loading PodData...</div>;
    if (requestState == RequestState.FULFILLED)
        return <ReceiveTable boards={store.getState().podData.boards} />;

    return <div>Error fetching PodData</div>;
};
