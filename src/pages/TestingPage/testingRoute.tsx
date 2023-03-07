import { loadTestingData } from "./loadTestingData";
import { TestingPage } from "./TestingPage";

export const testingRoute = {
    path: "/testing",
    element: <TestingPage />,
    loader: loadTestingData,
};