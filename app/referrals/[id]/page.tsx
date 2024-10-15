"use client";
import React from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Spin,
  Card,
  Table,
  Button,
  Space,
} from "antd";
import { getReferralById, getEmailLog } from "@/utils/refferalHelper";
import { getActivity } from "@/utils/activityHelper";
import NavBar from "@/components/Navbar";
import dayjs from "dayjs";
import ActivityTable from "@/components/ActivityTable";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const { Content, Footer } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

export default function Home({ params }: any) {
  const [form] = Form.useForm();
  const [data, setData] = React.useState<any>(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [logs, setLogs] = React.useState<any>([]);
  const [signedUrl, setSignedUrl] = React.useState<any>([]);
  const [activity, setActivity] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const handleValuesChange = () => {
    setIsDirty(true);
  };

  const getSignedUrl = async (uid: string) => {
    if (uid) {
      try {
        const response = await fetch(`/api/s3-retrieve?uid=${uid}`);
        const data = await response.json();
        return data.fileUrl;
      } catch (error) {
        console.error("Error fetching signed URL:", error);
        return "";
      }
    } else {
      return "";
    }
  };

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Destination",
      children: data?.destination,
    },
    {
      key: "2",
      label: "Application",
      children: data?.app_ref_friendly,
    },
    {
      key: "3",
      label: "Referral Comment (LGA)",
      children: data?.comment,
    },
    {
      key: "4",
      label: "Referral Attachments (LGA)",
      children: data?.file_url ? (
        <a
          href={`/api/s3-retrieve?uid=${data?.file_url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={async (e) => {
            e.preventDefault(); // Prevent default link behavior
            const response = await fetch(
              `/api/s3-retrieve?uid=${data?.file_url}`,
            );
            const result = await response.json();
            if (result.url) {
              window.open(result.url, "_blank"); // Open the signed URL in a new tab
            } else {
              console.error("Failed to fetch signed URL");
            }
          }}
        >
          Download
        </a>
      ) : (
        "No Attachment"
      ),
    },
    {
      key: "5",
      label: "Requesting Officer",
      children: data?.officer,
    },
    {
      key: "6",
      label: "Status",
      children: data?.status,
    },
    {
      key: "7",
      label: "Send Date",
      children: dayjs(data?.send_date).format("DD MMM YYYY"),
    },
    {
      key: "8",
      label: "Due Date",
      children: dayjs(data?.due_date).format("DD MMM YYYY"),
    },
    {
      key: "9",
      label: `Response Comment`,
      children: data?.responseDetails,
    },
    {
      key: "10",
      label: "Response Files", // "Response Files" should be a string
      children:
        signedUrl.length > 0 ? (
          signedUrl?.map((item: string, index: number) => (
            <div key={index}>
              <a
                key={index}
                href={item}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download {index + 1}⠀
              </a>
            </div>
          ))
        ) : (
          <></>
        ),
    },
    {
      key: "11",
      label: `Response Date`,
      children: data?.responseTime
        ? dayjs(data.responseTime.$d).format("DD MMM YYYY")
        : "No Response Yet",
    },
  ];

  async function handleReferrals() {
    //console.log("getting referral by ref: ", params.id);
    const payload: any = await getReferralById(params.id);
    setData(payload[0]);
    form.setFieldsValue({
      ...payload[0],
      due_date: payload[0].due_date ? dayjs(payload[0].due_date) : null,
      response_date: payload[0].response_date
        ? dayjs(payload[0].response_date)
        : null,
    });
    const response: any = await getEmailLog(await payload[0]?.email_id);
    //console.log(response);
    setLogs(response);
    const response2 = await getActivity(params.id);
    setActivity(response2);
    setIsLoading(false);
    //console.log({ payload });
    //console.log({ response });
    //console.log({ response2 });
  }

  React.useEffect(() => {
    handleReferrals();
  }, []);

  React.useEffect(() => {
    async function fetchSignedUrls() {
      if (Array.isArray(data?.responseFiles) && data.responseFiles.length > 0) {
        // Map over the responseFiles array to get signed URLs for each file
        const urls = await Promise.all(
          data.responseFiles.map((file: any) => getSignedUrl(file)),
        );
        setSignedUrl(urls);
      }
    }
    fetchSignedUrls();
  }, [data?.responseFiles]);

  React.useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Response",
      dataIndex: "activity",
      key: "activity",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text: any) => {
        const date = dayjs(text.$d);
        return date.format("DD MMM YYYY HH:mm:ss");
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Spin tip="Loading..." spinning={isLoading} fullscreen />
      <NavBar pageKey="0" />
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Title level={3}>Referral</Title>
        <Card>
          {form.getFieldsValue.length > 1 ? (
            <Descriptions items={items} />
          ) : (
            <></>
          )}
        </Card>
        <br />

        <Title level={4}>Email Log</Title>
        <Card>
          <Table
            columns={columns}
            dataSource={logs}
            rowKey="_id"
            size="small"
          />
        </Card>
        <br />
        <ActivityTable activity={activity} />
        <br />
        <br />
        <br />
      </Content>
      <Footer
        style={{
          textAlign: "left",
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        <Button type="primary" disabled={!isDirty}>
          Save Changes
        </Button>
      </Footer>
    </Layout>
  );
}
