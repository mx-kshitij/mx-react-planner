/**
 * This file was generated from ReactPlanner.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ListValue, ListAttributeValue, SelectionSingleValue } from "mendix";
import { Big } from "big.js";

export interface ReactPlannerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    eventData: ListValue;
    eventIdAttr: ListAttributeValue<string | Big>;
    eventStartAttr: ListAttributeValue<Date>;
    eventEndAttr: ListAttributeValue<Date>;
    eventResourceAttr: ListAttributeValue<string | Big>;
    eventTitleAttr: ListAttributeValue<string>;
    eventColorAttr?: ListAttributeValue<string>;
    eventSelection: SelectionSingleValue;
    resourceData: ListValue;
    resourceIdAttr: ListAttributeValue<string | Big>;
    resourceNameAttr: ListAttributeValue<string>;
}

export interface ReactPlannerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    eventData: {} | { caption: string } | { type: string } | null;
    eventIdAttr: string;
    eventStartAttr: string;
    eventEndAttr: string;
    eventResourceAttr: string;
    eventTitleAttr: string;
    eventColorAttr: string;
    eventSelection: "Single";
    onEventSelection: {} | null;
    resourceData: {} | { caption: string } | { type: string } | null;
    resourceIdAttr: string;
    resourceNameAttr: string;
}
