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
        gradePoint: v.optional(v.number()),
        mark: v.optional(v.number()),
        credits: v.optional(v.number()),
      })
    ),
    totalMarks: v.number(),
    maxMarks: v.number(),
    percentage: v.number(),
    cgpa: v.optional(v.number()),
    classification: v.optional(v.string()),
    notes: v.optional(v.string()),
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
