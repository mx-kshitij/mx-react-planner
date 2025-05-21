import { ReactElement, createElement, useEffect, useRef, useState } from "react";
import { Scheduler, SchedulerData, ViewType, DATE_FORMAT, View, EventItem, Resource } from "react-big-schedule";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import dayjs from "dayjs";
import "react-big-schedule/dist/css/style.css";
import "./ui/ReactPlanner.css";
import { ObjectItem, ValueStatus } from "mendix";
import { ReactPlannerContainerProps } from "typings/ReactPlannerProps";

const resourceList = [
    { id: 'r0', name: 'Resource0', groupOnly: true },
    { id: 'r1', name: 'Resource1' },
    { id: 'r2', name: 'Resource2', parentId: 'r0' },
    { id: 'r3', name: 'Resource3', parentId: 'r4' },
    { id: 'r4', name: 'Resource4', parentId: 'r2' },
];

const eventList = [
    {
        id: 1,
        start: '2025-06-20 09:30:00',
        end: '2025-06-20 13:30:00',
        resourceId: 'r1',
        title: 'I am finished',
        bgColor: '#D9D9D9',
    },
    {
        id: 2,
        start: '2022-12-18 12:30:00',
        end: '2022-12-26 23:30:00',
        resourceId: 'r2',
        title: 'I am not resizable',
        resizable: false,
    },
    {
        id: 3,
        start: '2022-12-19 12:30:00',
        end: '2022-12-20 23:30:00',
        resourceId: 'r3',
        title: 'I am not movable',
        movable: false,
    },
    {
        id: 4,
        start: '2022-12-19 14:30:00',
        end: '2022-12-20 23:30:00',
        resourceId: 'r1',
        title: 'I am not start-resizable',
        startResizable: false,
    },
    {
        id: 5,
        start: '2022-12-19 15:30:00',
        end: '2022-12-20 23:30:00',
        resourceId: 'r2',
        title: 'R2 has recurring tasks every week on Tuesday, Friday',
        rrule: 'FREQ=WEEKLY;DTSTART=20221219T013000Z;BYDAY=TU,FR',
        bgColor: '#f759ab',
    },
]

interface CustomEventItem extends EventItem {
    click: () => void;
    item: ObjectItem;
}

const defaultEventColor = "#ccc"

export function ReactPlanner(props: ReactPlannerContainerProps): ReactElement {
    const [events, setEvents] = useState<EventItem[]>(eventList);
    const [resources, setResources] = useState<Resource[]>(resourceList);
    const [updateFlag, setUpdateFlag] = useState(0);

    const schedulerDataRef = useRef(
        new SchedulerData(dayjs().format(DATE_FORMAT), ViewType.Week)
    );
    const schedulerData = schedulerDataRef.current;

    schedulerData.setSchedulerLocale('en');
    schedulerData.setCalendarPopoverLocale('en');
    schedulerData.config.schedulerWidth = '95%';

    useEffect(() => {
        const newEventList: CustomEventItem[] = [];
        props.eventData?.items?.forEach(item => {
            newEventList.push({
                id: props.eventIdAttr.get(item).value?.toString()!,
                start: props.eventStartAttr.get(item).value?.toString()!,
                end: props.eventEndAttr.get(item).value?.toString()!,
                resourceId: props.eventResourceAttr.get(item).value?.toString()!,
                title: props.eventTitleAttr.get(item).value?.toString()!,
                bgColor: props.eventColorAttr ? props.eventColorAttr.get(item).value : defaultEventColor,
                click: () => onItemClick(item),
                item: item
            });
        });
        setEvents(newEventList);
    }, [props.eventData]);

    useEffect(() => {
        const newResourceList: Resource[] = [];
        props.resourceData?.items?.forEach(item => {
            newResourceList.push({
                id: props.resourceIdAttr.get(item).value?.toString()!,
                name: props.resourceNameAttr.get(item).value?.toString()!
            });
        });
        setResources(newResourceList);
        schedulerData.setResources(newResourceList);
        setUpdateFlag(f => f + 1);
    }, [props.resourceData, schedulerData, props.resourceIdAttr, props.resourceNameAttr]);


    const prevClick = () => {
        schedulerData.prev();
        schedulerData.setEvents(events);
        setUpdateFlag(f => f + 1);
    };

    const nextClick = () => {
        schedulerData.next();
        schedulerData.setEvents(events);
        setUpdateFlag(f => f + 1);
    };

    const onSelectDate = (_schedulerData: SchedulerData, date: string) => {
        schedulerData.setDate(date);
        setUpdateFlag(f => f + 1);
    };

    const onViewChange = (_schedulerData: SchedulerData, view: View) => {
        schedulerData.setViewType(view.viewType);
        setUpdateFlag(f => f + 1);
    };

    const onItemClick = (item: ObjectItem) => {
        props.eventSelection.setSelection(item);
        if (props.onEventSelection)
            props.onEventSelection?.execute();
    }

    const onNewEvent = (resourceId: string, start: string, end: string) => {
        props.newEventResourceId.setValue(resourceId);
        props.newEventStart.setValue(new Date(start));
        props.newEventEnd.setValue(new Date(end));
        if (props.newEventAction)
            props.newEventAction.execute()
    }

    if (!props.eventData || props.eventData.status !== ValueStatus.Available
        || !props.resourceData || props.resourceData.status !== ValueStatus.Available) {
        return <div />
    }

    schedulerData.setEvents(events);
    schedulerData.setResources(resources);
    console.debug(`Update flag: ${updateFlag}`);

    return (
        <div className="react-planner">
            <DndProvider backend={HTML5Backend}>
                <Scheduler
                    schedulerData={schedulerData}
                    // parentRef={parentRef}
                    prevClick={prevClick}
                    nextClick={nextClick}
                    onSelectDate={onSelectDate}
                    onViewChange={onViewChange}
                    eventItemClick={(_schedulerData: SchedulerData<EventItem>, event: CustomEventItem) => {
                        event.click();
                    }}
                    newEvent={(_, slotId, __, start, end) => { onNewEvent(slotId, start, end) }}
                    eventItemPopoverTemplateResolver={(_schedulerData: SchedulerData, event: CustomEventItem) => {
                        return (<div>{props.popoverContent?.get(event.item)}</div>);
                    }}
                    toggleExpandFunc={(_schedulerData: SchedulerData<EventItem>, slotId: string) => {
                        schedulerData.toggleExpandStatus(slotId);
                        setUpdateFlag(f => f + 1);
                    }}
                />
            </DndProvider>
        </div>
    );
}