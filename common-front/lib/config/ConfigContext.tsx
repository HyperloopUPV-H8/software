import { createContext } from "react";
import { config } from "./config";

export const ConfigContext = createContext(config);

type Props = {
    devIp: string;
    prodIp: string;
    children: React.ReactNode;
};

export const ConfigProvider = ({ devIp, prodIp, children }: Props) => {
    const mutableConfig: typeof config = {
        ...config,
        devServer: { ...config.devServer, ip: devIp },
        prodServer: { ...config.prodServer, ip: prodIp },
    };

    return (
        <ConfigContext.Provider value={mutableConfig}>
            {children}
        </ConfigContext.Provider>
    );
};
