import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Table,
  InputNumber,
  Button,
  Space,
  message,
  Row,
  Col,
  Divider,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { invoiceService } from "../../../services/invoiceService";
import { apartmentService } from "../../../services/apartmentService";
import serviceService from "../../../services/serviceService";

const { Option } = Select;
const { Text } = Typography;

const CreateInvoiceWithDetailsModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceUsages, setServiceUsages] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchApartments();
      fetchServiceTypes();
    }
  }, [visible]);

  const fetchApartments = async () => {
    try {
      const response = await apartmentService.getAllApartments();
      setApartments(response.results || []);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await serviceService.getServiceTypes();
      setServiceTypes(response.results || []);
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  const addServiceUsage = () => {
    const newId = Date.now();
    setServiceUsages([
      ...serviceUsages,
      {
        id: newId,
        serviceTypeId: null,
        usage: 0,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeServiceUsage = (id) => {
    setServiceUsages(serviceUsages.filter((item) => item.id !== id));
  };

  const updateServiceUsage = (id, field, value) => {
    setServiceUsages(
      serviceUsages.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          if (field === "serviceTypeId") {
            const serviceType = serviceTypes.find(
              (st) => st.serviceTypeId === value
            );
            updated.unitPrice = serviceType
              ? parseFloat(serviceType.unitPrice)
              : 0;
          }

          // Calculate total
          updated.total = updated.usage * updated.unitPrice;

          return updated;
        }
        return item;
      })
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const invoiceData = {
        apartmentId: values.apartmentId,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        serviceUsages: serviceUsages
          .filter((item) => item.serviceTypeId && item.usage > 0)
          .map((item) => ({
            serviceTypeId: item.serviceTypeId,
            usage: item.usage,
          })),
      };

      await invoiceService.createInvoiceWithDetails(invoiceData);
      message.success("Tạo hóa đơn với chi tiết dịch vụ thành công!");

      form.resetFields();
      setServiceUsages([]);
      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Error creating invoice with details:", error);
      message.error("Có lỗi xảy ra khi tạo hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Dịch vụ",
      dataIndex: "serviceTypeId",
      render: (value, record) => (
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn dịch vụ"
          value={value}
          onChange={(val) =>
            updateServiceUsage(record.id, "serviceTypeId", val)
          }
        >
          {serviceTypes.map((st) => (
            <Option key={st.serviceTypeId} value={st.serviceTypeId}>
              {st.serviceName} ({st.unitPrice.toLocaleString()} VNĐ/{st.unit})
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Sử dụng",
      dataIndex: "usage",
      width: 120,
      render: (value, record) => (
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          value={value}
          onChange={(val) => updateServiceUsage(record.id, "usage", val || 0)}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: 120,
      align: "right",
      render: (value) => `${value.toLocaleString()} VNĐ`,
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      width: 120,
      align: "right",
      render: (value) => (
        <Text strong style={{ color: "#52c41a" }}>
          {value.toLocaleString()} VNĐ
        </Text>
      ),
    },
    {
      title: "Thao tác",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeServiceUsage(record.id)}
        />
      ),
    },
  ];

  const totalServiceFee = serviceUsages.reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <Modal
      title="Tạo Hóa Đơn Với Chi Tiết Dịch Vụ"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={900}
      okText="Tạo hóa đơn"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          dueDate: dayjs().add(30, "day"),
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="apartmentId"
              label="Căn hộ"
              rules={[{ required: true, message: "Vui lòng chọn căn hộ!" }]}
            >
              <Select
                placeholder="Chọn căn hộ"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {apartments.map((apt) => (
                  <Option key={apt.apartmentId} value={apt.apartmentId}>
                    {apt.apartmentType?.typeName || "N/A"} - Căn hộ{" "}
                    {apt.apartmentId} (
                    {apt.apartmentType?.rentFee
                      ? `${parseFloat(
                          apt.apartmentType.rentFee
                        ).toLocaleString()} VNĐ/tháng`
                      : ""}
                    )
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dueDate"
              label="Hạn thanh toán"
              rules={[
                { required: true, message: "Vui lòng chọn hạn thanh toán!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn hạn thanh toán"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider orientation="left">Chi tiết sử dụng dịch vụ</Divider>

      <Space style={{ marginBottom: 16 }}>
        <Button type="dashed" icon={<PlusOutlined />} onClick={addServiceUsage}>
          Thêm dịch vụ
        </Button>
      </Space>

      <Table
        dataSource={serviceUsages}
        columns={columns}
        pagination={false}
        rowKey="id"
        size="small"
        footer={() => (
          <div style={{ textAlign: "right" }}>
            <Text strong>
              Tổng phí dịch vụ: {totalServiceFee.toLocaleString()} VNĐ
            </Text>
          </div>
        )}
      />
    </Modal>
  );
};

export default CreateInvoiceWithDetailsModal;
