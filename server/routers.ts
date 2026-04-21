import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  fetchAllEmployeeData,
  getEmployeeNames,
  getEmployeeByName,
  verifyEmployeeCode,
  getEmployeeCode,
  ADMIN_CODE,
  type Month,
} from "./sheets";

const monthSchema = z.enum(["feb", "mar", "apr"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  employee: router({
    /**
     * Verify admin code
     */
    verifyAdmin: publicProcedure
      .input(z.object({ code: z.string().min(1) }))
      .mutation(({ input }) => {
        const valid = input.code.toUpperCase() === ADMIN_CODE.toUpperCase();
        return { success: valid };
      }),

    /**
     * Verify employee code
     */
    verifyEmployee: publicProcedure
      .input(z.object({ name: z.string().min(1), code: z.string().min(1) }))
      .mutation(({ input }) => {
        const valid = verifyEmployeeCode(input.name, input.code);
        const hasCode = getEmployeeCode(input.name) !== null;
        return { success: valid, hasCode };
      }),

    /**
     * Check if employee has a code
     */
    hasCode: publicProcedure
      .input(z.object({ name: z.string().min(1) }))
      .query(({ input }) => {
        const hasCode = getEmployeeCode(input.name) !== null;
        return { hasCode };
      }),

    /**
     * Get list of all employee names for a month
     */
    listNames: publicProcedure
      .input(z.object({ month: monthSchema }))
      .query(async ({ input }) => {
        try {
          const employees = await fetchAllEmployeeData(input.month as Month);
          const names = getEmployeeNames(employees);
          return { success: true, names, count: names.length };
        } catch (error) {
          console.error("Error fetching employee names:", error);
          return { success: false, names: [], count: 0, error: "Failed to fetch employee data" };
        }
      }),

    /**
     * Get employee hours by name for a month
     */
    getHours: publicProcedure
      .input(z.object({ name: z.string().min(1), month: monthSchema }))
      .query(async ({ input }) => {
        try {
          const employees = await fetchAllEmployeeData(input.month as Month);
          const employee = getEmployeeByName(employees, input.name);

          if (!employee) {
            return { success: false, error: "Employee not found" };
          }

          return {
            success: true,
            data: {
              name: employee.name,
              totalHours: employee.hours,
              sources: employee.sources,
            },
          };
        } catch (error) {
          console.error("Error fetching employee hours:", error);
          return { success: false, error: "Failed to fetch employee hours" };
        }
      }),

    /**
     * Get all employees with hours (admin only)
     */
    getAllHours: publicProcedure
      .input(z.object({ month: monthSchema }))
      .query(async ({ input }) => {
        try {
          const employees = await fetchAllEmployeeData(input.month as Month);
          const allData = Object.values(employees).sort((a, b) => a.name.localeCompare(b.name));
          const totalHours = Math.round(allData.reduce((sum, e) => sum + e.hours, 0) * 100) / 100;
          return {
            success: true,
            employees: allData.map((e) => ({ name: e.name, totalHours: e.hours, sources: e.sources })),
            totalHours,
            count: allData.length,
          };
        } catch (error) {
          console.error("Error fetching all employee hours:", error);
          return { success: false, employees: [], totalHours: 0, count: 0, error: "Failed to fetch data" };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
