import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save a new CGPA & percentage calculation
 */
export const saveCalculation = mutation({
  args: {
    userEmail: v.string(),
    userName: v.optional(v.string()),
    candidateName: v.optional(v.string()),
    semester: v.optional(v.string()),
    subjectCount: v.number(),
    subjects: v.array(
      v.object({
        id: v.optional(v.number()),
        code: v.optional(v.string()),
        name: v.string(),
        grade: v.string(),
        gradePoint: v.number(),
        mark: v.number(),
        credits: v.optional(v.number()),
      })
    ),
    totalMarks: v.number(),
    maxMarks: v.number(),
    percentage: v.number(),
    cgpa: v.number(),
    classification: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("calculations", {
      ...args,
      userEmail: args.userEmail.trim().toLowerCase(),
      timestamp: Date.now(),
    });
    return { success: true, id };
  },
});

/**
 * Get calculation history for a specific user, sorted from newest to oldest
 */
export const getHistoryByUser = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const email = args.userEmail.trim().toLowerCase();
    const list = await ctx.db
      .query("calculations")
      .withIndex("by_userEmail", (q) => q.eq("userEmail", email))
      .collect();

    // Sort descending by timestamp
    return list.sort((a, b) => b.timestamp - a.timestamp);
  },
});

/**
 * Delete a specific calculation record
 */
export const deleteCalculation = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.id as any);
      return { success: true };
    } catch {
      return { success: false };
    }
  },
});

/**
 * Clear all history for a specific user
 */
export const clearHistoryByUser = mutation({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const email = args.userEmail.trim().toLowerCase();
    const records = await ctx.db
      .query("calculations")
      .withIndex("by_userEmail", (q) => q.eq("userEmail", email))
      .collect();

    for (const record of records) {
      await ctx.db.delete(record._id);
    }
    return { success: true, deletedCount: records.length };
  },
});

