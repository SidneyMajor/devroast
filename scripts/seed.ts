import "dotenv/config";
import { faker } from "@faker-js/faker";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "sql",
  "html",
  "css",
];

const SEVERITY = ["critical", "warning", "good", "verdict"] as const;
const DIFF_TYPE = ["added", "removed", "context"] as const;

const SAMPLE_CODE = {
  javascript: [
    "var x = 1;",
    "let result = ''; for(var i=0; i<5; i++){ result += i; }",
    "const sum = (arr) => arr.map(x => x * 2);",
    "function calculateTotal(items) { var total = 0; for (var i = 0; i < items.length; i++) { total = total + items[i].price; } return total; }",
    "if (x = 5) { console.log('hello'); }",
  ],
  typescript: [
    "const x: any = 'hello';",
    "interface Person { name: string; age: number; }",
    "type StringOrNumber = string | number;",
  ],
  python: [
    "x = 1",
    "def foo(): pass",
    "for i in range(10): print(i)",
  ],
  java: [
    "public class Main { public static void main(String[] args) {} }",
    "ArrayList<Integer> list = new ArrayList<>();",
  ],
  go: [
    "func main() { var x int = 1 }",
    "err := error nil",
  ],
  rust: [
    "let mut x = 1;",
    "fn main() { println!(\"Hello\"); }",
  ],
};

const ISSUE_TITLES = [
  { severity: "critical", title: "Using var instead of const/let", description: "The var keyword is function-scoped rather than block-scoped. Use const for immutable bindings and let for mutable ones." },
  { severity: "critical", title: "Assignment instead of comparison", description: "You used = instead of ===. This is a common source of bugs." },
  { severity: "critical", title: "No error handling", description: "This code has no try-catch blocks. Errors will crash your application." },
  { severity: "critical", title: "SQL injection vulnerability", description: "Using string concatenation for SQL queries is dangerous. Use parameterized queries instead." },
  { severity: "critical", title: "Global variable pollution", description: "You're declaring variables in the global scope. This can cause conflicts." },
  { severity: "warning", title: "Unused variable detected", description: "The variable '%s' is declared but never used in this scope." },
  { severity: "warning", title: "Magic numbers", description: "Hardcoded numbers like %d make code hard to maintain. Use constants instead." },
  { severity: "warning", title: "Nested callbacks", description: "Callback hell detected. Consider using async/await or Promises." },
  { severity: "warning", title: "Inefficient loop", description: "This loop could be optimized with array methods like map, filter, or reduce." },
  { severity: "good", title: "Proper const usage", description: "Good job using const for immutable bindings!" },
  { severity: "good", title: "Descriptive naming", description: "Variable names are clear and descriptive. Great job!" },
  { severity: "good", title: "Modern syntax", description: "You're using modern JavaScript features. Well done!" },
  { severity: "verdict", title: "This is a disaster", description: "I'm genuinely concerned about this code. Please seek professional help." },
  { severity: "verdict", title: "Needs serious help", description: "This code is beyond repair. Consider rewriting from scratch." },
];

const ROAST_MESSAGES = [
  "Wow, using var in {year}? Bold choice!",
  "This code is... something else. Don't quit your day job.",
  "I've seen better code in a Hello World tutorial.",
  "This is why we can't have nice things.",
  "Congratulations, you broke JavaScript!",
  "My grandmother codes better than this.",
  "This is not the code you're looking for.",
  "Please, for the love of all that is holy, refactor this.",
  "The indentation is giving me anxiety.",
  "This code has more holes than Swiss cheese.",
];

function getRandomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateCode(language: string): string {
  const samples = SAMPLE_CODE[language as keyof typeof SAMPLE_CODE] || SAMPLE_CODE.javascript;
  return getRandomElement(samples);
}

function generateIssue(): { severity: string; title: string; description: string } {
  const issue = getRandomElement(ISSUE_TITLES);
  return {
    severity: issue.severity,
    title: issue.title,
    description: issue.description,
  };
}

function generateRoastFeedback(roastMode: boolean): string {
  if (!roastMode) {
    return "Thanks for submitting! Here's some feedback to help you improve your code.";
  }
  
  let message = getRandomElement(ROAST_MESSAGES);
  message = message.replace("{year}", new Date().getFullYear().toString());
  return message;
}

async function seed() {
  console.log("🌱 Starting seed...");
  
  const client = await pool.connect();
  
  try {
    // Clear existing data
    await client.query("DELETE FROM diffs");
    await client.query("DELETE FROM issues");
    await client.query("DELETE FROM roasts");
    await client.query("DELETE FROM submissions");
    console.log("🗑️  Cleared existing data");

    const ROAST_COUNT = 100;
    
    for (let i = 0; i < ROAST_COUNT; i++) {
      const language = getRandomElement(LANGUAGES);
      const code = generateCode(language);
      const roastMode = Math.random() > 0.2; // 80% roast mode
      const score = Number((Math.random() * 10).toFixed(2));
      
      // Insert submission
      const submissionResult = await client.query(
        "INSERT INTO submissions (code, language) VALUES ($1, $2) RETURNING id",
        [code, language]
      );
      const submissionId = submissionResult.rows[0].id;
      
      // Insert roast
      const roastFeedback = generateRoastFeedback(roastMode);
      const roastResult = await client.query(
        "INSERT INTO roasts (submission_id, feedback, score, roast_mode) VALUES ($1, $2, $3, $4) RETURNING id",
        [submissionId, roastFeedback, score, roastMode]
      );
      const roastId = roastResult.rows[0].id;
      
      // Insert 1-4 issues per roast
      const issueCount = Math.floor(Math.random() * 4) + 1;
      const issues = getRandomElements(ISSUE_TITLES, issueCount);
      
      for (const issue of issues) {
        await client.query(
          "INSERT INTO issues (roast_id, severity, title, description) VALUES ($1, $2, $3, $4)",
          [roastId, issue.severity, issue.title, issue.description]
        );
      }
      
      // Insert 0-5 diffs per roast
      const diffCount = Math.floor(Math.random() * 6);
      for (let j = 0; j < diffCount; j++) {
        const diffType = getRandomElement(DIFF_TYPE);
        const content = faker.lorem.sentence();
        await client.query(
          "INSERT INTO diffs (roast_id, diff_type, content) VALUES ($1, $2, $3)",
          [roastId, diffType, content]
        );
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(`✅ Created ${i + 1} roasts...`);
      }
    }
    
    // Update stats
    const statsResult = await client.query(`
      INSERT INTO stats (total_submissions, avg_score)
      SELECT 
        COUNT(*)::decimal,
        COALESCE(AVG(score)::decimal(3,2), 0)
      FROM roasts
    `);
    console.log("📊 Updated stats");
    
    console.log(`🎉 Seed completed! Created ${ROAST_COUNT} roasts.`);
    
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
