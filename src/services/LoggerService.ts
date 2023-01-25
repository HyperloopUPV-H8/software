import { postToBackend } from "services/HTTPHandler";

function sendLoggerRequest(
    loggerRequest: "enable" | "disable"
): Promise<Response> {
    return postToBackend(import.meta.env.VITE_LOGGER_PATH, loggerRequest);
}

function startLogging(): Promise<boolean> {
    return sendLoggerRequest("enable").then((res) => {
        return res.status == 200;
    });
}
function stopLogging(): Promise<boolean> {
    return sendLoggerRequest("disable").then((res) => {
        return res.status == 200;
    });
}

export const loggerService = {
    startLogging,
    stopLogging,
};

export default loggerService;
