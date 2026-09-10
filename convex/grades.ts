import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const DEFAULT_GRADES = [
  {
    grade: "O",
    gradePoint: 10,
    minMark: 91,
    maxMark: 100,
    description: "Outstanding Performance",
    order: 1,
  },
  {
    grade: "A+",
    gradePoint: 9,
    minMark: 81,
    maxMark: 90,
    description: "Excellent Performance",
    order: 2,
  },
  {
    grade: "A",
    gradePoint: 8,
    minMark: 71,
    maxMark: 80,
    description: "Very Good Performance",
    order: 3,
  },
  {
    grade: "B+",
    gradePoint: 7,
    minMark: 61,
    maxMark: 70,
    description: "Good Performance",
    order: 4,
  },
  {
    grade: "B",
    gradePoint: 6,
    minMark: 51,
    maxMark: 60,
    description: "Above Average Performance",
    order: 5,
  },
  {
    grade: "C",
    gradePoint: 5,
    minMark: 45,
    maxMark: 50,
    description: "Average / Satisfactory Performance",
    order: 6,
  },
  {
    grade: "U",
    gradePoint: 0,
    minMark: 0,
    maxMark: 44,
    description: "Re-appear (Arrear)",
    order: 7,
  },
];

/**
 * Get all grades from Convex database. Auto-seeds defaults if empty.
 */
export const getGradeSystem = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("gradeSystem").withIndex("by_order").collect();
    if (list.length === 0) {
      return DEFAULT_GRADES;
    }
    return list;
  },
});

/**
 * Save / update the entire grade system scale in Convex
 */
export const saveGradeSystem = mutation({
  args: {
    grades: v.array(
      v.object({
        grade: v.string(),
        gradePoint: v.number(),
        minMark: v.number(),
        maxMark: v.number(),
        description: v.string(),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("gradeSystem").collect();
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }

    const insertedIds = [];
    for (const g of args.grades) {
      const id = await ctx.db.insert("gradeSystem", {
        ...g,
        updatedAt: Date.now(),
      });
      insertedIds.push(id);
    }
    return { success: true, count: insertedIds.length };
  },
});

/**
 * Update a single grade in Convex database
 */
export const updateGrade = mutation({
  args: {
    grade: v.string(),
    gradePoint: v.number(),
    minMark: v.number(),
    maxMark: v.number(),
    description: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("gradeSystem")
      .withIndex("by_grade", (q) => q.eq("grade", args.grade))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        gradePoint: args.gradePoint,
        minMark: args.minMark,
        maxMark: args.maxMark,
        description: args.description,
        order: args.order,
        updatedAt: Date.now(),
      });
      return { success: true, id: existing._id };
    } else {
      const id = await ctx.db.insert("gradeSystem", {
        ...args,
        updatedAt: Date.now(),
      });
      return { success: true, id };
    }
  },
});

/**
 * Reset grade system back to official RIT defaults
 */
export const resetToDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("gradeSystem").collect();
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }
    for (const g of DEFAULT_GRADES) {
      await ctx.db.insert("gradeSystem", {
        ...g,
        updatedAt: Date.now(),
      });
    }
    return { success: true };
  },
});
