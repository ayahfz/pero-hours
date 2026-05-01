/**
 * Google Sheets data fetcher and parser
 */

interface SheetConfig {
  id: string;
  gid: string;
  name: string;
}

// ─── PERO SHEETS ─────────────────────────────────────────────────────────
const createPeroSheets = (gids: Record<string, string>): SheetConfig[] => [
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
  { id: "1WjQz5i_LjPI5Mfm6Lj-Cuw4MHkKccQC6IeOL8QHZrSs", gid: gids.rim, name: "Rim Hussein -F- pero" },
  { id: "18-_i6YkMmVpVXq6-NSGcTsx7Wcv_R02-9X7hGTgcSqg", gid: gids.vano, name: "Vano Gocer -F- pero" }, // ✅ موظف جديد
];

const PERO_FEB = createPeroSheets({ walid:"120316396", hamza:"1918210257", amira:"1885206852", rwan:"829684483", amir:"648470195", ikram:"1883314832", reda:"1308159926", saad:"203346374", aidan:"2061136177", ayoup:"404060375", ahmed:"21821810", sara:"1628219399", kamal:"313781673", lea:"185307543", nhi:"796641624" });
const PERO_MAR = createPeroSheets({ walid:"579175687", hamza:"1243546505", amira:"1732188231", rwan:"942873265", amir:"333543362", ikram:"1914475560", reda:"1403849725", saad:"446302457", aidan:"1481716311", ayoup:"1831640856", ahmed:"400328992", sara:"821992539", kamal:"290336078", lea:"1016187080", nhi:"496305040" });
const PERO_APR = createPeroSheets({ walid:"1442711308", hamza:"1119735852", amira:"403193194", rwan:"829920430", amir:"406436177", ikram:"451784339", reda:"1839567203", saad:"384342468", aidan:"1348083551", ayoup:"677791706", ahmed:"2100862280", sara:"779930179", kamal:"175591619", lea:"545627062", nhi:"2021386398", rim:"175591619", vano:"175591619" });
const PERO_MAY = createPeroSheets({ walid:"771776464", hamza:"1173637376", amira:"1263875789", amir:"2067992266", ikram:"1046803540", saad:"1270597281", aidan:"337668697", nhi:"551143475", ayoup:"863574210", ahmed:"470169714", sara:"1063025712", kamal:"1872816920", lea:"128405760", rim:"1567287838", vano:"2025754182" }); // ✅ شهر مايو

// ─── ONEFORMA SHEETS ───────────────────────────────────────────────────────
const ONEFORMA_APR: SheetConfig[] = [
  { id: "1839XKHWW4kB8cu2DUTjuwdlr7q6hD2nqa8xpV8Dga44", gid: "1137409283", name: "Aicha Hamamat-F-oneforma" },
  { id: "17hi9_c6HyHSTdmGldMazhxH0UU8wB2dTTaYfTCO5Gjw", gid: "1551564035", name: "Houda zouiten-F-oneforma" },
  { id: "11-JuzArW-CLhwmMM8GtIR_tt-s8ruVRHDQVXJE3nups", gid: "54907248", name: "rim naji-F-oneforma" },
  { id: "1-lB0fbrHemaD25F9m7PRJezW68prB5HTXekMv2d2aPA", gid: "986811430", name: "Hassan-F-oneforma" },
  { id: "1Nq57qCNiB9YbLQ-2OzFsDHSzLJ9fiqWUG1kSaRmx50A", gid: "1511048105", name: "Hind karam-F-oneforma" },
  { id: "1EFUz0e5QJRyoe0v74_YNsKP_5w9cgRbYS-n8Mh88EYo", gid: "1925175524", name: "Tayeb Chaouchi-F-Oneforma" },
  { id: "1rIlELwOieJXeCN2i8UewUShV5CPhKD9LOsjBrOaoldU", gid: "1692774344", name: "Khadija-F-Oneforma" },
  { id: "18gC3Jzjbsqu7mu5C3KOzvUAqsgzuKMepTkDKB7lPki8", gid: "937746884", name: "Helene Rabaud-F-oneforma" },
  { id: "1XzidQe8k1VD4cdrWAwHFlsvqD3SyXw7JwvlaSbkqm0s", gid: "32902641", name: "Chloe richelandet-f-Oneforma" },
  { id: "15ummKNZa_rRxBiL1vo6CGYVkNNeKEF3pbCDZYzVDvrA", gid: "468798136", name: "Ziad FOURATI-F-Oneforma" },
  { id: "1-FXntpDCujEMvc-MIUWJVPEZGRFcpRU3-JzF-jKXofg", gid: "1836449286", name: "Sahar Laaraj-F-Oneforma" },
  { id: "1GRpG0ip5ZqdWYeSrz0iXk_NaqBCVEBIm6c-z5xmYhsM", gid: "112293242", name: "Bilal-F-Oneforma" },
  { id: "1ni60gG4N1cw2UG7Kz-loM97YCfPi4NK1lbDgED44y6E", gid: "131131887", name: "issa Boutara-F-oneforma" },
];

