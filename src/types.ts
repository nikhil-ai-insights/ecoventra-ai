/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  ecoPoints: number;
  streak: number;
  level: number;
  badges: string[];
  joinedAt: string;
}

export interface FootprintCalculation {
  id: string;
  userId: string;
  date: string;
  categoryBreakdown: {
    transport: number; // kgCO2
    energy: number;    // kgCO2
    food: number;      // kgCO2
    shopping: number;  // kgCO2
  };
  inputs: {
    // Transportation
    carDistance: number;   // km/week
    bikeDistance: number;  // km/week
    publicTransit: number; // km/week (bus, train, metro)
    flights: number;       // hours/year
    
    // Energy
    electricity: number;   // kWh/month
    acUsage: number;       // hours/day
    appliances: string[];  // e.g. ["fridge", "dryer", "heating"]
    
    // Food
    dietType: 'vegan' | 'vegetarian' | 'non-veg';
    
    // Shopping
    onlinePurchases: number; // number of products/month
    clothingPurchases: number; // items/month
  };
  totalEmissions: number; // kgCO2/month
  annualForecast: number; // metric tons/year
  carbonScore: number;    // index from 0 to 100 (higher is better / lower footprint)
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface BillAnalysis {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  extractedData: {
    billType: 'electricity' | 'fuel' | 'unknown';
    units: number;        // kWh or Liters
    cost: number;         // USD
    period?: string;
  };
  carbonImpact: number;   // kgCO2
  suggestions: string[];   // AI generated reduction advice
}

export interface SustainabilityGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'shopping' | 'general';
  targetDate: string;
  progress: number; // 0 to 100
  tasks: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  createdAt: string;
  isAiGenerated: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'transport' | 'energy' | 'food' | 'shopping' | 'general';
  duration: string;
  completed: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string | null;
  ecoPoints: number;
  streak: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}
