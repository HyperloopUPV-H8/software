import { Window } from 'components/Window/Window';
import styles from './LCU.module.scss';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import pitchRotation from 'assets/svg/pitch-rotation.svg';
import yawRotation from 'assets/svg/yaw-rotation.svg';
import rollRotation from 'assets/svg/roll-rotation.svg';
import zIndex from 'assets/svg/z-index.svg';
import yIndex from 'assets/svg/y-index.svg';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { LevitationUnit } from 'components/LevitationUnit/LevitationUnit';
import { LcuMeasurements, useMeasurementsStore } from 'common';

export const LCU = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    const pitch = getNumericMeasurementInfo(LcuMeasurements.rotationPitch);
    const roll = getNumericMeasurementInfo(LcuMeasurements.rotationRoll);
    const yaw = getNumericMeasurementInfo(LcuMeasurements.rotationYaw);
    const positionY = getNumericMeasurementInfo(LcuMeasurements.positionY);
    const positionZ = getNumericMeasurementInfo(LcuMeasurements.positionZ);

    return (
        <Window title="LCU - Current">
            <div className={styles.LCUWrapper}>
                <div className={styles.levitationUnitsWrapper}>
                    <div className={styles.levitationUnitsColumn}>
                        <h5 className={styles.subtitle}>Left side</h5>
                        <LevitationUnit unitIndex={1} kind="hems" />
                        <LevitationUnit unitIndex={5} kind="ems" />
                        <LevitationUnit unitIndex={7} kind="ems" />
                        <LevitationUnit unitIndex={9} kind="ems" />
                        <LevitationUnit unitIndex={3} kind="hems" />
                    </div>

                    <div className={styles.levitationUnitsColumn}>
                        <h5 className={styles.subtitle}>Right side</h5>
                        <LevitationUnit unitIndex={0} kind="hems"  />
                        <LevitationUnit unitIndex={4} kind="ems"  />
                        <LevitationUnit unitIndex={6} kind="ems" />
                        <LevitationUnit unitIndex={8} kind="ems" />
                        <LevitationUnit unitIndex={2} kind="hems" />
                    </div>
                </div>

                <h5 className={styles.subtitle}>Orientation</h5>
                <div className={styles.rotationIndicatorsWrapper}>
                    <IndicatorStack>
                        <BarIndicator
                            icon={pitchRotation}
                            name="Pitch"
                            getValue={pitch.getUpdate}
                            safeRangeMin={pitch.range[0] ?? -0.05}
                            safeRangeMax={pitch.range[1] ?? 0.05}
                            warningRangeMin={pitch.warningRange[0] ?? -0.1}
                            warningRangeMax={pitch.warningRange[1] ?? 0.1}
                            units={pitch.units}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator
                            icon={rollRotation}
                            name="Roll"
                            getValue={roll.getUpdate}
                            safeRangeMin={roll.range[0] ?? -0.05}
                            safeRangeMax={roll.range[1] ?? 0.05}
                            warningRangeMin={roll.warningRange[0] ?? -0.1}
                            warningRangeMax={roll.warningRange[1] ?? 0.1}
                            units={roll.units}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <div className={styles.rotationIndicator}>
                            <BarIndicator
                                icon={yawRotation}
                                name="Yaw"
                                getValue={yaw.getUpdate}
                                safeRangeMin={yaw.range[0] ?? -0.005}
                                safeRangeMax={yaw.range[1] ?? 0.005}
                                warningRangeMin={yaw.warningRange[0] ?? -0.01}
                                warningRangeMax={yaw.warningRange[1] ?? 0.01}
                                units={yaw.units}
                            />
                        </div>
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator
                            icon={zIndex}
                            name="Z"
                            getValue={positionZ.getUpdate}
                            safeRangeMin={positionZ.range[0] ?? -2}
                            safeRangeMax={positionZ.range[1] ?? 2}
                            warningRangeMin={positionZ.warningRange[0] ?? -10}
                            warningRangeMax={positionZ.warningRange[1] ?? 10}
                            units={positionZ.units}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator
                            icon={yIndex}
                            name="Y"
                            getValue={positionY.getUpdate}
                            safeRangeMin={positionY.range[0] ?? -5}
                            safeRangeMax={positionY.range[1] ?? 5}
                            warningRangeMin={positionY.warningRange[0] ?? -10}
                            warningRangeMax={positionY.warningRange[1] ?? 10}
                            units={positionY.units}
                        />
                    </IndicatorStack>
                </div>
            </div>
        </Window>
    );
};

