"use client";
import React, { Suspense } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Upload,
  Spin,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUser } from "@clerk/nextjs";
import NavBar from "@/components/Navbar";
import dayjs from "dayjs";
import { createReferral } from "@/utils/refferalHelper";
import { getTasks } from "@/utils/taskHelper";
import ID from "./id";
import { v4 as uuidv4 } from "uuid";
import type { UploadProps } from "antd";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function New() {
  const [form] = Form.useForm();
  const [myUser, setUser] = React.useState<string>("");
  const [org, setOrg] = React.useState<any>("");
  const [userId, setUserId] = React.useState<string>("");
  const [list, setList] = React.useState<any>([]);
  const [search, setSearch] = React.useState<any>();
  const uniqueFileName = uuidv4();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const initialFormData = {
    _id: CreateShortUUID(),
    app_ref: search,
    app_ref_friendly: "",
    user_id: `${user?.id}`,
    send_date: dayjs().format("YYYY-MM-DD"),
    destination: "",
    due_date: dayjs().add(30, "days"),
    due_date_offset: 0,
    comment: "",
    status: "Awaiting response",
    officer: `${user?.firstName} ${user?.lastName}`,
    org: org,
    pin: createPin().toUpperCase(),
  };

  React.useEffect(() => {
    form.setFieldsValue(initialFormData);
  }, [form, initialFormData]);

  const handleSearchChange = (e: any) => setSearch(e);

  const props: UploadProps = {
    name: "file",
    action: "/api/s3-upload",
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      if (
        values.file_url &&
        values.file_url.file &&
        values.file_url.file.response
      ) {
        values.file_url = values.file_url.file.response.fileName;
      } else {
        values.file_url = null;
      }
      console.log(values);
      const outcome = await createReferral(values);
      console.log(outcome);
      message.success("Referral created successfully");
      window.location.replace(`/referrals/`);
    } catch (errorInfo) {
      setIsLoading(false);
      console.log("Failed:", errorInfo);
      message.error("Failed to create referral");
    }
  };

  async function handleUser() {
    setUser(`${user?.firstName} ${user?.lastName}`);
    setUserId(`${user?.id}`);
  }

  async function handleOrg() {
    if (!org) {
      const response = await user?.getOrganizationMemberships();
      if (response && response.data.length > 0) {
        const organizationName = response.data[0].organization.name;
        setOrg(organizationName);
      }
    }
  }

  function createPin() {
    return "xxxxxx".replace(/x/g, () =>
      ((Math.random() * 16) | 0).toString(16),
    );
  }

  function CreateShortUUID() {
    return "xxxxxxxxxxxxxxxx".replace(/x/g, () =>
      ((Math.random() * 16) | 0).toString(16),
    );
  }

  async function handleAssessments() {
    const payload = await getTasks(userId);
    setList(payload);
    console.log({ payload });
  }

  React.useEffect(() => {
    handleUser();
    handleOrg();
  }, [isLoaded]);

  React.useEffect(() => {
    if (isLoaded) {
      handleAssessments();
    }
  }, [userId, org, isLoaded]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Spin tip="Loading..." spinning={isLoading} fullscreen />
      <NavBar pageKey="0" />
      <Content style={{ padding: "0 50px" }}>
        <Title level={3} style={{ margin: "16px 0" }}>
          New Referral
        </Title>
        <Suspense fallback={<div>Loading...</div>}>
          <ID handler={handleSearchChange} />
        </Suspense>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 600 }}
          onFinish={handleCreate}
          initialValues={initialFormData}
        >
          <Form.Item hidden name="_id" />
          <Form.Item hidden name="app_ref_friendly" />
          <Form.Item hidden name="user_id" />
          <Form.Item hidden name="send_date" />
          <Form.Item hidden name="status" />
          <Form.Item hidden name="pin" />

          <Form.Item
            name="destination"
            label="Destination"
            rules={[{ required: true, message: "Please input a destination!" }]}
          >
            <Input placeholder="example@example.com" />
          </Form.Item>
          <Form.Item name="org" label="Originator" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="officer"
            label="Contact Officer"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="app_ref"
            label="Application"
            rules={[
              { required: true, message: "Please choose an application!" },
            ]}
          >
            <Select
              placeholder="Select..."
              onChange={(value, option: any) =>
                form.setFieldsValue({
                  app_ref: value,
                  app_ref_friendly: option.children,
                })
              }
            >
              {list.map((item: any) => (
                <Option key={item._id} value={item._id}>
                  {item.internalRef}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="comment" label="Comment / Request Details">
            <Input.TextArea placeholder="Comment / Request Details" />
          </Form.Item>
          <Form.Item name="file_url" label="File">
            <Upload {...props} data={{ fileName: uniqueFileName }}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="due_date" label="Due Date">
            <DatePicker
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                form.setFieldsValue({ due_date: date })
              }
            />
          </Form.Item>
          <Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
