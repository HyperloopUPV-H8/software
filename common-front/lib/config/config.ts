export const config = {
    devServer: { ip: "127.0.0.1", port: 4000 },
    prodServer: { ip: "192.168.0.9", port: 4000 },
    paths: {
        podDataDescription: "backend/podDataStructure",
        orderDescription: "backend/orderStructures",
        packets: "backend/packets",
        messages: "backend/messages",
        connections: "backend/connections",
        logger: "backend/logger",
        bootloader: "backend/bootloader_file",
        websocket: "backend",
        uploadableBoards: "backend/uploadableBoards",
    },
    oscilloscope: {
        ip: "192.168.0.100"
    },
    cameras: {
        ip: "192.168.0.9",
        port: 4040,
    },
};
