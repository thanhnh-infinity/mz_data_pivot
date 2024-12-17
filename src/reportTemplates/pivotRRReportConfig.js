const pivotRRReportConfig = {
    dataSource: {
        dataSourceType: "json",
        data: []
    },
    slice: {
        rows: [
            { uniqueName: "unit_id" },
            { uniqueName: "tenant_name" },
            { uniqueName: "unit_type" },
            { uniqueName: "monthly_rent" },
            { uniqueName: "move_in_date" },
            { uniqueName: "lease_end_date.Day" },
            { uniqueName: "lease_end_date.Month" },
            { uniqueName: "lease_end_date.Year" }
        ],
        columns: [{ uniqueName: "Measures" }],
        measures: [],
        expands: {
            rows: [],
            columns: []
        }
    },
    options: {
        grid: {
            type: "flat",
            title: "Rent Roll Report",
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
            name: "Rent Roll Format",
            thousandsSeparator: ",",
            decimalSeparator: ".",
            decimalPlaces: 2,
            maxSymbols: 20,
            currencySymbol: "",
            currencySymbolAlign: "right",
            nullValue: " ",
            infinityValue: "Infinity",
            divideByZeroValue: "Infinity"
        }
    ]
};

export default pivotRRReportConfig;