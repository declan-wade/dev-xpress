"use client";
import React from "react";
import {
  Layout,
  Spin,
  Table,
  Descriptions,
  Card,
  Button,
  Flex,
  Modal,
  Select,
  DatePicker,
  Tag,
  Typography,
} from "antd";
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { getTask, updateTask } from "@/utils/taskHelper";
import { ClockEvents } from "@/consts/Columns";
import dayjs from "dayjs";
const { Content } = Layout;
import {
  UserSwitchOutlined,
  SendOutlined,
  FieldTimeOutlined,
  SwapOutlined,
  FileWordOutlined,
  FilePdfOutlined,
  EditOutlined,
  WarningOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

export default function Page({ params }: any) {
  const { user, isLoaded } = useUser();
  const [data, setData] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [pauseDate, setPauseDate] = React.useState(dayjs());
  const [resumeDate, setResumeDate] = React.useState(dayjs());
  const { Title } = Typography;

  async function handleFetch() {
    console.log(params.id);
    const response = await getTask(params.id);
    console.log(response);
    setData(response);
  }

  async function handlePauseClock() {
    const payload = {
      clockState: "Paused",
      clockEvents: [
        ...(data?.clockEvents || []), // Spread existing clockEvents if present, or use an empty array if it's undefined
        { reason: reason, pauseDate: pauseDate, resumeDate: "" }, // Append the new clock event
      ],
    };
    updateTask(params.id, payload);
    handleFetch();
    setOpen(false);
  }

  async function handleResumeClock() {
    const offset = data.clockEvents.length - 1;
    data.clockEvents[offset].resumeDate = resumeDate;
    const payload = {
      clockState: "Running",
      clockEvents: data.clockEvents,
    };
    const response = await updateTask(params.id, payload);
    console.log(response);
    handleFetch();
    setOpen2(false);
  }

  // const props: UploadProps = {
  //   name: "file",
  //   action: "/api/s3-upload",
  //   multiple: true, // Enable multiple file uploads
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === "done") {
  //       console.log(info);
  //       message.success(`${info.file.name} file uploaded successfully`);
  //       setResponseFiles(prevFiles => [...prevFiles, info.file.response.fileName]);
  //     } else if (info.file.status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  React.useEffect(() => {
    if (isLoaded) {
      handleFetch();
    }
  }, [user]);

  const pauseReasonPlanning = [
    { value: "Clause 65A Planners RFI", label: "Clause 65A Planner RFI" },
    { value: "Clause 63A Admin RFI", label: "Clause 63A Admin RFI" },
  ];

  const pauseReasonBuilding = [
    { value: "Section 18 RFI", label: "Section 18 RFI" },
  ];

  const items = [
    {
      key: "1",
      label: "Reference",
      children: <p>{data?.internalRef}</p>,
    },
    {
      key: "2",
      label: "Property",
      children: <p>{data?.property}</p>,
    },
    {
      key: "3",
      label: "Type",
      children: <p>{data?.taskType}</p>,
    },
    {
      key: "4",
      label: "Statutory Days",
      children: <p>{data?.statDays}</p>,
    },
    {
      key: "5",
      label: "Clock",
      children:
        data?.clockState === "Running" ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            {data?.clockState}
          </Tag>
        ) : (
          <Tag icon={<ClockCircleOutlined />} color="default">
            {data?.clockState}
          </Tag>
        ),
    },
    {
      key: "6",
      label: "Start Date",
      children: <p>{dayjs(data?.startDate).format("D MMMM YYYY")}</p>,
    },
    {
      key: "7",
      label: "Utilised Days",
      children: <p>{dayjs().diff(data?.startDate, "days")}</p>,
    },
    {
      key: "8",
      label: "Target Date",
      children: <p>{getTargetDate()}</p>,
    },
  ];

  function getTargetDate() {
    if (data) {
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
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Navbar pageKey="0" />
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Card>
          <Descriptions title="Summary" items={items} />
        </Card>
        <br />
        <Modal
          title="Pause Clock"
          open={open}
          onOk={() => handlePauseClock()}
          onCancel={() => setOpen(false)}
        >
          <>
            <p>Reason for Clock Pause</p>
            {data ? (
              data.taskType.includes("BA") ? (
                <Select
                  onSelect={(e) => setReason(e)}
                  options={pauseReasonBuilding}
                  style={{ width: "300px" }}
                />
              ) : (
                <Select
                  onSelect={(e) => setReason(e)}
                  options={pauseReasonPlanning}
                  style={{ width: "300px" }}
                />
              )
            ) : (
              <></>
            )}
            <br />
            <br />

            <p>Paused Date</p>
            <DatePicker
              format="DD MMMM YYYY"
              defaultValue={dayjs()}
              onChange={(e) => setPauseDate(e)}
            />
          </>
        </Modal>
        <Modal
          title="Resume Clock"
          open={open2}
          onOk={() => handleResumeClock()}
          onCancel={() => setOpen2(false)}
        >
          <>
            <p>Resume Date</p>
            <DatePicker
              format="DD MMMM YYYY"
              defaultValue={dayjs()}
              onChange={(e) => setResumeDate(e)}
            />
          </>
        </Modal>
        <Card>
          <Flex>
            <Button type="text" icon={<UserSwitchOutlined />} disabled>
              Ready for Review
            </Button>
            <Button type="text" icon={<SendOutlined />} disabled>
              Send Referral
            </Button>
            {data?.clockState === "Running" ? (
              <Button
                type="text"
                onClick={() => setOpen(true)}
                icon={<FieldTimeOutlined />}
              >
                Pause Clock
              </Button>
            ) : (
              <Button
                type="text"
                onClick={() => setOpen2(true)}
                icon={<FieldTimeOutlined />}
              >
                Resume Clock
              </Button>
            )}
            <Button type="text" icon={<EditOutlined />} disabled>
              Edit Application
            </Button>
            <Button type="text" icon={<SwapOutlined />} disabled>
              Reallocate
            </Button>
            <Button type="text" icon={<FilePdfOutlined />} disabled>
              Generate PDF
            </Button>
            <Button type="text" icon={<FileWordOutlined />} disabled>
              Generate DOCX
            </Button>
          </Flex>
        </Card>
        <br />
        <Title level={4}>Clock Events</Title>
        <br />
        <Card>
          <Table
            columns={ClockEvents}
            dataSource={data?.clockEvents}
            rowKey="_id"
          />
        </Card>
      </Content>
    </Layout>
  );
}
