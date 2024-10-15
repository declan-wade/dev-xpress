"use client";
import React from "react";
import { Layout, Card, List, Typography, Space, Row, Col, Spin } from "antd";
import NewTaskForm from "@/components/NewTaskForm";
import Navbar from "@/components/Navbar";
const { Content } = Layout;

export default function Page() {
  async function handleSubmit() {}

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Navbar pageKey="0" />
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <NewTaskForm />
      </Content>
    </Layout>
  );
}
