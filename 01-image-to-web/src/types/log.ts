import { z } from 'zod';

export const LogStatusSchema = z.enum(['SUCCESS', 'PARTIAL_SUCCESS', 'FAILURE']);
export type LogStatus = z.infer<typeof LogStatusSchema>;

export const LogEntrySchema = z.object({
  id: z.string(),
  startTime: z.string(), // ISO string
  status: LogStatusSchema,
  runTime: z.number(), // in seconds
  tokens: z.number(),
  input: z.record(z.string(), z.any()).optional(),
  output: z.record(z.string(), z.any()).optional(),
  tracing: z.array(z.any()).optional(), // Placeholder for tracing data
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

export const LogFilterSchema = z.object({
  dateRange: z.enum(['Last 7 days', 'Last 30 days', 'All time']),
  status: LogStatusSchema.optional(),
  search: z.string().optional(),
});

export type LogFilter = z.infer<typeof LogFilterSchema>;

export const PaginatedLogsSchema = z.object({
  data: z.array(LogEntrySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type PaginatedLogs = z.infer<typeof PaginatedLogsSchema>;
