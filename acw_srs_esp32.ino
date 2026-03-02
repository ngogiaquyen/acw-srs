#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ========== CẤU HÌNH PHẦN CỨNG ==========
#define RELAY_PIN 5          // Chân điều khiển relay (LOW = ON, HIGH = OFF)

// ========== CẤU HÌNH WIFI ==========
const char* WIFI_SSID     = "XOM TRO BAT ON 5";
const char* WIFI_PASSWORD = "khongchodau@";

// ========== CẤU HÌNH SERVER BACKEND ==========
const char* SERVER_BASE = "http://192.168.1.91:3000:3000"; // Địa chỉ máy chạy Next.js (KHÔNG dùng localhost)

// ========== CẤU HÌNH THIẾT BỊ / TENANT ==========
const char* DEVICE_ID   = "1"; // Chuỗi nhận diện thiết bị
const int   TENANT_ID   = 1;           // ID tenant trong DB
const int   STATION_ID  = 1;           // ID trạm (stations.id), nếu không có thì dùng 0
const int   DEVICE_DB_ID = 1;          // ID trong bảng devices (devices.id) dùng cho /commands, /logs

// ========== THỜI GIAN LẶP ==========
const unsigned long HEARTBEAT_INTERVAL_MS = 30UL * 1000; // 30 giây
const unsigned long COMMAND_INTERVAL_MS   = 5UL * 1000;  // 5 giây

unsigned long lastHeartbeatMs = 0;
unsigned long lastCommandMs   = 0;

// ========== HÀM TIỆN ÍCH ==========

void relayOn() {
  digitalWrite(RELAY_PIN, LOW);
  Serial.println("[RELAY] ON");
}

void relayOff() {
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println("[RELAY] OFF");
}

bool httpPostJson(const String& url, const String& body, String* respOut = nullptr) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] WiFi not connected");
    return false;
  }

  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int code = http.POST(body);
  String resp = http.getString();
  http.end();

  Serial.printf("[HTTP] POST %s -> %d\n", url.c_str(), code);
  if (respOut) {
    *respOut = resp;
  }
  return code >= 200 && code < 300;
}

// ========== ĐĂNG KÝ THIẾT BỊ ==========

bool registerDevice() {
  StaticJsonDocument<256> doc;
  doc["deviceId"]        = DEVICE_ID;
  doc["tenantId"]        = TENANT_ID;
  if (STATION_ID > 0) {
    doc["stationId"] = STATION_ID;
  } else {
    doc["stationId"] = nullptr;
  }
  doc["name"]            = "May rua ESP32";
  doc["firmwareVersion"] = "1.0.0";

  String body;
  serializeJson(doc, body);

  String url = String(SERVER_BASE) + "/api/iot/device/register";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[REGISTER] ok=%d, resp=%s\n", ok, resp.c_str());
  return ok;
}

// ========== HEARTBEAT ==========

void sendHeartbeat() {
  StaticJsonDocument<128> doc;
  doc["deviceId"] = DEVICE_ID;

  String body;
  serializeJson(doc, body);

  String url = String(SERVER_BASE) + "/api/iot/device/heartbeat";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[HEARTBEAT] ok=%d, resp=%s\n", ok, resp.c_str());
}

// ========== GỬI LOG ==========

void sendLog(const char* level, const char* message) {
  StaticJsonDocument<512> doc;
  doc["logLevel"] = level;   // "info" | "warning" | "error"
  doc["message"]  = message;

  String body;
  serializeJson(doc, body);

  String url = String(SERVER_BASE) + "/api/iot/device/" + String(DEVICE_DB_ID) + "/logs";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[LOG] ok=%d, resp=%s\n", ok, resp.c_str());
}

// ========== PHẢN HỒI LỆNH ==========

void sendCommandResponse(int commandId, bool okExec, const char* msg) {
  StaticJsonDocument<512> doc;
  doc["commandId"]   = commandId;
  doc["status"]      = okExec ? "executed" : "failed";
  doc["responseData"] = msg;

  String body;
  serializeJson(doc, body);

  String url = String(SERVER_BASE) + "/api/iot/device/" + String(DEVICE_DB_ID) + "/response";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[CMD-RESP] ok=%d, resp=%s\n", ok, resp.c_str());
}

// ========== XỬ LÝ LỆNH TỪ SERVER ==========

void handleCommand(const String& type, const String& data, int cmdId) {
  Serial.printf("[CMD] type=%s, data=%s\n", type.c_str(), data.c_str());

  bool success = true;

  if (type == "start") {
    relayOn();
  } else if (type == "stop") {
    relayOff();
  } else if (type == "restart") {
    // Ví dụ: chỉ gửi log, không tự restart
    sendLog("info", "Nhan lenh restart (chua thuc hien)");
  } else if (type == "update_firmware") {
    sendLog("info", "Nhan lenh update_firmware (chua thuc hien)");
  } else if (type == "config") {
    sendLog("info", "Nhan lenh config (chua thuc hien)");
  } else {
    success = false;
  }

  sendCommandResponse(cmdId, success, success ? "OK" : "Unknown command");
}

void fetchCommands() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(SERVER_BASE) + "/api/iot/device/" + String(DEVICE_DB_ID) + "/commands";
  http.begin(url);
  int code = http.GET();
  String payload = http.getString();
  http.end();

  Serial.printf("[CMD] GET %s -> %d\n", url.c_str(), code);
  if (code != 200) {
    return;
  }

  StaticJsonDocument<2048> doc;
  if (deserializeJson(doc, payload) != DeserializationError::Ok) {
    Serial.println("[CMD] JSON parse error");
    return;
  }

  JsonArray commands = doc["commands"].as<JsonArray>();
  for (JsonObject cmd : commands) {
    int cmdId         = cmd["id"].as<int>();
    String cmdType    = cmd["command_type"].as<String>();
    String cmdPayload = "";

    if (!cmd["command_data"].isNull()) {
      // command_data được lưu dạng JSON string, ở đây ta đọc dạng chuỗi thô
      cmdPayload = cmd["command_data"].as<String>();
    }

    handleCommand(cmdType, cmdPayload, cmdId);
  }
}

// ========== WIFI KẾT NỐI ==========

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.printf("Connecting to WiFi %s", WIFI_SSID);

  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 40) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi connected, IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi connect failed");
  }
}

// ========== SETUP / LOOP ==========

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  relayOff();

  connectWifi();

  if (WiFi.status() == WL_CONNECTED) {
    registerDevice();
    sendLog("info", "ESP32 started & registered");
  }
}

void loop() {
  unsigned long now = millis();

  if (now - lastHeartbeatMs > HEARTBEAT_INTERVAL_MS) {
    lastHeartbeatMs = now;
    sendHeartbeat();
  }

  if (now - lastCommandMs > COMMAND_INTERVAL_MS) {
    lastCommandMs = now;
    fetchCommands();
  }

  // Các xử lý khác nếu cần…
}