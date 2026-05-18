# 🧋 Bobatea — Ứng dụng Bán Trà Sữa Trực Tuyến

**Thông tin sinh viên:**
- **Họ và tên:** Đào Minh Nhựt
- **MSSV:** 23110282
- **Chuyên ngành:** Công nghệ phần mềm (Software Engineering)
- **Môn học:** Các công nghệ phần mềm mới

---

## 📖 Giới thiệu dự án

**Bobatea** là một ứng dụng web thương mại điện tử full-stack hoàn chỉnh cho một cửa hàng trà sữa, được xây dựng theo mô hình **Client-Server** với kiến trúc RESTful API. Dự án triển khai đầy đủ các chức năng của một trang bán hàng hiện đại: xác thực người dùng bảo mật, trang chủ có phân loại sản phẩm, trang chi tiết sản phẩm với thư viện ảnh, bộ lọc đa điều kiện, tối ưu hiển thị (Lazy Loading, Phân trang ngang) và bảng quản trị dành cho Admin.

---

## ✨ Các tính năng nổi bật (Key Features)

### 1. 🔑 Xác thực & Bảo mật (Authentication & Security)
- **Đăng ký** tài khoản và xác minh Email qua mã **OTP** (có thời hạn) trước khi kích hoạt.
- **Đăng nhập** trả về **JWT Access Token** (stateless), được ký bằng secret key an toàn.
- **Phân quyền** hai vai trò: `user` (thành viên) và `admin` — mỗi vai trò chỉ truy cập được tài nguyên tương ứng.
- **Rate Limiting** trên endpoint `/login` và `/register` để chống tấn công Brute-force và Spam.
- **Quên mật khẩu** qua email: gửi OTP → xác minh → đặt mật khẩu mới.
- **Mã hoá mật khẩu** bằng `bcryptjs` trước khi lưu vào database.
- **Validation** toàn bộ dữ liệu đầu vào (định dạng email, độ dài mật khẩu,...) trả về lỗi rõ ràng cho Frontend.

### 2. 🏠 Trang chủ (Homepage)
- **Section 🔥 Đang Khuyến Mãi:** Hiển thị các sản phẩm đang được giảm giá.
- **Section ✨ Trà Sữa Mới Ra Mắt:** Hiển thị các sản phẩm mới nhất.
- **Section 🏆 Top 10 Bán Chạy Nhất:** Hiển thị 10 sản phẩm có lượng bán cao nhất với tính năng **phân trang ngang (Horizontal Pagination)**.
- **Section 👁️ Top 10 Xem Nhiều Nhất:** Hiển thị 10 sản phẩm được xem nhiều nhất với tính năng **phân trang ngang**.
- **Section 📦 Tất Cả Sản Phẩm Theo Danh Mục:** Danh sách sản phẩm tích hợp **Lazy Loading (Infinite Scroll)** tự động tải thêm dữ liệu khi cuộn đến cuối trang, sử dụng `IntersectionObserver`.
- Giao diện responsive, hiển thị đẹp trên cả desktop và mobile với **Tailwind CSS**.

### 3. 🔍 Tìm kiếm & Lọc đa điều kiện
- **Tìm kiếm** theo tên sản phẩm (gõ tên → Enter hoặc bấm nút).
- **Lọc theo danh mục** (Trà Sữa Truyền Thống, Trà Trái Cây, Macchiato & Kem Cheese).
- **Lọc Chỉ khuyến mãi** (checkbox).
- **Lọc Chỉ hàng mới** (checkbox).
- **Sắp xếp** theo: Mới nhất, Giá tăng dần, Giá giảm dần, Bán chạy nhất, Xem nhiều nhất.
- Tự động gọi lại API mỗi khi thay đổi điều kiện lọc.

### 4. 📄 Trang chi tiết sản phẩm
- **Swiper carousel** hiển thị nhiều ảnh (ảnh thumbnail + ảnh phụ) có nút điều hướng và phân trang.
- Tự động tăng số lượng **Lượt xem (Views)** mỗi khi người dùng truy cập.
- Hiển thị **danh mục**, **nhãn Khuyến mãi**, **giá gốc & giá sau giảm**.
- Hiển thị **số lượng hàng tồn kho** và **số lượng đã bán**.
- **Tăng/giảm số lượng** mua (có giới hạn theo stock, không vượt quá hàng tồn).
- **Sản phẩm tương tự** cùng danh mục hiển thị phía dưới.

### 5. 🖼️ Quản lý ảnh với Cloudinary
- Ảnh sản phẩm (thumbnail và ảnh phụ) được lưu trữ trực tiếp trên **Cloudinary CDN** giúp tối ưu tốc độ tải trang.
- Tích hợp API upload ảnh lên Cloudinary.

### 6. 👤 Trang quản trị Admin
- Xem danh sách người dùng, quản lý thông tin tài khoản.
- Trang được bảo vệ — chỉ tài khoản có role `admin` mới truy cập được.

---

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Mục đích |
|---|---|
| **Node.js + Express.js** | Nền tảng server & RESTful API |
| **Sequelize + MySQL** | ORM & cơ sở dữ liệu quan hệ |
| **jsonwebtoken** | Phát hành & xác minh JWT Token |
| **bcryptjs** | Mã hoá mật khẩu |
| **express-rate-limit** | Giới hạn request chống Brute-force |
| **Cloudinary + Multer** | Upload & lưu trữ ảnh trên CDN |
| **Nodemailer** | Gửi email OTP xác thực |
| **dotenv** | Quản lý biến môi trường |

