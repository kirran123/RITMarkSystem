import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Verified master credentials requested by user
const MASTER_USER = {
  email: "kirranvijay@gmail.com",
  password: "Kirranst@14",
  name: "Kirran S T",
  role: "student",
  department: "Information Technology",
};

/**
 * Validate user credentials.
 * Checks against the database, or falls back to master credentials.
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const password = args.password.trim();

    // Check if matching master credentials
    if (email === MASTER_USER.email.toLowerCase() && password === MASTER_USER.password) {
      // Check if user exists in DB, if not auto-seed
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (!existing) {
        await ctx.db.insert("users", {
          email: MASTER_USER.email,
          password: MASTER_USER.password,
          name: MASTER_USER.name,
          role: MASTER_USER.role,
          department: MASTER_USER.department,
          createdAt: Date.now(),
        });
      }

      return {
        success: true,
        user: {
          email: MASTER_USER.email,
          name: MASTER_USER.name,
          role: MASTER_USER.role,
          department: MASTER_USER.department,
        },
      };
    }

    // Check custom users in DB
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (user && user.password === password) {
      return {
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
        },
      };
    }

    return {
      success: false,
      message: "Invalid email or password. Please use the authorized credentials.",
    };
  },
});

/**
 * Query current user profile details
 */
export const getUserProfile = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (user) {
      return {
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      };
    }

    if (email === MASTER_USER.email.toLowerCase()) {
      return MASTER_USER;
    }

    return null;
  },
});
