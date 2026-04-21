/**
 * Test script to verify Google Sheets data fetching
 */

const SHEET_URLS = [
  {
    id: "1839XKHWW4kB8cu2DUTjuwdlr7q6hD2nqa8xpV8Dga44",
    gid: "1137409283",
    name: "Sheet 1",
  },
  {
    id: "17hi9_c6HyHSTdmGldMazhxH0UU8wB2dTTaYfTCO5Gjw",
    gid: "1551564035",
    name: "Sheet 2",
  },
  {
    id: "11-JuzArW-CLhwmMM8GtIR_tt-s8ruVRHDQVXJE3nups",
    gid: "54907248",
    name: "Sheet 3",
  },
];

const BOX_START_COLUMNS = [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81];

async function fetchSheetData(spreadsheetId, gid, sheetName) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch sheet: ${response.status} ${response.statusText}`
      );
    }

    const csv = await response.text();
    const rows = csv.split("\n").map((row) => row.split(","));

    console.log(`✓ Fetched ${rows.length} rows from ${sheetName}`);
    return rows;
  } catch (error) {
    console.error(`✗ Error fetching ${sheetName}:`, error.message);
    throw error;
  }
}

function parseSheetEmployees(rows, sheetName) {
  const employees = [];

  for (const startCol of BOX_START_COLUMNS) {
    try {
      const nameCell = rows[0]?.[startCol - 1]?.trim();

      if (!nameCell || nameCell.length === 0) {
        continue;
      }

      const hoursColIndex = startCol + 4 - 1;
      const hoursCell = rows[563]?.[hoursColIndex]?.trim();

      if (!hoursCell || hoursCell.length === 0) {
        continue;
      }

      let hours = 0;
      if (hoursCell.includes(":")) {
        const parts = hoursCell.split(":").map((p) => parseFloat(p) || 0);
        hours = parts[0] + parts[1] / 60 + (parts[2] || 0) / 3600;
      } else {
        hours = parseFloat(hoursCell);
      }

      if (!isNaN(hours) && hours > 0) {
        employees.push({
          name: nameCell,
          hours: Math.round(hours * 100) / 100,
        });
      }
    } catch (error) {
      console.error(
        `Error parsing box at column ${startCol} in ${sheetName}:`,
        error.message
      );
    }
  }

  return employees;
}

async function testAllSheets() {
  console.log("Testing Google Sheets data fetching...\n");

  for (const sheet of SHEET_URLS) {
    try {
      const rows = await fetchSheetData(sheet.id, sheet.gid, sheet.name);
      const employees = parseSheetEmployees(rows, sheet.name);
      console.log(`  Found ${employees.length} employees:`);
      employees.forEach((emp) => {
        console.log(`    - ${emp.name}: ${emp.hours} hours`);
      });
      console.log();
    } catch (error) {
      console.error(`Failed to process ${sheet.name}\n`);
    }
  }
}

testAllSheets().catch(console.error);
