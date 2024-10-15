import React from "react";
import dayjs from "dayjs";

function getTargetDate(data: any) {
  if (data.clockEventnts) {
    // Step 1: Parse startDate
    let targetDate = dayjs(data.startDate).add(data.statDays, "day");

    // Step 2: Calculate the total paused days
    let totalPausedDays = 0;

    data.clockEvents.forEach((event: any) => {
      const pauseDate = dayjs(event.pauseDate);
      const resumeDate = dayjs(event.resumeDate);

      // Calculate the difference in days between pauseDate and resumeDate
      const pausedDuration = resumeDate.diff(pauseDate, "day", true); // 'true' includes partial days as decimals
      totalPausedDays += pausedDuration;
    });

    // Step 3: Add the total paused days to the target date
    targetDate = targetDate.add(totalPausedDays, "day");
    return targetDate.format("D MMMM YYYY");
  } else {
    return dayjs(data.startDate)
      .add(data.statDays, "day")
      .format("D MMMM YYYY");
  }
}

export const TaskColumns: any = [
  {
    title: "ID",
    dataIndex: "internalRef",
    key: "internalRef",
    render: (text: string, record: any) => (
      <a href={`/tasks/${record._id}/`}>{text}</a>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text: string) => <p>{text}</p>,
  },
  {
    title: "Clock State",
    dataIndex: "clockState",
    key: "clockState",
    render: (text: string) => <p>{text}</p>,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (text: string) => <p>{dayjs(text).format("D MMMM YYYY")}</p>,
  },
  {
    title: "Utilised Days",
    dataIndex: "startDate",
    key: "startDate",
    render: (text: string) => <p>{dayjs().diff(text, "days")}</p>,
  },
  {
    title: "Due Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (text: string, record: any) => <p>{getTargetDate(record)}</p>,
  },
  {
    title: "Type",
    dataIndex: "taskType",
    key: "taskType",
    render: (text: string) => <p>{text}</p>,
  },
];

export const ClockEvents: any = [
  {
    title: "Reason",
    dataIndex: "reason",
    key: "reason",
    render: (text: string) => <p>{text}</p>,
  },
  {
    title: "Pause Date",
    dataIndex: "pauseDate",
    key: "pauseDate",
    render: (text: string) => <p>{dayjs(text).format("D MMMM YYYY")}</p>,
  },
  {
    title: "Resume Date",
    dataIndex: "resumeDate",
    key: "resumeDate",
    render: (text: string) =>
      text ? <p>{dayjs(text).format("D MMMM YYYY")}</p> : <p>--</p>,
  },
  {
    title: "Pause Days",
    dataIndex: "pauseDate",
    key: "pauseDate",
    render: (text: string, record: any) =>
      record.resumeDate ? (
        <p>{dayjs(record.resumeDate).diff(text, "days")}</p>
      ) : (
        <p>{dayjs().diff(text, "days")} days elapsed</p>
      ),
  },
];