### Frontend
| Công nghệ | Mục đích |
|---|---|
| **React + Vite** | Framework UI hiện đại, build nhanh |
| **Tailwind CSS** | Styling utility-first, responsive |
| **Redux Toolkit** | Quản lý trạng thái xác thực toàn cục |
| **React Router v6** | Điều hướng & Protected Routes |
| **Swiper.js** | Carousel ảnh sản phẩm |
| **Axios** | HTTP client gọi API |

---

## 🗂️ Cấu trúc dự án

```
BaiTap05_CacCongNghePhanMemMoi/
├── backend/
│   └── src/
│       ├── config/         # Cấu hình DB, Cloudinary
│       ├── controllers/    # Xử lý logic request/response
│       ├── middlewares/    # Auth, Rate Limiter, Upload
│       ├── models/         # Sequelize Models (User, Product, Category, ProductImage)
│       ├── routes/         # Định nghĩa API routes
│       ├── services/       # Business logic (gửi email,...)
│       ├── utils/          # Seed data, tạo admin
│       └── validations/    # Kiểm tra dữ liệu đầu vào
└── frontend/
    └── src/
        ├── components/     # Layout, UI components dùng chung
        ├── pages/          # Các trang: Login, Register, Home, ProductDetail,...
        ├── redux/          # Auth slice & store
        ├── routes/         # ProtectedRoute theo role
        └── services/       # Axios API service
```

---

## 🚀 API Endpoints

### 🔐 Xác thực (`/api/auth`)
| Method | Endpoint | Mô tả | Bảo vệ |
|--------|----------|--------|--------|
| POST | `/login` | Đăng nhập, nhận JWT Token | Rate Limit |
| POST | `/register` | Đăng ký tài khoản mới | Rate Limit |
| POST | `/verify-otp` | Xác minh OTP kích hoạt tài khoản | — |
| POST | `/resend-otp` | Gửi lại mã OTP | Rate Limit |
| POST | `/forgot-password` | Yêu cầu OTP đặt lại mật khẩu | — |
| POST | `/reset-password` | Xác minh OTP & cập nhật mật khẩu mới | — |

### 🛍️ Sản phẩm (`/api/products`)
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/` | Lấy danh sách sản phẩm (hỗ trợ search, filter, sort, pagination) |
| GET | `/:id` | Lấy chi tiết 1 sản phẩm + ảnh phụ + sản phẩm tương tự (Tăng view) |
| GET | `/categories` | Lấy danh sách danh mục |
| GET | `/top-best-sellers` | Lấy danh sách Top 10 sản phẩm bán chạy nhất |
| GET | `/top-most-viewed` | Lấy danh sách Top 10 sản phẩm xem nhiều nhất |

### 🖼️ Upload ảnh (`/api/upload`)
| Method | Endpoint | Mô tả | Bảo vệ |
|--------|----------|--------|--------|
| POST | `/image` | Upload 1 ảnh lên Cloudinary | JWT Token |
| POST | `/images` | Upload nhiều ảnh (tối đa 10) | JWT Token |
| DELETE | `/image/:publicId` | Xoá ảnh khỏi Cloudinary | JWT Token |

---

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18
- MySQL >= 8

### 1. Clone & cài dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc của backend:

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nhom4_baitap

# JWT
JWT_SECRET=your_jwt_secret_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=3000
NODE_ENV=development
```

### 3. Khởi động

```bash
# Chạy Backend (port 3000)
cd backend && npm run dev

# Chạy Frontend (port 5173)
cd frontend && npm run dev
```

---

## 🔒 Kết quả kiểm thử bảo mật (Postman)

### ✅ Đăng nhập thành công — HTTP 200 OK
Hệ thống trả về JWT Token và thông tin người dùng khi đăng nhập đúng email và mật khẩu.

### ❌ Sai mật khẩu — HTTP 401 Unauthorized
Hệ thống từ chối, không rò rỉ thông tin cụ thể, trả về thông báo "Thông tin đăng nhập không chính xác".

### ⚠️ Thiếu/sai Validation — HTTP 400 Bad Request
Middleware validation bắt lỗi ngay lập tức khi thiếu trường bắt buộc hoặc sai định dạng email/mật khẩu.

### 🚫 Vượt Rate Limit — HTTP 429 Too Many Requests
Sau quá nhiều lần đăng nhập thất bại liên tiếp, IP bị chặn tạm thời và nhận thông báo thử lại sau.

## 1 số hình ảnh UI:
<img width="1896" height="906" alt="image" src="https://github.com/user-attachments/assets/df113392-3630-4150-b337-e2d314cd1ace" />

<img width="1895" height="907" alt="image" src="https://github.com/user-attachments/assets/b5feacae-5801-4919-b86b-6cc36668bc90" />

<img width="1892" height="901" alt="image" src="https://github.com/user-attachments/assets/30f9e1f8-919d-485d-8275-18f58a3b1cdc" />

<img width="1894" height="894" alt="image" src="https://github.com/user-attachments/assets/06755469-c0c3-4ca9-94a8-53efe63d4db2" />

<img width="1895" height="905" alt="image" src="https://github.com/user-attachments/assets/2c5f5c13-401b-49b7-b98b-85092f32ad47" />

<img width="1891" height="898" alt="image" src="https://github.com/user-attachments/assets/7c37b22e-887e-48e1-b050-122d0e9460d0" />

<img width="1900" height="791" alt="image" src="https://github.com/user-attachments/assets/c33a06a7-2fc8-4ff1-b3c5-8105b45003ac" />

<img width="1894" height="908" alt="image" src="https://github.com/user-attachments/assets/cb7a13a6-d038-404b-bf24-56081ef47743" />
