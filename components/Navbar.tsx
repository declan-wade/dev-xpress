"use client";
import React from "react";
import { Badge, Layout, Menu, Alert } from "antd";
const { Header } = Layout;
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar({ pageKey }: { pageKey: string }) {
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  const [org, setOrg] = React.useState("");
  const [userPerms, setUserPerms] = React.useState<any>({});
  const { user, isLoaded } = useUser();

  const items = [
    {
      key: 1,
      label: <a href="/dashboard">Dashboard</a>,
    },
    {
      key: 2,
      label: <a href="/tasks">My Tasks </a>,
    },
    {
      key: 3,
      label: <a href="/referrals">My Referrals </a>,
    },
    // {
    //   key: 3,
    //   label: <a href="/referrals">Referrals</a>,
    // },
    // {
    //   key: 4,
    //   label: <a href="/reviews">My Reviews</a>,
    // },
    // {
    //   key: 5,
    //   label: <a href="/manager">Management</a>,
    // },
    // {
    //   key: 6,
    //   label: <a href="/reports">Reports</a>,
    // },
  ];

  // Filter the items array based on the position
  const filteredItems = items.filter((item) => {
    if (userPerms.position === "officer") {
      // Hide items 4, 5, and 6 for officers
      return item.key !== 4 && item.key !== 5 && item.key !== 6;
    } else if (userPerms.position === "senior") {
      // Hide items 5 and 6 for seniors
      return item.key !== 5 && item.key !== 6;
    }
    // Show all items by default for other positions
    return true;
  });

  async function handleGetUser() {
    const metadata = user?.publicMetadata;
    if (metadata) {
      setUserPerms(metadata);
      console.log(metadata);
      localStorage.setItem("userPerms", JSON.stringify(metadata)); // Cache userPerms
    }
  }

  async function handleOrg() {
    if (!org) {
      const response = await user?.getOrganizationMemberships();
      if (response && response.data.length > 0) {
        const organizationName = response.data[0].organization.name;
        setOrg(organizationName);
        localStorage.setItem("org", organizationName); // Cache org name
      }
    }
  }

  React.useEffect(() => {
    if (user) {
      handleGetUser();
      handleOrg();
    }
  }, [isLoaded, user]);

  return (
    <>
      {devMode && <Alert message="PREVIEW ENVIRONMENT" banner />}
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
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pageKey]}
          items={filteredItems}
          style={{ flex: 1, minWidth: 0, background: "#465952" }}
        />
        {user ? (
          <p style={{ color: "#ffffff", marginRight: "10px" }}>
            Hello, {user?.firstName} ({org})
          </p>
        ) : (
          <SignInButton />
        )}
        <UserButton />
      </Header>
    </>
  );
}
