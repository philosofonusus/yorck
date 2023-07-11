import React from "react";
import { AxisOptions, Chart } from "react-charts";

interface NetCurveChartProps {
  charts: {
    label: string;
    data: {
      primary: Date;
      secondary: number;
    }[];
  }[];
}

const NetCurveChart: React.FC<NetCurveChartProps> = ({ charts }) => {
  const primaryAxis = React.useMemo<
    AxisOptions<(typeof charts)[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary as unknown as Date,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<(typeof charts)[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  return (
    <div style={{ width: "400px", height: "300px" }}>
      <Chart
        options={{
          data: charts,
          primaryAxis,
          dark: true,
          secondaryAxes,
        }}
      />
    </div>
  );
};

export default NetCurveChart;
