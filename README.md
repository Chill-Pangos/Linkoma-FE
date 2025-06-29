# 🏢 Linkoma - Hệ Thống Quản Lý Chung Cư (Web Admin)

Linkoma là một hệ thống quản lý chung cư hiện đại được chia thành 2 phần:
- **🖥️ Web Admin (dự án này)**: Dành cho quản trị viên, quản lý, nhân viên
- **📱 Mobile App**: Dành cho cư dân (phát triển riêng)

Phần Web Admin cung cấp giao diện quản lý toàn diện cho việc điều hành tòa nhà, quản lý cư dân, hóa đơn và các dịch vụ chung cư.

## ✨ Tính Năng Chính (Web Admin)

### 🔐 Hệ Thống Phân Quyền (Web)
- **Admin**: Toàn quyền quản lý hệ thống và cấu hình
- **Manager**: Quản lý các hoạt động hàng ngày của tòa nhà
- **Staff**: Nhân viên xử lý công việc cụ thể (bảo trì, dịch vụ)
- **Security**: Bảo vệ và quản lý an ninh
- ~~**Resident**: Sử dụng Mobile App riêng~~

### 👥 Quản Lý Người Dùng (Admin Panel)
- ✅ CRUD tài khoản toàn bộ người dùng (Admin, Manager, Staff, Security, Resident)
- ⚡ Tạo nhanh tài khoản cư dân chỉ với email
- 📊 Thống kê người dùng theo vai trò và trạng thái
- 🔍 Tìm kiếm và lọc nâng cao
- 👁️ Xem chi tiết thông tin cá nhân
- 🔑 Quản lý phân quyền và role

### 🏠 Quản Lý Căn Hộ (Admin)
- 🏢 Quản lý thông tin căn hộ và tầng lầu
- 👨‍👩‍👧‍👦 Gán/chuyển đổi cư dân vào căn hộ
- 📋 Theo dõi trạng thái căn hộ (trống, đã thuê, bảo trì)
- 🔧 Quản lý thiết bị và tài sản căn hộ

### 💰 Quản Lý Hóa Đơn (Admin)
- 📄 Tạo và quản lý hóa đơn cho tất cả căn hộ
- 🔍 Tìm kiếm hóa đơn theo nhiều tiêu chí
- 💳 Theo dõi trạng thái thanh toán (pending, paid, overdue)
- 📊 Báo cáo thu chi chi tiết theo tháng/quý/năm
- 💸 Quản lý phí phạt và ưu đãi

### 🔧 Quản Lý Bảo Trì (Admin)
- 🛠️ Tiếp nhận yêu cầu bảo trì từ cư dân (qua Mobile)
- 📋 Theo dõi tiến độ xử lý và lịch sử bảo trì
- 👷 Phân công nhân viên và quản lý lịch làm việc
- 📈 Thống kê chi phí và hiệu suất bảo trì

### 📢 Thông Báo & Sự Kiện (Admin)
- 📣 Gửi thông báo tới cư dân (hiển thị trên Mobile)
- 🎉 Quản lý sự kiện chung cư và lịch sinh hoạt
- 📱 Push notification đến Mobile App
- 📋 Theo dõi tỷ lệ đọc và phản hồi

### 📊 Dashboard & Báo Cáo (Admin)
- 📈 Dashboard tổng quan cho từng vai trò quản lý
- 📊 Biểu đồ thống kê trực quan (doanh thu, cư dân, bảo trì)
- 📋 Báo cáo chi tiết theo thời gian và chỉ số KPI
- 💹 Phân tích doanh thu, chi phí và lợi nhuận
- 🎯 Theo dõi hiệu suất hoạt động tòa nhà

## 🛠️ Công Nghệ Sử Dụng

### Frontend (Web Admin)
- **React 19** - Library UI hiện đại cho admin panel
- **Vite** - Build tool nhanh chóng và hiệu quả
- **Ant Design 5** - Component library chuyên nghiệp cho admin
- **React Router v7** - Routing mạnh mẽ cho SPA
- **Axios** - HTTP client để giao tiếp với Backend API
- **Chart.js** - Biểu đồ và analytics cho dashboard
- **Day.js** - Xử lý thời gian và ngày tháng
- **Zustand** - State management nhẹ nhàng

### Styling & UI (Desktop-First)
- **Ant Design Icons** - Bộ icon professional cho admin
- **CSS3 với Gradient** - Giao diện hiện đại và đẹp mắt
- **Desktop Responsive** - Tối ưu cho màn hình lớn (laptop/desktop)
- **Admin Theme** - Color scheme chuyên nghiệp cho quản lý

## 🚀 Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js >= 18.0.0
- Yarn >= 1.22.0 (khuyến nghị) hoặc npm

### Cài Đặt Yarn (nếu chưa có)
```bash
# Cài đặt Yarn globally
npm install -g yarn

# Kiểm tra version
yarn --version
```

### Cài Đặt Dự Án
```bash
# Clone dự án
git clone [repository-url]
cd linkoma-fe

# Cài đặt dependencies với Yarn (khuyến nghị)
yarn install

# Hoặc sử dụng npm
npm install
```

### Chạy Dự Án với Vite
```bash
# Development server với hot reload (Vite)
yarn dev
# Hoặc: npm run dev

# Build cho production
yarn build
# Hoặc: npm run build

# Preview production build
yarn preview
# Hoặc: npm run preview

# Lint và kiểm tra code
yarn lint
# Hoặc: npm run lint
```

