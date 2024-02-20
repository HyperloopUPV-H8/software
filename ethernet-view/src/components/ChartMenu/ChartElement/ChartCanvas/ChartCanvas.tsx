import { NumericMeasurementInfo } from "common"

interface Props {
  measurements: NumericMeasurementInfo[];
}

export const ChartCanvas = ({ measurements } : Props) => {
  return (
    <div>
      {measurements.map((measurement) => (
        <div key={measurement.id}>
          {measurement.id}
        </div>
      ))}
    </div>
  )
}
