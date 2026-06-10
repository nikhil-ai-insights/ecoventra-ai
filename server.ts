/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// HTTP Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: referrerPolicy; connect-src 'self' https:;"
  );
  next();
});

// Middleware for parsing requests (with strict JSON size constraints to prevent memory depletion DOS attacks)
app.use(express.json({ limit: '2mb' }));

// Set up Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Simple in-memory cache for API requests to minimize expensive LLM calls and reduce latency
const apiCache = new Map<string, { value: any; expiry: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache duration

function getCachedItem(key: string): any | null {
  const cached = apiCache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    apiCache.delete(key);
    return null;
  }
  return cached.value;
}

function setCachedItem(key: string, value: any) {
  apiCache.set(key, { value, expiry: Date.now() + CACHE_TTL_MS });
}

// JSON Local Database paths
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Ensure DB directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial Mock Database Seed
const initialDbSeed = {
  user: {
    uid: "ecoventra_pioneer",
    email: "homeworkout169@gmail.com",
    displayName: "Eco Innovator",
    photoURL: null,
    role: "user",
    ecoPoints: 3450,
    streak: 6,
    level: 3,
    badges: ["Green Beginner", "Eco Explorer", "Carbon Reducer"],
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  calculations: [
    {
      id: "calc_01",
      userId: "ecoventra_pioneer",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      categoryBreakdown: { transport: 180, energy: 240, food: 95, shopping: 45 },
      inputs: {
        carDistance: 120,
        bikeDistance: 15,
        publicTransit: 30,
        flights: 4,
        electricity: 280,
        acUsage: 6,
        appliances: ["fridge", "ac", "microwave"],
        dietType: "non-veg",
        onlinePurchases: 12,
        clothingPurchases: 2
      },
      totalEmissions: 560,
      annualForecast: 6.72,
      carbonScore: 58
    },
    {
      id: "calc_02",
      userId: "ecoventra_pioneer",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      categoryBreakdown: { transport: 110, energy: 190, food: 50, shopping: 20 },
      inputs: {
        carDistance: 50,
        bikeDistance: 35,
        publicTransit: 60,
        flights: 4,
        electricity: 190,
        acUsage: 3,
        appliances: ["fridge", "microwave"],
        dietType: "vegetarian",
        onlinePurchases: 4,
        clothingPurchases: 0
      },
      totalEmissions: 370,
      annualForecast: 4.44,
      carbonScore: 78
    }
  ],
  goals: [
    {
      id: "goal_01",
      userId: "ecoventra_pioneer",
      title: "Reduce weekly driving by 50%",
      description: "Swap driving for hybrid/public transit to lower scope-1 logistics emissions.",
      category: "transport",
      targetDate: "2026-07-09",
      progress: 60,
      tasks: [
        { id: "task_11", text: "Commute via subway twice per week", completed: true },
        { id: "task_12", text: "Map bicycle highway safely to work", completed: true },
        { id: "task_13", text: "Ensure car tires are optimally inflated", completed: false }
      ],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      isAiGenerated: false
    },
    {
      id: "goal_02",
      userId: "ecoventra_pioneer",
      title: "Adopt Smart Energy Habits",
      description: "Regulate cooling and standby appliances to reduce electricity output.",
      category: "energy",
      targetDate: "2026-06-30",
      progress: 33,
      tasks: [
        { id: "task_21", text: "Install smart timer for target central AC usage", completed: true },
        { id: "task_22", text: "Unplug standby electronics at night", completed: false },
        { id: "task_23", text: "Initiate smart household meter audits", completed: false }
      ],
      createdAt: new Date().toISOString(),
      isAiGenerated: true
    }
  ],
  challenges: [
    {
      id: "challenge_01",
      title: "Pedal Power Weekend",
      description: "Replace all driving trips with cycling, running, or walking this Saturday & Sunday.",
      points: 250,
      category: "transport",
      duration: "2 days",
      completed: true
    },
    {
      id: "challenge_02",
      title: "Zero Waste Food Week",
      description: "Plan meals strictly, utilize leftovers, and compost 100% of organic waste.",
      points: 400,
      category: "food",
      duration: "7 days",
      completed: false
    },
    {
      id: "challenge_03",
      title: "Phantom Load Elimination",
      description: "Disconnect all entertainment and charging blocks from power strips during non-use.",
      points: 150,
      category: "energy",
      duration: "5 days",
      completed: true
    },
    {
      id: "challenge_04",
      title: "Minimalist Shopping Sprint",
      description: "Refrain from all fast-fashion clothing or dynamic consumer luxury shopping.",
      points: 300,
      category: "shopping",
      duration: "10 days",
      completed: false
    },
    {
      id: "challenge_05",
      title: "Green Diet Conversion",
      description: "Consume an exclusively vegan diet for 3 consecutive days.",
      points: 350,
      category: "food",
      duration: "3 days",
      completed: false
    }
  ],
  bills: [],
  leaderboard: [
    { userId: "lead1", displayName: "Sophia Rutherford", photoURL: null, ecoPoints: 4200, streak: 12, badgesCount: 5 },
    { userId: "lead2", displayName: "Liam Thorne", photoURL: null, ecoPoints: 3850, streak: 8, badgesCount: 4 },
    { userId: "ecoventra_pioneer", displayName: "Eco Innovator", photoURL: null, ecoPoints: 3450, streak: 6, badgesCount: 3, isCurrentUser: true },
    { userId: "lead3", displayName: "Marcus Aurelius", photoURL: null, ecoPoints: 3100, streak: 14, badgesCount: 4 },
    { userId: "lead4", displayName: "Elena Varghese", photoURL: null, ecoPoints: 2900, streak: 4, badgesCount: 2 }
  ]
};

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDbSeed, null, 2), "utf-8");
}

