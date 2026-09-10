import { mutation } from "./_generated/server";

export const runAllMigrations = mutation({
  args: {},
  handler: async (ctx) => {
    const results = {
      users: 0,
      grades: 0,
      departments: 0,
      staff: 0,
    };

    // 1. Migrate Users (Credentials)
    const usersToMigrate = [
      {
        email: "kirranvijay@gmail.com",
        password: "Kirranst@14",
        name: "Kirran S T",
        role: "admin",
        department: "Information Technology",
        designation: "Assistant Professor & Admin",
      },
      {
        email: "ritdeptit@gmail.com",
        password: "Kirranst@14",
        name: "RIT IT Department Admin",
        role: "admin",
        department: "Information Technology",
        designation: "Department Admin",
      },
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
      {
        email: "mariappan@ritrjpm.ac.in",
        password: "Kirranst@14",
        name: "Mariappan",
        role: "staff",
        department: "Information Technology",
        designation: "Professor & Head",
      },
      {
        email: "vijayalakshmik@ritrjpm.ac.in",
        password: "Kirranst@14",
        name: "Vijayalakshmi K",
        role: "staff",
        department: "Computer Science and Engineering",
        designation: "Professor & Head",
      },
    ];

    for (const u of usersToMigrate) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", u.email.toLowerCase()))
        .first();

      if (!existing) {
        await ctx.db.insert("users", {
          ...u,
          createdAt: Date.now(),
        });
        results.users++;
      } else {
        await ctx.db.patch(existing._id, {
          password: u.password,
          name: u.name,
          role: u.role,
          department: u.department,
        });
        results.users++;
      }
    }

    // 2. Migrate Official Grade System
    const gradesToMigrate = [
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

    const existingGrades = await ctx.db.query("gradeSystem").collect();
    for (const eg of existingGrades) {
      await ctx.db.delete(eg._id);
    }
    for (const g of gradesToMigrate) {
      await ctx.db.insert("gradeSystem", {
        ...g,
        updatedAt: Date.now(),
      });
      results.grades++;
    }

    // 3. Migrate All 10 RIT Academic Departments
    const deptsToMigrate = [
      { code: "IT", name: "Information Technology", hodName: "Mariappan", email: "mariappan@ritrjpm.ac.in", status: "Active" },
      { code: "AI&DS", name: "Artificial Intelligence and Data Science", hodName: "Kaliappan", email: "kaliappan@ritrjpm.ac.in", status: "Active" },
      { code: "AIML", name: "Artificial Intelligence and Machine Learning", hodName: "Kesavan", email: "vtkesavan@ritrjpm.ac.in", status: "Active" },
      { code: "CIVIL", name: "Civil Engineering", hodName: "Meyyappan", email: "meyyappan@ritrjpm.ac.in", status: "Active" },
      { code: "CSBS", name: "Computer Science and Business Systems", hodName: "Gomathynayagam", email: "gomathynayagam@ritrjpm.ac.in", status: "Active" },
      { code: "CSE", name: "Computer Science and Engineering", hodName: "Vijayalakshmi K", email: "vijayalakshmik@ritrjpm.ac.in", status: "Active" },
      { code: "EEE", name: "Electrical and Electronics Engineering", hodName: "Kannan", email: "kannan@ritrjpm.ac.in", status: "Active" },
      { code: "ECE", name: "Electronics and Communication Engineering", hodName: "Arunachala Perumal C", email: "arunachalaperumal@ritrjpm.ac.in", status: "Active" },
      { code: "MECH", name: "Mechanical Engineering", hodName: "Suresh Kumar", email: "sureshkumar@ritrjpm.ac.in", status: "Active" },
      { code: "CYBER", name: "Cyber Security", hodName: "Pending Appointment", email: "cyberhod@rit.edu.in", status: "Active" },
    ];

    const existingDepts = await ctx.db.query("departments").collect();
    for (const ed of existingDepts) {
      await ctx.db.delete(ed._id);
    }
    for (const d of deptsToMigrate) {
      await ctx.db.insert("departments", d);
      results.departments++;
    }

    // 4. Migrate Staff Members
    const staffToMigrate = [
      { staffId: "RIT_ST_01", name: "Kirran S T", email: "kirranvijay@gmail.com", department: "Information Technology", designation: "Assistant Professor & Admin", canCalculate: true, createdAt: Date.now() - 86400000 },
      { staffId: "RIT_ST_02", name: "Mariappan", email: "mariappan@ritrjpm.ac.in", department: "Information Technology", designation: "Professor & Head", canCalculate: true, createdAt: Date.now() - 172800000 },
      { staffId: "RIT_ST_03", name: "Vijayalakshmi K", email: "vijayalakshmik@ritrjpm.ac.in", department: "Computer Science and Engineering", designation: "Professor & Head", canCalculate: true, createdAt: Date.now() - 259200000 },
      { staffId: "RIT_ST_04", name: "Kaliappan", email: "kaliappan@ritrjpm.ac.in", department: "Artificial Intelligence and Data Science", designation: "Professor & Head", canCalculate: true, createdAt: Date.now() - 345600000 },
      { staffId: "RIT_ST_05", name: "RIT IT Department Admin", email: "ritdeptit@gmail.com", department: "Information Technology", designation: "Department Admin", canCalculate: true, createdAt: Date.now() },
    ];

    const existingStaff = await ctx.db.query("staff").collect();
    for (const es of existingStaff) {
      await ctx.db.delete(es._id);
    }
    for (const s of staffToMigrate) {
      await ctx.db.insert("staff", s);
      results.staff++;
    }

    return {
      success: true,
      migrated: results,
      message: "All initial data successfully migrated to Convex database!",
    };
  },
});
