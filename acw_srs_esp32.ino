#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <WebServer.h>

// ========== CẤU HÌNH PHẦN CỨNG ==========
#define RELAY_PIN 5           // Chân điều khiển relay
#define RELAY_ACTIVE_LOW true // true: LOW=ON, false: HIGH=ON

// ========== GIÁ TRỊ MẶC ĐỊNH ==========
#define DEFAULT_WIFI_SSID       "XOM TRO BAT ON 5"
#define DEFAULT_WIFI_PASSWORD   "khongchodau@"
#define DEFAULT_SERVER_BASE     "http://192.168.1.91:3000"
#define DEFAULT_DEVICE_ID       "1"
#define DEFAULT_DEVICE_NAME     "May rua ESP32"
#define DEFAULT_FIRMWARE_VER    "1.0.0"
#define DEFAULT_TENANT_ID       1
#define DEFAULT_DEVICE_DB_ID    1
#define DEFAULT_HB_INTERVAL_S   30
#define DEFAULT_CMD_INTERVAL_S  5

// ========== CẦU HÌNH RUNTIME (đọc từ NVS) ==========
char cfg_wifi_ssid[64];
char cfg_wifi_password[64];
char cfg_server_base[128];
char cfg_device_id[64];
char cfg_device_name[64];
char cfg_firmware_ver[32];
int  cfg_tenant_id;
int  cfg_device_db_id;
int  cfg_hb_interval_s;
int  cfg_cmd_interval_s;

Preferences prefs;
WebServer   configServer(80);

// ========== THỜI GIAN LẶP ==========
unsigned long lastHeartbeatMs = 0;
unsigned long lastCommandMs   = 0;

// ========== NVS: ĐỌC / LƯU CẤU HÌNH ==========

void loadConfig() {
  prefs.begin("acw", false);

  prefs.getString("wifi_ssid",     cfg_wifi_ssid,     sizeof(cfg_wifi_ssid));
  if (strlen(cfg_wifi_ssid) == 0) strlcpy(cfg_wifi_ssid, DEFAULT_WIFI_SSID, sizeof(cfg_wifi_ssid));

  prefs.getString("wifi_pass",     cfg_wifi_password, sizeof(cfg_wifi_password));
  if (strlen(cfg_wifi_password) == 0) strlcpy(cfg_wifi_password, DEFAULT_WIFI_PASSWORD, sizeof(cfg_wifi_password));

  prefs.getString("server_base",   cfg_server_base,   sizeof(cfg_server_base));
  if (strlen(cfg_server_base) == 0) strlcpy(cfg_server_base, DEFAULT_SERVER_BASE, sizeof(cfg_server_base));

  prefs.getString("device_id",     cfg_device_id,     sizeof(cfg_device_id));
  if (strlen(cfg_device_id) == 0) strlcpy(cfg_device_id, DEFAULT_DEVICE_ID, sizeof(cfg_device_id));

  prefs.getString("device_name",   cfg_device_name,   sizeof(cfg_device_name));
  if (strlen(cfg_device_name) == 0) strlcpy(cfg_device_name, DEFAULT_DEVICE_NAME, sizeof(cfg_device_name));

  prefs.getString("firmware_ver",  cfg_firmware_ver,  sizeof(cfg_firmware_ver));
  if (strlen(cfg_firmware_ver) == 0) strlcpy(cfg_firmware_ver, DEFAULT_FIRMWARE_VER, sizeof(cfg_firmware_ver));

  cfg_tenant_id      = prefs.getInt("tenant_id",      DEFAULT_TENANT_ID);
  cfg_device_db_id   = prefs.getInt("device_db_id",   DEFAULT_DEVICE_DB_ID);
  cfg_hb_interval_s  = prefs.getInt("hb_interval_s",  DEFAULT_HB_INTERVAL_S);
  cfg_cmd_interval_s = prefs.getInt("cmd_interval_s",  DEFAULT_CMD_INTERVAL_S);

  prefs.end();

  Serial.println("[CFG] Config loaded:");
  Serial.printf("  WiFi SSID:      %s\n", cfg_wifi_ssid);
  Serial.printf("  Server:         %s\n", cfg_server_base);
  Serial.printf("  Device ID:      %s\n", cfg_device_id);
  Serial.printf("  Tenant ID:      %d\n", cfg_tenant_id);
  Serial.printf("  Device DB ID:   %d\n", cfg_device_db_id);
  Serial.printf("  HB Interval:    %ds\n", cfg_hb_interval_s);
  Serial.printf("  CMD Interval:   %ds\n", cfg_cmd_interval_s);
}

