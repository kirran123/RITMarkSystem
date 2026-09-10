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
 * Add staff member with login password and calculation permissions
 */
export const addStaff = mutation({
  args: {
    staffId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    department: v.optional(v.string()),
    designation: v.string(),
    canCalculate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const password = args.password || "Kirranst@14";
    const dept = args.department || "Information Technology";
    const staffId = args.staffId || `RIT_ST_${Date.now().toString().slice(-4)}`;

    // 1. Insert into staff table
    const id = await ctx.db.insert("staff", {
      staffId,
      name: args.name,
      email,
      password,
      department: dept,
      designation: args.designation,
      canCalculate: args.canCalculate,
      createdAt: Date.now(),
    });

    // 2. Also ensure user account exists in users table so staff can sign in immediately
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existingUser) {
      await ctx.db.insert("users", {
        email,
        password,
        name: args.name,
        role: "staff",
        department: dept,
        designation: args.designation,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.patch(existingUser._id, {
        password,
        name: args.name,
        role: "staff",
        department: dept,
        designation: args.designation,
      });
    }

    return { success: true, id };
  },
});

/**
 * Update staff member details, calculation permission, and portal password
 */
export const updateStaff = mutation({
  args: {
    id: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    password: v.optional(v.string()),
    canCalculate: v.optional(v.boolean()),
    designation: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let staffDoc = null;
    if (args.email) {
      staffDoc = await ctx.db
        .query("staff")
        .withIndex("by_email", (q) => q.eq("email", args.email!.trim().toLowerCase()))
        .first();
    }
    if (!staffDoc && args.id) {
      try {
        staffDoc = await ctx.db.get(args.id as any);
      } catch {}
    }

    if (staffDoc) {
      const patchData: any = {};
      if (args.name !== undefined) patchData.name = args.name;
      if (args.password !== undefined && args.password !== '') patchData.password = args.password;
      if (args.canCalculate !== undefined) patchData.canCalculate = args.canCalculate;
      if (args.designation !== undefined) patchData.designation = args.designation;
      if (args.department !== undefined) patchData.department = args.department;

      await ctx.db.patch(staffDoc._id, patchData);

      // Also update in users collection so login reflects new password or name
      const email = staffDoc.email.toLowerCase();
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (user) {
        const userPatch: any = {};
        if (args.password !== undefined && args.password !== '') userPatch.password = args.password;
        if (args.name !== undefined) userPatch.name = args.name;
        if (args.designation !== undefined) userPatch.designation = args.designation;
        if (args.department !== undefined) userPatch.department = args.department;
        if (Object.keys(userPatch).length > 0) {
          await ctx.db.patch(user._id, userPatch);
        }
      }

      return { success: true, id: staffDoc._id };
    }

    return { success: false, message: "Staff record not found" };
  },
});

/**
 * Delete staff member
 */
export const deleteStaff = mutation({
  args: { id: v.optional(v.string()), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.email) {
      const item = await ctx.db
        .query("staff")
        .withIndex("by_email", (q) => q.eq("email", args.email!.trim().toLowerCase()))
        .first();
      if (item) {
        await ctx.db.delete(item._id);
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
