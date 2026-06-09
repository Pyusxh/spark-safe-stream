Spark Safe Stream is an IoT-based Power Theft Detection system designed to monitor electrical grid supply against authorized loads in real-time. Originally developed as a 5th-semester minor project, it combines embedded hardware with a responsive web dashboard to detect unauthorized power connections, trigger local safety mechanisms, and calculate the financial impact of power leakage.
​📖 Overview
​Power theft is a major cause of grid instability and economic loss. This project simulates a real-world power distribution scenario using two 100W bulbs—one representing a legitimate household load and the other simulating an illegal "theft" connection.
​By comparing the current supplied at the source with the current consumed at the destination, the ESP32 microcontroller identifies discrepancies. If a leak is detected, it triggers local hardware alerts and updates a real-time web dashboard for remote monitoring and financial analysis.
​✨ Key Features
​Hardware Capabilities
​Dual Current Monitoring: Uses two ACS712 sensors to continuously track current at the source and the load.
​Automated Safety Cutoff: A 5V relay automatically breaks the circuit if severe leakage or theft is detected.
​Local On-Site Alerts: An LCD display and a buzzer provide immediate physical feedback when an anomaly occurs.
​Web Dashboard & Software
​Live Power Flow Charts: Visualizes real-time power draw and system stability.
​Current Load Tracking: Displays the exact power consumption of the main house load.
​Leakage Analysis: Pinpoints exactly when and where the current drop occurs.
​Financial Impact Calculator: Translates the leaked current directly into estimated lost revenue/rupees in real-time.
​🛠️ Components Used
​Hardware
​ESP32 Development Board (Core logic and Wi-Fi connectivity)
​2 × ACS712 Current Sensors (Measuring source and load current)
​1 × 5V Relay Module (Circuit control / tripping mechanism)
​16x2 LCD Display (Status display)
​Buzzer (Audible alarm)
​2 × 100W AC Bulbs with Holders (Simulation loads)
​Jumper wires & Breadboard
​Software / Tech Stack
​C/C++ (Arduino IDE): For programming the ESP32 and reading analog sensor data.
​Web Technologies (HTML/CSS/JS): Front-end dashboard for visualization.
​WebSocket / REST API: For real-time communication between the ESP32 and the web interface.
​⚙️ System Logic & Architecture
​Sensing: Sensor A measures the total current leaving the distribution pole. Sensor B measures the current entering the authorized household.
​Processing: The ESP32 constantly compares Sensor A and Sensor B.
​Detection: If Sensor A - Sensor B > Threshold (accounting for minor natural line losses), the system flags a "Theft/Leakage" event.
​Action:
​The Buzzer sounds.
​The LCD updates its status to THEFT DETECTED.
​The Relay trips the connection (optional configuration for safety).
​Data is pushed to the web dashboard detailing the amount of leaked power and its calculated financial cost.
​🚀 Setup & Installation
​Hardware Wiring
​Connect the OUT pin of ACS712 (Source) to an ESP32 analog pin.
​Connect the OUT pin of ACS712 (Load) to another ESP32 analog pin.
​Connect the Relay signal pin to a designated digital out pin on the ESP32.
​Wire the LCD (via I2C if applicable) and Buzzer to their respective GPIOs.
​Warning: Proceed with extreme caution when working with AC mains voltage (the 100W bulbs). Ensure proper insulation.
​Firmware Upload
​Open the .ino file in the Arduino IDE.
​Install required libraries (WiFi.h, LiquidCrystal_I2C.h, etc.).
​Update the Wi-Fi SSID and Password in the code.
​Select your ESP32 board and COM port, then hit Upload.
​Dashboard Execution
​Navigate to the dashboard folder.
​Open index.html in your browser, or host it via a local Node.js/Python server.
​Ensure the dashboard is pointed to the ESP32's local IP address to start receiving WebSocket/HTTP data.
​👨‍💻 Author
​Piyush Koushal
