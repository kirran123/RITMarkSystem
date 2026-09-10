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
 * Update an existing department (HOD name, email, etc.)
 */
export const updateDepartment = mutation({
  args: {
    id: v.id("departments"),
    code: v.string(),
    name: v.string(),
    hodName: v.string(),
    email: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return { success: true };
  },
});

/**
 * Delete a department
 */
export const deleteDepartment = mutation({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
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
