# Delta Time Tracking Documentation

## Overview

The delta time tracking system detects when telemetry values haven't changed for a specified period, indicating potentially stale data. When data is determined to be stale, components display a visual indication (typically showing "-.--" or "DISCONNECTED" with grey styling) to alert operators that the displayed values may not be current.

## How It Works

1. **Sampling Period**: The system checks for value changes at regular intervals (typically 400ms)
2. **Grace Period**: After detecting no change, the system waits for a grace period before marking data as stale
3. **Tolerance**: For numeric values, small fluctuations below a tolerance threshold are ignored
4. **Display**: Stale data is indicated by showing "-.--" or "DISCONNECTED" text, often with grey coloring

## Configuration Parameters

### Global Constants
Delta tracking timing is configured globally in `/src/constants/deltaTracking.ts`:
- **DELTA_SAMPLE_PERIOD**: 400ms (time between checks for value changes)
- **DELTA_GRACE_PERIOD**: 100ms (standard grace period before marking as stale)
- **DELTA_GRACE_PERIOD_LONG**: 5000ms (extended grace period for slow-changing values)

### Common Settings
- **Sampling Period**: Uses `DELTA_SAMPLE_PERIOD` constant (default: 400ms)
- **Grace Period**: Uses `DELTA_GRACE_PERIOD` constant (default: 100ms)
- **Tolerance**: 0.01 to 0.5 depending on measurement type

## Affected Components

### Page Modules

#### 1. BrakeState (`MainPageModules/BrakeState.tsx`)
- **Type**: Boolean
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Stale Display**: Grey background (#cccccc), "DISCONNECTED" text

#### 2. Leds (`MainPageModules/Leds.tsx`)
- **Type**: Numeric (voltage)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.5V
- **Stale Display**: Grey background (#cccccc)

#### 3. MainBatteries (`MainPageModules/MainBatteries.tsx`)
- **Type**: Multiple numeric values
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.01
- **Stale Display**: "-.--" text, grey gauge colors
- **Affected measurements**:
  - Current (HV, LV, Cabinet)
  - State of Charge
  - Total Voltage
  - DC Bus Voltage

#### 4. PodPosition (`MainPageModules/PodPosition.tsx`)
- **Type**: Numeric (position)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.1m
- **Stale Display**: Grey background, 50% opacity, grayscale filter

### Component Library

#### 5. GaugeTag (`components/GaugeTag/GaugeTag.tsx`)
- **Type**: Numeric
- **Accepts**: `getUpdate: () => number | null`
- **Stale Display**: Grey gauge arc, "-.--" text

#### 6. BatteryIndicator (`components/BatteryIndicator/BatteryIndicator.tsx`)
- **Type**: Numeric (dual values)
- **Accepts**: `getValue: () => number | null`, `getValueSOC: () => number | null`
- **Stale Display**: Grey fill, "-.--" text

#### 7. BarIndicator (`components/BarIndicator/BarIndicator.tsx`)
- **Type**: Numeric
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.01
- **Stale Display**: "-.--" text, bar at 100% (fault state)

#### 8. CurrentIndicator (`components/LevitationUnit/CurrentIndicator/CurrentIndicator.tsx`)
- **Type**: Numeric (current)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.01
- **Stale Display**: "-.--" text

#### 9. ImdIndicator (`components/BoolIndicator/ImdIndicator.tsx`)
- **Type**: Boolean
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Stale Display**: Grey background (#cccccc), "DISCONNECTED" text

#### 10. SdcIndicator (`components/BoolIndicator/SdcIndicator.tsx`)
- **Type**: Enum/String
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Stale Display**: Grey background (#cccccc), "DISCONNECTED" text

#### 11. EnumIndicator (`components/EnumIndicator/EnumIndicator.tsx`)
- **Type**: Enum/String
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Stale Display**: Grey background (#cccccc), "DISCONNECTED" text

#### 12. VehicleState (`components/EnumIndicator/VehicleState.tsx`)
- **Type**: Dual Enum (general + operational state)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Stale Display**: Grey background (#cccccc), "DISCONNECTED" text

#### 13. OrientationIndicator (`components/OrientationIndicator/OrientationIndicator.tsx`)
- **Type**: Numeric (orientation)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.01
- **Stale Display**: "-.--" text

#### 14. BatteriesModule (`components/BatteriesModules/BatteriesModule.tsx`)
- **Type**: Multiple numeric values (6 cells + 2 temperature sensors)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.01
- **Stale Display**: "-.---" for cells, "-.--" for temperatures
- **Affected measurements**:
  - 6 battery cells (voltage)
  - 2 temperature sensors

#### 15. LowVoltageModule (`components/BatteriesModules/LowVoltageModule.tsx`)
- **Type**: Multiple numeric values (6 cells + 4 temperature sensors)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.01
- **Stale Display**: "-.---" for cells, "-.--" for temperatures
- **Affected measurements**:
  - 6 battery cells (voltage)
  - 4 temperature sensors

#### 16. BoosterModule (`components/BoosterModules/BoosterModule.tsx`)
- **Type**: Multiple numeric values (48 cells + 5 module statistics)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.01
- **Stale Display**: "-.---" for cells, "-.--" for module statistics
- **Affected measurements**:
  - 48 booster cells (voltage)
  - Module total voltage
  - Module max/min cell voltage
  - Module max/min temperature

#### 17. BatteriesPage (`pages/VehiclePage/BatteriesPage/BatteriesPage.tsx`)
- **Type**: Multiple numeric values (overview statistics)
- **Sampling**: 400ms
- **Grace Period**: 100ms
- **Tolerance**: 0.1
- **Stale Display**: "-.--" for all values
- **Affected measurements**:
  - High Voltage: Total voltage, max/min voltage, max/min temperature
  - Low Voltage: Total voltage, max/min voltage, max/min temperature

## Implementation Pattern

Most components follow this general pattern:

```typescript
// Delta tracking state
const deltaTrackingRef = useRef<{
    value: T | null;
    lastSampleTime: number;
    lastChangeTime: number;
    displayValue: T | null;
    isStale: boolean;
} | null>(null);

// Memoized delta-tracked getter
const getDeltaTrackedValue = useMemo(() => {
    return () => {
        const now = Date.now();
        const prevData = deltaTrackingRef.current;
        
        // Check sampling period
        if (prevData && now - prevData.lastSampleTime < SAMPLING_PERIOD) {
            const currentValue = originalGetter();
            return prevData.isStale ? null : currentValue;
        }
        
        // ... delta checking logic ...
    };
}, [originalGetter]);
```

## Visual Indicators

When data is stale:
- **Text displays**: Show "-.--" or "DISCONNECTED"
- **Colors**: Change to grey (#cccccc)
- **Gauges/Bars**: May show at maximum/fault position
- **Images**: May show reduced opacity or grayscale filter

## Purpose

This system helps operators quickly identify when displayed data may not be current due to:
- Communication issues
- Sensor failures
- System freezes
- Network latency

By providing clear visual feedback about data staleness, operators can make more informed decisions about system status and avoid acting on outdated information.