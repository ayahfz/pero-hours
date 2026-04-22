/**
 * Google Sheets data fetcher and parser
 * Fetches data from public Google Sheets URLs and extracts employee hours
 */

// Helper to create sheets for a specific month
const createSheetsForMonth = (gids: Record<string, string>) => [
  { id: "1sYzuJ7q9GRI-atGNJLMipBxYkshsGQAiIeE3c9Ijwyo", gid: gids.walid, name: "Walid Chert-F-Peroptyx" },
  { id: "1eiGLnIqFrKlj9XnIvse94xdcHERgcVbaVENDsrHl5kY", gid: gids.hamza, name: "Hamza Sabil-F-peropetyx" },
  { id: "1HRuWakC2bQBO3yLtQxPe5VIleTfBtBw2qCkdKif0WOE", gid: gids.amira, name: "Amira Benjaloun-F-peropetyx" },
  { id: "1AwBTqOViVWCOq0D1H1iMZVEYuqeNUJHFL4jLcaaDd_k", gid: gids.rwan, name: "rwan Javaudin-F-peropetyx" },
  { id: "1NdgFWyx7Uh6PZ-w7xNDB2gE08F_R6-8Bk27y8l1kd3A", gid: gids.amir, name: "amir hamidi-F-peropetyx" },
  { id: "149z6tTWCKhqX5YrNcqLwxwE9ra_EXLBmjxFAe8bZ7vs", gid: gids.ikram, name: "ikram aboutaleb-F-peropetyx" },
  { id: "1SS1F-KhUj0qg9TIUKcZu0zkV74YYY9T215E4-ib_oe0", gid: gids.reda, name: "Reda Boutara-F-pero" },
  { id: "1Qa3wTrh18rBEy3jwBBmYhI4lv-a8OYGdHa2n58o7uFU", gid: gids.saad, name: "Saad Hamid-F-pero" },
  { id: "1BTksdCZw4LyxyX-VnSY1qBZ2cm8escirZQBsCpi9YcA", gid: gids.aidan, name: "AIDAN AMINE-F-peroptyx" },
  { id: "1_cIcz1UV0_qSMlYs1BqIpCO56PKHSkIPXV2-d5qmZiU", gid: gids.ayoup, name: "Ayoup Elbarzouli-F-peropetyx" },
  { id: "1Vc8cCX3DySDNfJ0DD_fELptokUhGjIL9eaZ9pm9Lw3w", gid: gids.ahmed, name: "Ahmed-F-Sbs-pero" },
  { id: "110lICXLoRnfXpU06I000ujud0sbf5Zv04h9fyunKimI", gid: gids.sara, name: "Sara Sakhri-F-pero" },
  { id: "1SLaorcTMTJATgoAEo0LAjX66Kx27hwsquyS2Aro7WiM", gid: gids.kamal, name: "Kamal-F-pero" },
  { id: "1UHTif1TIDR2bSZsVQ7ltS9lkzs84Y4cprO6u89wGX4M", gid: gids.lea, name: "Lea Parke-F-Peroptyx" },
  { id: "14rvI0GLgMBmTEYsrjgCwmwzLloTpmzXBHZW317lJDVw", gid: gids.nhi, name: "Nhi Nguyen-belgium-Pero" },
];

const SHEET_URLS = createSheetsForMonth({
  walid: "120316396",
  hamza: "1918210257",
  amira: "1885206852",
  rwan: "829684483",
  amir: "648470195",
  ikram: "1883314832",
  reda: "1308159926",
  saad: "203346374",
  aidan: "2061136177",
  ayoup: "404060375",
  ahmed: "21821810",
  sara: "1628219399",
  kamal: "313781673",
  lea: "185307543",
  nhi: "796641624",
});

export const SHEET_URLS_MAR = createSheetsForMonth({
  walid: "579175687",
  hamza: "1243546505",
  amira: "1732188231",
  rwan: "942873265",
  amir: "333543362",
  ikram: "1914475560",
  reda: "1403849725",
  saad: "446302457",
  aidan: "1481716311",
  ayoup: "1831640856",
  ahmed: "400328992",
  sara: "821992539",
  kamal: "290336078",
  lea: "1016187080",
  nhi: "496305040",
});

