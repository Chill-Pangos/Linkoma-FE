import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  List,
  Avatar,
  Progress,
  Alert,
  Timeline,
  Badge,
  Tooltip
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  ToolOutlined,
  MessageOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  TeamOutlined,
  BellOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Import Vietnamese locale

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('vi'); // Set Vietnamese as default locale

const { Title, Text } = Typography;

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});

  // Mock data - thay thế bằng dữ liệu thực từ API
  const mockDashboardData = {
    overview: {
      totalResidents: 324,
      totalApartments: 150,
      occupancyRate: 86.7,
      activeMaintenanceRequests: 12,
      pendingFeedbacks: 8,
      monthlyRevenue: 145000000,
      revenueGrowth: 12.5,
      satisfaction: 4.3
    },
    recentActivities: [
      {
        id: 1,
        type: 'resident',
        title: 'Cư dân mới đăng ký',
        description: 'Nguyễn Văn B đăng ký căn hộ A205',
        timestamp: '2024-01-30T10:30:00',
        status: 'success'
      },
      {
        id: 2,
        type: 'maintenance',
        title: 'Yêu cầu bảo trì mới',
        description: 'Sửa chữa thang máy tầng 15',
        timestamp: '2024-01-30T09:15:00',
        status: 'warning'
      },
      {
        id: 3,
        type: 'feedback',
        title: 'Phản hồi từ cư dân',
        description: 'Góp ý về dịch vụ vệ sinh',
        timestamp: '2024-01-30T08:45:00',
        status: 'info'
      },
      {
        id: 4,
        type: 'payment',
        title: 'Thanh toán hóa đơn',
        description: 'A101 thanh toán phí quản lý tháng 1',
        timestamp: '2024-01-29T16:20:00',
        status: 'success'
      }
    ],
    urgentTasks: [
      {
        id: 1,
        title: 'Xử lý yêu cầu bảo trì khẩn cấp',
        description: 'Sửa chữa rò rỉ nước tầng 8',
        priority: 'high',
        deadline: '2024-01-31',
        assignee: 'Nguyễn Văn Thành'
      },
      {
        id: 2,
        title: 'Phản hồi khiếu nại cư dân',
        description: 'Xử lý khiếu nại về tiếng ồn',
        priority: 'medium',
        deadline: '2024-02-01',
        assignee: 'Trần Thị Mai'
      },
      {
        id: 3,
        title: 'Kiểm tra hệ thống PCCC',
        description: 'Kiểm tra định kỳ hệ thống phòng cháy chữa cháy',
        priority: 'medium',
        deadline: '2024-02-03',
        assignee: 'Lê Văn Dũng'
      }
    ],
    topPerformers: [
      {
        id: 1,
        name: 'Nguyễn Văn Thành',
        role: 'Kỹ thuật viên',
        completedTasks: 25,
        rating: 4.8,
        avatar: null
      },
      {
        id: 2,
        name: 'Trần Thị Mai',
        role: 'Nhân viên dịch vụ',
        completedTasks: 22,
        rating: 4.6,
        avatar: null
      },
      {
        id: 3,
        name: 'Lê Văn Dũng',
        role: 'Bảo vệ',
        completedTasks: 18,
        rating: 4.5,
        avatar: null
      }
    ],
    maintenanceStats: {
      total: 45,
      completed: 28,
      inProgress: 12,
      pending: 5
    },
    feedbackStats: {
      total: 67,
      resolved: 52,
      pending: 15,
      avgRating: 4.2
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockDashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'resident': return <UserOutlined style={{ color: '#1890ff' }} />;
      case 'maintenance': return <ToolOutlined style={{ color: '#faad14' }} />;
      case 'feedback': return <MessageOutlined style={{ color: '#52c41a' }} />;
      case 'payment': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default: return <BellOutlined />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const urgentTaskColumns = [
    {
      title: 'Nhiệm vụ',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? 'Cao' : priority === 'medium' ? 'Trung bình' : 'Thấp'}
        </Tag>
      )
    },
    {
      title: 'Hạn',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 100,
      render: (date) => (
        <div>
          <Text style={{ fontSize: 12 }}>
            {dayjs(date).format('DD/MM')}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 10 }}>
            {dayjs(date).diff(dayjs(), 'days')} ngày
          </Text>
        </div>
      )
    },
    {
      title: 'Phụ trách',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 120,
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text style={{ marginLeft: 8, fontSize: 12 }}>{name}</Text>
        </div>
      )
    }
  ];

  return (
    <div className="manager-dashboard">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <BarChartOutlined style={{ marginRight: 8 }} />
          Manager Dashboard
        </Title>
        <Text type="secondary">Tổng quan quản lý chung cư Linkoma</Text>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng cư dân"
              value={dashboardData.overview?.totalResidents || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng căn hộ"
              value={dashboardData.overview?.totalApartments || 0}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tỷ lệ lấp đầy"
              value={dashboardData.overview?.occupancyRate || 0}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Yêu cầu bảo trì"
              value={dashboardData.overview?.activeMaintenanceRequests || 0}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê doanh thu và hiệu suất */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card title="Doanh thu tháng này">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                  {dashboardData.overview?.monthlyRevenue?.toLocaleString('vi-VN') || 0} đ
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <CaretUpOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                  <Text style={{ color: '#52c41a' }}>
                    +{dashboardData.overview?.revenueGrowth || 0}% so với tháng trước
                  </Text>
                </div>
              </div>
              <RiseOutlined style={{ fontSize: 48, color: '#52c41a', opacity: 0.3 }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Mức độ hài lòng">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                  {dashboardData.overview?.satisfaction || 0}/5.0
                </div>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    percent={(dashboardData.overview?.satisfaction || 0) * 20}
                    showInfo={false}
                    strokeColor="#faad14"
                  />
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Dựa trên {dashboardData.feedbackStats?.total || 0} phản hồi
                </Text>
              </div>
              <TrophyOutlined style={{ fontSize: 48, color: '#faad14', opacity: 0.3 }} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Thống kê bảo trì */}
        <Col xs={24} sm={12}>
          <Card title="Thống kê bảo trì">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Hoàn thành</Text>
                <Text strong>{dashboardData.maintenanceStats?.completed || 0}</Text>
              </div>
              <Progress
                percent={((dashboardData.maintenanceStats?.completed || 0) / (dashboardData.maintenanceStats?.total || 1)) * 100}
                strokeColor="#52c41a"
                showInfo={false}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Đang xử lý</Text>
                <Text strong>{dashboardData.maintenanceStats?.inProgress || 0}</Text>
              </div>
              <Progress
                percent={((dashboardData.maintenanceStats?.inProgress || 0) / (dashboardData.maintenanceStats?.total || 1)) * 100}
                strokeColor="#faad14"
                showInfo={false}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Chờ xử lý</Text>
                <Text strong>{dashboardData.maintenanceStats?.pending || 0}</Text>
              </div>
              <Progress
                percent={((dashboardData.maintenanceStats?.pending || 0) / (dashboardData.maintenanceStats?.total || 1)) * 100}
                strokeColor="#ff4d4f"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>

        {/* Top performers */}
        <Col xs={24} sm={12}>
          <Card title="Nhân viên xuất sắc">
            <List
              size="small"
              dataSource={dashboardData.topPerformers || []}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge count={index + 1} style={{ backgroundColor: '#52c41a' }}>
                        <Avatar icon={<UserOutlined />} />
                      </Badge>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>{item.name}</Text>
                        <Text style={{ color: '#faad14' }}>★ {item.rating}</Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary">{item.role}</Text>
                        <br />
                        <Text style={{ fontSize: 12 }}>
                          Hoàn thành: {item.completedTasks} nhiệm vụ
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Nhiệm vụ cần xử lý */}
        <Col xs={24} lg={14}>
          <Card
            title="Nhiệm vụ cần xử lý khẩn cấp"
            extra={
              <Button type="primary" size="small">
                Xem tất cả
              </Button>
            }
          >
            <Table
              size="small"
              columns={urgentTaskColumns}
              dataSource={dashboardData.urgentTasks || []}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>

        {/* Hoạt động gần đây */}
        <Col xs={24} lg={10}>
          <Card title="Hoạt động gần đây">
            <Timeline
              size="small"
              items={dashboardData.recentActivities?.map(activity => ({
                dot: getActivityIcon(activity.type),
                children: (
                  <div>
                    <Text strong style={{ fontSize: 14 }}>
                      {activity.title}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {activity.description}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {dayjs(activity.timestamp).fromNow()}
                    </Text>
                  </div>
                )
              })) || []}
            />
          </Card>
        </Col>
      </Row>

      {/* Alert quan trọng */}
      {dashboardData.overview?.activeMaintenanceRequests > 10 && (
        <Alert
          message="Cảnh báo: Có nhiều yêu cầu bảo trì đang chờ xử lý"
          description="Hiện tại có hơn 10 yêu cầu bảo trì chưa được xử lý. Vui lòng kiểm tra và phân công xử lý kịp thời."
          type="warning"
          showIcon
          closable
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
