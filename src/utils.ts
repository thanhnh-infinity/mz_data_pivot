// utils.ts
export const createTooltip = (contentTooltip: string) => {
    const existingTooltip = document.getElementById("cell-tooltip");
    if (existingTooltip) existingTooltip.remove();

    const tooltip = document.createElement("div");
    tooltip.id = "cell-tooltip";
    tooltip.style.position = "fixed";
    tooltip.style.top = "10px";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translateX(-50%)";
    tooltip.style.background = "rgba(0,0,0,0.75)";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "15px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.zIndex = "1000";
    tooltip.style.pointerEvents = "auto";
    tooltip.style.maxWidth = "400px";
    tooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    tooltip.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>Cell Details:</strong>
            <button id="close-tooltip" style="background: transparent; border: none; color: #fff; font-size: 16px; cursor: pointer;">&times;</button>
        </div>
        <div>${contentTooltip}</div>
    `;
    document.body.appendChild(tooltip);

    const closeButton = document.getElementById("close-tooltip");
    closeButton?.addEventListener("click", () => tooltip.remove());
};

export const findMatchingRow = (data: any[], searchConditions: any) => {
    return data.find(
        (row) =>
            row.unique_building === searchConditions.unique_building &&
            row.unique_unit === searchConditions.unique_unit &&
            row.year === searchConditions.year &&
            row.month === searchConditions.month
    );
};


export const configureCellStyleLeaseTable = (cellBuilder: any, cellData: any) => {
    if (cellData && cellData.type === "value") {
        if (cellData.type === "value" && (cellData.value === null || cellData.value === undefined || isNaN(cellData.value))) {
            cellBuilder.text = "0";
            cellBuilder.addClass("zero_value"); 
        }
    }

    if (cellData.type == "value") {
        if (cellData.rowIndex % 2 == 0) {
        cellBuilder.addClass("distinguish_row_1");
        } else {
        cellBuilder.addClass("distinguish_row_2");
        }
    }
}