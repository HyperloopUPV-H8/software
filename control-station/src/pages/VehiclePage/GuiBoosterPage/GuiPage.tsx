import React from "react";
import "./GuiPage.scss";
import Module from "../../../components/GuiModules/Module";
import { Messages } from "../Messages/Messages";
import { OrdersContainer } from "../../../../../ethernet-view/src/components/OrdersContainer/OrdersContainer";
import { Pagination } from "../../../components/Pagination/Pagination";

interface ModuleData {
    id: number;
    name: string;
}

const modules: ModuleData[] = [
    { id: 1, name: "Module 1" },
    { id: 2, name: "Module 2" },
    { id: 3, name: "Module 3" },
];

export function GuiPage() {
    return (
        <div className="boosterGui">
            <header className="header">
                <h1>Booster GUI</h1>
                <div className="line"></div>
            </header>
            <main className="main">
                <div className="modules">
                    {modules.map((module) => (
                        <Module key={module.id} id={module.id} />
                    ))}
                </div>
                <div className="messagesAndOrders">
                    <div className="messages">
                        <Messages />
                    </div>
                    <div className="orders">orders</div>
                </div>
            </main>
            {/* <footer className="footer">
                <Pagination routes={routes}/>
            </footer> */}
        </div>
    );
}

