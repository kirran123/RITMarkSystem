import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save a new CGPA & percentage calculation
 */
export const saveCalculation = mutation({
  args: {
    userEmail: v.string(),
    userName: v.optional(v.union(v.string(), v.null())),
    candidateName: v.optional(v.union(v.string(), v.null())),
    semester: v.optional(v.union(v.string(), v.null())),
    subjectCount: v.number(),
    subjects: v.array(
      v.object({
        id: v.optional(v.union(v.number(), v.null())),
        code: v.optional(v.union(v.string(), v.null())),
        name: v.string(),
        grade: v.string(),
        gradePoint: v.optional(v.union(v.number(), v.null())),
        mark: v.optional(v.union(v.number(), v.null())),
        credits: v.optional(v.union(v.number(), v.null())),
      })
    ),
    totalMarks: v.number(),
    maxMarks: v.number(),
    percentage: v.number(),
    cgpa: v.optional(v.union(v.number(), v.null())),
    classification: v.optional(v.union(v.string(), v.null())),
    notes: v.optional(v.union(v.string(), v.null())),
    timestamp: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    const email = args.userEmail.trim().toLowerCase();
    const cleanSubjects = (args.subjects || []).map((s, idx) => ({
      id: typeof s.id === "number" ? s.id : idx + 1,
      code: s.code || `${idx + 1}`,
      name: s.name || `Subject ${idx + 1}`,
      grade: (s.grade || "A+").toUpperCase(),
      gradePoint: typeof s.gradePoint === "number" ? s.gradePoint : 0,
      mark: typeof s.mark === "number" ? s.mark : 0,
      credits: typeof s.credits === "number" ? s.credits : 0,
    }));

    const id = await ctx.db.insert("calculations", {
      userEmail: email,
      userName: args.userName || "Faculty Member",
      candidateName: args.candidateName || "Anonymous",
      semester: args.semester || "Mark Calculation",
      subjectCount: args.subjectCount || cleanSubjects.length,
      subjects: cleanSubjects,
      totalMarks: Number(args.totalMarks || 0),
      maxMarks: Number(args.maxMarks || cleanSubjects.length * 100),
      percentage: Number(args.percentage || 0),
      cgpa: typeof args.cgpa === "number" ? args.cgpa : 0,
      classification: args.classification || "",
      notes: args.notes || "",
      timestamp: typeof args.timestamp === "number" ? args.timestamp : Date.now(),
    });
    return { success: true, id };
  },
});

/**
 * Batch migrate calculations from client localStorage
 */
export const migrateBatchCalculations = mutation({
  args: {
    records: v.array(
      v.object({
        userEmail: v.string(),
        userName: v.optional(v.union(v.string(), v.null())),
        candidateName: v.optional(v.union(v.string(), v.null())),
        semester: v.optional(v.union(v.string(), v.null())),
        subjectCount: v.number(),
        subjects: v.array(
          v.object({
            id: v.optional(v.union(v.number(), v.null())),
            code: v.optional(v.union(v.string(), v.null())),
            name: v.string(),
            grade: v.string(),
            gradePoint: v.optional(v.union(v.number(), v.null())),
            mark: v.optional(v.union(v.number(), v.null())),
            credits: v.optional(v.union(v.number(), v.null())),
          })
        ),
        totalMarks: v.number(),
        maxMarks: v.number(),
        percentage: v.number(),
        cgpa: v.optional(v.union(v.number(), v.null())),
        classification: v.optional(v.union(v.string(), v.null())),
        notes: v.optional(v.union(v.string(), v.null())),
        timestamp: v.optional(v.union(v.number(), v.null())),
      })
    ),
  },
  handler: async (ctx, args) => {
    let savedCount = 0;
    for (const rec of args.records) {
      const email = rec.userEmail.trim().toLowerCase();
      const recTimestamp = typeof rec.timestamp === "number" ? rec.timestamp : Date.now();
      const candName = (rec.candidateName || "Anonymous").trim();

      // Check if already exists by exact timestamp or by candidate + totalMarks + percentage
      const existingByTs = await ctx.db
        .query("calculations")
        .withIndex("by_userEmail", (q) => q.eq("userEmail", email))
        .filter((q) => q.eq(q.field("timestamp"), recTimestamp))
        .first();

      if (existingByTs) {
        continue;
      }

      const cleanSubjects = (rec.subjects || []).map((s, idx) => ({
        id: typeof s.id === "number" ? s.id : idx + 1,
        code: s.code || `${idx + 1}`,
        name: s.name || `Subject ${idx + 1}`,
        grade: (s.grade || "A+").toUpperCase(),
        gradePoint: typeof s.gradePoint === "number" ? s.gradePoint : 0,
        mark: typeof s.mark === "number" ? s.mark : 0,
        credits: typeof s.credits === "number" ? s.credits : 0,
      }));

      await ctx.db.insert("calculations", {
        userEmail: email,
        userName: rec.userName || "Faculty Member",
        candidateName: candName,
        semester: rec.semester || "Mark Calculation",
        subjectCount: rec.subjectCount || cleanSubjects.length,
        subjects: cleanSubjects,
        totalMarks: Number(rec.totalMarks || 0),
        maxMarks: Number(rec.maxMarks || cleanSubjects.length * 100),
        percentage: Number(rec.percentage || 0),
        cgpa: typeof rec.cgpa === "number" ? rec.cgpa : 0,
        classification: rec.classification || "",
        notes: rec.notes || "",
        timestamp: recTimestamp,
      });
      savedCount++;
    }
    return { success: true, count: savedCount };
  },
});

/**
 * Get calculation history.
 * If user is admin or master admin, returns all portal calculations.
 * Otherwise returns calculations for the specific user email.
 */
export const getHistoryByUser = query({
  args: {
    userEmail: v.string(),
    isAdmin: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const email = args.userEmail.trim().toLowerCase();
    const isMasterAdmin =
      args.isAdmin === true ||
      email === "kirranvijay@gmail.com" ||
      email === "ritdeptit@gmail.com";

    if (isMasterAdmin) {
      const all = await ctx.db.query("calculations").collect();
      return all.sort((a, b) => b.timestamp - a.timestamp);
    }

    const list = await ctx.db
      .query("calculations")
      .withIndex("by_userEmail", (q) => q.eq("userEmail", email))
      .collect();

    return list.sort((a, b) => b.timestamp - a.timestamp);
  },
});

/**
 * Get all calculations across the portal (for administrative oversight)
 */
export const getAllCalculations = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("calculations").collect();
    return all.sort((a, b) => b.timestamp - a.timestamp);
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
  args: {
    userEmail: v.string(),
    isAdmin: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const email = args.userEmail.trim().toLowerCase();
    const isMaster =
      args.isAdmin === true ||
      email === "kirranvijay@gmail.com" ||
      email === "ritdeptit@gmail.com";

    const records = isMaster
      ? await ctx.db.query("calculations").collect()
      : await ctx.db
          .query("calculations")
          .withIndex("by_userEmail", (q) => q.eq("userEmail", email))
          .collect();

    for (const record of records) {
      await ctx.db.delete(record._id);
    }
    return { success: true, deletedCount: records.length };
  },
});
