import React, { useState } from "react";
import UserStats from "./UserStats";
import UserSearch from "./UserSearch";
import AddUserButton from "./AddUserButton";
import UserTable from "./UserTable"; 

const mockData = Array.from({ length: 100 }, (_, i) => ({
  key: i,
  name: "Example User",
  email: "exampleuser@example.com",
  role: i % 2 === 0 ? "Cư dân" : "Nhân viên",
  status: i % 3 === 0 ? "Offline" : "Online",
}));

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = mockData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* <h2>Quản lý người dùng</h2> */}
      <UserStats />
      <UserSearch onSearch={setSearchTerm} />
      <AddUserButton onAdd={() => alert("Chức năng thêm mới")} />
      <UserTable data={filteredData} />
    </div>
  );
};

export default UserManagement;
