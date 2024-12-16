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
            {
                uniqueName: "year"
            },
            {
                uniqueName: "month",
                sortOrder: "asc",
                sort: "custom",
                customSorting: [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ]
            }
        ],
        measures: [
            {
                uniqueName: "rent_value_current_month",
                aggregation: "sum"
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
            name: "Lease Aggrement Report",
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

export default pivotLeaseReportConfig;