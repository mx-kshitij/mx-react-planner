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
}

const defaultEventColor = "#ccc"

export function ReactPlanner({
    eventData,
    eventIdAttr,
    eventStartAttr,
    eventEndAttr,
    eventResourceAttr,
    eventTitleAttr,
    eventColorAttr,
    eventSelection,
    resourceData,
    resourceIdAttr,
    resourceNameAttr
}: ReactPlannerContainerProps): ReactElement {
    const [events, setEvents] = useState<EventItem[]>(eventList);
    const [resources, setResources] = useState<Resource[]>(resourceList);
    const [updateFlag, setUpdateFlag] = useState(0);

    const schedulerDataRef = useRef(
        new SchedulerData(dayjs().format(DATE_FORMAT), ViewType.Week)
    );
    const schedulerData = schedulerDataRef.current;

    schedulerData.setSchedulerLocale('en');
    schedulerData.setCalendarPopoverLocale('en');

    useEffect(() => {
        const newEventList : CustomEventItem[] = [];
        eventData?.items?.forEach(item => {
            newEventList.push({
                id: eventIdAttr.get(item).value?.toString()!,
                start: eventStartAttr.get(item).value?.toString()!,
                end: eventEndAttr.get(item).value?.toString()!,
                resourceId: eventResourceAttr.get(item).value?.toString()!,
                title: eventTitleAttr.get(item).value?.toString()!,
                bgColor: eventColorAttr ? eventColorAttr.get(item).value : defaultEventColor,
                click: () => onItemClick(item)
            });
        });
        setEvents(newEventList);
    }, [eventData]);

    useEffect(() => {
        const newResourceList: Resource[] = [];
        resourceData?.items?.forEach(item => {
            newResourceList.push({
                id: resourceIdAttr.get(item).value?.toString()!,
                name: resourceNameAttr.get(item).value?.toString()!
            });
        });
        setResources(newResourceList);
        schedulerData.setResources(newResourceList);
        setUpdateFlag(f => f + 1);
    }, [resourceData, schedulerData, resourceIdAttr, resourceNameAttr]);

    
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
        eventSelection.setSelection(item);
    }
    
    if (!eventData || eventData.status !== ValueStatus.Available
        || !resourceData || resourceData.status !== ValueStatus.Available) {
        return <div />
    }

    schedulerData.setEvents(events);
    schedulerData.setResources(resources);
    console.debug(`Update flag: ${updateFlag}`);

    return (
        <DndProvider backend={HTML5Backend}>
            <Scheduler
                schedulerData={schedulerData}
                prevClick={prevClick}
                nextClick={nextClick}
                onSelectDate={onSelectDate}
                onViewChange={onViewChange}
                eventItemClick={(_schedulerData: SchedulerData<EventItem>, event: CustomEventItem) => {
                    event.click();
                }}
            />
        </DndProvider>
    );
}