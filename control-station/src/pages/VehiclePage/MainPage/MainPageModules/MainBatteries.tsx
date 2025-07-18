import { Window2 } from "components/Window/Window2";
import styles from "../MainPage.module.scss";
import { BatteryIndicator } from "components/BatteryIndicator/BatteryIndicator";
import {
  BmslMeasurements,
  useMeasurementsStore,
  HvscuMeasurements,
  HvscuCabinetMeasurements,
  useGlobalTicker,
} from "common";
import { GaugeTag } from "components/GaugeTag/GaugeTag";
import { useRef, useMemo } from "react";

export const Batteries = () => {
  const getNumericMeasurementInfo = useMeasurementsStore(
    (state) => state.getNumericMeasurementInfo,
  );

  // Previous value and timestamp tracking refs
  const prevValuesRef = useRef<{
    [key: string]: {
      value: number | null;
      lastSampleTime: number;
      lastChangeTime: number;
      displayValue: number | null;
    };
  }>({});

  // Helper function to create delta-tracked getUpdate with 100ms sampling
  const createDeltaTrackedGetter = (
    measurementKey: string,
    originalGetter: () => number,
  ) => {
    return () => {
      const now = Date.now();
      const prevData = prevValuesRef.current[measurementKey];

      // Check if 500ms have passed since last sample
      if (prevData && now - prevData.lastSampleTime < 400) {
        // Not enough time passed, return current value if not stale, otherwise null
        const currentValue = originalGetter();
        return prevData.displayValue === null ? null : currentValue;
      }

      // 2 seconds have passed or no previous data, get fresh value
      const currentValue = originalGetter();

      // Initialize if no previous data
      if (!prevData) {
        prevValuesRef.current[measurementKey] = {
          value: currentValue,
          lastSampleTime: now,
          lastChangeTime: now,
          displayValue: currentValue,
        };
        return currentValue;
      }

      // Check for delta with tolerance
      const prevValue = prevData.value;
      const tolerance = 0.01; // Ignore changes smaller than 0.01
      const hasChanged =
        prevValue === null || currentValue === null
          ? prevValue !== currentValue
          : Math.abs(prevValue - currentValue) > tolerance;

      if (hasChanged) {
        // Value changed significantly, update everything
        prevValuesRef.current[measurementKey] = {
          value: currentValue,
          lastSampleTime: now,
          lastChangeTime: now,
          displayValue: currentValue,
        };
        return currentValue;
      } else {
        // Value hasn't changed significantly, check if it's been stale for too long
        const staleDuration = now - prevData.lastChangeTime;
        const displayValue =
          staleDuration > 100 ? null : prevData.displayValue || currentValue; // Show null after 5 seconds of no change

        prevValuesRef.current[measurementKey] = {
          value: currentValue,
          lastSampleTime: now,
          lastChangeTime: prevData.lastChangeTime,
          displayValue: displayValue,
        };
        return displayValue;
      }
    };
  };

  const CurrentHV = getNumericMeasurementInfo(HvscuMeasurements.CurrentReading);
  const CurrentLV = getNumericMeasurementInfo(BmslMeasurements.current);
  const CurrentCabinet = getNumericMeasurementInfo(
    HvscuCabinetMeasurements.CurrentOutput,
  );

  const SocHigh = getNumericMeasurementInfo(HvscuMeasurements.MinimumSoc);
  const SocLow = getNumericMeasurementInfo(BmslMeasurements.stateOfCharge);
  const SocCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.Soc);

  const TotalVoltageHigh = getNumericMeasurementInfo(
    HvscuMeasurements.BatteriesVoltage,
  );
  const TotalVoltageLow = getNumericMeasurementInfo(
    BmslMeasurements.totalVoltage,
  );
  const TotalVoltageCabinet = getNumericMeasurementInfo(
    HvscuCabinetMeasurements.TotalVoltage,
  );

  const BusHV = getNumericMeasurementInfo(HvscuMeasurements.VoltageReading);
  const BusCabinet = getNumericMeasurementInfo(
    HvscuCabinetMeasurements.BusVoltage,
  );

  // Memoize delta-tracked getters to prevent recreation on every render
  const getters = useMemo(
    () => ({
      CurrentHV: createDeltaTrackedGetter("CurrentHV", CurrentHV.getUpdate),
      CurrentLV: createDeltaTrackedGetter("CurrentLV", CurrentLV.getUpdate),
      CurrentCabinet: createDeltaTrackedGetter(
        "CurrentCabinet",
        CurrentCabinet.getUpdate,
      ),
      SocHigh: createDeltaTrackedGetter("SocHigh", SocHigh.getUpdate),
      SocLow: createDeltaTrackedGetter("SocLow", SocLow.getUpdate),
      SocCabinet: createDeltaTrackedGetter("SocCabinet", SocCabinet.getUpdate),
      TotalVoltageHigh: createDeltaTrackedGetter(
        "TotalVoltageHigh",
        TotalVoltageHigh.getUpdate,
      ),
      TotalVoltageLow: createDeltaTrackedGetter(
        "TotalVoltageLow",
        TotalVoltageLow.getUpdate,
      ),
      TotalVoltageCabinet: createDeltaTrackedGetter(
        "TotalVoltageCabinet",
        TotalVoltageCabinet.getUpdate,
      ),
      BusHV: createDeltaTrackedGetter("BusHV", BusHV.getUpdate),
      BusCabinet: createDeltaTrackedGetter("BusCabinet", BusCabinet.getUpdate),
    }),
    [],
  );

  return (
    <div className={styles.batteriesRow}>
      <Window2 title="High Voltage">
        <GaugeTag
          name={"Current"}
          id={"hv"}
          units={CurrentHV.units}
          getUpdate={getters.CurrentHV}
          strokeWidth={110}
          min={0}
          max={85}
        />
        <BatteryIndicator
          getValue={getters.TotalVoltageHigh}
          getValueSOC={getters.SocHigh}
          color="#ACF293"
          units={TotalVoltageHigh.units}
          safeRangeMin={0}
          warningRangeMin={100}
          safeRangeMax={100}
          warningRangeMax={70}
        />
        <GaugeTag
          name={"DC Bus"}
          id={"hv-bus"}
          units={BusHV.units}
          getUpdate={getters.BusHV}
          strokeWidth={110}
          min={0}
          max={430}
        />
      </Window2>

      <Window2 title="Low Voltage">
        <GaugeTag
          name={"Current"}
          id={"lv"}
          units={CurrentLV.units}
          getUpdate={getters.CurrentLV}
          strokeWidth={110}
          min={0}
          max={5}
        />
        <BatteryIndicator
          getValue={getters.TotalVoltageLow}
          getValueSOC={getters.SocLow}
          color="#ACF293"
          units={TotalVoltageLow.units}
          safeRangeMin={0}
          warningRangeMin={0}
          safeRangeMax={100}
          warningRangeMax={70}
        />
      </Window2>

      <Window2 title="Booster">
        <GaugeTag
          name={"Current"}
          id={"cabinet"}
          units={CurrentCabinet.units}
          getUpdate={getters.CurrentCabinet}
          strokeWidth={110}
          min={0}
          max={125}
        />
        <BatteryIndicator
          getValue={getters.TotalVoltageCabinet}
          getValueSOC={getters.SocCabinet}
          color="#ACF293"
          units={TotalVoltageCabinet.units}
          safeRangeMin={0}
          warningRangeMin={0}
          safeRangeMax={100}
          warningRangeMax={70}
        />
        <GaugeTag
          name={"DC Bus"}
          id={"cabinet-bus"}
          units={BusCabinet.units}
          getUpdate={getters.BusCabinet}
          strokeWidth={110}
          min={0}
          max={432}
        />
      </Window2>
    </div>
  );
};