### 🔥 Tính Năng Vite
- **⚡ Hot Module Replacement (HMR)**: Cập nhật realtime khi dev
- **🚀 Fast Cold Start**: Khởi động nhanh hơn Webpack
- **📦 Optimized Build**: Build production tối ưu với Rollup
- **🔌 Rich Plugin Ecosystem**: Hỗ trợ nhiều plugin mở rộng

### Cấu Hình Môi Trường
Tạo file `.env` trong thư mục gốc:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Linkoma
```

## 📁 Cấu Trúc Dự Án

```
src/
├── components/          # Shared components
├── hooks/              # Custom React hooks
│   └── useAuth.js     # Authentication hook
├── layouts/           # Layout components
│   ├── AdminLayout.jsx
│   └── SidebarMenu.jsx
├── pages/             # Page components
│   ├── Admin/         # Admin management pages
│   │   ├── Dashboard/           # Admin dashboard & analytics
│   │   ├── UserManagement/      # Manage all users (Admin, Staff, Residents)
│   │   ├── BillManagement/      # Invoice & billing management
│   │   ├── ApartmentManagement/ # Apartment & floor management
│   │   ├── MaintenanceManagement/ # Maintenance requests & scheduling
│   │   ├── ServiceManagement/   # Building services management
│   │   ├── EventNotificationManagement/ # Events & notifications
│   │   ├── FeedbackManagement/  # Resident feedback from mobile
│   │   └── Reports/             # Comprehensive reports & analytics
│   ├── Auth/          # Authentication pages (admin login)
│   ├── Manager/       # Manager-specific pages
│   ├── Public/        # Public pages (landing, about)
│   └── ~~Resident/~~  # Resident pages (moved to Mobile App)
├── router/            # Routing configuration
├── services/          # API services
│   ├── adminService.js
│   ├── userService.js
│   ├── invoiceService.js
│   └── invoiceDetailService.js
├── store/             # Global state management
├── utils/             # Utility functions
└── assets/            # Static assets
```

## 🎨 Tính Năng UI/UX (Web Admin)

### 🖥️ Desktop-First Design
- � Tối ưu cho màn hình lớn (laptop/desktop 1200px+)
- 📊 Layout phức tạp với nhiều panel và table
- 🎛️ Dashboard với nhiều widget và biểu đồ
- � Data table với pagination và filtering mạnh mẽ

### 🌈 Professional Admin Theme
- 🎨 Color scheme chuyên nghiệp (blue gradient)
- 🔄 Smooth transitions và animations tinh tế
- �️ Hover effects và interactive elements
- 🌙 Consistent design language cho admin panel

### ⚡ Performance (Desktop)
- 🚀 Fast loading với Vite HMR
- 📦 Code splitting tự động cho từng module
- 🔄 Lazy loading cho heavy components (charts, tables)
- 💾 Optimized builds với Rollup
- ⚡ Lightning fast dev server cho development

## 📊 Tính Năng Nổi Bật (Admin Panel)

### 🎛️ Admin Dashboard Thông Minh
- 📈 Biểu đồ realtime (doanh thu, cư dân, bảo trì)
- 🎯 KPI tracking và performance metrics
- 📊 Visual analytics với Chart.js
- 🔔 Alert system cho các vấn đề cần xử lý
- 📋 Quick actions và shortcuts

### 👥 Quản Lý Người Dùng Toàn Diện
- ⚡ Quick create tài khoản cư dân chỉ với email
- 🔍 Advanced search & filter (role, status, apartment)
- 👥 Bulk operations (import/export, mass update)
- 📊 User statistics và engagement metrics
- 🔑 Role-based access control

### 💰 Hệ Thống Billing Hoàn Chỉnh
- 📄 Invoice generator với detailed breakdown
- � Payment status tracking và reminders
- 📊 Financial reports và revenue analytics
- 🔄 Auto calculations cho phí chung cư
- 📱 Integration với Mobile payment notifications

### 🏢 Ecosystem Integration
- 📱 **Mobile App Connection**: Nhận data từ Resident mobile app
- 🔄 **Realtime Sync**: Push notifications đến mobile
- 📊 **Cross-platform Analytics**: Thống kê toàn bộ hệ thống
- 🔗 **API Gateway**: Centralized data management

## 🔧 Scripts Có Sẵn

### Yarn Commands (Khuyến nghị)
- `yarn dev` - Khởi động Vite development server với HMR
- `yarn build` - Build cho production với Vite + Rollup
- `yarn preview` - Preview production build locally
- `yarn lint` - Kiểm tra lỗi code với ESLint

### NPM Commands (Thay thế)
- `npm run dev` - Khởi động development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Kiểm tra lỗi code

### 🎯 Development Tips
```bash
# Chạy nhanh với Vite trực tiếp
yarn vite

# Chạy dev server trên port tùy chỉnh
yarn dev --port 3000

# Build với mode development để debug
yarn build --mode development

# Analyze bundle size
yarn build --analyze
```

## 🤝 Đóng Góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên Hệ

- 📧 Email: [your-email@example.com]
- 🌐 Website: [your-website.com]
- 📱 Phone: [your-phone-number]

---

<div align="center">
  <strong>🏢 Linkoma Web Admin - Giải Pháp Quản Lý Chung Cư Chuyên Nghiệp 🏢</strong>
  <br/>
  <em>🖥️ Web Admin Dashboard | 📱 Mobile App cho Resident (riêng biệt)</em>
</div>
