import { TabItem } from "layouts/TabLayout/TabItem";
import { useState, useEffect, useMemo } from "react";

function getTabsWithId(tabs: Omit<TabItem, "id">[]): TabItem[] {
    return tabs.map((element) => {
        return Object.assign(element, { id: crypto.randomUUID() });
    });
}

export function useTabs(
    items: Omit<TabItem, "id">[]
): [typeof tabsWithId, typeof visibleTab, typeof setVisibleTab] {
    const tabsWithId = useMemo(() => {
        return getTabsWithId(items);
    }, [getTabsWithId, items]);

    //FIXME: fails if item length == 0
    const [visibleTab, setVisibleTab] = useState(tabsWithId[0]);

    useEffect(() => {
        setVisibleTab(tabsWithId[0]);
    }, [tabsWithId]);

    return [tabsWithId, visibleTab, setVisibleTab];
}
