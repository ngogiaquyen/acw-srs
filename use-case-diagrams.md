# Sơ Đồ Use Case cho Dự Án ACW-SRS

Dự án ACW-SRS (Auto Car Wash Smart Rental System) là nền tảng quản lý trạm rửa xe tự động theo mô hình SaaS/Multi-tenant, kết nối thiết bị ESP32 với web dashboard.

## 1. Sơ Đồ Use Case Tổng Quát

```mermaid
usecase "Manage Tenants" as MT
usecase "View System Revenue" as VSR
usecase "Manage Leads" as ML
usecase "Manage Orders" as MO
usecase "Simulate Payments" as SP
usecase "Manage Devices" as MD
usecase "Manage Stations" as MS
usecase "View Transactions" as VT
usecase "View Revenue" as VR
usecase "Configure Settings" as CS
usecase "Register Device" as RD
usecase "Start Washing" as SW
usecase "Stop Washing" as STW
usecase "Make Payment" as MP
usecase "Register with System" as RWS
usecase "Send Heartbeat" as SH
usecase "Receive Commands" as RC
usecase "Send Logs" as SL

actor "Super Admin" as SA
actor "Tenant Admin" as TA
actor "End User" as EU
actor "IoT Device" as ID

SA --> MT
SA --> VSR
SA --> ML
SA --> MO
SA --> SP

TA --> MD
TA --> MS
TA --> VT
TA --> VR
TA --> CS

EU --> RD
EU --> SW
EU --> STW
EU --> MP

ID --> RWS
ID --> SH
ID --> RC
ID --> SL
```

## 2. Sơ Đồ Use Case Chi Tiết cho Super Admin

```mermaid
usecase "Create Tenant" as CT
usecase "Edit Tenant" as ET
usecase "View Tenant Details" as VTD
usecase "View Revenue Charts" as VRC
usecase "Compare Tenant Revenue" as CTR
usecase "View Leads" as VL
usecase "Convert Lead to Order" as CLO
usecase "View Orders" as VO
usecase "Process Order" as PO
usecase "Simulate Payment Transaction" as SPT

actor "Super Admin" as SA

SA --> CT
SA --> ET
SA --> VTD
SA --> VRC
SA --> CTR
SA --> VL
SA --> CLO
SA --> VO
SA --> PO
SA --> SPT

"Manage Tenants" as MT ..> CT : include
MT ..> ET : include
MT ..> VTD : include
"View System Revenue" as VSR ..> VRC : include
VSR ..> CTR : include
"Manage Leads" as ML ..> VL : include
ML ..> CLO : include
"Manage Orders" as MO ..> VO : include
MO ..> PO : include
"Simulate Payments" as SP ..> SPT : include
```

## 3. Sơ Đồ Use Case Chi Tiết cho Tenant Admin

```mermaid
usecase "Add Device" as AD
usecase "Edit Device" as ED
usecase "View Device List" as VDL
usecase "Monitor Device Status" as MDS
usecase "Add Station" as AS
usecase "Edit Station" as ES
usecase "View Station List" as VSL
usecase "View Transaction History" as VTH
usecase "View Revenue Reports" as VRR
usecase "Update Settings" as US
usecase "Configure Payment" as CP

actor "Tenant Admin" as TA

TA --> AD
TA --> ED
TA --> VDL
TA --> MDS
TA --> AS
TA --> ES
TA --> VSL
TA --> VTH
TA --> VRR
TA --> US
TA --> CP

"Manage Devices" as MD ..> AD : include
MD ..> ED : include
MD ..> VDL : include
MD ..> MDS : include
"Manage Stations" as MS ..> AS : include
MS ..> ES : include
MS ..> VSL : include
"View Transactions" as VT ..> VTH : include
"View Revenue" as VR ..> VRR : include
"Configure Settings" as CS ..> US : include
CS ..> CP : include
```

## 4. Sơ Đồ Use Case Chi Tiết cho End User

```mermaid
usecase "Scan QR Code" as SQC
usecase "Enter Device ID" as EID
usecase "Authenticate User" as AU
usecase "Select Washing Program" as SWP
usecase "Confirm Payment" as CP
usecase "Start Washing Process" as SWP2
usecase "Monitor Washing Progress" as MWP
usecase "Stop Washing Early" as SWE
usecase "Receive Receipt" as RR

actor "End User" as EU

EU --> SQC
EU --> EID
EU --> AU
EU --> SWP
EU --> CP
EU --> SWP2
EU --> MWP
EU --> SWE
EU --> RR

"Register Device" as RD ..> SQC : include
RD ..> EID : include
RD ..> AU : include
"Start Washing" as SW ..> SWP : include
SW ..> CP : include
SW ..> SWP2 : include
SW ..> MWP : include
"Stop Washing" as STW ..> SWE : include
"Make Payment" as MP ..> CP : include
MP ..> RR : include
```

## 5. Sơ Đồ Use Case Chi Tiết cho IoT Device

```mermaid
usecase "Send Registration Request" as SRR
usecase "Receive Registration Confirmation" as RRC
usecase "Send Periodic Heartbeat" as SPH
usecase "Receive Heartbeat Acknowledgment" as RHA
usecase "Receive Start Command" as RSC
usecase "Execute Washing Cycle" as EWC
usecase "Send Status Updates" as SSU
usecase "Receive Stop Command" as RSC2
usecase "Send Completion Log" as SCL
usecase "Send Error Logs" as SEL

actor "IoT Device" as ID

ID --> SRR
ID --> RRC
ID --> SPH
ID --> RHA
ID --> RSC
ID --> EWC
ID --> SSU
ID --> RSC2
ID --> SCL
ID --> SEL

"Register with System" as RWS ..> SRR : include
RWS ..> RRC : include
"Send Heartbeat" as SH ..> SPH : include
SH ..> RHA : include
"Receive Commands" as RC ..> RSC : include
RC ..> RSC2 : include
RC ..> EWC : include
"Send Logs" as SL ..> SCL : include
SL ..> SEL : include
SL ..> SSU : include
```