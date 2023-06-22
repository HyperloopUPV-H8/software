export const config = {
    devServer: { ip: "127.0.0.2", port: 4000 },
    prodServer: { ip: "192.168.1.2", port: 4000 },
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
    cameras: {
        ip: "192.168.0.9",
        port: 4040,
    },
} as const;
