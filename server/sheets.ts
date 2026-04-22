/**
 * Google Sheets data fetcher and parser
 * Supports Feb, Mar, Apr months
 */

const SHEET_URLS: Record<string, Array<{ id: string; gid: string; name: string }>> = {
  feb: [
    { id: "1sYzuJ7q9GRI-atGNJLMipBxYkshsGQAiIeE3c9Ijwyo", gid: "120316396", name: "Walid Chert-F-Peroptyx" },
    { id: "1eiGLnIqFrKlj9XnIvse94xdcHERgcVbaVENDsrHl5kY", gid: "1918210257", name: "Hamza Sabil-F-peropetyx" },
    { id: "1HRuWakC2bQBO3yLtQxPe5VIleTfBtBw2qCkdKif0WOE", gid: "1885206852", name: "Amira Benjaloun-F-peropetyx" },
    { id: "1AwBTqOViVWCOq0D1H1iMZVEYuqeNUJHFL4jLcaaDd_k", gid: "829684483", name: "rwan Javaudin-F-peropetyx" },
    { id: "1NdgFWyx7Uh6PZ-w7xNDB2gE08F_R6-8Bk27y8l1kd3A", gid: "648470195", name: "amir hamidi-F-peropetyx" },
    { id: "149z6tTWCKhqX5YrNcqLwxwE9ra_EXLBmjxFAe8bZ7vs", gid: "1883314832", name: "ikram aboutaleb-F-peropetyx" },
    { id: "1SS1F-KhUj0qg9TIUKcZu0zkV74YYY9T215E4-ib_oe0", gid: "1308159926", name: "Reda Boutara-F-pero" },
    { id: "1Qa3wTrh18rBEy3jwBBmYhI4lv-a8OYGdHa2n58o7uFU", gid: "203346374", name: "Saad Hamid-F-pero" },
    { id: "1BTksdCZw4LyxyX-VnSY1qBZ2cm8escirZQBsCpi9YcA", gid: "2061136177", name: "AIDAN AMINE-F-peroptyx" },
    { id: "1_cIcz1UV0_qSMlYs1BqIpCO56PKHSkIPXV2-d5qmZiU", gid: "404060375", name: "Ayoup Elbarzouli-F-peropetyx" },
    { id: "1Vc8cCX3DySDNfJ0DD_fELptokUhGjIL9eaZ9pm9Lw3w", gid: "21821810", name: "Ahmed-F-Sbs-pero" },
    { id: "110lICXLoRnfXpU06I000ujud0sbf5Zv04h9fyunKimI", gid: "1628219399", name: "Sara Sakhri-F-pero" },
    { id: "1SLaorcTMTJATgoAEo0LAjX66Kx27hwsquyS2Aro7WiM", gid: "313781673", name: "Kamal-F-pero" },
    { id: "1UHTif1TIDR2bSZsVQ7ltS9lkzs84Y4cprO6u89wGX4M", gid: "185307543", name: "Lea Parke-F-Peroptyx" },
    { id: "14rvI0GLgMBmTEYsrjgCwmwzLloTpmzXBHZW317lJDVw", gid: "796641624", name: "Nhi Nguyen-belgium-Pero" },
  ],
  mar: [
    { id: "1sYzuJ7q9GRI-atGNJLMipBxYkshsGQAiIeE3c9Ijwyo", gid: "579175687", name: "Walid Chert-F-Peroptyx" },
    { id: "1eiGLnIqFrKlj9XnIvse94xdcHERgcVbaVENDsrHl5kY", gid: "1243546505", name: "Hamza Sabil-F-peropetyx" },
    { id: "1HRuWakC2bQBO3yLtQxPe5VIleTfBtBw2qCkdKif0WOE", gid: "1732188231", name: "Amira Benjaloun-F-peropetyx" },
    { id: "1AwBTqOViVWCOq0D1H1iMZVEYuqeNUJHFL4jLcaaDd_k", gid: "942873265", name: "rwan Javaudin-F-peropetyx" },
    { id: "1NdgFWyx7Uh6PZ-w7xNDB2gE08F_R6-8Bk27y8l1kd3A", gid: "333543362", name: "amir hamidi-F-peropetyx" },
    { id: "149z6tTWCKhqX5YrNcqLwxwE9ra_EXLBmjxFAe8bZ7vs", gid: "1914475560", name: "ikram aboutaleb-F-peropetyx" },
    { id: "1SS1F-KhUj0qg9TIUKcZu0zkV74YYY9T215E4-ib_oe0", gid: "1403849725", name: "Reda Boutara-F-pero" },
    { id: "1Qa3wTrh18rBEy3jwBBmYhI4lv-a8OYGdHa2n58o7uFU", gid: "446302457", name: "Saad Hamid-F-pero" },
    { id: "1BTksdCZw4LyxyX-VnSY1qBZ2cm8escirZQBsCpi9YcA", gid: "1481716311", name: "AIDAN AMINE-F-peroptyx" },
    { id: "1_cIcz1UV0_qSMlYs1BqIpCO56PKHSkIPXV2-d5qmZiU", gid: "1831640856", name: "Ayoup Elbarzouli-F-peropetyx" },
    { id: "1Vc8cCX3DySDNfJ0DD_fELptokUhGjIL9eaZ9pm9Lw3w", gid: "400328992", name: "Ahmed-F-Sbs-pero" },
    { id: "110lICXLoRnfXpU06I000ujud0sbf5Zv04h9fyunKimI", gid: "821992539", name: "Sara Sakhri-F-pero" },
    { id: "1SLaorcTMTJATgoAEo0LAjX66Kx27hwsquyS2Aro7WiM", gid: "290336078", name: "Kamal-F-pero" },
    { id: "1UHTif1TIDR2bSZsVQ7ltS9lkzs84Y4cprO6u89wGX4M", gid: "1016187080", name: "Lea Parke-F-Peroptyx" },
    { id: "14rvI0GLgMBmTEYsrjgCwmwzLloTpmzXBHZW317lJDVw", gid: "496305040", name: "Nhi Nguyen-belgium-Pero" },
  ],
  apr: [
    { id: "1sYzuJ7q9GRI-atGNJLMipBxYkshsGQAiIeE3c9Ijwyo", gid: "1442711308", name: "Walid Chert-F-Peroptyx" },
    { id: "1eiGLnIqFrKlj9XnIvse94xdcHERgcVbaVENDsrHl5kY", gid: "1119735852", name: "Hamza Sabil-F-peropetyx" },
    { id: "1HRuWakC2bQBO3yLtQxPe5VIleTfBtBw2qCkdKif0WOE", gid: "403193194", name: "Amira Benjaloun-F-peropetyx" },
    { id: "1AwBTqOViVWCOq0D1H1iMZVEYuqeNUJHFL4jLcaaDd_k", gid: "829920430", name: "rwan Javaudin-F-peropetyx" },
    { id: "1NdgFWyx7Uh6PZ-w7xNDB2gE08F_R6-8Bk27y8l1kd3A", gid: "406436177", name: "amir hamidi-F-peropetyx" },
    { id: "149z6tTWCKhqX5YrNcqLwxwE9ra_EXLBmjxFAe8bZ7vs", gid: "451784339", name: "ikram aboutaleb-F-peropetyx" },
    { id: "1SS1F-KhUj0qg9TIUKcZu0zkV74YYY9T215E4-ib_oe0", gid: "1839567203", name: "Reda Boutara-F-pero" },
    { id: "1Qa3wTrh18rBEy3jwBBmYhI4lv-a8OYGdHa2n58o7uFU", gid: "384342468", name: "Saad Hamid-F-pero" },
    { id: "1BTksdCZw4LyxyX-VnSY1qBZ2cm8escirZQBsCpi9YcA", gid: "1348083551", name: "AIDAN AMINE-F-peroptyx" },
    { id: "1_cIcz1UV0_qSMlYs1BqIpCO56PKHSkIPXV2-d5qmZiU", gid: "677791706", name: "Ayoup Elbarzouli-F-peropetyx" },
    { id: "1Vc8cCX3DySDNfJ0DD_fELptokUhGjIL9eaZ9pm9Lw3w", gid: "2100862280", name: "Ahmed-F-Sbs-pero" },
    { id: "110lICXLoRnfXpU06I000ujud0sbf5Zv04h9fyunKimI", gid: "779930179", name: "Sara Sakhri-F-pero" },
    { id: "1SLaorcTMTJATgoAEo0LAjX66Kx27hwsquyS2Aro7WiM", gid: "175591619", name: "Kamal-F-pero" },
    { id: "1UHTif1TIDR2bSZsVQ7ltS9lkzs84Y4cprO6u89wGX4M", gid: "545627062", name: "Lea Parke-F-Peroptyx" },
    { id: "14rvI0GLgMBmTEYsrjgCwmwzLloTpmzXBHZW317lJDVw", gid: "2021386398", name: "Nhi Nguyen-belgium-Pero" },
    { id: "1WjQz5i_LjPI5Mfm6Lj-Cuw4MHkKccQC6IeOL8QHZrSs", gid: "175591619", name: "Rim Hussein-F-pero" },
  ],
};

