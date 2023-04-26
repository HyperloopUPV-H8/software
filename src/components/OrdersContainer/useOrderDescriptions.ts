import { OrderDescription } from "common";
import { useState, useEffect } from "react";
import { fetchFromBackend } from "services/fetch";

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
