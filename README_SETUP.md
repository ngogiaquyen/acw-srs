# HƯỚNG DẪN SETUP DỰ ÁN

## Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- MySQL 8.0+ (sẽ cần ở giai đoạn 2)
sử dụng ui.shadcn
## Cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Tạo file `.env.local`:**
```bash
# Copy từ env.example
cp env.example .env.local
```

Sau đó chỉnh sửa các giá trị trong `.env.local` theo môi trường của bạn.

3. **Chạy development server:**
```bash
npm run dev
```

4. **Mở trình duyệt:**
Truy cập: http://localhost:3000

## Cấu trúc dự án

```
esp32/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React Components
│   ├── ui/               # Reusable UI components
│   ├── super-admin/      # Super Admin components
│   ├── tenant/           # Tenant Admin components
│   └── shared/           # Shared components
├── lib/                   # Utilities & Libraries
│   ├── db/               # Database utilities
│   ├── auth/             # Authentication
│   ├── utils/            # Helper functions
│   └── types/            # TypeScript types
└── public/               # Static files
```

## Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy ESLint

## Giai đoạn tiếp theo

Sau khi setup xong, tiếp tục với:
- **Giai đoạn 2:** Setup Database MySQL
- **Giai đoạn 3:** Authentication System Cơ bản

Xem chi tiết trong file `README_IMPLEMENTATION_PHASES.md`
