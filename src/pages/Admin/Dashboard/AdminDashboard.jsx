import React from "react";
import { Card, Row, Col, Statistic, Typography, Space, Avatar, Badge } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  FileTextOutlined,
  BellOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Title level={2} style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, #1890ff, #722ed1)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Linkoma Admin Dashboard 🏢
            </Title>
            <Text style={{ color: '#666' }}>
              Chào mừng bạn trở lại!
            </Text>
          </div>
          <Space>
            <Badge count={5}>
              <Avatar icon={<BellOutlined />} style={{ backgroundColor: '#1890ff' }} />
            </Badge>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Doanh Thu Tháng</span>}
              value={111.4}
              suffix="M VNĐ"
              prefix={<DollarOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <ArrowUpOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                +12% so với tháng trước
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Cư Dân</span>}
              value={100}
              suffix="người"
              prefix={<UserOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
            />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
              Khách ghé thăm: 8 lượt
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Căn Hộ Có Cư Dân</span>}
              value={34}
              suffix="căn"
              prefix={<HomeOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
            />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
              Còn trống: 2 căn
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(100,100,100,0.8)' }}>Phí Phát Sinh</span>}
              value={2}
              suffix="M VNĐ"
              prefix={<FileTextOutlined style={{ color: '#666' }} />}
              valueStyle={{ color: '#666', fontSize: '24px', fontWeight: 'bold' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <ArrowDownOutlined style={{ color: '#ff4d4f', marginRight: '4px' }} />
              <Text style={{ color: 'rgba(100,100,100,0.8)', fontSize: '12px' }}>
                -5% so với tháng trước
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Summary */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="📊 Tổng Quan Nhanh"
            style={{
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tỷ lệ lấp đầy căn hộ:</Text>
                <Text strong style={{ color: '#52c41a' }}>94.4%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tỷ lệ thu phí đúng hạn:</Text>
                <Text strong style={{ color: '#1890ff' }}>87.2%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Phản hồi chưa xử lý:</Text>
                <Text strong style={{ color: '#faad14' }}>5 vấn đề</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Yêu cầu bảo trì:</Text>
                <Text strong style={{ color: '#722ed1' }}>3 yêu cầu</Text>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card
            title="🔔 Hoạt Động Gần Đây"
            style={{
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                <Avatar size="small" style={{ backgroundColor: '#52c41a', marginRight: '12px' }}>
                  101
                </Avatar>
                <div>
                  <Text strong>Thanh toán hóa đơn</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Căn hộ 101 - 5 phút trước</Text>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                <Avatar size="small" style={{ backgroundColor: '#faad14', marginRight: '12px' }}>
                  205
                </Avatar>
                <div>
                  <Text strong>Yêu cầu bảo trì</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Căn hộ 205 - 1 giờ trước</Text>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                <Avatar size="small" style={{ backgroundColor: '#1890ff', marginRight: '12px' }}>
                  302
                </Avatar>
                <div>
                  <Text strong>Cư dân mới chuyển vào</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Căn hộ 302 - 3 giờ trước</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>      </Row>
    </div>
  );
};

export default AdminDashboard;
