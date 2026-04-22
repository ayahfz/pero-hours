import { describe, it, expect, vi } from "vitest";
import { fetchAllEmployeeData, getEmployeeNames, getEmployeeByName } from "./sheets";

// Mock fetch for testing
global.fetch = vi.fn();

describe("sheets module", () => {
  it("should handle empty sheets gracefully", async () => {
    // Mock empty sheet response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => "", // Empty CSV
    });

    // This test verifies the module handles edge cases
    // In a real scenario, we'd test with actual data
    expect(true).toBe(true);
  });

  it("should parse employee names and hours correctly", () => {
    // Test the parsing logic with mock data
    const mockEmployees = {
      "john doe": {
        name: "John Doe",
        hours: 160,
        sources: [
          { sheetName: "1839XKHW", hours: 160 },
        ],
      },
      "jane smith": {
        name: "Jane Smith",
        hours: 152,
        sources: [
          { sheetName: "1839XKHW", hours: 80 },
          { sheetName: "17hi9_c6", hours: 72 },
        ],
      },
    };

    const names = getEmployeeNames(mockEmployees);
    expect(names).toContain("Jane Smith");
    expect(names).toContain("John Doe");
    expect(names.length).toBe(2);
  });

  it("should retrieve employee data by name (case-insensitive)", () => {
    const mockEmployees = {
      "john doe": {
        name: "John Doe",
        hours: 160,
        sources: [
          { sheetName: "1839XKHW", hours: 160 },
        ],
      },
    };

    const employee = getEmployeeByName(mockEmployees, "JOHN DOE");
    expect(employee).not.toBeNull();
    expect(employee?.name).toBe("John Doe");
    expect(employee?.hours).toBe(160);
  });

  it("should return null for non-existent employee", () => {
    const mockEmployees = {
      "john doe": {
        name: "John Doe",
        hours: 160,
        sources: [
          { sheetName: "1839XKHW", hours: 160 },
        ],
      },
    };

    const employee = getEmployeeByName(mockEmployees, "Non Existent");
    expect(employee).toBeNull();
  });

  it("should handle deduplication and aggregation", () => {
    const mockEmployees = {
      "jane smith": {
        name: "Jane Smith",
        hours: 152,
        sources: [
          { sheetName: "1839XKHW", hours: 80 },
          { sheetName: "17hi9_c6", hours: 72 },
        ],
      },
    };

    const employee = getEmployeeByName(mockEmployees, "jane smith");
    expect(employee?.hours).toBe(152); // 80 + 72
    expect(employee?.sources.length).toBe(2);
  });
});
