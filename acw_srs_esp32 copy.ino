#include <WiFi.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <WebServer.h>

// ========== CẤU HÌNH PHẦN CỨNG ==========
#define RELAY_PIN 5           // Chân điều khiển relay
#define RELAY_ACTIVE_LOW false // true: LOW=ON, false: HIGH=ON

// ========== GIÁ TRỊ MẶC ĐỊNH ==========
#define DEFAULT_WIFI_SSID       "WYNDEV"
#define DEFAULT_WIFI_PASSWORD   "quyen2025"
// #define DEFAULT_SERVER_BASE     "http://192.168.1.3:3000"
#define DEFAULT_SERVER_BASE     "https://wash.wyndev.space"
#define DEFAULT_DEVICE_ID       "1"
#define DEFAULT_DEVICE_NAME     "May rua ESP32"
#define DEFAULT_FIRMWARE_VER    "1.0.0"
#define DEFAULT_HB_INTERVAL_S   30
#define DEFAULT_CMD_INTERVAL_S  5
#define DEFAULT_AP_PASSWORD     "123456788"

// ========== CẦU HÌNH RUNTIME (đọc từ NVS) ==========
char cfg_wifi_ssid[64];
char cfg_wifi_password[64];
char cfg_server_base[128];
char cfg_device_id[64];
char cfg_device_name[64];
char cfg_firmware_ver[32];
int  cfg_hb_interval_s;
int  cfg_cmd_interval_s;
char cfg_web_username[128];
char cfg_web_password[128];
bool cfg_auth_required = true;

Preferences prefs;
WebServer   configServer(80);

// ========== THỜI GIAN LẶP ==========
unsigned long lastHeartbeatMs = 0;
unsigned long lastCommandMs   = 0;
unsigned long lastWifiConnectedMs = 0; // Thời điểm cuối cùng còn thấy WiFi
bool isAPActive = false;               // Trạng thái AP đang bật hay không

// ========== HẸN GIỌ TỰ TẮT (overflow-safe) ==========
// Lưu thời gian CÒN LẠI (ms) thay vì thời điểm tắt.
// Phép trừ unsigned long luôn đúng dù millis() wrap-around ~49 ngày.
unsigned long relayRemainingMs = 0; // 0 = không hẹn
unsigned long lastLoopMs       = 0; // millis() của lần loop trước

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

  cfg_hb_interval_s  = prefs.getInt("hb_interval_s",  DEFAULT_HB_INTERVAL_S);
  cfg_cmd_interval_s = prefs.getInt("cmd_interval_s",  DEFAULT_CMD_INTERVAL_S);

  prefs.getString("web_user", cfg_web_username, sizeof(cfg_web_username));
  // Không có default - credentials phải được push từ server

  prefs.getString("web_pass", cfg_web_password, sizeof(cfg_web_password));
  // Không có default - credentials phải được push từ server

  cfg_auth_required = prefs.getBool("auth_req", true);

  prefs.end();

  Serial.println("[CFG] Config loaded:");
  Serial.printf("  WiFi SSID:      %s\n", cfg_wifi_ssid);
  Serial.printf("  Server:         %s\n", cfg_server_base);
  Serial.printf("  Device ID:      %s\n", cfg_device_id);
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
  prefs.putInt("hb_interval_s",   cfg_hb_interval_s);
  prefs.putInt("cmd_interval_s",  cfg_cmd_interval_s);
  prefs.putString("web_user",     cfg_web_username);
  prefs.putString("web_pass",     cfg_web_password);
  prefs.putBool("auth_req",       cfg_auth_required);
  prefs.end();
  Serial.println("[CFG] Config saved to NVS");
}

// ========== WEB CONFIG SERVER ==========

