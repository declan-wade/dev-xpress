import React from "react";
import { Typography, Table, Card } from "antd";
import dayjs from "dayjs";
const { Title } = Typography;
import { createStyles } from "antd-style";

export default function ActivityTable({ activity }: any) {
  const useStyle = createStyles(({ css, token }) => {
    const { antCls }: any = token;
    return {
      customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: unset;
            }
          }
        }
      `,
    };
  });
  const { styles } = useStyle();
  const columns: any = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      showSorterTooltip: { target: "full-header" },
      sorter: (a: any, b: any) => a.activity.localeCompare(b.activity),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      showSorterTooltip: { target: "full-header" },
      sorter: (a: any, b: any) => a.username.localeCompare(b.username),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      showSorterTooltip: { target: "full-header" },
      sorter: (a: any, b: any) => {
        const dateA = dayjs(a.timestamp.$d);
        const dateB = dayjs(b.timestamp.$d);
        return dateA.valueOf() - dateB.valueOf();
      },
      sortDirections: ["ascend", "descend"],
      render: (text: any) => {
        const date = dayjs(text.$d);
        return date.format("DD MMM YYYY HH:mm:ss");
      },
    },
  ];

  return (
    <>
      <Title level={4}>Activity Log</Title>
      <Card>
        <Table
          columns={columns}
          className={styles.customTable}
          rowKey="_id"
          dataSource={activity}
          size="small"
          scroll={{ y: 55 * 5 }}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      </Card>
    </>
  );
}
