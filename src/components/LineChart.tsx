import {
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {LineChartInterface} from "../models/ChartInterfaces.tsx";

/**
 * LineChart component
 * Reusable chart showing a line with shaded area beneath,
 * styled to match the provided design.
 *
 * Props:
 * - data: Array<{ session: string | number; weight: number }>
 * - width: string | number (optional, default '100%')
 * - height: number (optional, default 200)
 */
const LineChart: React.FC<LineChartInterface> = ({
                                                 data,
                                                 width = '100%',
                                                 height = 200,
                                             }) => {
    return (
        <div
            style={{
                backgroundColor: '#2e2e2e',
                borderRadius: '12px',
                padding: '16px',
            }}
        >
            <ResponsiveContainer width={width} height={height}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                    <defs>
                        <linearGradient id="gradientWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2CE9E7" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#2CE9E7" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#2CE9E7"
                        strokeWidth={3}
                        fill="url(#gradientWeight)"
                        dot={{ fill: '#2CE9E7', r: 4 }}
                        activeDot={{ r: 5 }}
                    />

                    <XAxis
                        dataKey="session"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#ccc', fontSize: 12 }}
                        padding={{ left: 5, right: 5 }}
                    />

                    <Tooltip
                        contentStyle={{ backgroundColor: '#444', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                        itemStyle={{ color: '#2CE9E7' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChart;
