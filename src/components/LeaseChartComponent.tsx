import React from "react";
import { Chart } from "react-google-charts";

interface ChartComponentProps {
    chartData: any[]; // Data for the chart
    selectedBuilding: string; // Title or label for chart display
    onBuildingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Dropdown change handler
    buildings: string[]; // List of buildings for dropdown
}

const ChartComponent: React.FC<ChartComponentProps> = ({
    chartData,
    selectedBuilding,
    onBuildingChange,
    buildings,
}) => {
    return (
        <div className="chart-container">
            <label htmlFor="building-selector">Select Building:</label>
            <select id="building-selector" onChange={onBuildingChange} value={selectedBuilding}>
                {buildings.map((key: string) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
            

            {/* Render Google Chart */}
            {chartData.length > 0 && (
                <Chart
                    width={"100%"}
                    height={"500px"}
                    chartType="LineChart"
                    loader={<div>Loading Chart...</div>}
                    data={chartData}
                    options={{
                        title: `Rent Value Changes for Each Leasing Unit for ${selectedBuilding}`,
                        hAxis: { title: "Time (Year/Month)" },
                        vAxis: { title: "Rent Value ($)" },
                        legend: { position: "bottom" },
                        series: {}, // Allow multiple lines for each unit
                    }}
                />
            )}
        </div>
    );
};

export default ChartComponent;