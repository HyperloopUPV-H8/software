import { OrderDescription, OrderFieldDescription } from "common";
import { useState, useEffect } from "react";
import { fetchFromBackend } from "common";
import { config } from "common";

export function useOrderDescriptions() {
    const [orderDescriptions, setOrderDescriptions] = useState<
        Record<string, OrderDescription>
    >({});

    useEffect(() => {
        const controller = new AbortController();

        fetchFromBackend(config.paths.orderDescription, controller.signal)
            .then((res) => {
                return res.json();
            })
            .then((descriptions: Record<string, OrderDescription>) => {
                setOrderDescriptions(getCorrectDescriptions(descriptions));
            })
            .catch((reason) => console.error(reason));

        return () => {
            controller.abort();
        };
    }, []);

    return orderDescriptions;
}
function getCorrectDescriptions(
    descriptions: Record<string, OrderDescription>
): Record<string, OrderDescription> {
    return Object.fromEntries(
        Object.entries(descriptions).map(([name, description]) => {
            return [name, getDescriptionWithCorrectRange(description)];
        })
    );
}

function getDescriptionWithCorrectRange(
    description: OrderDescription
): OrderDescription {
    return { ...description, fields: getCorrectFields(description.fields) };
}

function getCorrectFields(
    fields: Record<string, OrderFieldDescription>
): Record<string, OrderFieldDescription> {
    return Object.fromEntries(
        Object.entries(fields).map(([name, field]) => {
            return [name, getCorrectField(field)];
        })
    );
}

function getCorrectField(field: OrderFieldDescription): OrderFieldDescription {
    if (field.valueDescription.kind == "numeric") {
        return {
            name: field.name,
            valueDescription: {
                ...field.valueDescription,
            },
        };
    } else {
        return field;
    }
}
