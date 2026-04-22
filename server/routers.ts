import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { fetchAllEmployeeData, getEmployeeNames, getEmployeeByName } from "./sheets";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  employee: router({
    verifyAdmin: publicProcedure
      .input(z.object({ code: z.string() }))
      .mutation(({ input }) => {
        const ADMIN_PASSWORD = "ADMIN2024";
        if (input.code === ADMIN_PASSWORD) {
          return { success: true };
        }
        return { success: false };
      }),

    verifyEmployee: publicProcedure
      .input(z.object({ name: z.string(), code: z.string() }))
      .mutation(({ input }) => {
        const codes = JSON.parse(process.env.EMPLOYEE_CODES || "{}");
        if (codes[input.name] === input.code) {
          return { success: true };
        }
        return { success: false };
      }),

    hasCode: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input }) => {
        try {
          const employees = await fetchAllEmployeeData("feb");
          const employee = getEmployeeByName(employees, input.name);
          return { success: true, hasCode: !!employee?.code };
        } catch (error) {
          return { success: true, hasCode: false };
        }
      }),

    listNames: publicProcedure
      .input(z.object({ month: z.string().optional() }))
      .query(async ({ input }) => {
        try {
          const employees = await fetchAllEmployeeData(input.month || "feb");
          const names = getEmployeeNames(employees);
          return { success: true, names, count: names.length };
        } catch (error) {
          console.error("Error fetching employee names:", error);
          return { success: false, names: [], count: 0, error: "Failed to fetch employee data" };
        }
      }),

    getHours: publicProcedure
      .input(z.object({ name: z.string().min(1), month: z.string() }))
      .query(async ({ input }) => {
        try {
          const employees = await fetchAllEmployeeData(input.month);
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

    getAllHours: publicProcedure
      .input(z.object({ month: z.string() }))
      .query(async ({ input }) => {
        try {
          const employees = await fetchAllEmployeeData(input.month);
          const totalHours = Object.values(employees).reduce((sum, emp) => sum + (emp.hours || 0), 0);
          return {
            success: true,
            totalHours,
            count: Object.keys(employees).length,
          };
        } catch (error) {
          console.error("Error fetching all hours:", error);
          return { success: false, totalHours: 0, count: 0 };
        }
      }),
  }),
}); // ✅ تأكد إن فيه قوسين دول في آخر الملف

export type AppRouter = typeof appRouter; // ✅ والسطر ده كمان