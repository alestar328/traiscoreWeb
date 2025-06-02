import {
    LineChart as RechartsLineChart,
    Line,
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
                <RechartsLineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#2CE9E7"
                        strokeWidth={2}
                        dot={{ fill: '#2CE9E7', r: 3, strokeWidth: 0 }}
                        activeDot={{ r: 4, fill: '#2CE9E7', strokeWidth: 0 }}
                        connectNulls={true}
                    />

                    <XAxis
                        dataKey="session"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#ccc', fontSize: 12 }}
                        padding={{ left: 5, right: 5 }}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#444',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                        labelStyle={{ color: '#fff' }}
                        itemStyle={{ color: '#2CE9E7' }}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChart;