// src/pages/NotFoundPage.jsx
import React from "react";
import { Result, Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#f7f9fc",
        backgroundImage: "url('/src/assets/BG.png')",
      }}
      extra={
        <Flex style={{ gap: 16,justifyContent:'center' }}>
          <Button type="primary" onClick={() => navigate("/")}>
            Quay về trang chủ
          </Button>
          <Button type="secondary" onClick={() => navigate(-1)}>
            Quay về trang trước
          </Button>
        </Flex>
      }
    />
  );
};

export default NotFoundPage;