// REST API Database Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "online", time: new Date().toISOString(), geminiKeyLoaded: !!apiKey });
});

app.get("/api/db/load", (req, res) => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("DB Load Error: ", error);
    res.json(initialDbSeed);
  }
});

app.post("/api/db/save", (req, res) => {
  try {
    const data = req.body;
    
    // Strict schema structure validator to safeguard persistence integrity
    if (!data || typeof data !== "object") {
      return res.status(400).json({ success: false, message: "Malformed payload format. Must be a JSON object." });
    }
    
    // Verify core root database tables exist before storage write
    if (!data.user || !Array.isArray(data.calculations) || !Array.isArray(data.goals) || !Array.isArray(data.challenges)) {
      return res.status(400).json({ success: false, message: "Payload schema validation failed. Required root arrays are absent." });
    }

    // Defensive input filtering against XSS injection scripts
    if (data.user && typeof data.user.displayName === 'string') {
      data.user.displayName = data.user.displayName
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, message: "Database saved successfully" });
  } catch (error) {
    console.error("DB Save Error: ", error);
    res.status(500).json({ success: false, message: "Failed to persist database metadata." });
  }
});

// Gemini Endpoint: Conversational Chat Coach
app.post("/api/gemini/coach", async (req, res) => {
  const { messages, userContext } = req.body;
  if (!apiKey) {
    return res.json({
      text: "Hello! I am your Ecoventra AI Sustainability Coach. It seems your GEMINI_API_KEY is not configured yet. Set it in the Secrets panel on the top-right settings to access custom real-time AI guidance! For now, how can I assist you with eco-conscious habits today?"
    });
  }

  const cacheKey = `coach_${JSON.stringify(messages || "")}_${userContext?.carbonScore || ""}`;
  const cached = getCachedItem(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    // Collect contextual calculations
    const scoreText = userContext?.carbonScore ? `Currently, the user has an outstanding Ecoventra Carbon Score of ${userContext.carbonScore}/100 and average monthly emissions of ${userContext.monthlyEmissions || "450"} kgCO2.` : "The user hasn't calculated their carbon footprint yet.";
    
    const formattedHistory = messages.map((msg: any) => {
      return `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`;
    }).join("\n");

    const systemInstruction = `You are Ecoventra Coach, an expert sustainability analyst and environmental consultant.
    Your tone is empathetic, professional, highly motivational, and mathematically rigorous.
    Always prioritize actionable micro-adjustments in diet, transport, energy, and consumption over vague slogans.
    ${scoreText} or dynamic factors about ecoPoints. Keep responses structured, concise, and beautifully formatted in standard markdown.
    If the user presents numbers or habits (e.g. driving distance, appliance settings), compute quick estimated carbon impacts ($0.23 kgCO2/km for typical internal combustion engine autos, etc.) to give precise data-driven feedback.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `System guidelines: ${systemInstruction}\n\nChat Conversation History:\n${formattedHistory}\n\nAssistant:`,
    });

    const resultPayload = { text: response.text };
    setCachedItem(cacheKey, resultPayload);
    res.json(resultPayload);
  } catch (err: any) {
    console.error("Gemini Coach Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI Coach insights." });
  }
});

// Gemini Endpoint: Smart Bill & Receipt Analyzer
app.post("/api/gemini/analyze-bill", async (req, res) => {
  const { fileData, fileName, fileMime } = req.body;
  if (!apiKey) {
    return res.json({
      extractedData: {
        billType: "electricity",
        units: 320,
        cost: 85
      },
      carbonImpact: 134.4,
      suggestions: [
        "Upgrade to high-efficiency LED lights across all main fixtures.",
        "Unplug desktop computers and entertainment consoles during nighttime idle segments.",
        "Check weather stripping on exterior entrance frames to prevent HVAC loss."
      ],
      aiAnalysis: "(Simulation Mode: Please set your GEMINI_API_KEY to activate authentic optical-character bill parsing)"
    });
  }

  try {
    const prompt = "Analyze this utility bill or receipt. Strictly extract the details into a direct JSON structure including billType (either 'electricity', 'fuel' or 'unknown'), units (total electricity consumption in kWh or fuel/petrol volume in Liters), cost (total amount charged in USD dollars), and provide 3-4 specific highly advanced sustainability action tips tailored specifically to this utility. Compute the direct estimate carbon footprint impact of this usage in kgCO2 (e.g. electricity typical emission factor: 0.4 kgCO2/kWh, car petrol: 2.3 kgCO2/Liter). Return standard text analysis followed by JSON.";

    const docPart = {
      inlineData: {
        mimeType: fileMime || "image/png",
        data: fileData, // base64 string
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [docPart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["billType", "units", "cost", "carbonImpact", "suggestions", "aiAnalysis"],
          properties: {
            billType: { type: Type.STRING, description: "Must be 'electricity' or 'fuel'" },
            units: { type: Type.NUMBER, description: "Extracted kWh or Liters" },
            cost: { type: Type.NUMBER, description: "Total bill value in USD" },
            carbonImpact: { type: Type.NUMBER, description: "Calculated carbon output in kgCO2" },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 3 personalized energy saving recommendations"
            },
            aiAnalysis: { type: Type.STRING, description: "Brief executive summary of findings and anomalies" }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini Bill Analyzer Error:", err);
    res.status(500).json({ error: err.message || "Could not successfully compile bill analysis." });
  }
});

// Gemini Endpoint: AI Goal Planner Roadmap Creator
app.post("/api/gemini/goal-planner", async (req, res) => {
  const { title, description, category } = req.body;
  if (!apiKey) {
    return res.json({
      tasks: [
        { id: "ai_t1", text: `Initialize monitoring of ${category !== 'general' ? category : 'sustainability'} habits`, completed: false },
        { id: "ai_t2", text: "Map optimization milestones over next 30 days", completed: false },
        { id: "ai_t3", text: "Report final footprint offset metrics in profile", completed: false }
      ],
      aiRoadmap: `Custom 30-day AI roadmap for goal: "${title}". (Simulation Mode: Please set your GEMINI_API_KEY in Secrets for fully custom generated action items!)`
    });
  }

  const cacheKey = `goal_${category || ""}_${title || ""}_${description || ""}`;
  const cachedResponse = getCachedItem(cacheKey);
  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  try {
    const prompt = `Formulate a detailed sustainability reduction roadmap for the following user goal:
    Goal Title: "${title}"
    Goal Description: "${description}"
    Topic Category: "${category}"
    
    Return a list of 4 concrete, actionable sequential milestone tasks to accomplish this, along with a 2-paragraph inspiring AI sustainability roadmap explaining the planetary carbon reduction context.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["tasks", "aiRoadmap"],
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["text"],
                properties: {
                  text: { type: Type.STRING, description: "Action step (e.g. 'Turn off AC 1 hour early each day')" }
                }
              }
            },
            aiRoadmap: { type: Type.STRING, description: "Explanatory context of planetary sustainability benefits." }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    setCachedItem(cacheKey, parsed);
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini Goal Planner Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate dynamic AI sustainability plan roadmap." });
  }
});

// Initialize and integrate Vite asset handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Load Vite in middlewaremode for lightning-fast asset rendering
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ecoventra Web Application server online on port ${PORT}`);
  });
}

startServer();
