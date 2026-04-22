# Employee Hours Viewer - TODO

## Core Features
- [x] Backend API: Fetch data from three Google Sheets URLs (public access)
- [x] Backend API: Parse "Apr" sheet tab only from each file
- [x] Backend API: Extract 14 employee boxes per sheet (columns C, I, O, U, AA, AG, AM, AS, AY, BE, BK, BQ, BW, CC)
- [x] Backend API: Extract employee names from Row 1 (merged 5-column ranges)
- [x] Backend API: Extract total hours from Row 564 (last column of each box)
- [x] Backend API: Skip empty boxes gracefully
- [x] Backend API: Deduplicate and aggregate hours for employees across multiple sheets
- [x] Backend API: Return all employees with their aggregated hours and source breakdown
- [x] Frontend: Elegant mobile-first UI with refined typography and clean spacing
- [x] Frontend: Employee name dropdown/searchable selector
- [x] Frontend: Results card showing employee name, total hours, and per-sheet breakdown
- [x] Frontend: Handle empty and error states with clear messaging
- [x] Testing: Verify data extraction from all three sheets
- [x] Testing: Verify deduplication and aggregation logic
- [x] Testing: Test mobile responsiveness and browser compatibility

## Design & Polish
- [x] Global styling with elegant typography and spacing
- [x] Mobile-first responsive design
- [x] Premium visual finish with intentional details
- [x] Clear error and empty state messaging

## Completed
- [x] All core features implemented and tested
- [x] Data fetching from all three Google Sheets working
- [x] Employee deduplication and aggregation working
- [x] Frontend UI displaying employee list and hours
- [x] Mobile-friendly responsive design
- [x] All vitest tests passing (6 tests)
- [x] Live app verified: successfully loads 10 employees from 3 sheets
- [x] Employee selection and hours display working correctly
- [x] Breakdown by source sheet displayed accurately

## Bug Fixes & Improvements
- [x] Extract and display actual spreadsheet names (e.g., "Aicha Hamamat-F- oneforma") instead of "Apr (File 1/2/3)"
- [x] Verified: "Hours by Source" now shows actual spreadsheet names
- [x] All tests passing (6 tests)

## New Requirements (User Feedback)
- [x] Fix sheet name: "Amira Abdelmonem-F-oneforma" → "Houda zouiten-F-oneforma" (VERIFIED)
- [x] Add box number tracking: Display which box (1-14) each employee is in for each sheet (VERIFIED)
- [x] Update "Hours by Source" to show: "Sheet Name" with "Box X" below (VERIFIED)
- [x] All tests passing (6 vitest tests)
- [x] Fixed: Employee count was temporarily showing 6 instead of 10 (resolved)
- [x] Added 10 new sheets (13 total) - employee count increased from 10 to 25
- [x] All sheets loading and aggregating data correctly
- [x] Removed search box for cleaner UI
- [x] Added refresh button with helper text in employee selector
- [x] All features verified and working with 13 sheets

## User Feedback - Auto-Refresh Feature
- [x] Add "Refresh" button to manually update data from Google Sheets (VERIFIED)
- [x] Button appears next to the total hours display with spinning icon during refresh (VERIFIED)
- [x] Users can refresh data without changing employee selection (VERIFIED)
- [x] Refresh button tested and working correctly


## Bug Fixes - Data Accuracy
- [x] Fix: issa Boutara-F- oneforma sheet URL was incorrect - updated to correct gid=131131887 (VERIFIED)
- [x] Verify: Mahmoud Ramadan now shows in Box 2 with correct hours 1.83 hrs (VERIFIED)
- [x] Retest: All employee data after URL correction - Total Hours now 23.01 (VERIFIED)