static const char CONFIG_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>ACW ESP32 Config</title>
<style>
  :root {
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --bg: #f8fafc;
    --card: #ffffff;
    --text: #1e293b;
    --text-light: #64748b;
    --border: #e2e8f0;
    --success-bg: #f0fdf4;
    --success-text: #166534;
    --error-bg: #fef2f2;
    --error-text: #991b1b;
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg);
    color: var(--text);
    margin: 0;
    padding: 20px 16px;
    line-height: 1.5;
  }
  .container {
    max-width: 500px;
    margin: 0 auto;
  }
  header { margin-bottom: 24px; text-align: center; }
  h2 { margin: 0; font-size: 24px; color: var(--text); letter-spacing: -0.025em; }
  p.sub { margin: 4px 0 0; color: var(--text-light); font-size: 14px; }
  
  .status-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .status-box b { display: block; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-light); }
  .status-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 15px; }
  .status-item:last-child { margin-bottom: 0; }
  .status-val { font-weight: 500; }
  
  .status-ok { border-left: 4px solid #22c55e; }
  .status-err { border-left: 4px solid #ef4444; }

  fieldset {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    background: var(--card);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  legend { font-weight: 600; font-size: 14px; color: var(--primary); padding: 0 8px; }
  
  label { display: block; font-size: 13px; font-weight: 500; color: var(--text-light); margin-bottom: 6px; }
  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.2s;
    background: #fff;
  }
  input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  
  .pw-wrap { position: relative; }
  .pw-eye {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--text-light);
    padding: 4px; display: flex; align-items: center;
  }

  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  
  .actions { margin-top: 32px; }
  button {
    width: 100%;
    padding: 14px;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  button:hover { background: var(--primary-hover); }
  button:active { transform: scale(0.98); }

  .msg {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 400px;
    padding: 16px; border-radius: 12px;
    font-size: 14px; font-weight: 500;
    text-align: center; z-index: 1000;
    display: none; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  }
  .msg.ok { display: block; background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
  .msg.err { display: block; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
  
  .footer { text-align: center; margin-top: 32px; font-size: 12px; color: var(--text-light); }
</style>
</head>
<body>
<div class="container">
  <header>
    <h2>⚙️ ACW ESP32 Config</h2>
    <p class="sub">Quản lý và cấu hình thiết bị IoT</p>
  </header>

  <div class="status-box {{status_class}}">
    <b>📊 Trạng thái hệ thống</b>
    <div class="status-item">
      <span>WiFi</span>
      <span class="status-val">{{status_wifi}}</span>
    </div>
    <div class="status-item">
      <span>Server</span>
      <span class="status-val">{{status_server}}</span>
    </div>
  </div>

  <form id="f" method="POST" action="/save">

  <fieldset>
    <legend>WiFi</legend>
    <label>SSID
      <input type="text" name="wifi_ssid" value="{{wifi_ssid}}" maxlength="63">
    </label>
    <label>Mật khẩu
      <div class="pw-wrap">
        <input type="password" id="wifi_pass" name="wifi_pass" value="{{wifi_pass}}" maxlength="63">
        <button type="button" class="pw-eye" onclick="togglePw('wifi_pass',this)" title="Hiện/ẩn mật khẩu">👁</button>
      </div>
    </label>
  </fieldset>

  <fieldset>
    <legend>Server Backend</legend>
    <label>Server Base URL
      <input type="text" name="server_base" value="{{server_base}}" maxlength="127" placeholder="http://192.168.1.x:3000">
    </label>
  </fieldset>

  <fieldset>
    <legend>Thiết thiết bị</legend>
    <label>Device ID
      <input type="text" name="device_id" value="{{device_id}}" maxlength="63">
    </label>
    <label>Tên thiết bị
      <input type="text" name="device_name" value="{{device_name}}" maxlength="63">
    </label>
    <label>Firmware Version
      <input type="text" name="firmware_ver" value="{{firmware_ver}}" maxlength="31">
    </label>
  </fieldset>

  <fieldset>
    <legend>Thời gian lặp</legend>
    <div class="row">
      <div><label>Heartbeat (giây) <input type="number" name="hb_interval_s" value="{{hb_interval_s}}" min="5" max="3600"></label></div>
      <div><label>Lấy lệnh (giây) <input type="number" name="cmd_interval_s" value="{{cmd_interval_s}}" min="1" max="60"></label></div>
    </div>
  </fieldset>

  <div class="actions">
    <button type="submit">💾 Lưu & Khởi động lại</button>
  </div>
</form>

<div class="footer">
  IP hiện tại: {{local_ip}}<br>
  ACW-SRS IoT Platform &copy; 2024
</div>

<div class="msg ok" id="ok">Đã lưu! ESP32 đang khởi động lại...</div>
<div class="msg err" id="err">Lỗi khi lưu dữ liệu.</div>

</div> <!-- end container -->

<script>
  function togglePw(id,btn){
    const inp = document.getElementById(id);
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
  }
  document.getElementById('f').onsubmit = function() {
    document.getElementById('ok').style.display = 'block';
  };
</script>
</body>
</html>
)rawliteral";

String buildConfigPage() {
  String html = String(CONFIG_HTML);

  // Kiểm tra trạng thái WiFi
  String statusWifi = (WiFi.status() == WL_CONNECTED) ? "✅ Đã kết nối (" + WiFi.localIP().toString() + ")" : "❌ Chưa kết nối";
  String statusServer = "Chờ kiểm tra...";
  String statusClass = "status-ok";

  // Kiểm tra trạng thái Server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    // Thử gửi một request nhanh tới server
    String checkUrl = String(cfg_server_base) + "/api/iot/device/heartbeat";
    http.begin(checkUrl);
    http.setTimeout(2000); // Timeout 2s để không treo trang web
    int code = http.GET(); // Chỉ kiểm tra khả năng kết nối
    
    if (code > 0) {
      statusServer = "✅ Đã thấy Server (HTTP " + String(code) + ")";
    } else {
      statusServer = "❌ Lỗi kết nối: " + HTTPClient::errorToString(code);
      statusClass = "status-err";
    }
    http.end();
  } else {
    statusServer = "⚠️ Đợi WiFi kết nối...";
    statusClass = "status-err";
  }

  html.replace("{{status_wifi}}",   statusWifi);
  html.replace("{{status_server}}", statusServer);
  html.replace("{{status_class}}",  statusClass);

  html.replace("{{wifi_ssid}}",     String(cfg_wifi_ssid));
  html.replace("{{wifi_pass}}",     String(cfg_wifi_password));
  html.replace("{{server_base}}",   String(cfg_server_base));
  html.replace("{{device_id}}",     String(cfg_device_id));
  html.replace("{{device_name}}",   String(cfg_device_name));
  html.replace("{{firmware_ver}}",  String(cfg_firmware_ver));
  html.replace("{{hb_interval_s}}", String(cfg_hb_interval_s));
  html.replace("{{cmd_interval_s}}",String(cfg_cmd_interval_s));
  html.replace("{{local_ip}}",      WiFi.localIP().toString());
  return html;
}

bool checkWebAuth() {
  // Nếu chưa kết nối WiFi (đang ở chế độ AP/Setup), cho phép vào thẳng để cấu hình
  if (WiFi.status() != WL_CONNECTED) {
    return true;
  }

  // Nếu không yêu cầu đăng nhập cục bộ (do thiết bị hoặc người thuê bị xóa)
  if (!cfg_auth_required) {
    return true;
  }

  // Nếu đã kết nối WiFi, yêu cầu mật khẩu để bảo mật
  // Nếu chưa được cấu hình credentials từ server, khóa để bảo vệ
  if (strlen(cfg_web_username) == 0 || strlen(cfg_web_password) == 0) {
    configServer.send(403, "text/plain; charset=utf-8",
      "Truy cap bi tu choi. Credentials chua duoc cau hinh tu Server.");
    return false;
  }
  if (!configServer.authenticate(cfg_web_username, cfg_web_password)) {
    configServer.requestAuthentication(BASIC_AUTH, "ACW ESP32 Config", "Authentication required");
    return false;
  }
  return true;
}

void handleConfigGet() {
  if (!checkWebAuth()) return;
  configServer.send(200, "text/html; charset=utf-8", buildConfigPage());
}

void handleConfigSave() {
  if (!checkWebAuth()) return;
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

  if (configServer.hasArg("hb_interval_s"))
    cfg_hb_interval_s = max(5, (int)configServer.arg("hb_interval_s").toInt());

  if (configServer.hasArg("cmd_interval_s"))
    cfg_cmd_interval_s = max(1, (int)configServer.arg("cmd_interval_s").toInt());

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

bool relayOn() {
  int targetLevel = RELAY_ACTIVE_LOW ? LOW : HIGH;
  digitalWrite(RELAY_PIN, targetLevel);
  delay(10); // Đợi ổn định điện áp
  int actualLevel = digitalRead(RELAY_PIN);
  
  Serial.printf("[RELAY] ON (pin=%d, target=%s, actual=%s)\n", 
                RELAY_PIN, 
                targetLevel == LOW ? "LOW" : "HIGH", 
                actualLevel == LOW ? "LOW" : "HIGH");
                
  return (actualLevel == targetLevel);
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

// ========== KIỂM TRA PHẢN HỒI SERVER ==========
void checkServerResponse(const String& payload) {
  if (payload.length() == 0) return;
  
  DynamicJsonDocument doc(1024);
  if (deserializeJson(doc, payload) == DeserializationError::Ok) {
    if (doc.containsKey("clearCredentials") && doc["clearCredentials"].as<bool>() == true) {
      if (cfg_auth_required || strlen(cfg_web_username) > 0 || strlen(cfg_web_password) > 0) {
        cfg_web_username[0] = '\0';
        cfg_web_password[0] = '\0';
        cfg_auth_required = false;
        saveConfig();
        Serial.println("[CFG] Web authentication disabled by server (Device or Tenant deleted)");
      }
    }
  }
}

// ========== ĐĂNG KÝ THIẾT BỊ ==========

void registerDevice() {
  StaticJsonDocument<256> doc;
  doc["deviceId"]        = cfg_device_id;
  doc["name"]            = cfg_device_name;
  doc["firmwareVersion"] = cfg_firmware_ver;

  String body;
  serializeJson(doc, body);

  String url = String(cfg_server_base) + "/api/iot/device/register";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[REGISTER] ok=%d, resp=%s\n", ok, resp.c_str());
  if (resp.length() > 0) {
    checkServerResponse(resp);
  }
}

// ========== HEARTBEAT ==========

void sendHeartbeat() {
  StaticJsonDocument<256> doc;
  doc["deviceId"]        = cfg_device_id;
  doc["remainingSeconds"] = (int)(relayRemainingMs / 1000);
  doc["localIp"]         = WiFi.localIP().toString();

  String body;
  serializeJson(doc, body);

  String url = String(cfg_server_base) + "/api/iot/device/heartbeat";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[HEARTBEAT] ok=%d, resp=%s\n", ok, resp.c_str());
  if (resp.length() > 0) {
    checkServerResponse(resp);
  }
}

// ========== GỬI LOG ==========

void sendLog(const char* level, const char* message) {
  StaticJsonDocument<512> doc;
  doc["logLevel"] = level;
  doc["message"]  = message;

  String body;
  serializeJson(doc, body);

  String url = String(cfg_server_base) + "/api/iot/device/" + String(cfg_device_id) + "/logs";
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

  String url = String(cfg_server_base) + "/api/iot/device/" + String(cfg_device_id) + "/response";
  String resp;
  bool ok = httpPostJson(url, body, &resp);
  Serial.printf("[CMD-RESP] ok=%d, resp=%s\n", ok, resp.c_str());
}

// ========== XỬ LÝ LỆNH TỪ SERVER ==========

void handleCommand(const String& type, const String& data, int cmdId) {
  Serial.printf("[CMD] type=%s, data=%s\n", type.c_str(), data.c_str());

  bool success = true;

  if (type == "start") {
    if (!relayOn()) {
      sendLog("error", "Hardware_Fails: Khong the bat Relay");
      sendCommandResponse(cmdId, false, "Hardware_Fails");
      return;
    }
    
    sendLog("info", "May rua bat dau hoat dong");

    // Đọc thời gian từ commandData JSON để hẹn giờ tự tắt
    if (data.length() > 0) {
      StaticJsonDocument<512> dataDoc;
      if (deserializeJson(dataDoc, data) == DeserializationError::Ok) {
        int durMin  = dataDoc["durationMinutes"] | 0;
        int seconds = dataDoc["seconds"] | 0;
        bool isResume = dataDoc["isResume"] | false;

        if (seconds > 0) {
           relayRemainingMs = (unsigned long)seconds * 1000UL;
           Serial.printf("[TIMER] Tu tat sau %d giay (Resume)\n", seconds);
        } else if (durMin > 0) {
           relayRemainingMs = (unsigned long)durMin * 60000UL;
           Serial.printf("[TIMER] Tu tat sau %d phut\n", durMin);
        }
        
        lastLoopMs = millis();
        if (isResume) {
          sendLog("info", "Resume may rua sau khi reboot");
        }
      }
    }
  } else if (type == "stop") {
    relayOff();
    relayRemainingMs = 0;
    sendLog("info", "May rua da dung");
  } else if (type == "add_time") {
    // Cộng dồn thêm thời gian khi người dùng nạp tiền lần 2+
    if (data.length() > 0) {
      StaticJsonDocument<256> dataDoc;
      if (deserializeJson(dataDoc, data) == DeserializationError::Ok) {
        int addMin = dataDoc["addedMinutes"] | 0;
        int addSec = dataDoc["addedSeconds"] | 0;
        
        unsigned long addMs = 0;
        if (addSec > 0) {
          addMs = (unsigned long)addSec * 1000UL;
        } else if (addMin > 0) {
          addMs = (unsigned long)addMin * 60000UL;
        }

        if (addMs > 0) {
          if (relayRemainingMs == 0) {
            // Relay đang tắt (hết giờ trước đó), bật lại và đặt timer mới
            relayOn();
            relayRemainingMs = addMs;
            lastLoopMs = millis();
            sendLog("info", "May rua bat dau hoat dong (nap them)");
          } else {
            // Relay đang chạy, cộng dồn thêm giờ
            relayRemainingMs += addMs;
            sendLog("info", "Da cong don them thoi gian");
          }
          Serial.printf("[TIMER] Cong them %lu giay, con lai ~%lu giay\n", addMs / 1000, relayRemainingMs / 1000);
        }
      }
    }
  } else if (type == "restart") {
    sendLog("info", "Nhan lenh restart (chua thuc hien)");
  } else if (type == "update_firmware") {
    // OTA qua HTTP
    String firmwareUrl = "";
    if (data.length() > 0) {
      StaticJsonDocument<512> otaDoc;
      if (deserializeJson(otaDoc, data) == DeserializationError::Ok) {
        firmwareUrl = otaDoc["firmwareUrl"] | "";
      }
    }
    if (firmwareUrl.length() == 0) {
      sendLog("error", "update_firmware: firmwareUrl is empty");
      sendCommandResponse(cmdId, false, "firmwareUrl is required");
      return;
    }
    Serial.printf("[OTA] Starting update from: %s\n", firmwareUrl.c_str());
    sendLog("info", "OTA: bat dau tai firmware...");
    // Gửi phản hồi trước khi reboot
    sendCommandResponse(cmdId, true, "OTA started");
    WiFiClient otaClient;
    httpUpdate.rebootOnUpdate(true);
    t_httpUpdate_return ret = httpUpdate.update(otaClient, firmwareUrl);
    // Chỉ chạy đến đây nếu OTA thất bại (thành công thì reboot tự động)
    switch (ret) {
      case HTTP_UPDATE_FAILED:
        Serial.printf("[OTA] FAILED (%d): %s\n",
          httpUpdate.getLastError(),
          httpUpdate.getLastErrorString().c_str());
        sendLog("error", ("OTA failed: " + httpUpdate.getLastErrorString()).c_str());
        break;
      case HTTP_UPDATE_NO_UPDATES:
        Serial.println("[OTA] No update");
        sendLog("info", "OTA: no update available");
        break;
      default:
        break;
    }
  } else if (type == "config") {
    // Cập nhật credentials web UI từ server
    if (data.length() > 0) {
      StaticJsonDocument<256> cfgDoc;
      if (deserializeJson(cfgDoc, data) == DeserializationError::Ok) {
        bool changed = false;
        if (cfgDoc.containsKey("webUsername") && cfgDoc["webUsername"].as<String>().length() > 0) {
          strlcpy(cfg_web_username, cfgDoc["webUsername"].as<String>().c_str(), sizeof(cfg_web_username));
          changed = true;
        }
        if (cfgDoc.containsKey("webPassword") && cfgDoc["webPassword"].as<String>().length() > 0) {
          strlcpy(cfg_web_password, cfgDoc["webPassword"].as<String>().c_str(), sizeof(cfg_web_password));
          changed = true;
        }
        if (changed) {
          cfg_auth_required = true;
          saveConfig();
          Serial.printf("[CFG] Web credentials updated: user=%s\n", cfg_web_username);
          sendLog("info", "Web credentials updated");
        }
      }
    }
  } else {
    success = false;
  }

  sendCommandResponse(cmdId, success, success ? "OK" : "Unknown command");
}

void fetchCommands() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(cfg_server_base) + "/api/iot/device/" + String(cfg_device_id) + "/commands";
  http.begin(url);
  int code = http.GET();
  String payload = http.getString();
  http.end();

  Serial.printf("[CMD] GET %s -> %d\n", url.c_str(), code);
  if (payload.length() > 0) {
    checkServerResponse(payload);
  }
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

// ========== WIFI KẾT NỐI & AP ==========

void startAP() {
  if (isAPActive) return; // Đã bật rồi thì thôi
  String apSSID = "ACW_Setup_" + String(cfg_device_id);
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP(apSSID.c_str(), DEFAULT_AP_PASSWORD);
  isAPActive = true;
  Serial.println("[WIFI] Auto-AP Started");
  Serial.printf("  SSID: %s\n", apSSID.c_str());
  Serial.printf("  PASS: %s\n", DEFAULT_AP_PASSWORD);
  Serial.println("  URL:  http://192.168.4.1/");
}

void connectWifi() {
  // Luôn luôn khởi động chế độ AP để người dùng có thể cấu hình bất kỳ lúc nào
  startAP();

  WiFi.mode(WIFI_AP_STA); // Đảm bảo chế độ vừa phát AP, vừa thu STA
  WiFi.begin(cfg_wifi_ssid, cfg_wifi_password);
  Serial.printf("[WIFI] Connecting to %s", cfg_wifi_ssid);

  int retry = 0;
  // Đợi tối đa 15s
  while (WiFi.status() != WL_CONNECTED && retry < 30) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    lastWifiConnectedMs = millis();
    Serial.print("[WIFI] Connected! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("[WIFI] Connect failed. AP mode is already active.");
  }
}

// ========== SETUP / LOOP ==========

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  relayOff();

  loadConfig();
  connectWifi();

  startConfigServer(); // Luôn khởi động server để có thể cấu hình qua IP hoặc AP

  if (WiFi.status() == WL_CONNECTED) {
    registerDevice();
    sendHeartbeat(); // Gửi heartbeat ngay lập tức sau khi khởi động
    sendLog("info", "ESP32 started & registered");
  }
}

void loop() {
  configServer.handleClient(); // xử lý web request

  unsigned long now     = millis();
  unsigned long elapsed = now - lastLoopMs; // an toàn với wrap-around
  lastLoopMs = now;

  // Đếm ngược thời gian relay
  if (relayRemainingMs > 0) {
    if (elapsed >= relayRemainingMs) {
      relayRemainingMs = 0;
      relayOff();
      sendLog("info", "May rua da dung tu dong sau het gio");
      Serial.println("[TIMER] Het gio, relay OFF");
    } else {
      relayRemainingMs -= elapsed;
    }
  }

  if (now - lastHeartbeatMs > (unsigned long)cfg_hb_interval_s * 1000UL) {
    lastHeartbeatMs = now;
    sendHeartbeat();
  }

  if (now - lastCommandMs > (unsigned long)cfg_cmd_interval_s * 1000UL) {
    lastCommandMs = now;
    fetchCommands();
  }

  // Giám sát kết nối WiFi
  if (WiFi.status() == WL_CONNECTED) {
    lastWifiConnectedMs = now;
    if (isAPActive) {
      // Nếu đã có lại WiFi nhà, có thể tắt AP sau một lúc hoặc cứ để đó.
      // Ở đây ta cứ để đó để người dùng vẫn vào được qua AP nếu cần.
      // Nhưng ta reset flag để không gọi startAP liên tục.
    }
  } else {
    // Nếu mất kết nối quá 60 giây, tự động bật AP để sửa config
    if (now - lastWifiConnectedMs > 60000UL) {
      if (!isAPActive) {
        Serial.println("[WIFI] Connection lost for 60s. Enabling AP...");
        startAP();
      }
    }
  }
}
