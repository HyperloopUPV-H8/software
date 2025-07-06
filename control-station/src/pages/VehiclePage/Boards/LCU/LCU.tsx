import { Window } from 'components/Window/Window';
import styles from './LCU.module.scss';
import pitchRotation from 'assets/svg/pitch-rotation.svg';
import yawRotation from 'assets/svg/yaw-rotation.svg';
import rollRotation from 'assets/svg/roll-rotation.svg';
import zIndex from 'assets/svg/z-index.svg';
import yIndex from 'assets/svg/y-index.svg';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { LevitationUnit } from 'components/LevitationUnit/LevitationUnit';
import { LcuMeasurements, useMeasurementsStore } from 'common';
import { OrientationIndicator } from 'components/OrientationIndicator/OrientationIndicator';

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
                        <LevitationUnit unitIndex={1} kind="hems" imageSide={'none'} />
                        <LevitationUnit unitIndex={5} kind="ems" imageSide={'none'} />
                        <LevitationUnit unitIndex={7} kind="ems" imageSide={'none'} />
                        <LevitationUnit unitIndex={9} kind="ems" imageSide={'none'} />
                        <LevitationUnit unitIndex={3} kind="hems" imageSide={'none'} />
                    </div>

                    <div className={styles.levitationUnitsColumn}>
                        <h5 className={styles.subtitle}>Right side</h5>
                        <LevitationUnit unitIndex={0} kind="hems" imageSide={'none'}  />
                        <LevitationUnit unitIndex={4} kind="ems" imageSide={'none'}  />
                        <LevitationUnit unitIndex={6} kind="ems" imageSide={'none'} />
                        <LevitationUnit unitIndex={8} kind="ems" imageSide={'none'} />
                        <LevitationUnit unitIndex={2} kind="hems" imageSide={'none'} />
                    </div>
                </div>

                <h5 className={styles.subtitle}>Orientation</h5>
                <div className={styles.rotationIndicatorsWrapper}>
                    <div className={styles.rotationRow}>
                        <IndicatorStack>
                            <OrientationIndicator
                                icon={pitchRotation}
                                name="Pitch"
                                getValue={pitch.getUpdate}
                                units='º'
                            />
                        </IndicatorStack>
                        <IndicatorStack>
                            <OrientationIndicator
                                icon={rollRotation}
                                name="Roll"
                                getValue={roll.getUpdate}
                                units='º'
                            />
                        </IndicatorStack>
                        <IndicatorStack>
                            <OrientationIndicator
                                icon={yawRotation}
                                name="Yaw"
                                getValue={yaw.getUpdate}
                                units='º'
                            />
                        </IndicatorStack>
                    </div>
                    <div className={styles.positionRow}>
                        <IndicatorStack>
                            <OrientationIndicator
                                icon={zIndex}
                                name="Z"
                                getValue={positionZ.getUpdate}
                                units={positionZ.units}
                            />
                        </IndicatorStack>
                        <IndicatorStack>
                            <OrientationIndicator
                                icon={yIndex}
                                name="Y"
                                getValue={positionY.getUpdate}
                                units={positionY.units}
                            />
                        </IndicatorStack>
                    </div>
                </div>
            </div>
        </Window>
    );
};

