import { subWeeks, subMonths, subYears, startOfDay } from "date-fns";

/**
 * Generates a date filter based on the provided type.
 * @param filter - The type of date range: "weekly", "monthly", or "yearly".
 * @returns The starting date for the filter or undefined if no filter is provided.
 * @throws Error if the filter type is invalid.
 */
export const generateDateFilter = (
  filter?: "weekly" | "monthly" | "yearly"
) => {
  if (!filter) return undefined;

  switch (filter) {
    case "weekly":
      return subWeeks(startOfDay(new Date()), 1); // 1 week ago
    case "monthly":
      return subMonths(startOfDay(new Date()), 1); // 1 month ago
    case "yearly":
      return subYears(startOfDay(new Date()), 1); // 1 year ago
    default:
      throw new Error(
        "Invalid filter type. Use 'weekly', 'monthly', or 'yearly'."
      );
  }
};

//example use case in services
// const getAllPayouts = async (filter?: "weekly" | "monthly" | "yearly") => {
//   const dateFilter = generateDateFilter(filter);
//   const result = await prisma.riderPayout.findMany({
//     where: dateFilter
//       ? {
//           createdAt: {
//             gte: dateFilter,
//           },
//         }
//       : undefined,

//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   return result;
// };

//example use case in controller
// const getPayouts = catchAsync(async (req: Request, res: Response) => {
//   const { filter } = req.query;

//   // Validate the filter
//   const validFilters = ["weekly", "monthly", "yearly"];
//   if (filter && !validFilters.includes(filter as string)) {
//     throw new ApiError(
//       400,
//       "Invalid filter. Use 'weekly', 'monthly', or 'yearly'."
//     );
//   }
//   const result = await transactionService.getAllPayouts(
//     filter as "weekly" | "monthly" | "yearly"
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Payouts retrieved successfully",
//     data: result,
//   });
// });
