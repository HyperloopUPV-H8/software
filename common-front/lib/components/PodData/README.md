# PodData Provider

The `PodDataProvider` component enables real-time packet data updates from the backend WebSocket connection.

## Problem
The frontend has infrastructure to receive packet updates via the `"podData/update"` WebSocket topic, but no component was subscribing to this topic. This caused packet data to not update in real-time, making each packet appear as a new instance instead of updating existing values.

## Solution
The `PodDataProvider` component subscribes to the `"podData/update"` topic and updates both:
- `podDataStore`: Stores packet metadata (count, cycleTime, hexValue)
- `measurementsStore`: Stores individual measurement values from packets

## Usage
Wrap your application or the components that need packet data with `PodDataProvider`:

```tsx
import { PodDataProvider } from '@hyperloop-upv/common-front';

function App() {
  return (
    <PodDataProvider>
      {/* Your components that use packet data */}
      <YourChartComponent />
    </PodDataProvider>
  );
}
```

## How it works
1. Backend sends packet updates via WebSocket with topic `"podData/update"`
2. `PodDataProvider` subscribes to this topic using `usePodData` hook
3. When updates arrive, they're dispatched to the appropriate stores
4. Chart components can then access real-time data from `measurementsStore`

## Creating Charts with Real-time Data
To create a chart that displays packet measurements:

```tsx
import { LinesChart, LineDescription, useMeasurementsStore } from '@hyperloop-upv/common-front';

function MyChart() {
  const getMeasurement = useMeasurementsStore(state => state.getNumericMeasurementInfo);
  
  const lineDescriptions: LineDescription[] = [
    {
      id: "VCU/temperature",  // Format: "${boardName}/${measurementId}"
      name: "Temperature",
      color: "#FF5733",
      range: [0, 100],
      warningRange: [80, 100],
      getUpdate: () => getMeasurement("VCU/temperature")?.value.value ?? 0
    }
  ];
  
  return <LinesChart descriptions={lineDescriptions} />;
}
```

Note: Make sure `PodDataProvider` is active in your component tree for real-time updates to work.