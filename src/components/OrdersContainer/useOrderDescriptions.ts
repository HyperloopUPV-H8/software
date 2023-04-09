import { OrderDescription } from "adapters/Order";
import { useState, useEffect } from "react";
import { fetchFromBackend } from "services/HTTPHandler";

export function useOrderDescriptions() {
    const [orderDescriptions, setOrderDescriptions] = useState<
        Record<string, OrderDescription>
    >({});

    useEffect(() => {
        fetchFromBackend(import.meta.env.VITE_ORDER_DESCRIPTIONS_PATH)
            .then((res) => {
                return res.json();
            })
            .then((descriptions: Record<string, OrderDescription>) => {
                setOrderDescriptions(descriptions);
            })
            .catch((reason) => console.error(reason));
    }, []);

    return orderDescriptions;
}
