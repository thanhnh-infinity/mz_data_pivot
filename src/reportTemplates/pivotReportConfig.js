const pivotIEReportConfig = {
    dataSource: {
        dataSourceType: "csv",
        filename: "https://raw.githubusercontent.com/thanhnh-infinity/thanhnh-infinity.github.io/refs/heads/master/projects/ie_fact_table_NYC_2019.csv"
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
            { uniqueName: "month" }
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
                { tuple: ["year.2019"] }
            ]
        }
    },
    options: {
        grid: {
            type: "compact",
            title: "Income and Expense Report for NYC Property 2019",
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