import React, { useState } from "react";
import * as WebDataRocks from "@webdatarocks/react-webdatarocks";
import "@webdatarocks/webdatarocks/webdatarocks.min.css";
import "./App.css";
import pivotIEReportConfig from "./reportTemplates/pivotIEReportConfig";
import pivotRRReportConfig from "./reportTemplates/pivotRRReportConfig";
import pivotLeaseReportConfig from "./reportTemplates/pivotLeaseReportConfig";

// Define the type for report configurations
const reportConfigs = {
    IncomeExpense: pivotIEReportConfig,
    RentRoll: pivotRRReportConfig,
    LeaseAggrement : pivotLeaseReportConfig
};

type ReportType = keyof typeof reportConfigs; // This ensures that `reportType` is one of the keys: "IncomeExpense" | "RentRoll"

const App: React.FC = () => {
    const ref: React.RefObject<WebDataRocks.Pivot> = React.useRef<WebDataRocks.Pivot>(null);

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
        LeaseAggrement: [
          {
              label: "NYC Lease Aggrement Summary",
              report_name: "Lease Aggrement Summary NYC Property",
              value: "https://raw.githubusercontent.com/thanhnh-infinity/mz_data_pivot/refs/heads/main/csv_sources/lease_fact_table_NYC_all.csv"
          }
      ]

    };

    const onReportComplete = () => {
        if (ref.current) {
            ref.current.webdatarocks.off("reportcomplete");
            console.log(ref.current.webdatarocks);
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