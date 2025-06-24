import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Table,
  Typography,
  Space,
  Statistic,
  Progress,
  Tag,
  Tabs,
  Empty,
  message
} from 'antd';
import {
  BarChartOutlined,
  FileTextOutlined,
  DownloadOutlined,
  UserOutlined,
  DollarOutlined,
  ToolOutlined,
  MessageOutlined,
  HomeOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const ManagerReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});
  const [filters, setFilters] = useState({
    dateRange: [dayjs().subtract(1, 'month'), dayjs()],
    reportType: 'overview'
  });

  // Mock data - thay thế bằng dữ liệu thực từ API
  const mockReportData = {
    overview: {
      totalResidents: 324,
      newResidents: 12,
      totalRevenue: 145000000,
      revenueGrowth: 8.5,
      maintenanceCost: 15000000,
      satisfaction: 4.3,
      completedMaintenance: 28,
      pendingMaintenance: 12
    },
    residentReport: [
      {
        key: '1',
        apartment: 'A101',
        residentName: 'Nguyễn Văn A',
        memberCount: 4,
        moveInDate: '2023-01-15',
        status: 'Đang cư trú',
        paymentStatus: 'Đã thanh toán',
        lastPayment: '2024-01-15'
      },
      {
        key: '2',
        apartment: 'A102',
        residentName: 'Trần Thị B',
        memberCount: 2,
        moveInDate: '2023-03-20',
        status: 'Đang cư trú',
        paymentStatus: 'Quá hạn',
        lastPayment: '2023-12-15'
      },
      {
        key: '3',
        apartment: 'A103',
        residentName: 'Lê Văn C',
        memberCount: 3,
        moveInDate: '2023-06-10',
        status: 'Tạm vắng',
        paymentStatus: 'Đã thanh toán',
        lastPayment: '2024-01-10'
      }
    ],
    maintenanceReport: [
      {
        key: '1',
        requestId: 'MT001',
        apartment: 'A101',
        category: 'Điện nước',
        description: 'Sửa chữa ống nước rò rỉ',
        status: 'Hoàn thành',
        priority: 'Cao',
        createdDate: '2024-01-15',
        completedDate: '2024-01-17',
        technician: 'Nguyễn Văn Thành',
        cost: 250000
      },
      {
        key: '2',
        requestId: 'MT002',
        apartment: 'A205',
        category: 'Thang máy',
        description: 'Bảo trì thang máy định kỳ',
        status: 'Đang xử lý',
        priority: 'Trung bình',
        createdDate: '2024-01-20',
        completedDate: null,
        technician: 'Trần Văn Minh',
        cost: null
      }
    ],
    financialReport: [
      {
        key: '1',
        month: '2024-01',
        totalRevenue: 48500000,
        managementFee: 32000000,
        parkingFee: 6000000,
        servicesFee: 4500000,
        maintenanceCost: 5000000,
        netProfit: 43500000
      },
      {
        key: '2',
        month: '2023-12',
        totalRevenue: 47200000,
        managementFee: 31000000,
        parkingFee: 6000000,
        servicesFee: 4200000,
        maintenanceCost: 6000000,
        netProfit: 41200000
      }
    ],
    performanceReport: [
      {
        key: '1',
        employee: 'Nguyễn Văn Thành',
        role: 'Kỹ thuật viên',
        completedTasks: 25,
        avgRating: 4.8,
        onTimeRate: 96,
        customerSatisfaction: 4.9
      },
      {
        key: '2',
        employee: 'Trần Thị Mai',
        role: 'Nhân viên dịch vụ',
        completedTasks: 22,
        avgRating: 4.6,
        onTimeRate: 91,
        customerSatisfaction: 4.5
      },
      {
        key: '3',
        employee: 'Lê Văn Dũng',
        role: 'Bảo vệ',
        completedTasks: 18,
        avgRating: 4.5,
        onTimeRate: 88,
        customerSatisfaction: 4.3
      }
    ]
  };

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportData(mockReportData);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải báo cáo!');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (type) => {
    message.success(`Đang xuất báo cáo ${type}...`);
  };

  const residentColumns = [
    {
      title: 'Căn hộ',
      dataIndex: 'apartment',
      key: 'apartment',
      width: 80
    },
    {
      title: 'Cư dân',
      dataIndex: 'residentName',
      key: 'residentName',
      width: 150
    },
    {
      title: 'Số thành viên',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 100,
      render: (count) => <Tag color="blue">{count} người</Tag>
    },
    {
      title: 'Ngày chuyển đến',
      dataIndex: 'moveInDate',
      key: 'moveInDate',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'Đang cư trú' ? 'green' : 'orange'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status) => (
        <Tag color={status === 'Đã thanh toán' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    }
  ];

  const maintenanceColumns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'requestId',
      key: 'requestId',
      width: 100
    },
    {
      title: 'Căn hộ',
      dataIndex: 'apartment',
      key: 'apartment',
      width: 80
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'Hoàn thành' ? 'green' : status === 'Đang xử lý' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Kỹ thuật viên',
      dataIndex: 'technician',
      key: 'technician',
      width: 120
    },
    {
      title: 'Chi phí',
      dataIndex: 'cost',
      key: 'cost',
      width: 100,
      render: (cost) => cost ? `${cost.toLocaleString('vi-VN')}đ` : '-'
    }
  ];

  const financialColumns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      width: 100,
      render: (month) => dayjs(month).format('MM/YYYY')
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: 120,
      render: (value) => (
        <Text strong style={{ color: '#1890ff' }}>
          {value.toLocaleString('vi-VN')}đ
        </Text>
      )
    },
    {
      title: 'Phí quản lý',
      dataIndex: 'managementFee',
      key: 'managementFee',
      width: 120,
      render: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      title: 'Phí gửi xe',
      dataIndex: 'parkingFee',
      key: 'parkingFee',
      width: 100,
      render: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      title: 'Chi phí bảo trì',
      dataIndex: 'maintenanceCost',
      key: 'maintenanceCost',
      width: 120,
      render: (value) => (
        <Text style={{ color: '#ff4d4f' }}>
          {value.toLocaleString('vi-VN')}đ
        </Text>
      )
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'netProfit',
      key: 'netProfit',
      width: 120,
      render: (value) => (
        <Text strong style={{ color: '#52c41a' }}>
          {value.toLocaleString('vi-VN')}đ
        </Text>
      )
    }
  ];

  const performanceColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
      width: 150
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => <Tag color="purple">{role}</Tag>
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'completedTasks',
      key: 'completedTasks',
      width: 100,
      render: (tasks) => <Text strong>{tasks} nhiệm vụ</Text>
    },
    {
      title: 'Đánh giá TB',
      dataIndex: 'avgRating',
      key: 'avgRating',
      width: 100,
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text style={{ color: '#faad14' }}>★ {rating}</Text>
        </div>
      )
    },
    {
      title: 'Đúng hạn',
      dataIndex: 'onTimeRate',
      key: 'onTimeRate',
      width: 120,
      render: (rate) => (
        <div>
          <Progress percent={rate} size="small" />
          <Text style={{ fontSize: 12 }}>{rate}%</Text>
        </div>
      )
    }
  ];

  return (
    <div className="manager-reports">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Báo cáo quản lý
        </Title>
        <Text type="secondary">Báo cáo và thống kê chi tiết cho manager</Text>
      </div>

      {/* Bộ lọc */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={8}>
            <label style={{ display: 'block', marginBottom: 8 }}>Khoảng thời gian:</label>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <label style={{ display: 'block', marginBottom: 8 }}>Loại báo cáo:</label>
            <Select
              value={filters.reportType}
              onChange={(value) => setFilters({ ...filters, reportType: value })}
              style={{ width: '100%' }}
            >
              <Option value="overview">Tổng quan</Option>
              <Option value="residents">Cư dân</Option>
              <Option value="maintenance">Bảo trì</Option>
              <Option value="financial">Tài chính</Option>
              <Option value="performance">Hiệu suất</Option>
            </Select>
          </Col>
          <Col xs={24} sm={10}>
            <Space>
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                onClick={fetchReportData}
                loading={loading}
              >
                Tạo báo cáo
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleExportReport(filters.reportType)}
              >
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng cư dân"
              value={reportData.overview?.totalResidents || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <div style={{ fontSize: 12, color: '#52c41a' }}>
                  +{reportData.overview?.newResidents || 0} mới
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={reportData.overview?.totalRevenue || 0}
              formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <div style={{ fontSize: 12, color: '#52c41a' }}>
                  +{reportData.overview?.revenueGrowth || 0}%
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Chi phí bảo trì"
              value={reportData.overview?.maintenanceCost || 0}
              formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Mức hài lòng"
              value={reportData.overview?.satisfaction || 0}
              suffix="/5.0"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs báo cáo chi tiết */}
      <Card>
        <Tabs defaultActiveKey="residents">
          <TabPane tab={
            <span>
              <UserOutlined />
              Báo cáo cư dân
            </span>
          } key="residents">
            <Table
              columns={residentColumns}
              dataSource={reportData.residentReport || []}
              loading={loading}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} cư dân`
              }}
            />
          </TabPane>

          <TabPane tab={
            <span>
              <ToolOutlined />
              Báo cáo bảo trì
            </span>
          } key="maintenance">
            <Table
              columns={maintenanceColumns}
              dataSource={reportData.maintenanceReport || []}
              loading={loading}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} yêu cầu`
              }}
            />
          </TabPane>

          <TabPane tab={
            <span>
              <DollarOutlined />
              Báo cáo tài chính
            </span>
          } key="financial">
            <Table
              columns={financialColumns}
              dataSource={reportData.financialReport || []}
              loading={loading}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true
              }}
            />
          </TabPane>

          <TabPane tab={
            <span>
              <TeamOutlined />
              Báo cáo hiệu suất
            </span>
          } key="performance">
            <Table
              columns={performanceColumns}
              dataSource={reportData.performanceReport || []}
              loading={loading}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} nhân viên`
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ManagerReports;
