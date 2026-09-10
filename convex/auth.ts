import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Verified master admin credentials
const MASTER_ADMIN = {
  email: "kirranvijay@gmail.com",
  password: "Kirranst@14",
  name: "Kirran S T",
  role: "admin",
  department: "Information Technology",
};

// Initial authorized faculty/staff accounts
const INITIAL_STAFF = [
  {
    email: "hodit@ritrjpm.ac.in",
    password: "Kirranst@14",
    name: "Dr. K. Vijayalakshmi",
    role: "staff",
    department: "Information Technology",
    designation: "Professor & Head",
  },
  {
    email: "hodcse@ritrjpm.ac.in",
    password: "Kirranst@14",
    name: "Dr. M. Kaliappan",
    role: "staff",
    department: "Computer Science and Engineering",
    designation: "Professor & Head",
  },
  {
    email: "hodai@ritrjpm.ac.in",
    password: "Kirranst@14",
    name: "Dr. S. Rajakarunakaran",
    role: "staff",
    department: "Artificial Intelligence & Data Science",
    designation: "Professor & Head",
  },
  {
    email: "faculty@ritrjpm.ac.in",
    password: "Kirranst@14",
    name: "Academic Faculty Member",
    role: "staff",
    department: "Information Technology",
    designation: "Assistant Professor",
  },
];

/**
 * Seed initial admin and staff users into the database if not present
 */
export const seedInitialUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Ensure master admin exists
    const admin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", MASTER_ADMIN.email))
      .first();

    if (!admin) {
      await ctx.db.insert("users", {
        ...MASTER_ADMIN,
        createdAt: Date.now(),
      });
    }

    // 2. Ensure initial staff exist
    for (const staff of INITIAL_STAFF) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", staff.email))
        .first();

      if (!existing) {
        await ctx.db.insert("users", {
          ...staff,
          createdAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

/**
 * Validate credentials against Convex database
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.string(), // "staff" | "admin"
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const password = args.password.trim();
    const requestedRole = args.role.toLowerCase();

    // Auto-seed admin and staff if users table is empty
    let adminRecord = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", MASTER_ADMIN.email))
      .first();

    if (!adminRecord) {
      await ctx.db.insert("users", {
        ...MASTER_ADMIN,
        createdAt: Date.now(),
      });
      for (const s of INITIAL_STAFF) {
        await ctx.db.insert("users", {
          ...s,
          createdAt: Date.now(),
        });
      }
    }

    // Query user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      return {
        success: false,
        message: "User not found. Please verify your institutional email ID.",
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: "Invalid password. Please enter authorized credentials.",
      };
    }

    // If logging in as admin, check admin role
    if (requestedRole === "admin" && user.role !== "admin") {
      return {
        success: false,
        message: "Account does not hold Administrative privileges. Please sign in as Staff.",
      };
    }

    return {
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department || "Information Technology",
      },
    };
  },
});

/**
 * Register / add new user with credentials into Convex database
 */
export const addUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.string(),
    department: v.optional(v.string()),
    designation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return { success: false, message: "User with this email already exists" };
    }

    const id = await ctx.db.insert("users", {
      ...args,
      email,
      createdAt: Date.now(),
    });

    return { success: true, id };
  },
});

/**
 * Update user password in Convex database
 */
export const updatePassword = mutation({
  args: {
    email: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    await ctx.db.patch(user._id, {
      password: args.newPassword,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Query all registered users from Convex (for admin view)
 */
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      department: u.department,
      createdAt: u.createdAt,
    }));
  },
});