export const SHEET_URLS_APR = createSheetsForMonth({
  walid: "1442711308",
  hamza: "1119735852",
  amira: "403193194",
  rwan: "829920430",
  amir: "406436177",
  ikram: "451784339",
  reda: "1839567203",
  saad: "384342468",
  aidan: "1348083551",
  ayoup: "677791706",
  ahmed: "2100862280",
  sara: "779930179",
  kamal: "175591619",
  lea: "545627062",
  nhi: "2021386398",
});

const BOX_START_COLUMNS = [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81];

interface EmployeeData {
  name: string;
  hours: number;
  sources: Array<{ sheetName: string; hours: number; boxNumber: number }>;
}

interface AggregatedEmployees { [name: string]: EmployeeData; }

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];
    if (char === '"') {
      if (insideQuotes && nextChar === '"') { currentField += '"'; i++; }
      else { insideQuotes = !insideQuotes; }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentField.trim()); currentField = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) rows.push(currentRow);
        currentRow = []; currentField = "";
      }
      if (char === "\r" && nextChar === "\n") i++;
    } else { currentField += char; }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) rows.push(currentRow);
  }
  return rows;
}

async function fetchSheetData(spreadsheetId: string, gid: string, sheetName: string): Promise<string[][]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, redirect: "follow" });
    if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.status}`);
    const csv = await response.text();
    return parseCSV(csv);
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    throw error;
  }
}

function parseSheetEmployees(rows: string[][], sheetName: string): Array<{ name: string; hours: number; boxNumber: number }> {
  const employees: Array<{ name: string; hours: number; boxNumber: number }> = [];
  for (let boxIdx = 0; boxIdx < BOX_START_COLUMNS.length; boxIdx++) {
    const boxNumber = boxIdx + 1;
    const startCol = BOX_START_COLUMNS[boxIdx];
    try {
      const nameCell = rows[0]?.[startCol - 1]?.trim();
      if (!nameCell) continue;
      let totalsRowIndex = -1;
      for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i]?.some((cell) => cell?.match(/^\d+:\d{2}:\d{2}$/))) { totalsRowIndex = i; break; }
      }
      if (totalsRowIndex === -1) continue;
      const hoursColIndex = startCol + 4 - 1;
      const hoursCell = rows[totalsRowIndex]?.[hoursColIndex]?.trim();
      if (!hoursCell) continue;
      let hours = 0;
      if (hoursCell.includes(":")) {
        const parts = hoursCell.split(":").map((p) => parseFloat(p) || 0);
        hours = parts[0] + parts[1] / 60 + (parts[2] || 0) / 3600;
      } else { hours = parseFloat(hoursCell); }
      if (!isNaN(hours) && hours > 0) {
        employees.push({ name: nameCell, hours: Math.round(hours * 100) / 100, boxNumber });
      }
    } catch (error) { console.error(`Error parsing box ${boxNumber} in ${sheetName}:`, error); }
  }
  return employees;
}

/**
 * ✅ MODIFIED: Now accepts month parameter
 */
export async function fetchAllEmployeeData(month: string = "feb"): Promise<AggregatedEmployees> {
  // ✅ اختيار الشيتات حسب الشهر
  const sheets = getSheetUrlsForMonth(month);
  const aggregated: AggregatedEmployees = {};

  for (const sheet of sheets) {
    try {
      const rows = await fetchSheetData(sheet.id, sheet.gid, sheet.name);
      const employees = parseSheetEmployees(rows, sheet.name);
      for (const employee of employees) {
        const key = employee.name.toLowerCase().trim();
        if (!aggregated[key]) {
          aggregated[key] = { name: employee.name, hours: 0, sources: [] };
        }
        aggregated[key].hours += employee.hours;
        aggregated[key].sources.push({ sheetName: sheet.name, hours: employee.hours, boxNumber: employee.boxNumber });
      }
    } catch (error) { console.error(`Error processing ${sheet.name}:`, error); }
  }
  return aggregated;
}

export function getEmployeeNames(employees: AggregatedEmployees): string[] {
  return Object.values(employees).map((emp) => emp.name).sort((a, b) => a.localeCompare(b));
}

export function getEmployeeByName(employees: AggregatedEmployees, name: string): EmployeeData | null {
  const key = name.toLowerCase().trim();
  return employees[key] || null;
}

/**
 * ✅ دالة اختيار الشيتات حسب الشهر (موجودة أصلاً ومتغيرة)
 */
export function getSheetUrlsForMonth(month: string = "feb") {
  if (month === "mar") return SHEET_URLS_MAR;
  if (month === "apr") return SHEET_URLS_APR;
  return SHEET_URLS;
}