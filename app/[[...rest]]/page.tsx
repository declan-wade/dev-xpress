"use client";
import React from "react";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Typography,
  Flex,
  Spin,
  Tag,
  Row,
  Col,
  Card,
} from "antd";
const { Header, Content, Footer } = Layout;
import { SignIn } from "@clerk/nextjs";

export default function Home() {
  React.useEffect(() => {}, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundImage: "url('landing.jpg')",
        backgroundSize: "cover",
      }}
    >
      <Header
        style={{ display: "flex", alignItems: "center", background: "#465952" }}
      >
        <p style={{ fontSize: "18px", color: "#ffffff", marginRight: "5px" }}>
          <img
            alt=""
            src="/ea.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
        </p>
        <p style={{ fontSize: "20px", color: "#ffffff", marginRight: "20px" }}>
          DevXpress
        </p>
      </Header>
      <Content>
        <Flex align="center" justify="center" style={{ margin: "50px" }}>
          <SignIn />
        </Flex>
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
        Pedro Szekely.
      </Footer>
    </Layout>
  );
}