const BOX_START_COLUMNS = [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81];

export const EMPLOYEE_CODES: Record<string, string> = {
  "abdelrahman emad": "DFF62175",
  "amira": "9AB2461C",
  "aya hafez": "AE94B2B4",
  "aya mohamed": "C16EA835",
  "desha": "20FB0C9C",
  "eman ahmed": "F2281874",
  "eman magdy": "A07DB1E6",
  "esraa mahmoud": "8A5B9DB4",
  "ezz eldin ahmed": "7A672AD2",
  "maha": "23485E2A",
  "maha mohamed": "28AEE85D",
  "mahmoud ramadan": "70AFE9FE",
  "mohamed elhenawy": "3F1E58FE",
  "mohamed hesham ismail": "FA68F1CF",
  "mohamed shobir": "10F1EA6C",
  "mostafa ali": "9BB06E73",
  "mostafa gamal": "D573FB48",
  "nawar": "484C64D2",
  "osama hassan": "429E1E11",
  "radwa": "48885643",
  "tawfik": "FB916E30",
  "yasmine reda": "904449CA",
  "youssef adel": "9363D725",
  "zainab": "37EA4A8B",
  "adham": "A043BAE1",
  "ahmed abozied": "603803A8",
  "ahmed mahmoud hosni": "39C0CB52",
  "eslam hany": "F511D9CB",
  "feras": "8F68D9D9",
  "hossam": "B0341314",
  "kholoud": "A5534EA9",
  "mohamed ashraf": "2B26FA8A",
  "mohamed gad": "DC30543F",
  "mohamed leheita": "E5A6E743",
  "mohamed saeed": "849E63F8",
  "shahd": "101AC616",
  "shaimaa hany": "F8FD0BA8",
  "tarek": "4A167FE4",
  "yahya": "82ED4A92",
  "zeinab hamdy": "C8C8050E",
};

