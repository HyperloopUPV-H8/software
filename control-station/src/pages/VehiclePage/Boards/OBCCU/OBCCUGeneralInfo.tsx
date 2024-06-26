import { ObccuMeasurements, useMeasurementsStore } from 'common';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { StateIndicator } from 'components/StateIndicator/StateIndicator';
import { Window } from 'components/Window/Window';
import batteryIcon from 'assets/svg/battery-filled.svg';
import thunderIcon from 'assets/svg/thunder-filled.svg';
import { GaugeTag } from 'components/GaugeTag/GaugeTag';

export const OBCCUGeneralInfo = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    const totalVoltageHigh = getNumericMeasurementInfo(
        ObccuMeasurements.totalVoltageHigh
    );
    const dischargeCurrent = getNumericMeasurementInfo(
        ObccuMeasurements.dischargeCurrent
    );

    return (
        <Window title="OBCCU">
            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.5rem',
                    }}
                >
                    <IndicatorStack>
                        <StateIndicator
                            measurementId={ObccuMeasurements.generalState}
                            icon={thunderIcon}
                        />
                    </IndicatorStack>

                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                        }}
                    >
                        <GaugeTag
                            name={'Voltage'}
                            units={'Volts'}
                            getUpdate={totalVoltageHigh.getUpdate}
                            strokeWidth={120}
                            min={totalVoltageHigh.range[0] ?? 225}
                            max={totalVoltageHigh.range[1] ?? 252}
                        />
                        <GaugeTag
                            name={'Current'}
                            units={'Amps'}
                            getUpdate={dischargeCurrent.getUpdate}
                            strokeWidth={120}
                            min={dischargeCurrent.range[0] ?? 0}
                            max={dischargeCurrent.range[1] ?? 100}
                        />
                    </div>

                    <IndicatorStack>
                        <StateIndicator
                            measurementId={ObccuMeasurements.contactorsState}
                            icon={batteryIcon}
                        />
                        <StateIndicator
                            measurementId={ObccuMeasurements.imdState}
                            icon={thunderIcon}
                        />
                    </IndicatorStack>
                </div>
            </div>
        </Window>
    );
};