const ONEFORMA_MAY: SheetConfig[] = [
  { id: "1839XKHWW4kB8cu2DUTjuwdlr7q6hD2nqa8xpV8Dga44", gid: "2062120697", name: "Aicha Hamamat-F- oneforma" },
  { id: "17hi9_c6HyHSTdmGldMazhxH0UU8wB2dTTaYfTCO5Gjw", gid: "184845301", name: "Houda zouiten-F-oneforma" },
  { id: "11-JuzArW-CLhwmMM8GtIR_tt-s8ruVRHDQVXJE3nups", gid: "1759349848", name: "rim naji-F-oneforma" },
  { id: "1-lB0fbrHemaD25F9m7PRJezW68prB5HTXekMv2d2aPA", gid: "218324878", name: "Hassan-F- oneforma" },
  { id: "1ni60gG4N1cw2UG7Kz-loM97YCfPi4NK1lbDgED44y6E", gid: "1750940983", name: "issa Boutara-F- oneforma" },
  { id: "1EFUz0e5QJRyoe0v74_YNsKP_5w9cgRbYS-n8Mh88EYo", gid: "595132184", name: "Tayeb Chaouchi-F-Oneforma" },
  { id: "1GRpG0ip5ZqdWYeSrz0iXk_NaqBCVEBIm6c-z5xmYhsM", gid: "1530088048", name: "Bilal -F- Oneforma" },
  { id: "1Nq57qCNiB9YbLQ-2OzFsDHSzLJ9fiqWUG1kSaRmx50A", gid: "531961131", name: "Hind karam-F-oneforma" },
  { id: "1-FXntpDCujEMvc-MIUWJVPEZGRFcpRU3-JzF-jKXofg", gid: "2000430135", name: "Sahar Laaraj-F-Oneforma" },
  { id: "1rIlELwOieJXeCN2i8UewUShV5CPhKD9LOsjBrOaoldU", gid: "384204300", name: "Khadija-F-Oneforma" },
  { id: "1XzidQe8k1VD4cdrWAwHFlsvqD3SyXw7JwvlaSbkqm0s", gid: "462978174", name: "Chloe richelandet -f- Oneforma" },
  { id: "15ummKNZa_rRxBiL1vo6CGYVkNNeKEF3pbCDZYzVDvrA", gid: "1239757959", name: "Ziad FOURATI -F-Oneforma" },
  { id: "18gC3Jzjbsqu7mu5C3KOzvUAqsgzuKMepTkDKB7lPki8", gid: "1426051648", name: "Helene Rabaud-F-oneforma" },
]; // ✅ شهر مايو

// ─── ROUTER ───────────────────────────────────────────────────────────────
export function getSheetUrls(brand: string, month: string): SheetConfig[] {
  if (brand === "oneforma") {
    if (month === "may") return ONEFORMA_MAY;
    return ONEFORMA_APR;
  }
  if (month === "may") return PERO_MAY;
  if (month === "apr") return PERO_APR;
  if (month === "mar") return PERO_MAR;
  return PERO_FEB;
}

// ─── CORE LOGIC ─────────────────────────────────────────────────────────
const BOX_START_COLUMNS = [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81];

interface EmployeeData { name: string; hours: number; sources: Array<{ sheetName: string; hours: number; boxNumber: number }>; }
interface AggregatedEmployees { [name: string]: EmployeeData; }

function normalizeName(name: string): string { return name.toLowerCase().trim().replace(/\s+/g, ' '); }

function getLevenshteinDistance(a: string, b: string): number {
  const matrix = []; for (let i = 0; i <= b.length; i++) matrix[i] = [i]; for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) for (let j = 1; j <= a.length; j++) matrix[i][j] = b.charAt(i-1)==a.charAt(j-1) ? matrix[i-1][j-1] : Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
  return matrix[b.length][a.length];
}

