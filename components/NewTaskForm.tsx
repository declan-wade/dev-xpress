"use client";
import React from "react";
import {
  Badge,
  Radio,
  Menu,
  Alert,
  Form,
  Select,
  Input,
  Button,
  DatePicker,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import { useUser } from "@clerk/nextjs";
import { getMembers } from "@/utils/orgHelper";
import { createTask } from "@/utils/taskHelper";
const { TextArea } = Input;
const { Title } = Typography;

export default function NewTaskForm() {
  const [form] = Form.useForm();
  const [type, setType] = React.useState(0);
  const [userList, setUserList] = React.useState<any>([]);
  const { user } = useUser();

  const planningTypes = [
    { value: "Development Application", label: "Development Application" },
    { value: "DTC Check", label: "DTC Check" },
    { value: "Planning Advice", label: "Planning Advice" },
    { value: "DAP", label: "DAP" },
    { value: "DRP", label: "DRP" },
  ];

  const buildingTypes = [
    { value: "BA1", label: "BA1" },
    { value: "BA2", label: "BA2" },
    { value: "BA5", label: "BA5" },
    { value: "BA8", label: "BA8" },
    { value: "BA9", label: "BA9" },
    { value: "BA20A", label: "BA20A" },
  ];

  const statDaysPlanning = [
    { value: 60, label: "60 days" },
    { value: 90, label: "90 days" },
  ];

  const statDaysBuilding = [
    { value: 10, label: "10 days" },
    { value: 25, label: "25 days" },
  ];

  const planningStatus = [
    { value: "Admin Check", label: "Admin Check" },
    { value: "Assessment In Progress", label: "Assessment In Progress" },
    { value: "Awaiting RFI", label: "Awaiting RFI" },
    {
      value: "Awaiting Internal Referrals",
      label: "Awaiting Internal Referrals",
    },
    {
      value: "Awaiting External Referrals",
      label: "Awaiting External Referrals",
    },
    { value: "Review In Progress", label: "Review In Progress" },
  ];

  async function handleSubmit(data: any) {
    console.log(data);
    const response = await createTask(
      data,
      `${user?.firstName} ${user?.lastName}`,
    );
    window.location.assign("/tasks");
  }

  async function handleOrg() {
    const response = await user?.getOrganizationMemberships();
    if (response) {
      console.log(response);
      form.setFieldValue("org", response.data[0].organization.name);
      const response2 = await getMembers(response.data[0].organization.id);
      setUserList(JSON.parse(response2));
    }
  }

  React.useEffect(() => {
    handleOrg();
  }, [user]);

  return (
    <Row>
      <Col span={12}>
        <Form form={form} onFinish={(e) => handleSubmit(e)} layout="vertical">
          <Title level={3}>Create Task</Title>
          <Radio.Group
            onChange={(e) => setType(e.target.value)}
            value={type}
            style={{ marginTop: "15px", marginBottom: "15px" }}
          >
            <Radio value={1}>Planning</Radio>
            <Radio value={2}>Building</Radio>
            <Radio value={3}>Environmental Health</Radio>
          </Radio.Group>
          <Form.Item
            name="taskType"
            label="Task Type (Planning):"
            rules={[{ required: type === 1 }]}
            hidden={type != 1}
          >
            <Select options={planningTypes} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status:"
            rules={[{ required: type === 1 }]}
          >
            <Select options={planningStatus} />
          </Form.Item>
          <Form.Item
            name="internalRef"
            label="Internal reference:"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="taskType"
            label="Task Type (Building):"
            rules={[{ required: type === 2 }]}
            hidden={type != 2}
          >
            <Select options={buildingTypes} />
          </Form.Item>
          <Form.Item
            name="taskType"
            label="Task Type (EH):"
            rules={[{ required: type === 3 }]}
            hidden={type != 3}
          >
            <Select options={planningTypes} />
          </Form.Item>
          <Form.Item name="property" label="Property:">
            <Space.Compact>
              <Input addonBefore="Property ID" />
              <Button type="primary">Fetch</Button>
            </Space.Compact>
            <br />
            Or
            <br />
            <Space.Compact>
              <Input addonBefore="Address" />
              <Button type="primary">Search</Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item name="startDate" label="Start Date:">
            <DatePicker format="DD MMMM YYYY" />
          </Form.Item>

          {type == 1 ? (
            <Form.Item name="statDays" label="Statutory Days (calendar days):">
              <Select options={statDaysPlanning} />
            </Form.Item>
          ) : type == 2 ? (
            <Form.Item name="statDays" label="Statutory Days (business days):">
              <Select options={statDaysBuilding} />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item
            name="assignedOfficer"
            label="Assigned Officer:"
            rules={[{ required: true }]}
          >
            <Select>
              {userList?.memberships?.map((membership: any) => (
                <Select.Option
                  key={membership.publicUserData.userId}
                  value={membership.publicUserData.userId}
                >
                  {membership.publicUserData.firstName}{" "}
                  {membership.publicUserData.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="org" label="Organisation:">
            <Input disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={type === 0}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
