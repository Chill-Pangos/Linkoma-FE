import { Card, Row, Col, Statistic, Divider } from "antd";

const UserStats = () => (
  <Card style={{ marginBottom: 24 }}>
    <Row gutter={16}>
      <Col span={7}>
        <Statistic title="Số lượng người dùng" value={100} />
      </Col>

      <Col span={7}>
        <Statistic title="Nhân viên" value={10} />
      </Col>

      <Col span={7}>
        <Statistic title="Cư dân" value={90} />
      </Col>
    </Row>
  </Card>
);

export default UserStats;
