import { Table, Tag } from "antd";

const columns = [
  {
    title: "Họ tên",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Vai trò",
    dataIndex: "role",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) => (
      <Tag color={status === "Online" ? "green" : "default"}>{status}</Tag>
    ),
  },
  {
    title: "Hành động",
    render: () => <a>Xem chi tiết / Sửa đổi</a>,
  },
];

const UserTable = ({ data }) => (
  <Table
    rowSelection={{}}
    columns={columns}
        dataSource={data}
        sticky={true}
    pagination={{ pageSize: 20, showSizeChanger: true }}
  />
);

export default UserTable;
