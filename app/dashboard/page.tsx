"use client";
import React from "react";
import { Layout, Card, List, Typography, Space, Row, Col, Spin } from "antd";
import { useUser } from "@clerk/nextjs";
import { getTasks } from "@/utils/taskHelper";
import Navbar from "@/components/Navbar";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
  const [list, setList] = React.useState<any>([]);
  const [assessCount, setAssessCount] = React.useState<any>(null);
  const [referralCount, setReferralCount] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { user, isLoaded } = useUser();

  async function handleAssessments() {
    if (user?.id) {
      const payload = await getTasks(user.id);
      setList(payload);
      console.log({ payload });
    }
  }

  async function handleCounts() {
    if (user?.id) {
      //const payload = await getReferralsNum(user.id);
      //setReferralCount(payload);
      //const payload2 = await getAssessNum(user.id);
      //setAssessCount(payload2);
      //setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (isLoaded) {
      handleAssessments();
    }
  }, [isLoaded]);

  const assessData = [
    {
      title: "Applications Due Next 7 Days",
      value: 0,
    },
    { title: "Overdue Applications", value: 0 },
    { title: "Total Applications", value: list?.length },
  ];

  const referralData = [
    {
      title: "Applications Due Next 7 Days",
      value: 0,
    },
    { title: "Draft Responses", value: 0 },
    { title: "Recieved Responses", value: 0 },
    { title: "Total Referrals", value: 0 },
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundImage: "url('dashboard.jpg')",
        backgroundSize: "cover",
      }}
    >
      <Spin tip="Loading..." spinning={isLoading} fullscreen />
      <Navbar pageKey="1" />
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Row>
          <Col>
            <Card
              title="My Tasks"
              style={{ width: 300, margin: "16px 0" }}
              extra={<a href="/tasks">View</a>}
            >
              <List
                dataSource={assessData}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <Text>{item.title}:</Text>
                      <Text strong>{item.value}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Card
            title="My Referrals"
            style={{ width: 300, margin: "16px 0 0 16px" }}
            // extra={<a href="/referrals">View</a>}
          >
            <List
              dataSource={referralData}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    <Text>{item.title}:</Text>
                    <Text strong>{item.value}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Row>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          color: "#ffff",
          background: "rgba(128, 128, 128, 0.3)",
        }}
      >
        DevXpress © {new Date().getFullYear()} Codex Group WA. All Rights
        Reserved. Background image licensed under Creative Commons - Courtesy of
        Stefan Jürgensen.
      </Footer>
    </Layout>
  );
}
