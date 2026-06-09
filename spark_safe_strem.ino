/* ====== BLYNK SETTINGS ====== */
#define BLYNK_TEMPLATE_ID "TMPL3tjya4War"
#define BLYNK_TEMPLATE_NAME "IOT POWER"
#define BLYNK_AUTH_TOKEN "M85tQ2xQGMGQeOIIR3HRiGWsY1iss-Bj"
#include <BlynkSimpleEsp32.h>

#include "soc/soc.h"           
#include "soc/rtc_cntl_reg.h"  
#include <WiFi.h> 
#include <HTTPClient.h> 
#include <WiFiClientSecure.h> 
#include <UniversalTelegramBot.h> 
#include <LiquidCrystal_I2C.h>

/* ====== USER SETTINGS ====== */
const char* WIFI_SSID = "OPPO A12"; 
const char* WIFI_PASS = "9340560457";

// --- Telegram Credentials ---
String TELEGRAM_BOT_TOKEN = "8526482739:AAFntQXIvVAwayKeg7uCvxIzjjKCaD4zNIY"; 
String TELEGRAM_CHAT_ID   = "5175669874"; 

// --- Supabase Credentials ---
const char* SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyYXVoYmt6ZmplZXZneGpsdmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MzgyNzQsImV4cCI6MjA5MzIxNDI3NH0.04bafJH-2C6h7sJQAjCSW-mp4S9usRlK-ZGqBADLnAU";
String SUPABASE_POST_URL = "https://urauhbkzfjeevgxjlvhl.supabase.co/rest/v1/power_logs";
String SUPABASE_GET_URL  = "https://urauhbkzfjeevgxjlvhl.supabase.co/rest/v1/device_control?select=manual_cutoff&limit=1";
/* ============================ */

// -------- Pins -------- 
#define RELAY_PIN       5 
#define BUZZER_PIN      4

const bool RELAY_ACTIVE_LOW = false; 
LiquidCrystal_I2C lcd(0x27, 16, 2);

WiFiClientSecure secureClient; 
UniversalTelegramBot bot(TELEGRAM_BOT_TOKEN, secureClient);

// -------- System Variables -------- 
const float THEFT_THRESHOLD = 0.30; 
const int THEFT_COUNT_REQUIRED = 3; // Fast trigger for the presentation
int theftCount = 0; 
bool theftActive = false;
bool manualCutoffActive = false; 

// -------- DEMO MODE VARIABLES -------- 
bool demoHouseOn = false;
bool demoTheftOn = false;

// -------- Timers -------- 
unsigned long lastDbUpdate = 0; 
unsigned long lastDbPoll = 0; 
unsigned long lastBotPoll = 0; 
unsigned long lastSensorRead = 0; 

const unsigned long DB_UPDATE_INTERVAL = 2000; 
const unsigned long DB_POLL_INTERVAL = 3000;   
const unsigned long BOT_POLL_INTERVAL = 1500; 
const unsigned long SENSOR_INTERVAL = 400; 

long updateOffset = 0;

// -------- Hardware Control -------- 
void relayOn() { digitalWrite(RELAY_PIN, RELAY_ACTIVE_LOW ? LOW : HIGH); }
void relayOff() { digitalWrite(RELAY_PIN, RELAY_ACTIVE_LOW ? HIGH : LOW); }

// -------- BLYNK CONTROLS -------- 
BLYNK_WRITE(V0) { demoHouseOn = param.asInt(); } // Button 1: Normal House Load
BLYNK_WRITE(V1) { demoTheftOn = param.asInt(); } // Button 2: Trigger Theft

// -------- Supabase API Check Command -------- 
void checkSupabaseCommand() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SUPABASE_GET_URL);
    http.addHeader("apikey", SUPABASE_KEY);
    http.addHeader("Authorization", String("Bearer ") + String(SUPABASE_KEY));

    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      String payload = http.getString();
      if (payload.indexOf("\"manual_cutoff\":true") > 0 || payload.indexOf("\"manual_cutoff\": true") > 0) {
        manualCutoffActive = true;
      } else {
        manualCutoffActive = false;
      }
    }
    http.end();
  }
}

// -------- Supabase API Upload -------- 
void sendToSupabase(float main, float load, float diff, bool isTheft) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SUPABASE_POST_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", SUPABASE_KEY);
    http.addHeader("Authorization", String("Bearer ") + String(SUPABASE_KEY));
    http.addHeader("Prefer", "return=minimal"); 

    String jsonPayload = "{\"main_current\":" + String(main, 3) + 
                         ",\"load_current\":" + String(load, 3) + 
                         ",\"difference\":" + String(diff, 3) + 
                         ",\"theft_active\":" + String(isTheft ? "true" : "false") + "}";

    http.POST(jsonPayload);
    http.end();
  }
}

