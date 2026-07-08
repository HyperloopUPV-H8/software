import { BLCU, BOARDS, HVBMS, LCU, LVBMS, PCU_BOARD, VCU } from "../../constants/measurements";
import BoardCard from "./components/BoardCard";
import LcuAirgapCard from "./components/LcuAirgapCard";

const Boards = () => (
  <div className="flex h-full flex-col gap-6 overflow-auto p-4">
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-base font-semibold">Board States</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BoardCard
          board={BOARDS.VCU}
          name="VCU"
          stateMeasurementKey={VCU.generalState}
          stats={[
            { label: "Operational state", measurementKey: VCU.operationalState              },
            { label: "High pressure",     measurementKey: VCU.highPressure,    unit: "bar"  },
            { label: "Low pressure",      measurementKey: VCU.lowPressure,     unit: "bar"  },
            { label: "SDC closed",        measurementKey: VCU.sdcClosed                     },
            { label: "Contactors",        measurementKey: VCU.contactorsClosed              },
            { label: "Active brakes",     measurementKey: VCU.activeBrakes                  },
          ]}
        />

        <BoardCard
          board={BOARDS.HVBMS}
          name="HVBMS"
          stateMeasurementKey={HVBMS.operationalState}
          stats={[
            { label: "Min SOC",    measurementKey: HVBMS.minimumSoc,       unit: "%"  },
            { label: "Pack V",     measurementKey: HVBMS.batteriesVoltage, unit: "V"  },
            { label: "Current",    measurementKey: HVBMS.currentReading,   unit: "A"  },
            { label: "Temp max",   measurementKey: HVBMS.tempMax,          unit: "°C" },
            { label: "IMD",        measurementKey: HVBMS.imdOk                        },
            { label: "SDC status", measurementKey: HVBMS.sdcStatus                    },
          ]}
        />

        <BoardCard
          board={BOARDS.PCU}
          name="PCU"
          stateMeasurementKey={PCU_BOARD.generalState}
          stats={[
            { label: "Operating state", measurementKey: PCU_BOARD.operatingState           },
            { label: "Peak current",    measurementKey: PCU_BOARD.peakCurrent,  unit: "A"  },
            { label: "Frequency",       measurementKey: PCU_BOARD.frequency,    unit: "Hz" },
          ]}
        />

        <BoardCard
          board={BOARDS.LCU}
          name="LCU"
          stateMeasurementKey={LCU.masterState}
          stats={[
            { label: "Slave SM", measurementKey: LCU.slaveState },
          ]}
        />

        <BoardCard
          board={BOARDS.LVBMS}
          name="LVBMS"
          stateMeasurementKey={LVBMS.generalState}
          stats={[
            { label: "SOC",           measurementKey: LVBMS.soc,          unit: "%", decimals: 0 },
            { label: "Total voltage", measurementKey: LVBMS.totalVoltage, unit: "V"              },
            { label: "Current",       measurementKey: LVBMS.current,      unit: "A"              },
            { label: "Temperature",   measurementKey: LVBMS.temperature,  unit: "°C"             },
          ]}
        />

        <BoardCard board={BOARDS.BLCU} name="BLCU" stateMeasurementKey={BLCU.state} />
      </div>
    </section>

    {/* LCU levitation detail */}
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-base font-semibold">Levitation</h2>
      <LcuAirgapCard />
    </section>
  </div>
);

export default Boards;
