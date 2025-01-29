import React from "react";
import "./Module.scss";

interface ModuleProps {
    id: string | number;
}
const Module: React.FC<ModuleProps> = ({ id }) => {
    const cells = Array.from({ length: 48 }, (_, index) => (
        <div key={index} className="cell"></div>
    ));

    return (
        <div className="box1">
            <div className="box2">
                <article className="title">
                    <h2 className="h2">Module {id}</h2>
                </article>
                <div className="box3">
                    <div className="voltaje">
                        <h3 className="h3">Voltaje</h3>
                        <p className="p">max </p>
                        <p className="p">min </p>
                        <p className="p">mean </p>
                    </div>
                    <div className="intensity">
                        <h3 className="h3">Intensity</h3>
                        <p className="p">max </p>
                        <p className="p">min </p>
                    </div>
                </div>
            </div>
            <div className="flexCells">{cells}</div>
        </div>
    );
};

export default Module;