function findMatchingName(newName: string, existingNames: string[]): string | null {
  const n1 = normalizeName(newName);
  const w1 = n1.split(' ');
  
  for (const existing of existingNames) {
    const n2 = normalizeName(existing);
    const w2 = n2.split(' ');
    
    // Exact match
    if (n1 === n2) return existing;
    
    // ✅ للأسماء الثلاثية - لو الأول والأخير متطابقين
    if (w1.length === 3 && w2.length === 3) {
      if (w1[0] === w2[0] && w1[2] === w2[2]) {
        return existing;
      }
    }
    
    // لو عدد الكلمات مختلف، متدمجش
    if (w1.length !== w2.length) continue;
    
    // لو الاسم الأول واحد، بس الاسم التاني مختلف تماماً، متدمجش
    if (w1.length >= 2 && w2.length >= 2) {
      if (w1[0] === w2[0] && w1[1] !== w2[1]) {
        continue;
      }
    }
    
    // Check similarity only if word count matches
    if (w1.length > 0) {
      let totalSim = 0;
      for (let i = 0; i < w1.length; i++) {
        const dist = getLevenshteinDistance(w1[i], w2[i]);
        const maxLen = Math.max(w1[i].length, w2[i].length);
        totalSim += 1 - (dist / maxLen);
      }
      if ((totalSim / w1.length) > 0.85) return existing;
    }
  }
  return null;
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = []; let currentRow: string[] = []; let currentField = ""; let insideQuotes = false;
  for (let i = 0; i < csv.length; i++) { const char = csv[i]; const nextChar = csv[i + 1];
    if (char === '"') { if (insideQuotes && nextChar === '"') { currentField += '"'; i++; } else { insideQuotes = !insideQuotes; }
    } else if (char === "," && !insideQuotes) { currentRow.push(currentField.trim()); currentField = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) { if (currentField || currentRow.length > 0) { currentRow.push(currentField.trim()); if (currentRow.some(f => f.length > 0)) rows.push(currentRow); currentRow = []; currentField = ""; } if (char === "\r" && nextChar === "\n") i++;
    } else { currentField += char; } }
  if (currentField || currentRow.length > 0) { currentRow.push(currentField.trim()); if (currentRow.some(f => f.length > 0)) rows.push(currentRow); }
  return rows;
}

async function fetchSheetData(spreadsheetId: string, gid: string, sheetName: string): Promise<string[][]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, redirect: "follow" });
    if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.status}`);
    return parseCSV(await response.text());
  } catch (error) { console.error(`Error fetching ${sheetName}:`, error); throw error; }
}

function parseSheetEmployees(rows: string[][], sheetName: string) {
  const employees: Array<{ name: string; hours: number; boxNumber: number }> = [];
  for (let boxIdx = 0; boxIdx < BOX_START_COLUMNS.length; boxIdx++) {
    const boxNumber = boxIdx + 1; const startCol = BOX_START_COLUMNS[boxIdx];
    try {
      const nameCell = rows[0]?.[startCol - 1]?.trim(); if (!nameCell) continue;
      let totalsRowIndex = -1; for (let i = rows.length - 1; i >= 0; i--) { if (rows[i]?.some(cell => cell?.match(/^\d+:\d{2}:\d{2}$/))) { totalsRowIndex = i; break; } }
      if (totalsRowIndex === -1) continue;
      const hoursCell = rows[totalsRowIndex]?.[startCol + 3]?.trim(); if (!hoursCell) continue;
      let hours = 0;
      if (hoursCell.includes(":")) { const parts = hoursCell.split(":").map(p => parseFloat(p) || 0); hours = parts[0] + parts[1] / 60 + (parts[2] || 0) / 3600; }
      else { hours = parseFloat(hoursCell); }
      if (!isNaN(hours) && hours > 0) employees.push({ name: nameCell, hours: Math.round(hours * 100) / 100, boxNumber });
    } catch (error) { console.error(`Error parsing box ${boxIdx + 1} in ${sheetName}:`, error); }
  }
  return employees;
}

export async function fetchAllEmployeeData(brand: string, month: string): Promise<AggregatedEmployees> {
  const sheets = getSheetUrls(brand, month);
  const aggregated: AggregatedEmployees = {};
  for (const sheet of sheets) {
    try {
      const rows = await fetchSheetData(sheet.id, sheet.gid, sheet.name);
      for (const emp of parseSheetEmployees(rows, sheet.name)) {
        const normalizedName = normalizeName(emp.name);
        const key = findMatchingName(normalizedName, Object.keys(aggregated)) || normalizedName;
        if (!aggregated[key]) aggregated[key] = { name: key, hours: 0, sources: [] };
        aggregated[key].hours += emp.hours;
        aggregated[key].sources.push({ sheetName: sheet.name, hours: emp.hours, boxNumber: emp.boxNumber });
      }
    } catch (error) { console.error(`Error processing ${sheet.name}:`, error); }
  }
  return aggregated;
}

export function getEmployeeNames(employees: AggregatedEmployees): string[] {
  return Object.values(employees).map(emp => emp.name).sort((a, b) => a.localeCompare(b));
}

export function getEmployeeByName(employees: AggregatedEmployees, name: string): EmployeeData | null {
  const key = normalizeName(name);
  return employees[key] || null;
}