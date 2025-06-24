import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Select,
  DatePicker,
  Space,
  Typography,
  Progress,
  Tag,
  Tooltip,
  Badge,
  message,
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  PrinterOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  UserOutlined,
  ToolOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CarOutlined,
  ShoppingOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportManagement = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportType, setReportType] = useState('all');

  // Add CSS animation keyframes for chart
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Mock data for statistics
  const statisticsData = [
    {
      title: 'Tổng doanh thu',
      value: 245000000,
      suffix: 'VNĐ',
      valueStyle: { color: '#3f8600' },
      prefix: <DollarOutlined />,
    },
    {
      title: 'Số căn hộ',
      value: 156,
      suffix: 'căn',
      valueStyle: { color: '#1890ff' },
      prefix: <HomeOutlined />,
    },
    {
      title: 'Tổng cư dân',
      value: 423,
      suffix: 'người',
      valueStyle: { color: '#722ed1' },
      prefix: <UserOutlined />,
    },
    {
      title: 'Yêu cầu bảo trì',
      value: 89,
      suffix: 'yêu cầu',
      valueStyle: { color: '#fa8c16' },
      prefix: <ToolOutlined />,
    },
  ];

  // Mock data for revenue chart - 12 months
  const revenueData = [
    { month: 'T1', revenue: 45000000, percent: 60 },
    { month: 'T2', revenue: 52000000, percent: 70 },
    { month: 'T3', revenue: 48000000, percent: 64 },
    { month: 'T4', revenue: 61000000, percent: 81 },
    { month: 'T5', revenue: 55000000, percent: 73 },
    { month: 'T6', revenue: 67000000, percent: 89 },
    { month: 'T7', revenue: 58000000, percent: 77 },
    { month: 'T8', revenue: 63000000, percent: 84 },
    { month: 'T9', revenue: 70000000, percent: 93 },
    { month: 'T10', revenue: 65000000, percent: 87 },
    { month: 'T11', revenue: 72000000, percent: 96 },
    { month: 'T12', revenue: 75000000, percent: 100 },
  ];

  // Extended service data with more services
  const serviceData = [
    { type: 'Điện', value: 35, color: '#ff6b6b', icon: <ThunderboltOutlined /> },
    { type: 'Nước', value: 28, color: '#4ecdc4', icon: <GlobalOutlined /> },
    { type: 'Internet', value: 22, color: '#45b7d1', icon: <GlobalOutlined /> },
    { type: 'Gửi xe', value: 18, color: '#96ceb4', icon: <CarOutlined /> },
    { type: 'Vệ sinh', value: 15, color: '#feca57', icon: <ShoppingOutlined /> },
    { type: 'Bảo vệ', value: 12, color: '#ff9ff3', icon: <SafetyOutlined /> },
    { type: 'Kỹ thuật', value: 10, color: '#54a0ff', icon: <ToolOutlined /> },
    { type: 'Hỗ trợ', value: 8, color: '#5f27cd', icon: <CustomerServiceOutlined /> },
  ];

  // Mock data for recent reports table
  const recentReports = [
    {
      key: '1',
      type: 'Báo cáo doanh thu',
      period: 'Tháng 12/2024',
      status: 'completed',
      createdBy: 'Admin',
      createdAt: '2024-12-31',
    },
    {
      key: '2',
      type: 'Báo cáo bảo trì',
      period: 'Quý 4/2024',
      status: 'pending',
      createdBy: 'Manager',
      createdAt: '2024-12-30',
    },
    {
      key: '3',
      type: 'Báo cáo cư dân',
      period: 'Năm 2024',
      status: 'completed',
      createdBy: 'Admin',
      createdAt: '2024-12-29',
    },
  ];

  const handleExport = (format) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(`Đã xuất báo cáo ${format.toUpperCase()} thành công!`);
    }, 2000);
  };

  const columns = [
    {
      title: 'Loại báo cáo',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        <Space>
          <BarChartOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Kỳ báo cáo',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
        </Tag>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => message.info('Xem báo cáo')}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleExport('pdf')}
          >
            Tải
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <BarChartOutlined style={{ marginRight: '12px', color: '#667eea' }} />
          Báo cáo & Thống kê
        </Title>
        <Text type="secondary">Quản lý và theo dõi các báo cáo hệ thống</Text>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Kỳ báo cáo:</Text>
              <Select
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                style={{ width: '100%' }}
              >
                <Option value="week">Tuần này</Option>
                <Option value="month">Tháng này</Option>
                <Option value="quarter">Quý này</Option>
                <Option value="year">Năm này</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Loại báo cáo:</Text>
              <Select
                value={reportType}
                onChange={setReportType}
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="revenue">Doanh thu</Option>
                <Option value="resident">Cư dân</Option>
                <Option value="maintenance">Bảo trì</Option>
                <Option value="service">Dịch vụ</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Khoảng thời gian:</Text>
              <RangePicker style={{ width: '100%' }} />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: '#667eea' }} />
                <Text strong>Xu hướng doanh thu</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            extra={
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => handleExport('excel')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                Xuất Excel
              </Button>
            }
          >
            <div style={{ height: '280px', padding: '20px 0' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'end', 
                justifyContent: 'space-between',
                height: '200px',
                padding: '0 10px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(102,126,234,0.05) 100%)',
                borderRadius: '8px',
                border: '1px solid rgba(102,126,234,0.1)',
                marginBottom: '20px'
              }}>
                {revenueData.map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    flex: 1,
                    maxWidth: '45px',
                    position: 'relative'
                  }}>
                    {/* Revenue amount above column */}
                    <Text style={{
                      fontSize: '9px',
                      fontWeight: 600,
                      color: '#667eea',
                      marginBottom: '4px',
                      textAlign: 'center',
                      lineHeight: '10px',
                      background: 'rgba(102,126,234,0.1)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      border: '1px solid rgba(102,126,234,0.2)',
                      whiteSpace: 'nowrap',
                      transform: 'scale(0.8)',
                      transformOrigin: 'center'
                    }}>
                      {(item.revenue / 1000000).toFixed(0)}M
                    </Text>
                    
                    <Tooltip title={`${item.month}: ${item.revenue.toLocaleString()} VNĐ`}>
                      <div style={{
                        width: '20px',
                        height: `${item.percent * 1.6}px`,
                        background: `linear-gradient(180deg, #667eea 0%, #764ba2 100%)`,
                        borderRadius: '3px 3px 5px 5px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 3px 10px rgba(102,126,234,0.4)',
                        animation: `fadeInUp 0.6s ease ${index * 0.1}s both`,
                        position: 'relative'
                      }}>
                        {/* Highlight effect on top of column */}
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          left: '2px',
                          right: '2px',
                          height: '4px',
                          background: 'rgba(255,255,255,0.4)',
                          borderRadius: '2px'
                        }} />
                      </div>
                    </Tooltip>
                    
                    <Text style={{ 
                      fontSize: '10px', 
                      fontWeight: 600, 
                      color: '#667eea',
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'center',
                      width: '20px',
                      textAlign: 'center',
                      marginTop: '2px'
                    }}>
                      {item.month}
                    </Text>
                  </div>
                ))}
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '10px',
                background: 'rgba(102,126,234,0.08)',
                borderRadius: '6px'
              }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  📈 Tổng doanh thu năm: <Text strong style={{ color: '#667eea' }}>
                    {revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()} VNĐ
                  </Text>
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PieChartOutlined style={{ color: '#fa8c16' }} />
                <Text strong>Phân bổ dịch vụ</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            extra={
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => handleExport('pdf')}
                style={{
                  background: 'linear-gradient(135deg, #fa8c16 0%, #fa541c 100%)',
                  border: 'none',
                }}
              >
                Xuất PDF
              </Button>
            }
          >
            <div style={{ height: '280px', padding: '20px 10px' }}>
              <Row gutter={[12, 12]}>
                {serviceData.map((item, index) => (
                  <Col xs={12} sm={6} key={index}>
                    <div style={{
                      textAlign: 'center',
                      padding: '12px 8px',
                      background: `linear-gradient(135deg, ${item.color}10 0%, ${item.color}20 100%)`,
                      borderRadius: '12px',
                      border: `2px solid ${item.color}30`,
                      height: '90px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Circular progress background */}
                      <div style={{
                        position: 'relative',
                        width: '35px',
                        height: '35px',
                        marginBottom: '8px'
                      }}>
                        <svg width="35" height="35" style={{ transform: 'rotate(-90deg)' }}>
                          <circle
                            cx="17.5"
                            cy="17.5"
                            r="14"
                            fill="none"
                            stroke="#f0f0f0"
                            strokeWidth="3"
                          />
                          <circle
                            cx="17.5"
                            cy="17.5"
                            r="14"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="3"
                            strokeDasharray={`${(item.value / 40) * 87.96} 87.96`}
                            strokeLinecap="round"
                            style={{
                              transition: 'stroke-dasharray 1s ease',
                              animation: `rotate 2s ease ${index * 0.2}s`
                            }}
                          />
                        </svg>
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: item.color
                        }}>
                          {item.value}%
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ color: item.color, fontSize: '10px' }}>
                          {item.icon}
                        </span>
                        <Text strong style={{ 
                          fontSize: '9px', 
                          color: '#666',
                          lineHeight: '12px'
                        }}>
                          {item.type}
                        </Text>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              
              <div style={{ 
                marginTop: '16px', 
                textAlign: 'center', 
                padding: '10px',
                background: 'rgba(250,140,22,0.08)',
                borderRadius: '8px'
              }}>
                <Text type="secondary" style={{ fontSize: '11px', fontWeight: 500 }}>
                  🎯 Tổng tỷ lệ phục vụ: <Text strong style={{ color: '#fa8c16' }}>
                    {serviceData.reduce((sum, item) => sum + item.value, 0)}%
                  </Text> • <Text strong style={{ color: '#fa8c16' }}>
                    {serviceData.length} loại dịch vụ
                  </Text>
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Reports Table */}
      <Card
        title={
          <Space>
            <BarChartOutlined style={{ color: '#52c41a' }} />
            <Text strong>Báo cáo gần đây</Text>
          </Space>
        }
        style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none',
              }}
            >
              Tạo báo cáo mới
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={recentReports}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
          }}
          loading={loading}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default ReportManagement;
