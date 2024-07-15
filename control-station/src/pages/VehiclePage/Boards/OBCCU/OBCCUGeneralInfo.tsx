import { ObccuMeasurements, useMeasurementsStore } from 'common';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { StateIndicator } from 'components/StateIndicator/StateIndicator';
import { Window } from 'components/Window/Window';
import batteryIcon from 'assets/svg/battery-filled.svg';
import thunderIcon from 'assets/svg/thunder-filled.svg';
import { GaugeTag } from 'components/GaugeTag/GaugeTag';
import pluggedIcon from 'assets/svg/plugged-icon.svg';

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

    const outputVoltage = getNumericMeasurementInfo(
        ObccuMeasurements.outputVoltage
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
                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                        }}
                    >
                        <GaugeTag
                            id="obccu_general_voltage"
                            name={'Voltage'}
                            units={'Volts'}
                            getUpdate={totalVoltageHigh.getUpdate}
                            strokeWidth={120}
                            min={totalVoltageHigh.warningRange[0] ?? 225}
                            max={totalVoltageHigh.warningRange[1] ?? 252}
                        />
                        <GaugeTag
                            id="obccu_general_current"
                            name={'Current'}
                            units={'Amps'}
                            getUpdate={dischargeCurrent.getUpdate}
                            strokeWidth={120}
                            min={dischargeCurrent.warningRange[0] ?? 0}
                            max={dischargeCurrent.warningRange[1] ?? 100}
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

                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <GaugeTag
                            id="obccu_output_voltage"
                            name={'Bus Voltage'}
                            units={'Volts'}
                            getUpdate={outputVoltage.getUpdate}
                            strokeWidth={120}
                            min={outputVoltage.warningRange[0] ?? 225}
                            max={outputVoltage.warningRange[1] ?? 252}
                        />
                    </div>
                </div>
            </div>
        </Window>
    );
};
