"use client";
import React from "react";
import { Layout, Typography, Table, Button, Space, Tag, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getReferrals } from "../../utils/refferalHelper";
import NavBar from "@/components/Navbar";
import dayjs from "dayjs";
import { useUser } from "@clerk/nextjs";
import SiteFooter from "@/components/Footer";

const { Content } = Layout;
const { Title } = Typography;

export default function Referrals() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string>("");
  const [list, setList] = React.useState<any>([]);
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  async function handleUser() {
    setUserId(`${user?.id}`);
  }

  async function handleReferrals() {
    const payload = await getReferrals(userId);
    setList(payload);
    //console.log({ payload });
    setIsLoading(false);
  }

  React.useEffect(() => {
    handleUser();
  }, [isLoaded]);

  React.useEffect(() => {
    if (user) {
      console.log({ userId });
      handleReferrals();
    }
  }, [userId]);

  const columns: any = [
    {
      title: "DA Ref",
      dataIndex: "app_ref_friendly",
      key: "app_ref_friendly",
      showSorterTooltip: { target: "full-header" },
      sorter: (a: any, b: any) =>
        a.app_ref_friendly.localeCompare(b.app_ref_friendly),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Attachments",
      dataIndex: "responseFiles",
      key: "responseFiles",
      render: (item: any) => item?.length,
    },
    {
      title: "Sent Date",
      dataIndex: "send_date",
      key: "send_date",
      showSorterTooltip: { target: "full-header" },
      sorter: (a: any, b: any) => {
        const dateA = dayjs(a.send_date);
        const dateB = dayjs(b.send_date);
        return dateA.valueOf() - dateB.valueOf();
      },
      sortDirections: ["ascend", "descend"],
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Utilised Days",
      key: "utilised_days",
      render: (_: any, record: any) => dayjs().diff(record.send_date, "days"),
      defaultSortOrder: "descend",
      sorter: (a: any, b: any) =>
        dayjs().diff(a.send_date, "days") - dayjs().diff(b.send_date, "days"),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      showSorterTooltip: { target: "full-header" },
      sorter: (a: any, b: any) => {
        const dateA = dayjs(a.due_date);
        const dateB = dayjs(b.due_date);
        return dateA.valueOf() - dateB.valueOf();
      },
      sortDirections: ["ascend", "descend"],
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Bounced",
          value: "Bounced",
        },
        {
          text: "Awaiting response",
          value: "Awaiting response",
        },
        {
          text: "Draft response",
          value: "Draft response",
        },
        {
          text: "Response complete",
          value: "Response complete",
        },
      ],
      onFilter: (value: any, record: any) =>
        record.status.indexOf(value as string) === 0,
      showSorterTooltip: { target: "full-header" },
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
      render: (text: string) => <StatusBadge status={text} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button onClick={() => router.push(`/referrals/${record._id}`)}>
          View
        </Button>
      ),
    },
  ];

  const StatusBadge = ({ status }: any) => {
    let badgeVariant;
    switch (status) {
      case "Email Bounced":
        badgeVariant = "red";
        break;
      case "Awaiting response":
      case "Awaiting response":
        badgeVariant = "blue";
        break;
      case "Draft response":
        badgeVariant = "yellow";
        break;
      case "Response complete":
        badgeVariant = "green";
        break;
      default:
        badgeVariant = "default"; // Optional: default variant for unexpected status values
    }

    return <Tag color={badgeVariant}>{status}</Tag>;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavBar pageKey="3" />
      <Spin tip="Loading..." spinning={isLoading} fullscreen />
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Space
            align="center"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <Title level={3}>My Referrals</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/referrals/new")}
            >
              Create New
            </Button>
          </Space>
          <Table
            columns={columns}
            dataSource={list}
            rowKey="_id"
            size="small"
          />
        </Space>
      </Content>
      <SiteFooter />
    </Layout>
  );
}
