import { ReactElement, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { ReactPlannerPreviewProps } from "../typings/ReactPlannerProps";

export function preview({ sampleText }: ReactPlannerPreviewProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText} />;
}

export function getPreviewCss(): string {
    return require("./ui/ReactPlanner.css");
}
