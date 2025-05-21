import React from "react";
import { Card, Row, Col, Statistic, Tabs, Table, Typography } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { ArrowUpOutlined } from "@ant-design/icons";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);
const { Title } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic title="Doanh thu tháng" value={111400000} suffix="VNĐ" />
            <div style={{ marginTop: 8 }}>Phí phát sinh tháng này: 2,000,000VNĐ</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Số lượng cư dân" value={100} />
            <div>Lượt khách ghé thăm: 8</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Số lượng căn hộ có cư dân" value={34} />
            <div>Số lượng căn hộ còn trống: 2</div>
          </Card>
        </Col>
      </Row>

      <Card title="Doanh thu" style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="4">
          <TabPane tab="Theo năm" key="4">
            <Bar
              data={{
                labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                datasets: [
                  {
                    label: "Doanh thu",
                    backgroundColor: "#1890ff",
                    data: [500, 1200, 900, 700, 600, 400, 300, 800, 900, 1000, 1100, 950],
                  },
                ],
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Phản hồi / Sự cố">
            <Row>
              <Col span={12}>
                <Statistic title="Phản hồi tiếp nhận" value={12321} precision={0} valueStyle={{ color: "#3f8600" }} prefix={<ArrowUpOutlined />} />
              </Col>
              <Col span={12}>
                <Statistic title="Đã xử lý" value={2.7} suffix="%" precision={1} valueStyle={{ color: "#3f8600" }} prefix={<ArrowUpOutlined />} />
              </Col>
            </Row>
            <Table
              style={{ marginTop: 12 }}
              size="small"
              pagination={{ pageSize: 5 }}
              columns={[
                { title: "Thời gian", dataIndex: "time", key: "time" },
                { title: "Phòng", dataIndex: "room", key: "room" },
                { title: "Sự cố/Phản hồi", dataIndex: "issue", key: "issue" },
                { title: "Trạng thái", dataIndex: "status", key: "status" },
              ]}
              dataSource={[
                { key: 1, time: "text", room: "101", issue: "text", status: "Status" },
                { key: 2, time: "text", room: "103", issue: "text", status: "Status" },
                { key: 3, time: "text", room: "302", issue: "text", status: "Status" },
                { key: 4, time: "text", room: "204", issue: "text", status: "Status" },
                { key: 5, time: "text", room: "401", issue: "text", status: "Status" },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Phân bổ doanh thu">
            <Doughnut
              data={{
                labels: ["Tiền phòng", "Tiền dịch vụ", "Tiền điện", "Tiền nước", "Tiền Internet", "Tiền khác"],
                datasets: [
                  {
                    data: [28.79, 21.04, 19.73, 14.83, 7.80, 7.80],
                    backgroundColor: ["#1890ff", "#13c2c2", "#ffc53d", "#ff4d4f", "#722ed1", "#a0d911"],
                  },
                ],
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
