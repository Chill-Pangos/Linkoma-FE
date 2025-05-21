import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const UserSearch = ({ onSearch }) => (
  <Input
    placeholder="Nhập tên người dùng..."
    prefix={<SearchOutlined />}
    onChange={(e) => onSearch(e.target.value)}
    style={{ width: "100%", marginBottom: 16 }}
  />
);

export default UserSearch;
