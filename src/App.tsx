import React, { useState, useRef } from "react";
import * as WebDataRocks from "@webdatarocks/react-webdatarocks";
import "@webdatarocks/webdatarocks/webdatarocks.min.css";
import "./App.css";
import pivotIEReportConfig from "./reportTemplates/pivotIEReportConfig";
import pivotRRReportConfig from "./reportTemplates/pivotRRReportConfig";
import pivotLeaseReportConfig from "./reportTemplates/pivotLeaseReportConfig";
import Papa from "papaparse";

// Define the type for report configurations
const reportConfigs = {
    IncomeExpense: pivotIEReportConfig,
    RentRoll: pivotRRReportConfig,
    LeaseAgreement: pivotLeaseReportConfig
};

type ReportType = keyof typeof reportConfigs; // This ensures that `reportType` is one of the keys: "IncomeExpense" | "RentRoll"

const App: React.FC = () => {
    const ref = useRef<WebDataRocks.Pivot>(null);
    const selectedReportTypeRef = useRef<ReportType>("IncomeExpense"); // Use ref to track the latest selected report type

    const [currentConfig, setCurrentConfig] = useState(pivotIEReportConfig);
    const [selectedReportType, setSelectedReportType] = useState<ReportType>("IncomeExpense");
    const [selectedCsvFile, setSelectedCsvFile] = useState("");

    // CSV file sources for each report type
    const csvSources = {
        IncomeExpense: [
            {
                label: "NYC 2019 Income/Expense",
                report_name: "Income and Expense Pivot Report for NYC property 2019",
                value: "https://raw.githubusercontent.com/thanhnh-infinity/mz_data_pivot/refs/heads/main/csv_sources/ie_fact_table_NYC_2019.csv"
            },
            {
                label: "OH 2.2024 Income/Expense",
                report_name: "Income and Expense Pivot Report for MF property 2.2024",
                value: "https://raw.githubusercontent.com/thanhnh-infinity/mz_data_pivot/refs/heads/main/csv_sources/ie_fact_table_Ohio_02_2024.csv"
            },
            {
                label: "OH 4.2024 Income/Expense",
                report_name: "Income and Expense Pivot Report for MF property 4.2024",
                value: "https://raw.githubusercontent.com/thanhnh-infinity/mz_data_pivot/refs/heads/main/csv_sources/ie_fact_table_Ohio_04_2024.csv"
            }
        ],
        RentRoll: [
            {
                label: "NYC Rent Roll 2019",
                report_name: "Rent Roll Report for NYC property 2019",
                value: "https://raw.githubusercontent.com/thanhnh-infinity/mz_data_pivot/refs/heads/main/csv_sources/rr_fact_table_NYC_2019.csv"
            },
            {
                label: "OH Rent Roll 2024",
                report_name: "Rent Roll Report for OH property 2024",
                value: "https://raw.githubusercontent.com/thanhnh-infinity/mz_data_pivot/refs/heads/main/csv_sources/rr_fact_table_Ohio_2024.csv"
            }
        ],
        LeaseAgreement: [
            {
                label: "NYC Lease LeaseAgreement Summary",
                report_name: "Lease LeaseAgreement Summary NYC Property",
                value: "https://raw.githubusercontent.com/thanhnh-infinity/mz_data_pivot/refs/heads/main/csv_sources/lease_fact_table_NYC_all.csv"
            }
        ]
    };

    const onReportComplete = () => {
        if (ref.current) {
            ref.current.webdatarocks.off("reportcomplete");
            console.log(ref.current.webdatarocks);

            const pivot = ref.current.webdatarocks;
            pivot.on("cellclick", handleCellClickEvent);
        }
    };

    const handleCellClickEvent = (cell: any) => {
        console.log(selectedReportTypeRef.current); // Use the ref to get the latest report type
    
        if (selectedReportTypeRef.current === "LeaseAgreement" && cell) {
            if (cell.type === "value") {
                // Remove any existing tooltips
                const existingTooltip = document.getElementById("cell-tooltip");
                if (existingTooltip) {
                    existingTooltip.remove();
                }
    
                // Log the cell data for debugging
                console.log("Cell clicked:", cell);
                const { value: cellValue, rowLabel, columnLabel, isTotal, isGrandTotal, rows, columns } = cell;
    
                // Create a new tooltip
                const tooltip = document.createElement("div");
                tooltip.id = "cell-tooltip";
                tooltip.style.position = "fixed"; // Fixed position for top display
                tooltip.style.top = "10px"; // 10px from the top of the page
                tooltip.style.left = "50%"; // Center horizontally
                tooltip.style.transform = "translateX(-50%)"; // Adjust for centering
                tooltip.style.background = "rgba(0,0,0,0.75)";
                tooltip.style.color = "#fff";
                tooltip.style.padding = "15px";
                tooltip.style.borderRadius = "5px";
                tooltip.style.zIndex = "1000";
                tooltip.style.pointerEvents = "auto";
                tooltip.style.maxWidth = "400px";
                tooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    
                // Tooltip content logic
                let contentTooltip = "";
    
                // Case 1: Total or Grand Total
                if (isTotal && !isGrandTotal) {
                    const rowCaption = rows.length > 0 ? rows[rows.length - 1].caption : "Unknown Row";
                    const colCaption = columns.length > 0 ? columns[columns.length - 1].caption : "Unknown Column";
                    contentTooltip = `Value: ${cellValue} is the total value of lease rent value for ${rowCaption} in ${colCaption}`;
                }
                // Case 2: Non-total cell
                else if (!isTotal && !isGrandTotal) {
                    /*
                    const rowData = cell.label; // Helper function to fetch the record
                    if (rowData && rowData.label) {
                        contentTooltip = `
                            Row: ${rowLabel || "N/A"}<br>
                            Column: ${columnLabel || "N/A"}<br>
                            Value: ${cellValue}<br>
                            Evidence: ${rowData.evidence_of_monthly_rent_amount}
                        `;
                    } else {
                        contentTooltip = "Data not available.";
                    }
                    */

                    contentTooltip = "Data not available .... Implementation is On-Progress...."

                } else {
                    // Unknown case, close the tooltip
                    tooltip.remove();
                    return;
                }
    
                // Add content to the tooltip
                tooltip.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>Cell Details:</strong>
                        <button id="close-tooltip" style="background: transparent; border: none; color: #fff; font-size: 16px; cursor: pointer;">&times;</button>
                    </div>
                    <div>${contentTooltip}</div>
                `;
    
                // Append tooltip to the body
                document.body.appendChild(tooltip);
    
                // Add click event to the close button
                const closeButton = document.getElementById("close-tooltip");
                closeButton?.addEventListener("click", () => {
                    tooltip.remove();
                });
            }
        }
    };

    const updateReportConfig = (reportType: ReportType, csvFile: string, reportName: string) => {
        if (ref.current) {
            const updatedConfig = {
                ...reportConfigs[reportType],
                dataSource: {
                    ...reportConfigs[reportType].dataSource,
                    filename: csvFile // Update filename
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

    return (
        <div className="App">
            <div className="toolbar">
                <label htmlFor="report-type-selector">Choose Report Type: </label>
                <select
                    id="report-type-selector"
                    onChange={(e) => {
                        const selectedType = e.target.value as ReportType; // Cast to ReportType
                        setSelectedReportType(selectedType);
                        selectedReportTypeRef.current = selectedType; // Update the ref with the new value
                        const defaultCsv = csvSources[selectedType][0];
                        setSelectedCsvFile(defaultCsv.value);
                        updateReportConfig(selectedType, defaultCsv.value, defaultCsv.report_name);
                    }}
                    defaultValue={selectedReportType}
                >
                    {Object.keys(reportConfigs).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <label htmlFor="csv-selector">Choose CSV Data Source File: </label>
                <select
                    id="csv-selector"
                    onChange={(e) => {
                        const selectedFileIndex = e.target.selectedIndex;
                        const selectedFile = csvSources[selectedReportType][selectedFileIndex];
                        setSelectedCsvFile(selectedFile.value);
                        updateReportConfig(selectedReportType, selectedFile.value, selectedFile.report_name);
                    }}
                    value={selectedCsvFile}
                >
                    {csvSources[selectedReportType].map((file, index) => (
                        <option key={index} value={file.value}>
                            {file.label}
                        </option>
                    ))}
                </select>
            </div>
            <WebDataRocks.Pivot
                ref={ref}
                toolbar={true}
                width="100%"
                height="1000px"
                reportcomplete={() => onReportComplete()}
                report={currentConfig}
            />
        </div>
    );
};

export default App;