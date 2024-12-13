const pivotIEReportConfig = {
    dataSource: {
        dataSourceType: "csv",
        filename: ""
    },
    slice: {
        rows: [
            { uniqueName: "income_or_expense" },
            { uniqueName: "category" },
            { uniqueName: "original_category" }
        ],
        columns: [
            { uniqueName: "Measures" },
            { uniqueName: "year" },
            {
                uniqueName: "month",
                sortOrder: "asc", // Enforce ascending order
                sort: "custom",   // Use custom sorting for this field
                customSorting: [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ]
            }
        ],
        measures: [
            {
                uniqueName: "amount",
                aggregation: "sum"
            }
        ],
        expands: {
            rows: [
                { tuple: ["income_or_expense.Expense"] },
                { tuple: ["income_or_expense.Income"] }
            ],
            columns: [
            ]
        }
    },
    options: {
        grid: {
            type: "compact",
            title: "Income and Expense Report",
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
            name: "Income and Expense NYC 2019",
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

export default pivotIEReportConfig;