export const ADMIN_CODE = "ADMIN2024";

export type Month = "feb" | "mar" | "apr";

function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

export function getEmployeeCode(name: string): string | null {
  const normalized = normalizeName(name);
  if (EMPLOYEE_CODES[normalized]) return EMPLOYEE_CODES[normalized];
  for (const key of Object.keys(EMPLOYEE_CODES)) {
    if (normalized.replace(/\s/g, "") === key.replace(/\s/g, "")) {
      return EMPLOYEE_CODES[key];
    }
  }
  return null;
}

export function verifyEmployeeCode(name: string, code: string): boolean {
  const storedCode = getEmployeeCode(name);
  if (!storedCode) return false;
  return storedCode.toUpperCase() === code.toUpperCase();
}

interface EmployeeData {
  name: string;
  hours: number;
  sources: Array<{ sheetName: string; hours: number; boxNumber: number }>;
}

interface AggregatedEmployees {
  [name: string]: EmployeeData;
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      }
      if (char === "\r" && nextChar === "\n") i++;
    } else {
      currentField += char;
    }
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
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
    const csv = await response.text();
    const rows = parseCSV(csv);
    console.log(`Fetched ${rows.length} rows from ${sheetName} (gid: ${gid})`);
    return rows;
  } catch (error) {
    console.error(`Error fetching sheet data for ${sheetName}:`, error);
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
      if (!nameCell || nameCell.length === 0 || nameCell === "...") continue;

      let totalsRowIndex = -1;
      for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].some((cell) => cell.match(/^\d+:\d{2}:\d{2}$/))) {
          totalsRowIndex = i;
          break;
        }
      }
      if (totalsRowIndex === -1) continue;

      const hoursColIndex = startCol + 4 - 1;
      const hoursCell = rows[totalsRowIndex]?.[hoursColIndex]?.trim();
      if (!hoursCell || hoursCell.length === 0) continue;

      let hours = 0;
      if (hoursCell.includes(":")) {
        const parts = hoursCell.split(":").map((p) => parseFloat(p) || 0);
        hours = parts[0] + parts[1] / 60 + (parts[2] || 0) / 3600;
      } else {
        hours = parseFloat(hoursCell);
      }

      if (!isNaN(hours) && hours > 0) {
        employees.push({ name: nameCell, hours: Math.round(hours * 100) / 100, boxNumber });
      }
    } catch (error) {
      console.error(`Error parsing box ${boxNumber} in sheet ${sheetName}:`, error);
    }
  }

  return employees;
}

export async function fetchAllEmployeeData(month: Month): Promise<AggregatedEmployees> {
  const aggregated: AggregatedEmployees = {};
  const sheets = SHEET_URLS[month];
  if (!sheets) throw new Error(`Invalid month: ${month}`);

  for (const sheet of sheets) {
    try {
      const rows = await fetchSheetData(sheet.id, sheet.gid, sheet.name);
      const employees = parseSheetEmployees(rows, sheet.name);

      for (const employee of employees) {
        const key = normalizeName(employee.name);
        if (!aggregated[key]) {
          aggregated[key] = { name: employee.name, hours: 0, sources: [] };
        }
        aggregated[key].hours += employee.hours;
        aggregated[key].hours = Math.round(aggregated[key].hours * 100) / 100;
        aggregated[key].sources.push({ sheetName: sheet.name, hours: employee.hours, boxNumber: employee.boxNumber });
      }
    } catch (error) {
      console.error(`Error processing sheet ${sheet.name}:`, error);
    }
  }

  return aggregated;
}

export function getEmployeeNames(employees: AggregatedEmployees): string[] {
  return Object.values(employees).map((emp) => emp.name).sort((a, b) => a.localeCompare(b));
}

export function getEmployeeByName(employees: AggregatedEmployees, name: string): EmployeeData | null {
  const normalized = normalizeName(name);
  if (employees[normalized]) return employees[normalized];
  for (const key of Object.keys(employees)) {
    if (key.replace(/\s/g, "") === normalized.replace(/\s/g, "")) return employees[key];
  }
  return null;
}