void saveConfig() {
  prefs.begin("acw", false);
  prefs.putString("wifi_ssid",    cfg_wifi_ssid);
  prefs.putString("wifi_pass",    cfg_wifi_password);
  prefs.putString("server_base",  cfg_server_base);
  prefs.putString("device_id",    cfg_device_id);
  prefs.putString("device_name",  cfg_device_name);
  prefs.putString("firmware_ver", cfg_firmware_ver);
  prefs.putInt("tenant_id",       cfg_tenant_id);
  prefs.putInt("device_db_id",    cfg_device_db_id);
  prefs.putInt("hb_interval_s",   cfg_hb_interval_s);
  prefs.putInt("cmd_interval_s",  cfg_cmd_interval_s);
  prefs.end();
  Serial.println("[CFG] Config saved to NVS");
}

// ========== WEB CONFIG SERVER ==========

static const char CONFIG_HTML[] PROGMEM = R"rawhtml(
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ACW ESP32 Config</title>
<style>
  body{font-family:sans-serif;max-width:520px;margin:30px auto;padding:0 16px;background:#f5f5f5}
  h2{color:#1a73e8;margin-bottom:4px}
  p.sub{color:#888;font-size:13px;margin-top:0}
  fieldset{border:1px solid #ccc;border-radius:8px;padding:14px 18px;margin-bottom:16px;background:#fff}
  legend{font-weight:bold;color:#333;padding:0 6px}
  label{display:block;font-size:13px;color:#555;margin-top:10px}
  input[type=text],input[type=password],input[type=number]{
    width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid #ccc;
    border-radius:5px;font-size:14px;margin-top:3px}
  input:focus{outline:none;border-color:#1a73e8}
  .row{display:flex;gap:10px}
  .row input{flex:1}
  button{
    display:inline-block;padding:9px 22px;background:#1a73e8;color:#fff;
    border:none;border-radius:6px;cursor:pointer;font-size:14px;margin-top:8px}
  button:hover{background:#1558b0}
  .msg{margin-top:14px;padding:10px 14px;border-radius:6px;font-size:14px;display:none}
  .ok{background:#d4edda;color:#155724;border:1px solid #c3e6cb}
  .err{background:#f8d7da;color:#721c24;border:1px solid #f5c6cb}
  .ip{font-size:12px;color:#888;margin-top:6px}
</style>
</head>
<body>
<h2>&#9881; ACW ESP32 Cấu hình</h2>
<p class="sub">Thay đổi rồi nhấn <b>Lưu &amp; Khởi động lại</b></p>
<form id="f" method="POST" action="/save">

  <fieldset>
    <legend>WiFi</legend>
    <label>SSID
      <input type="text" name="wifi_ssid" value="{{wifi_ssid}}" maxlength="63">
    </label>
    <label>Mật khẩu
      <input type="password" name="wifi_pass" value="{{wifi_pass}}" maxlength="63">
    </label>
  </fieldset>

  <fieldset>
    <legend>Server Backend</legend>
    <label>Server Base URL
      <input type="text" name="server_base" value="{{server_base}}" maxlength="127"
             placeholder="http://192.168.1.x:3000">
    </label>
  </fieldset>

  <fieldset>
    <legend>Thiết bị</legend>
    <label>Device ID (chuỗi device_id trong DB)
      <input type="text" name="device_id" value="{{device_id}}" maxlength="63">
    </label>
    <label>Tên thiết bị
      <input type="text" name="device_name" value="{{device_name}}" maxlength="63">
    </label>
    <label>Firmware Version
      <input type="text" name="firmware_ver" value="{{firmware_ver}}" maxlength="31">
    </label>
    <div class="row">
      <div style="flex:1">
        <label>Tenant ID
          <input type="number" name="tenant_id" value="{{tenant_id}}" min="1">
        </label>
      </div>
      <div style="flex:1">
        <label>Device DB ID
          <input type="number" name="device_db_id" value="{{device_db_id}}" min="1">
        </label>
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Thời gian lặp</legend>
    <div class="row">
      <div style="flex:1">
        <label>Heartbeat (giây)
          <input type="number" name="hb_interval_s" value="{{hb_interval_s}}" min="5" max="3600">
        </label>
      </div>
      <div style="flex:1">
        <label>Lấy lệnh (giây)
          <input type="number" name="cmd_interval_s" value="{{cmd_interval_s}}" min="1" max="60">
        </label>
      </div>
    </div>
  </fieldset>

  <button type="submit">&#128190; Lưu &amp; Khởi động lại</button>
</form>

<div class="ip">IP hiện tại: {{local_ip}} &nbsp;|&nbsp; Truy cập: http://{{local_ip}}/</div>
<div class="msg ok" id="ok">Đã lưu! ESP32 đang khởi động lại...</div>
<div class="msg err" id="err">Lỗi khi lưu.</div>
<script>
  const p = new URLSearchParams(location.search);
  if(p.get('saved')==='1') { document.getElementById('ok').style.display='block'; }
  if(p.get('err')==='1')   { document.getElementById('err').style.display='block'; }
</script>
</body>
</html>
)rawhtml";

String buildConfigPage() {
  String html = String(CONFIG_HTML);
  html.replace("{{wifi_ssid}}",     String(cfg_wifi_ssid));
  html.replace("{{wifi_pass}}",     String(cfg_wifi_password));
  html.replace("{{server_base}}",   String(cfg_server_base));
  html.replace("{{device_id}}",     String(cfg_device_id));
  html.replace("{{device_name}}",   String(cfg_device_name));
  html.replace("{{firmware_ver}}",  String(cfg_firmware_ver));
  html.replace("{{tenant_id}}",     String(cfg_tenant_id));
  html.replace("{{device_db_id}}",  String(cfg_device_db_id));
  html.replace("{{hb_interval_s}}", String(cfg_hb_interval_s));
  html.replace("{{cmd_interval_s}}",String(cfg_cmd_interval_s));
  html.replace("{{local_ip}}",      WiFi.localIP().toString());
  return html;
}

void handleConfigGet() {
  configServer.send(200, "text/html; charset=utf-8", buildConfigPage());
}

void handleConfigSave() {
  // Đọc từng field; nếu rỗng giữ nguyên giá trị cũ
  if (configServer.hasArg("wifi_ssid") && configServer.arg("wifi_ssid").length() > 0)
    strlcpy(cfg_wifi_ssid, configServer.arg("wifi_ssid").c_str(), sizeof(cfg_wifi_ssid));

  if (configServer.hasArg("wifi_pass") && configServer.arg("wifi_pass").length() > 0)
    strlcpy(cfg_wifi_password, configServer.arg("wifi_pass").c_str(), sizeof(cfg_wifi_password));

  if (configServer.hasArg("server_base") && configServer.arg("server_base").length() > 0)
    strlcpy(cfg_server_base, configServer.arg("server_base").c_str(), sizeof(cfg_server_base));

  if (configServer.hasArg("device_id") && configServer.arg("device_id").length() > 0)
    strlcpy(cfg_device_id, configServer.arg("device_id").c_str(), sizeof(cfg_device_id));

  if (configServer.hasArg("device_name") && configServer.arg("device_name").length() > 0)
    strlcpy(cfg_device_name, configServer.arg("device_name").c_str(), sizeof(cfg_device_name));

  if (configServer.hasArg("firmware_ver") && configServer.arg("firmware_ver").length() > 0)
    strlcpy(cfg_firmware_ver, configServer.arg("firmware_ver").c_str(), sizeof(cfg_firmware_ver));

  if (configServer.hasArg("tenant_id"))
    cfg_tenant_id = configServer.arg("tenant_id").toInt();

  if (configServer.hasArg("device_db_id"))
    cfg_device_db_id = configServer.arg("device_db_id").toInt();

  if (configServer.hasArg("hb_interval_s"))
    cfg_hb_interval_s = max(5, configServer.arg("hb_interval_s").toInt());

  if (configServer.hasArg("cmd_interval_s"))
    cfg_cmd_interval_s = max(1, configServer.arg("cmd_interval_s").toInt());

  saveConfig();

  // Redirect về trang chính với thông báo saved
  configServer.sendHeader("Location", "/?saved=1");
  configServer.send(303);

  // Đợi gửi xong rồi restart
  delay(800);
  ESP.restart();
}

void startConfigServer() {
  configServer.on("/",     HTTP_GET,  handleConfigGet);
  configServer.on("/save", HTTP_POST, handleConfigSave);
  configServer.begin();
  Serial.printf("[WEB] Config server started at http://%s/\n", WiFi.localIP().toString().c_str());
}

// ========== HÀM TIỆN ÍCH ==========

void relayOn() {
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_LOW ? LOW : HIGH);
  Serial.printf("[RELAY] ON (pin=%d, level=%s)\n", RELAY_PIN, RELAY_ACTIVE_LOW ? "LOW" : "HIGH");
}

void relayOff() {
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_LOW ? HIGH : LOW);
  Serial.printf("[RELAY] OFF (pin=%d, level=%s)\n", RELAY_PIN, RELAY_ACTIVE_LOW ? "HIGH" : "LOW");
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
  doc["deviceId"]        = cfg_device_id;
  doc["tenantId"]        = cfg_tenant_id;
  doc["name"]            = cfg_device_name;
  doc["firmwareVersion"] = cfg_firmware_ver;

  String body;
  serializeJson(doc, body);

  String url = String(cfg_server_base) + "/api/iot/device/register";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[REGISTER] ok=%d, resp=%s\n", ok, resp.c_str());
  return ok;
}

// ========== HEARTBEAT ==========

void sendHeartbeat() {
  StaticJsonDocument<128> doc;
  doc["deviceId"] = cfg_device_id;

  String body;
  serializeJson(doc, body);

  String url = String(cfg_server_base) + "/api/iot/device/heartbeat";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[HEARTBEAT] ok=%d, resp=%s\n", ok, resp.c_str());
}

// ========== GỬI LOG ==========

void sendLog(const char* level, const char* message) {
  StaticJsonDocument<512> doc;
  doc["logLevel"] = level;
  doc["message"]  = message;

  String body;
  serializeJson(doc, body);

  String url = String(cfg_server_base) + "/api/iot/device/" + String(cfg_device_db_id) + "/logs";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[LOG] ok=%d, resp=%s\n", ok, resp.c_str());
}

// ========== PHẢN HỒI LỆNH ==========

void sendCommandResponse(int commandId, bool okExec, const char* msg) {
  StaticJsonDocument<512> doc;
  doc["commandId"]    = commandId;
  doc["status"]       = okExec ? "executed" : "failed";
  doc["responseData"] = msg;

  String body;
  serializeJson(doc, body);

  String url = String(cfg_server_base) + "/api/iot/device/" + String(cfg_device_db_id) + "/response";
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
    sendLog("info", "May rua bat dau hoat dong");
  } else if (type == "stop") {
    relayOff();
    sendLog("info", "May rua da dung");
  } else if (type == "restart") {
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
  String url = String(cfg_server_base) + "/api/iot/device/" + String(cfg_device_db_id) + "/commands";
  http.begin(url);
  int code = http.GET();
  String payload = http.getString();
  http.end();

  Serial.printf("[CMD] GET %s -> %d\n", url.c_str(), code);
  if (code != 200) return;

  StaticJsonDocument<2048> doc;
  if (deserializeJson(doc, payload) != DeserializationError::Ok) {
    Serial.println("[CMD] JSON parse error");
    return;
  }

  JsonArray commands = doc["commands"].as<JsonArray>();
  for (JsonObject cmd : commands) {
    int cmdId      = cmd["id"].as<int>();
    String cmdType = cmd["command_type"].as<String>();
    String cmdData = "";
    if (!cmd["command_data"].isNull()) {
      cmdData = cmd["command_data"].as<String>();
    }
    handleCommand(cmdType, cmdData, cmdId);
  }
}

// ========== WIFI KẾT NỐI ==========

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(cfg_wifi_ssid, cfg_wifi_password);
  Serial.printf("Connecting to WiFi %s", cfg_wifi_ssid);

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

  loadConfig();
  connectWifi();

  if (WiFi.status() == WL_CONNECTED) {
    startConfigServer();
    registerDevice();
    sendLog("info", "ESP32 started & registered");
  }
}

void loop() {
  configServer.handleClient(); // xử lý web request

  unsigned long now = millis();

  if (now - lastHeartbeatMs > (unsigned long)cfg_hb_interval_s * 1000UL) {
    lastHeartbeatMs = now;
    sendHeartbeat();
  }

  if (now - lastCommandMs > (unsigned long)cfg_cmd_interval_s * 1000UL) {
    lastCommandMs = now;
    fetchCommands();
  }
}
