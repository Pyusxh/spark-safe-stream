## Tools
- 3D printer (PLA and PETG capable)
- M3 hex key / screwdriver set
- Wire strippers
- Crimping tool (optional, for ferrules on AC wires)
- Multimeter
- Small flathead screwdriver (for terminal blocks)
- Computer with Arduino IDE / PlatformIO and USB-C cable

## Assumptions
- Basic understanding of mains AC electricity safety precautions
- Familiarity with ESP32 firmware uploading (Arduino IDE or PlatformIO)
- Basic electronics knowledge (e.g., distinguishing VCC, GND, data pins)
- Access to appropriate 3D printing filament (PLA, PETG)

## 1. Fabrication
### 1.1 3D print all component mounts and enclosures
*(not yet generated)*

### 1.2 Prepare mechanical supports and base plates
*(not yet generated)*

### 1.3 Install bypass switch into its 3D printed mount
*(not yet generated)*

### 1.4 Install LCD Display into its 3D printed bezel
*(not yet generated)*

### 1.5 Install other electrical components into their respective 3D printed mounts
*(not yet generated)*

## 2. Wiring
### 2.1 Wire 5V DC power supply to both ESP32 boards
*(not yet generated)*

### 2.2 Connect Grid Current Sensor to Grid Controller ESP32
*(not yet generated)*

### 2.3 Connect House Current Sensor to House Monitor ESP32
*(not yet generated)*

### 2.4 Connect Power Cutoff Relay, Buzzer, and LCD to Grid Controller ESP32
*(not yet generated)*

### 2.5 Wire AC input terminal to Grid Current Sensor and Neutral AC wire
*(not yet generated)*

### 2.6 Wire Grid Current Sensor output to Power Cutoff Relay and Bypass Switch
*(not yet generated)*

### 2.7 Wire Power Cutoff Relay to House Current Sensor and then to Authorized AC Bulb
*(not yet generated)*

### 2.8 Wire Bypass Switch to Bypass AC Bulb
*(not yet generated)*

## 3. Bring-up
### 3.1 Upload firmware to Grid Controller ESP32
*(not yet generated)*

### 3.2 Upload firmware to House Monitor ESP32
*(not yet generated)*

### 3.3 Verify I2C communication with LCD Display
*(not yet generated)*

### 3.4 Test Power Cutoff Relay and Buzzer functionality
*(not yet generated)*

### 3.5 Calibrate and verify Grid and House Current Sensor readings
*(not yet generated)*

### 3.6 Test Bypass Switch input detection on Grid Controller
*(not yet generated)*

### 3.7 Perform initial power-up with Authorized and Bypass bulbs, test theft detection and cutoff logic
*(not yet generated)*

## 4. Assembly
### 4.1 Assemble Tower A structure (base plate and vertical supports)
*(not yet generated)*

### 4.2 Assemble Tower B structure (base plate and vertical supports)
*(not yet generated)*

### 4.3 Mount all Grid-related components and their mounts to Tower A supports
*(not yet generated)*

### 4.4 Mount all House-related components and their mounts to Tower B supports
*(not yet generated)*

### 4.5 Mount the bypass switch mount and bypass bulb holder into the bypass enclosure
*(not yet generated)*

### 4.6 Secure all wiring with cable ties, ensuring strain relief and safety for AC lines
*(not yet generated)*

### 4.7 Screw in Authorized AC Bulb and Bypass AC Bulb
*(not yet generated)*

### 4.8 Perform final functional test of the complete system
*(not yet generated)*
