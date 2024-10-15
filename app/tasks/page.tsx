"use client";
import React from "react";
import { Layout, Spin, Table, Typography, Button } from "antd";
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { getTasks } from "@/utils/taskHelper";
import { TaskColumns } from "@/consts/Columns";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
const { Content } = Layout;
const { Title } = Typography;

export default function Page() {
  const { user, isLoaded } = useUser();
  const [data, setData] = React.useState<any>([]);

  async function handleFetch() {
    const response = await getTasks(user?.id);
    setData(response);
  }

  React.useEffect(() => {
    if (isLoaded) {
      handleFetch();
    }
  }, [user]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Navbar pageKey="2" />
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Title level={3}>My Tasks</Title>
        <Button
          type="primary"
          onClick={() => window.location.assign("/tasks/new")}
          style={{ marginBottom: "15px" }}
        >
          Add
        </Button>
        <Table columns={TaskColumns} rowKey="_id" dataSource={data} />
      </Content>
    </Layout>
  );
}
