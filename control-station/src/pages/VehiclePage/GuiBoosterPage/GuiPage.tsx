import "./GuiPage.scss";
import Module from "../../../components/GuiModules/Module";
import { Messages } from "../Messages/Messages";

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
                </div>
            </main>
        </div>
    );
}

