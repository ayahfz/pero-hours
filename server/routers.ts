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
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Employee hours feature
   */
  employee: router({
    /**
     * Get list of all employee names
     */
    listNames: publicProcedure.query(async () => {
      try {
        const employees = await fetchAllEmployeeData();
        const names = getEmployeeNames(employees);
        return {
          success: true,
          names,
          count: names.length,
        };
      } catch (error) {
        console.error("Error fetching employee names:", error);
        return {
          success: false,
          names: [],
          count: 0,
          error: "Failed to fetch employee data",
        };
      }
    }),

    /**
     * Get employee hours by name
     */
    getHours: publicProcedure
      .input(z.object({ name: z.string().min(1) }))
      .query(async ({ input }) => {
        try {
          const employees = await fetchAllEmployeeData();
          const employee = getEmployeeByName(employees, input.name);

          if (!employee) {
            return {
              success: false,
              error: "Employee not found",
            };
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
          return {
            success: false,
            error: "Failed to fetch employee hours",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
