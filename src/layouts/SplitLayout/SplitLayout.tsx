import React from "react";
import styles from "@layouts/SplitLayout/SplitLayout.module.scss";
import {
  useState,
  useEffect,
  useRef,
  MouseEvent as ReactMouseEvent,
} from "react";
type Props = {
  components: React.ReactNode[];
  direction?: Direction;
  initialPortions?: number[];
};

export enum Direction {
  VERTICAL,
  HORIZONTAL,
}

export const SplitLayout = ({
  components,
  direction = Direction.HORIZONTAL,
  initialPortions,
}: Props) => {
  let [normalizedPortions, setNormalizedPortions] = useState<number[]>([]);
  let mousePos = useRef([0, 0]);
  let wrapperRef = useRef<HTMLDivElement>(null);
  let separatorRef = useRef<HTMLDivElement>(null);
  let targetElements = useRef([
    { index: 0, initialSize: 0 },
    { index: 1, initialSize: 0 },
  ]);

  useEffect(() => {
    let portions;

    if (initialPortions) {
      portions = initialPortions;
    } else {
      let defaultFraction = 1 / components.length;
      portions = new Array<number>(components.length).fill(defaultFraction);
    }

    setNormalizedPortions(portions);
  }, []);

  function handleSeparatorMouseDown(
    ev: ReactMouseEvent<HTMLDivElement>,
    index: number
  ) {
    ev.preventDefault();
    mousePos.current = [ev.clientX, ev.clientY];
    targetElements.current = [
      { index: index, initialSize: normalizedPortions[index] },
      { index: index + 1, initialSize: normalizedPortions[index + 1] },
    ];
    document.addEventListener("mousemove", handleDocumentMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
  }

  function handleDocumentMouseUp(ev: MouseEvent) {
    ev.preventDefault();
    document.removeEventListener("mousemove", handleDocumentMove);
    document.removeEventListener("mouseup", handleDocumentMouseUp);
  }

  function handleDocumentMove(ev: MouseEvent) {
    ev.preventDefault();
    let normalizedDisplacement = getNormalizedDisplacement(
      getMouseDisplacement(ev)
    );
    setNormalizedPortions((prevPortions) => {
      return getNormalizedPortions(prevPortions, normalizedDisplacement);
    });
  }

  function getMouseDisplacement(ev: MouseEvent): number {
    if (direction == Direction.HORIZONTAL) {
      return ev.clientX - mousePos.current[0];
    } else {
      return ev.clientY - mousePos.current[1];
    }
  }

  function getNormalizedDisplacement(screenDisplacement: number): number {
    let wrapperLength = getElementLength(wrapperRef.current!);
    let wrapperLengthWithoutSeparators =
      wrapperLength -
      getElementLength(separatorRef.current!) * (normalizedPortions.length - 1);
    return screenDisplacement / wrapperLengthWithoutSeparators;
  }

  function getElementLength(element: HTMLElement): number {
    let rect = element.getBoundingClientRect();
    if (direction == Direction.HORIZONTAL) {
      return rect.width;
    } else {
      return rect.height;
    }
  }

  function getNormalizedPortions(
    prevFractions: number[],
    normalizedDisplacement: number
  ) {
    let newFractions = [...prevFractions];
    newFractions[targetElements.current[0].index] =
      targetElements.current[0].initialSize + normalizedDisplacement;
    newFractions[targetElements.current[1].index] =
      targetElements.current[1].initialSize - normalizedDisplacement;
    return newFractions;
  }

  return (
    <div
      id={styles.wrapper}
      ref={wrapperRef}
      style={{
        flexDirection: direction == Direction.HORIZONTAL ? "row" : "column",
      }}
    >
      {components.map((component, index, arr) => {
        return (
          <React.Fragment key={index}>
            <div
              className={styles.componentWrapper}
              style={{ flexBasis: `${normalizedPortions[index] * 100}%` }}
            >
              {component}
            </div>
            {index < arr.length - 1 && (
              <div
                ref={separatorRef}
                className={styles.separator}
                style={{
                  cursor:
                    direction == Direction.HORIZONTAL ? "e-resize" : "n-resize",
                }}
                onMouseDown={(ev) => {
                  handleSeparatorMouseDown(ev, index);
                }}
              >
                <div className={styles.line}></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
