import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions } from 'react-native';

const HexagonBackground = ({
  className = '',
  children,
  hexagonProps = {},
  hexagonSize = 75,
  hexagonMargin = 3,
  ...props
}) => {
  const hexagonWidth = hexagonSize;
  const hexagonHeight = hexagonSize * 1.1;
  const rowSpacing = hexagonSize * 0.8;
  const baseMarginTop = -36 - 0.275 * (hexagonSize - 100);
  const computedMarginTop = baseMarginTop + hexagonMargin;
  const oddRowMarginLeft = -(hexagonSize / 2);
  const evenRowMarginLeft = hexagonMargin / 2;

  const [gridDimensions, setGridDimensions] = useState({
    rows: 0,
    columns: 0,
  });

  const updateGridDimensions = useCallback(() => {
    const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
    const rows = Math.ceil(screenHeight / rowSpacing);
    const columns = Math.ceil(screenWidth / hexagonWidth) + 1;
    setGridDimensions({ rows, columns });
  }, [rowSpacing, hexagonWidth]);

  useEffect(() => {
    updateGridDimensions();
    const subscription = Dimensions.addEventListener('change', updateGridDimensions);
    return () => subscription?.remove();
  }, [updateGridDimensions]);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#000000',
        zIndex: 0,
      }}
      {...props}
    >
      {/* SVG Grid for Hexagons */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: gridDimensions.rows }).map((_, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={{
              flexDirection: 'row',
              marginTop: computedMarginTop,
              marginLeft:
                ((rowIndex + 1) % 2 === 0
                  ? evenRowMarginLeft
                  : oddRowMarginLeft) - 10,
            }}
          >
            {Array.from({ length: gridDimensions.columns }).map((_, colIndex) => (
              <View
                key={`hexagon-${rowIndex}-${colIndex}`}
                style={{
                  width: hexagonWidth,
                  height: hexagonHeight,
                  marginLeft: hexagonMargin,
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* SVG Hexagon */}
                <svg
                  width={hexagonWidth}
                  height={hexagonHeight}
                  viewBox={`0 0 ${hexagonWidth} ${hexagonHeight}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  {/* Outer hexagon */}
                  <polygon
                    points={`
                      ${hexagonWidth * 0.5},0
                      ${hexagonWidth},${hexagonHeight * 0.25}
                      ${hexagonWidth},${hexagonHeight * 0.75}
                      ${hexagonWidth * 0.5},${hexagonHeight}
                      0,${hexagonHeight * 0.75}
                      0,${hexagonHeight * 0.25}
                    `}
                    fill="#000000"
                    stroke="none"
                  />
                  {/* Inner hexagon border */}
                  <polygon
                    points={`
                      ${hexagonWidth * 0.5},0
                      ${hexagonWidth},${hexagonHeight * 0.25}
                      ${hexagonWidth},${hexagonHeight * 0.75}
                      ${hexagonWidth * 0.5},${hexagonHeight}
                      0,${hexagonHeight * 0.75}
                      0,${hexagonHeight * 0.25}
                    `}
                    fill="none"
                    stroke="#404040"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                </svg>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Content */}
      {children && (
        <View
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default HexagonBackground;
