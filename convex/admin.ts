import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all departments
 */
export const getDepartments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

/**
 * Add a new department
 */
export const addDepartment = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    hodName: v.string(),
    email: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("departments", args);
    return { success: true, id };
  },
});

/**
 * Update an existing department (HOD name, email, name, status)
 * Matches by code or id to sync smoothly with Convex storage
 */
export const updateDepartment = mutation({
  args: {
    id: v.optional(v.string()),
    code: v.string(),
    name: v.optional(v.string()),
    hodName: v.string(),
    email: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let dept = await ctx.db
      .query("departments")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!dept && args.id) {
      try {
        dept = await ctx.db.get(args.id as any);
      } catch {}
    }

    if (dept) {
      await ctx.db.patch(dept._id, {
        ...(args.name ? { name: args.name } : {}),
        hodName: args.hodName,
        email: args.email,
        ...(args.status ? { status: args.status } : {}),
      });
      return { success: true, id: dept._id };
    } else {
      const id = await ctx.db.insert("departments", {
        code: args.code,
        name: args.name || args.code,
        hodName: args.hodName,
        email: args.email,
        status: args.status || "Active",
      });
      return { success: true, id };
    }
  },
});

/**
 * Delete a department by code or id
 */
export const deleteDepartment = mutation({
  args: {
    id: v.optional(v.string()),
    code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.code) {
      const dept = await ctx.db
        .query("departments")
        .withIndex("by_code", (q) => q.eq("code", args.code!))
        .first();
      if (dept) {
        await ctx.db.delete(dept._id);
        return { success: true };
      }
    }
    if (args.id) {
      try {
        await ctx.db.delete(args.id as any);
        return { success: true };
      } catch {}
    }
    return { success: false };
  },
});

/**
 * Get all staff members
 */
export const getStaff = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("staff").collect();
  },
});

/**
 * Add staff member for calculating
 */
export const addStaff = mutation({
  args: {
    staffId: v.string(),
    name: v.string(),
    email: v.string(),
    department: v.string(),
    designation: v.string(),
    canCalculate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("staff", {
      ...args,
      createdAt: Date.now(),
    });
    return { success: true, id };
  },
});

/**
 * Toggle or update staff calculation permission
 */
export const updateStaff = mutation({
  args: {
    id: v.id("staff"),
    canCalculate: v.boolean(),
    designation: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return { success: true };
  },
});

/**
 * Delete staff member
 */
export const deleteStaff = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
