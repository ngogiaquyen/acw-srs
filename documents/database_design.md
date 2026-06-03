## 2.4 Thiết kế bảng dữ liệu

Bảng: tenants
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| name | varchar(255) | NOT NULL |
| email | varchar(255) | UNIQUE, NOT NULL |
| phone | varchar(20) | — |
| address | text | — |
| license_max_devices | int | Default: 0 |
| subscription_status | enum('active', 'suspended', 'expired') | Default: 'active' |
| subscription_start_date | date | — |
| subscription_end_date | date | — |
| allow_expired_access | boolean | Default: FALSE |
| is_active | boolean | Default: TRUE |
| sepay_bank_account | varchar(50) | Default: NULL |
| sepay_bank_code | varchar(20) | Default: NULL |
| sepay_account_name | varchar(100) | Default: NULL |
| sepay_webhook_secret | varchar(255) | Default: NULL |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |
| updated_at | timestamp | Default: CURRENT_TIMESTAMP |

Bảng 2.1 Cấu trúc bảng tenants


Bảng: users
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| email | varchar(255) | UNIQUE, NOT NULL |
| password_hash | varchar(255) | NOT NULL |
| role | enum('SUPER_ADMIN', 'TENANT_ADMIN') | NOT NULL |
| tenant_id | int | NULL, FOREIGN KEY |
| name | varchar(255) | NOT NULL |
| phone | varchar(20) | — |
| is_active | boolean | Default: TRUE |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |
| updated_at | timestamp | Default: CURRENT_TIMESTAMP |

Bảng 2.2 Cấu trúc bảng users


Bảng: devices
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| tenant_id | int | NOT NULL, FOREIGN KEY |
| device_id | varchar(255) | UNIQUE, NOT NULL |
| name | varchar(255) | NOT NULL |
| last_heartbeat | timestamp | NULL |
| last_ip | varchar(45) | Default: NULL |
| firmware_version | varchar(50) | — |
| is_active | boolean | Default: TRUE |
| price_per_minute | decimal(10, 2) | Default: NULL |
| payment_code | varchar(50) | Default: NULL |
| web_username | varchar(255) | Default: NULL |
| web_password | varchar(255) | Default: NULL |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |
| updated_at | timestamp | Default: CURRENT_TIMESTAMP |

Bảng 2.3 Cấu trúc bảng devices


Bảng: transactions
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| tenant_id | int | NOT NULL, FOREIGN KEY |
| device_id | int | NOT NULL, FOREIGN KEY |
| pricing_package_id | int | NULL |
| qr_code | varchar(255) | NOT NULL |
| amount | decimal(10, 2) | NOT NULL |
| duration_minutes | int | NOT NULL |
| status | enum('pending', 'completed', 'failed', 'refunded') | Default: 'pending' |
| payment_method | varchar(50) | — |
| payment_transaction_id | varchar(255) | — |
| started_at | timestamp | NULL |
| ended_at | timestamp | NULL |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |
| updated_at | timestamp | Default: CURRENT_TIMESTAMP |

Bảng 2.4 Cấu trúc bảng transactions


Bảng: device_commands
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| device_id | int | NOT NULL, FOREIGN KEY |
| command_type | enum('start', 'stop', 'add_time', 'restart', 'update_firmware', 'config') | NOT NULL |
| command_data | json | NULL |
| status | enum('pending', 'sent', 'executed', 'failed') | Default: 'pending' |
| response_data | json | NULL |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |
| executed_at | timestamp | NULL |

Bảng 2.5 Cấu trúc bảng device_commands


Bảng: device_logs
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| device_id | int | NOT NULL, FOREIGN KEY |
| log_level | enum('info', 'warning', 'error') | Default: 'info' |
| message | text | NOT NULL |
| metadata | json | NULL |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |

Bảng 2.6 Cấu trúc bảng device_logs


Bảng: leads
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| name | varchar(255) | NOT NULL |
| email | varchar(255) | NOT NULL |
| phone | varchar(20) | — |
| company | varchar(255) | — |
| address | text | — |
| message | text | — |
| source | varchar(100) | Default: 'website' |
| status | enum('new', 'contacted', 'qualified', 'converted', 'lost') | Default: 'new' |
| assigned_to | int | NULL, FOREIGN KEY |
| notes | text | — |
| is_active | boolean | Default: TRUE |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |
| updated_at | timestamp | Default: CURRENT_TIMESTAMP |

Bảng 2.7 Cấu trúc bảng leads


Bảng: orders
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| lead_id | int | NULL, FOREIGN KEY |
| order_number | varchar(50) | UNIQUE, NOT NULL |
| customer_name | varchar(255) | NOT NULL |
| customer_email | varchar(255) | NOT NULL |
| customer_phone | varchar(20) | — |
| customer_address | text | — |
| package_name | varchar(255) | NOT NULL |
| package_description | text | — |
| quantity | int | Default: 1 |
| unit_price | decimal(12, 2) | NOT NULL |
| total_amount | decimal(12, 2) | NOT NULL |
| currency | varchar(10) | Default: 'VND' |
| status | enum('draft', 'pending', 'confirmed', 'processing', 'delivered', 'completed', 'cancelled') | Default: 'draft' |
| payment_status | enum('unpaid', 'partial', 'paid', 'refunded') | Default: 'unpaid' |
| payment_method | varchar(50) | — |
| payment_transaction_id | varchar(255) | — |
| tenant_id | int | NULL, FOREIGN KEY |
| notes | text | — |
| is_active | boolean | Default: TRUE |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |
| updated_at | timestamp | Default: CURRENT_TIMESTAMP |
| confirmed_at | timestamp | NULL |

Bảng 2.8 Cấu trúc bảng orders


Bảng: password_reset_tokens
| Tên trường | Kiểu dữ liệu | Ràng buộc |
| :--- | :--- | :--- |
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| email | varchar(255) | NOT NULL |
| token | varchar(255) | NOT NULL |
| expires_at | timestamp | NOT NULL |
| used | boolean | Default: FALSE |
| created_at | timestamp | Default: CURRENT_TIMESTAMP |

Bảng 2.9 Cấu trúc bảng password_reset_tokens
