import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users allowed to access the system
  users: defineTable({
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.string(), // "staff" | "admin"
    department: v.optional(v.string()),
    designation: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Mark Calculation records
  calculations: defineTable({
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
    timestamp: v.number(),
  })
    .index("by_userEmail", ["userEmail"])
    .index("by_timestamp", ["timestamp"]),

  // Grade System scale (Letters, Grade Points, Marks, and Descriptions)
  gradeSystem: defineTable({
    grade: v.string(), // "O", "A+", "A", "B+", "B", "C", "U"
    gradePoint: v.number(),
    minMark: v.number(),
    maxMark: v.number(),
    description: v.string(),
    order: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_grade", ["grade"]),

  // Departments
  departments: defineTable({
    code: v.string(),
    name: v.string(),
    hodName: v.string(),
    email: v.string(),
    status: v.string(),
  }).index("by_code", ["code"]),

  // Staff members authorized for calculations
  staff: defineTable({
    staffId: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    department: v.string(),
    designation: v.string(),
    canCalculate: v.boolean(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
