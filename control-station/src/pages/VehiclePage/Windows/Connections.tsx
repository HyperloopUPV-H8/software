import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { StateIndicator } from 'components/StateIndicator/StateIndicator';
import { Window } from 'components/Window/Window';
import styles from './Connections.module.scss';
import plugIcon from '../../../assets/svg/plugged-icon.svg';
import {
    BmslMeasurements,
    LcuMeasurements,
    ObccuMeasurements,
    PcuMeasurements,
    VcuMeasurements,
} from 'common';

type Props = {};

export default function Connections(_: Props) {
    return (
        <Window title={'Connections'}>
            <div className={styles.connections}>
                <div className={styles.board}>
                    <h3 className={styles.name}>VCU</h3>
                    <IndicatorStack className={styles.state}>
                        <StateIndicator
                            icon={plugIcon}
                            measurementId={VcuMeasurements.generalState}
                        />
                        <StateIndicator
                            icon={plugIcon}
                            measurementId={VcuMeasurements.specificState}
                        />
                    </IndicatorStack>
                </div>
                <div className={styles.row}>
                    <div className={styles.board}>
                        <h3 className={styles.name}>LCU</h3>
                        <IndicatorStack className={styles.state}>
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={LcuMeasurements.generalState}
                            />
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={VcuMeasurements.lcuConnection}
                            />
                        </IndicatorStack>
                    </div>
                    <div className={styles.board}>
                        <h3 className={styles.name}>PCU</h3>
                        <IndicatorStack className={styles.state}>
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={PcuMeasurements.generalState}
                            />
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={PcuMeasurements.specificState}
                            />
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={VcuMeasurements.pcuConnection}
                            />
                        </IndicatorStack>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.board}>
                        <h3 className={styles.name}>OBCCU</h3>
                        <IndicatorStack className={styles.state}>
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={ObccuMeasurements.generalState}
                            />
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={VcuMeasurements.obccuConnection}
                            />
                        </IndicatorStack>
                    </div>
                    <div className={styles.board}>
                        <h3 className={styles.name}>BMSL</h3>
                        <IndicatorStack className={styles.state}>
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={BmslMeasurements.generalState}
                            />
                            <StateIndicator
                                icon={plugIcon}
                                measurementId={VcuMeasurements.bmslConnection}
                            />
                        </IndicatorStack>
                    </div>
                </div>
            </div>
        </Window>
    );
}
