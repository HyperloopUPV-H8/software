function sendLoggerRequest(
    loggerRequest: "enable" | "disable"
): Promise<Response> {
    return fetch(
        `http://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
        }${import.meta.env.VITE_LOGGER_URL}`,
        {
            method: "POST",
            mode: "cors",
            body: loggerRequest,
        }
    );
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
