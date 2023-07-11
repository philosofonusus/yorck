import React from "react";
import { createChart, ColorType, UTCTimestamp } from "lightweight-charts";

interface NetCurveChartProps {
  charts: {
    label: string;
    data: {
      time: UTCTimestamp;
      value: number;
    }[];
  }[];
}

const randomColor = (() => {
  "use strict";

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const HSLToRGB = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

  return () => {
    var h = randomInt(0, 360);
    var s = randomInt(42, 98);
    var l = randomInt(40, 90);
    return `rgba(${HSLToRGB(h, s, l)
      .map((el) => +el.toFixed(0))
      .join(",")}, opacity)`;
  };
})();

const NetCurveChart: React.FC<NetCurveChartProps> = ({ charts }) => {
  const chartRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current!, {
      width: chartRef.current!.offsetWidth,
      height: chartRef.current!.offsetHeight,
      // dark mode chart
      layout: {
        background: {
          type: ColorType.Solid,
          color: "rgba(2, 8, 23, 1)",
        },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          color: "rgba(30, 41, 59, 0.78)",
        },
        horzLines: {
          color: "rgba(30, 41, 59, 0.78)",
        },
      },
      handleScroll: {
        vertTouchDrag: false,
      },
      crosshair: {
        vertLine: {
          color: "rgba(197, 203, 206, 0.5)",
          labelBackgroundColor: "rgba(30, 41, 59, 1)",
          width: 1,
          style: 3,
        },
        horzLine: {
          color: "rgba(197, 203, 206, 0.5)",
          width: 1,
          labelBackgroundColor: "rgba(30, 41, 59, 1)",
          style: 3,
        },
        mode: 1,
      },
      leftPriceScale: {
        visible: true,
        borderVisible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        fixRightEdge: true,
        borderVisible: false,
        timeVisible: true,
      },
    });
    charts.map((el) => {
      const color = randomColor();
      const series = chart.addAreaSeries({
        title: el.label.slice(0, 6),
        topColor: color.replace("opacity", "0.56"),
        bottomColor: color.replace("opacity", "0.04"),
        lineColor: color.replace("opacity", "1"),
      });
      series.setData(el.data);
    });
    return () => {
      chart.remove();
    };
  }, [chartRef, charts]);

  return <div className="w-1/2 aspect-[16/9]" ref={chartRef} />;
};

export default NetCurveChart;
