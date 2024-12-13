import React, { useState, useRef, useEffect } from "react";
import * as WebDataRocks from "@webdatarocks/react-webdatarocks";
import "@webdatarocks/webdatarocks/webdatarocks.min.css";
import "./App.css";
import { createTooltip, findMatchingRow, configureCellStyleLeaseTable } from "./utils";
import pivotIEReportConfig from "./reportTemplates/pivotIEReportConfig";
import pivotRRReportConfig from "./reportTemplates/pivotRRReportConfig";
import pivotLeaseReportConfig from "./reportTemplates/pivotLeaseReportConfig";
import ChartComponent from "./components/LeaseChartComponent";

const reportConfigs = {
    IncomeExpense: pivotIEReportConfig,
    RentRoll: pivotRRReportConfig,
    LeaseAgreement: pivotLeaseReportConfig
};

type ReportType = keyof typeof reportConfigs; // This ensures that `reportType` is one of the keys: "IncomeExpense" | "RentRoll"

const api_end_point = "http://127.0.0.1:5001/api/get_report_data"

let globalReportData : any = {};

const App: React.FC = () => {
    const ref = useRef<WebDataRocks.Pivot>(null);
    const selectedReportTypeRef = useRef<ReportType>("IncomeExpense");
    const [currentConfig, setCurrentConfig] = useState(pivotIEReportConfig);
    const [reportData, setReportData] = useState<any>(null); 
    const [reportName, setReportName] = useState<string>(""); 
    const [reportType, setReportType] = useState<ReportType>("IncomeExpense"); 
    
    const [chartData, setChartData] = useState<any[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<string>("");

    const onReportComplete = () => {
        if (ref.current) {
            ref.current.webdatarocks.off("reportcomplete");
            console.log(ref.current.webdatarocks);
    
            const pivot = ref.current.webdatarocks;
            pivot.on("cellclick", handleCellClickEvent);
        }
    };
    
    const handleCellClickEvent = (cell: any) => {   
        
        const existingTooltip = document.getElementById("cell-tooltip");
        if (existingTooltip) existingTooltip.remove();

        if (!cell || cell.type !== "value" || cell.isGrandTotal || isNaN(cell.value)) return;
        let contentTooltip = "";

        if (cell.isTotal) {
            const rowCaption = cell.rows?.[cell.rows.length - 1]?.caption || "Unknown Row";
            const colCaption = cell.columns?.[cell.columns.length - 1]?.caption || "Unknown Column";
            switch (selectedReportTypeRef.current) {
                case "LeaseAgreement" :
                    contentTooltip = `Value: ${cell.value} is the total rent for ${rowCaption} in ${colCaption}`;
                    break;
                case "IncomeExpense":
                    contentTooltip = `IncomeExpense`;
                    break;
            }
                
            createTooltip(contentTooltip);
        } else {
            // For non-total cells, fetch the matching row data
            const searchBuilding = cell.rows?.[cell.rows.length - 2]?.caption || "Unknown Row";
            const searchUnit = cell.rows?.[cell.rows.length - 1]?.caption || "Unknown Row";
            
            const colYear = cell.columns?.[cell.columns.length - 2]?.caption || "Unknown Column";
            const colMonth = cell.columns?.[cell.columns.length - 1]?.caption || "Unknown Column";
             // Convert year and month to numbers
            const year = Number(colYear);
            const month = Number(colMonth);
            const searchConditions = {
                unique_building: searchBuilding,
                unique_unit: searchUnit,
                year: year,
                month: month
            };
            const rowData = findMatchingRow(globalReportData.data, searchConditions);
            if (rowData) {
                switch (selectedReportTypeRef.current) {
                    case "LeaseAgreement":
                        contentTooltip = `
                            <strong>Unit:</strong> ${rowData.unique_unit || "N/A"}<br>
                            <strong>Year:</strong> ${rowData.year || "N/A"}<br>
                            <strong>Month:</strong> ${rowData.month || "N/A"}<br>
                            <strong>Rent:</strong> $${rowData.rent_value_current_month || "N/A"}<br>
                            <strong>Evidence:</strong> ${rowData.evidence_of_monthly_rent_amount || "N/A"}
                        `;
                        createTooltip(contentTooltip);
                        break;
                    case "IncomeExpense":
                        contentTooltip = `IncomeExpense`
                        createTooltip(contentTooltip);
                        break;
                    default:
                        contentTooltip = "Additional details are not available.";
                }
            } else {
                const existingTooltip = document.getElementById("cell-tooltip");
                if (existingTooltip) existingTooltip.remove();
                return;
            }
        }
    };

    useEffect(() => {
        fetch(api_end_point)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Data:", data);
                globalReportData = {...data}
                setReportData(data.data);
                setReportName(data.report_name);
                setReportType(data.report_type as ReportType);
                selectedReportTypeRef.current = data.report_type as ReportType;
                processChartData(data.data);
            })
            .catch((err) => console.error("Error fetching report data:", err));
    }, []);

    useEffect(() => {
        if (reportData && reportName && reportType) {
            updateReportConfig(reportType, reportData, reportName);
        }
    }, [reportData, reportName, reportType]);

    const updateReportConfig = (reportType: ReportType, reportData: any, reportName: string) => {
        if (ref.current) {
            const updatedConfig = {
                ...reportConfigs[reportType],
                dataSource: {
                    data: reportData, // Use the JSON data instead of filename
                    dataSourceType: "json" // Ensure the type is set to JSON
                },
                options: {
                    ...reportConfigs[reportType].options,
                    grid: {
                        ...reportConfigs[reportType].options.grid,
                        title: reportName // Update grid title
                    }
                },
                slice: {
                    ...reportConfigs[reportType].slice,
                    rows: [...reportConfigs[reportType].slice.rows],
                    columns: [...reportConfigs[reportType].slice.columns],
                    measures: [...(reportConfigs[reportType].slice.measures || [])],
                    expands: {
                        rows: reportConfigs[reportType].slice.expands.rows || [], // Default to empty array
                        columns: reportConfigs[reportType].slice.expands.columns || [] // Default to empty array
                    }
                }
            };
    
            setCurrentConfig(updatedConfig); // Update state
            ref.current.webdatarocks.setReport(updatedConfig); // Update WebDataRocks report
        }
    };


    // Process Chart Data for all units in a selected building
    const processChartData = (data: any[]) => {
        if (selectedReportTypeRef.current === "LeaseAgreement") {
            const groupedData: { [key: string]: any } = {};

            data.forEach((row) => {
                const buildingKey = row.unique_building;
                if (!groupedData[buildingKey]) {
                    groupedData[buildingKey] = {};
                }

                const unitKey = row.unique_unit;
                const timeKey = `${row.year}-${row.month}`;

                if (!groupedData[buildingKey][unitKey]) {
                    groupedData[buildingKey][unitKey] = {};
                }
                groupedData[buildingKey][unitKey][timeKey] = row.rent_value_current_month;
            });

            const defaultBuilding = Object.keys(groupedData)[0];
            setSelectedBuilding(defaultBuilding);

            const chartHeader = ["Year/Month", ...Object.keys(groupedData[defaultBuilding])];

            const chartRows: any[] = [];
            const timeKeys = Array.from(
                new Set(
                    Object.values(groupedData[defaultBuilding] as Record<string, any>) // Cast values to a known type
                        .map((unit) => Object.keys(unit as Record<string, number>)) // Cast unit to an object
                        .flat()
                )
            ).sort();

            timeKeys.forEach((time) => {
                const row: any[] = [time];
                Object.keys(groupedData[defaultBuilding]).forEach((unitKey) => {
                    row.push(groupedData[defaultBuilding][unitKey][time] || 0);
                });
                chartRows.push(row);
            });

            const finalChartData = [chartHeader, ...chartRows];
            setChartData(finalChartData);
        } 
    };

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (selectedReportTypeRef.current === "LeaseAgreement") {
            const selectedKey = e.target.value;
            setSelectedBuilding(selectedKey);
            processChartData(globalReportData.data.filter((row: any) => row.unique_building === selectedKey));
        }
    };

    // Customize cell appearance
    const customizeCellFunction = (cellBuilder: any, cellData: any) => {
        if (selectedReportTypeRef.current === "LeaseAgreement") {
            configureCellStyleLeaseTable(cellBuilder, cellData)
        }
    };

    return (
        <div className="App">
             {/* WebDataRocks Pivot Table */}
            <WebDataRocks.Pivot
                ref={ref}
                toolbar={true}
                width="100%"
                height="800px"
                reportcomplete={() => onReportComplete()}
                customizeCell={customizeCellFunction}
                report={currentConfig}
            />

            
            {/* Chart Component */}
            <ChartComponent
                chartData={chartData}
                selectedBuilding={selectedBuilding}
                onBuildingChange={handleBuildingChange}
                buildings={Array.from(new Set(globalReportData.data?.map((row: any) => row.unique_building)))}
            />
        </div>
    );
};

export default App;