// -------- Telegram Setup (BACKUP CONTROLS) -------- 
void handleTelegramMessages(int num) { 
  for (int i = 0; i < num; i++) { 
    String chat_id = bot.messages[i].chat_id; 
    String msg = bot.messages[i].text; 
    long msg_id = bot.messages[i].message_id;

    if (msg == "/relay_on") { manualCutoffActive = false; bot.sendMessage(chat_id, "Relay ON", ""); }   
    else if (msg == "/relay_off") { manualCutoffActive = true; bot.sendMessage(chat_id, "Relay OFF", ""); }   
    
    // BACKUP DEMO CONTROLS (In case Blynk UI lags)
    else if (msg == "/house_on") { demoHouseOn = true; bot.sendMessage(chat_id, "Demo: House ON", ""); }
    else if (msg == "/house_off") { demoHouseOn = false; bot.sendMessage(chat_id, "Demo: House OFF", ""); }
    else if (msg == "/theft_on") { demoTheftOn = true; bot.sendMessage(chat_id, "Demo: THEFT ON", ""); }
    else if (msg == "/theft_off") { demoTheftOn = false; bot.sendMessage(chat_id, "Demo: THEFT OFF", ""); }
    
    if (msg_id >= updateOffset) updateOffset = msg_id + 1;   
  } 
}

// -------- Setup -------- 
void setup() { 
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200); 

  pinMode(RELAY_PIN, OUTPUT); 
  pinMode(BUZZER_PIN, OUTPUT);
  relayOn(); 
  digitalWrite(BUZZER_PIN, LOW);

  lcd.init(); 
  lcd.backlight(); 
  lcd.print("Connecting WiFi"); 

  WiFi.mode(WIFI_STA); 
  Blynk.begin(BLYNK_AUTH_TOKEN, WIFI_SSID, WIFI_PASS);
  WiFi.setTxPower(WIFI_POWER_8_5dBm); 

  lcd.clear(); lcd.print("System Online!");

  secureClient.setCACert(NULL); 
  bot.sendMessage(TELEGRAM_CHAT_ID, "VAMPAIR Demo Node Online.", ""); 

  lastDbUpdate = millis(); 
  lastDbPoll = millis();
  lastSensorRead = millis(); 
}

// -------- Main Loop -------- 
void loop() {
  Blynk.run();

  if (millis() - lastBotPoll >= BOT_POLL_INTERVAL) { 
    if (WiFi.status() == WL_CONNECTED) { 
      int num = bot.getUpdates(updateOffset); 
      if (num) handleTelegramMessages(num); 
    } 
    lastBotPoll = millis(); 
  }

  if (millis() - lastDbPoll >= DB_POLL_INTERVAL) {
    checkSupabaseCommand();
    lastDbPoll = millis();
  }

  if (millis() - lastSensorRead >= SENSOR_INTERVAL) { 
    lastSensorRead = millis();

    // ==========================================
    // THE DEMO ENGINE (Replaces physical sensors)
    // ==========================================
    float currentMainA = 0.0;
    float currentLoadA = 0.0;

    if (demoHouseOn) {
      currentLoadA = 0.44;
      currentMainA = demoTheftOn ? 0.89 : 0.44; 
    } else {
      currentLoadA = 0.00;
      currentMainA = demoTheftOn ? 0.45 : 0.00;
    }

    // Add realistic sensor noise (+/- 0.02A) so it looks totally authentic
    if (currentLoadA > 0) currentLoadA += random(-2, 3) / 100.0;
    if (currentMainA > 0) currentMainA += random(-2, 3) / 100.0;

    float currentDiff = fabs(currentMainA - currentLoadA);   
    // ==========================================

    // LCD Display Updates
    lcd.clear();   
    lcd.setCursor(0, 0);   
    lcd.print("M:"); lcd.print(currentMainA, 2);   
    lcd.print(" L:"); lcd.print(currentLoadA, 2);   

    lcd.setCursor(0, 1);   
    if (manualCutoffActive) {
      lcd.print("MANUAL POWER CUT");
    } else if (theftActive) {     
      lcd.print("THEFT! Relay OFF");   
    } else {     
      lcd.print("Diff: "); lcd.print(currentDiff, 2); lcd.print("A");  
    }   

    // Theft Detection Logic
    if (currentDiff > THEFT_THRESHOLD) {     
      theftCount++;     
      if (!theftActive && theftCount >= THEFT_COUNT_REQUIRED) {       
        theftActive = true;       
        relayOff();       
        digitalWrite(BUZZER_PIN, HIGH);       
        delay(200); 
        bot.sendMessage(TELEGRAM_CHAT_ID, "⚠️ THEFT DETECTED\nPower Cut Off.", "");     
      }   
    } else {     
      if (theftCount > 0) theftCount--;     
      if (theftActive && currentDiff < (THEFT_THRESHOLD * 0.6)) {       
        theftActive = false;       
        relayOn();       
        digitalWrite(BUZZER_PIN, LOW);       
        delay(200);
        bot.sendMessage(TELEGRAM_CHAT_ID, "✅ Theft cleared. Power restored.", "");     
      }   
    }

    // Master Relay Control
    if (theftActive || manualCutoffActive) {
      relayOff();
      if (theftActive) { digitalWrite(BUZZER_PIN, HIGH); } else { digitalWrite(BUZZER_PIN, LOW); }
    } else {
      relayOn();
      digitalWrite(BUZZER_PIN, LOW);
    }

    // Database Cloud Sync
    if (millis() - lastDbUpdate >= DB_UPDATE_INTERVAL) {
      sendToSupabase(currentMainA, currentLoadA, currentDiff, theftActive);
      lastDbUpdate = millis();
    }
  }

  delay(10); 
}
