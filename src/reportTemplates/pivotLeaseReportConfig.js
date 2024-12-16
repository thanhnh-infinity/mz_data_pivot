const pivotLeaseReportConfig = {
    dataSource: {
        dataSourceType: "csv",
        filename: ""
    },
    slice: {
        rows: [
            { uniqueName: "unique_building" },
            { uniqueName: "unique_unit" },
            { uniqueName: "tenant" },
            { uniqueName: "unit_tenant_hiring_from_owner" }
        ],
        columns: [
            { uniqueName: "Measures" },
            { uniqueName: "year"   },
            { 
                uniqueName: "month_index",
                caption: "Month",
                mapping: { // Map numeric values to month names
                    1: "January",
                    2: "February",
                    3: "March",
                    4: "April",
                    5: "May",
                    6: "June",
                    7: "July",
                    8: "August",
                    9: "September",
                    10: "October",
                    11: "November",
                    12: "December"
                }
            }
        ],
        measures: [
            {
                uniqueName: "rent_value_current_month",
                aggregation: "sum",
                format: "69bgc8ao"
            }
        ],
        expands: {
            rows: [],
            columns: []
        }
    },
    options: {
        grid: {
            type: "compact",
            title: "Lease Aggrement Report",
            showFilter: true,
            showHeaders: true,
            showTotals: true,
            showGrandTotals: "on",
            showHierarchies: true,
            showHierarchyCaptions: true,
            showReportFiltersArea: true
        },
        configuratorActive: false,
        configuratorButton: true,
        showAggregations: true,
        showCalculatedValuesButton: true,
        drillThrough: true,
        showDrillThroughConfigurator: true,
        sorting: "on",
        datePattern: "dd/MM/yyyy",
        dateTimePattern: "dd/MM/yyyy HH:mm:ss",
        saveAllFormats: false,
        showDefaultSlice: true,
        defaultHierarchySortName: "asc"
    },
    formats: [
        {
            name: "69bgc8ao",
            thousandsSeparator: ",",
            decimalSeparator: ".",
            decimalPlaces: 2,
            maxSymbols: 20,
            currencySymbol: "$",
            currencySymbolAlign: "left",
            nullValue: " ",
            infinityValue: "Infinity",
            divideByZeroValue: "Infinity"
        }
    ]
};

export default pivotLeaseReportConfig;