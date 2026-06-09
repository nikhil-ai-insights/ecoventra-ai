/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { 
  CheckCircle, ShieldCheck, Car, HelpCircle, AlertCircle, ShoppingBag, 
  Bike, Plane, Zap, Snowflake, UtensilsCrossed, Calendar, Leaf 
} from 'lucide-react';

interface CalculatorFormProps {
  onSuccess: () => void;
}

export default function CalculatorForm({ onSuccess }: CalculatorFormProps) {
  const { addCalculation } = useApp();
  
  // Step manager
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form states
  const [carDistance, setCarDistance] = useState("80");
  const [bikeDistance, setBikeDistance] = useState("20");
  const [publicTransit, setPublicTransit] = useState("40");
  const [flights, setFlights] = useState("2");

  const [electricity, setElectricity] = useState("220");
  const [acUsage, setACUsage] = useState("4");
  const [appliances, setAppliances] = useState<string[]>(["fridge"]);

  const [dietType, setDietType] = useState<'vegan' | 'vegetarian' | 'non-veg'>("vegetarian");

  const [onlinePurchases, setOnlinePurchases] = useState("5");
  const [clothingPurchases, setClothingPurchases] = useState("2");

  const toggleAppliance = (name: string) => {
    if (appliances.includes(name)) {
      setAppliances(appliances.filter(a => a !== name));
    } else {
      setAppliances([...appliances, name]);
    }
  };

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mathematically computed carbon footprint details in kgCO2 per month
    const carNum = parseFloat(carDistance) || 0;
    const bikeNum = parseFloat(bikeDistance) || 0;
    const transitNum = parseFloat(publicTransit) || 0;
    const flightsNum = parseFloat(flights) || 0;

    const electNum = parseFloat(electricity) || 0;
    const acNum = parseFloat(acUsage) || 0;

    const onlineNum = parseFloat(onlinePurchases) || 0;
    const clothesNum = parseFloat(clothingPurchases) || 0;

    // Fuel multipliers (Typical averages)
    // Car regular ICE: 0.22 kgCO2/km
    // Public Transit (Bus/Train/Subway): 0.06 kgCO2/km
    // Flights: 1 hour flight outputs ~100 kgCO2 overall (apportioned: 100 * flights / 12 months)
    const transportVal = (carNum * 0.22 * 4.3) + (transitNum * 0.06 * 4.3) + ((flightsNum * 100) / 12);

    // Energy: typical grid factor 0.38 kgCO2 per kWh
    // AC is highly intensive, estimated 1.2 kW * hours * 30 days * 0.38
    const energyVal = (electNum * 0.38) + (acNum * 1.2 * 30 * 0.38) + (appliances.length * 8);

    // Diet multiplier: vegan (45 kgCO2/mo), veggie (110 kgCO2/mo), omnivore (Non-Veg) (210 kgCO2/mo)
    let foodVal = 110;
    if (dietType === 'vegan') foodVal = 45;
    if (dietType === 'non-veg') foodVal = 210;

    // Consumption: Online items avg 5 kgCO2 each, standard fashion items 17 kgCO2 each
    const shoppingVal = (onlineNum * 5) + (clothesNum * 17);

    // Cumulative parameters
    const finalTotalEmissions = Math.round(transportVal + energyVal + foodVal + shoppingVal);
    const finalAnnualTotal = parseFloat(((finalTotalEmissions * 12) / 1000).toFixed(2));

    // Platform Carbon Score: Higher is better. Benchmark comparison. 
    // Max baseline benchmark: 1200kgCO2/month
    const score = Math.max(10, Math.min(100, Math.round(100 * (1 - (finalTotalEmissions / 1200)))));

    await addCalculation({
      categoryBreakdown: {
        transport: Math.round(transportVal),
        energy: Math.round(energyVal),
        food: Math.round(foodVal),
        shopping: Math.round(shoppingVal)
      },
      inputs: {
        carDistance: carNum,
        bikeDistance: bikeNum,
        publicTransit: transitNum,
        flights: flightsNum,
        electricity: electNum,
        acUsage: acNum,
        appliances,
        dietType,
        onlinePurchases: onlineNum,
        clothingPurchases: clothesNum
      },
      totalEmissions: finalTotalEmissions,
      annualForecast: finalAnnualTotal,
      carbonScore: score
    });

    onSuccess();
  };

  const stepsDetails = [
    { title: "Transportation Log", desc: "Vehicles, commute habits, and travel frequencies" },
    { title: "Household Energy Scope", desc: "Electricity, smart utility metrics and thermal grids" },
    { title: "Planetary Diet Choice", desc: "Nutrition inputs and meat consumption structures" },
    { title: "Consumption Audit", desc: "Online shipping volumes and fast-fashion clothing purchases" }
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-250/50 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xl animate-fade-in">
      
      {/* Dynamic progression headers */}
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono text-emerald-500 font-bold">Step {step} of 4</span>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
            {stepsDetails[step - 1].title}
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-450">{stepsDetails[step - 1].desc}</p>
        </div>
        
        {/* Step dots */}
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-emerald-500' : i < step ? 'w-2.5 bg-emerald-500/40' : 'w-2.5 bg-slate-200 dark:bg-slate-850'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Step 1: Logistics / Transport */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Car className="h-4 w-4 mr-1.5 text-slate-400" />
                  Car Driving (km / week)
                </label>
                <input 
                  type="number" 
                  value={carDistance} 
                  onChange={(e) => setCarDistance(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 100"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Bike className="h-4 w-4 mr-1.5 text-slate-400" />
                  Cycling / Running (km / week)
                </label>
                <input 
                  type="number" 
                  value={bikeDistance} 
                  onChange={(e) => setBikeDistance(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 15"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Car className="h-4 w-4 mr-1.5 text-slate-400" />
                  Public Transit - Metro / Bus / Subway (km / week)
                </label>
                <input 
                  type="number" 
                  value={publicTransit} 
                  onChange={(e) => setPublicTransit(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Plane className="h-4 w-4 mr-1.5 text-slate-400" />
                  Aviation / Flight Travel (hours / year)
                </label>
                <input 
                  type="number" 
                  value={flights} 
                  onChange={(e) => setFlights(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 6"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-start space-x-2.5">
              <Leaf className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-xs">
                <strong>Eco Tip:</strong> Choosing public transportation, subway systems, or rail links over classic single-occupancy SUVs helps reduce logistics-related footprint counts by up to 70%!
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Household Utilities */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Zap className="h-4 w-4 mr-1.5 text-slate-350" />
                  Electricity Consumption (kWh / month)
                </label>
                <input 
                  type="number" 
                  value={electricity} 
                  onChange={(e) => setElectricity(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <Snowflake className="h-4 w-4 mr-1.5 text-slate-350" />
                  Air-conditioning active (hours / day)
                </label>
                <input 
                  type="number" 
                  value={acUsage} 
                  onChange={(e) => setACUsage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 5"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Active High-Wattage Equipment
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "dryer", name: "Clothes Dryer" },
                  { id: "water_heater", name: "Water Heater" },
                  { id: "dishwasher", name: "Dishwasher" },
                  { id: "fridge", name: "Refrigerator" },
                  { id: "electric_stove", name: "Electric Stove" },
                  { id: "ev_charger", name: "EV Fast Charger" }
                ].map((item) => {
                  const isSelected = appliances.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleAppliance(item.id)}
                      className={`px-4 py-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' 
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Diet / Food habits */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Primary Diet Selection (Dietary Carbon Impact factor)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'vegan',
                    title: 'Pure Vegan',
                    desc: 'Plant-only nutrition. Negligible methane or packaging impacts.',
                    impact: '45 kgCO2/month',
                    color: 'from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500'
                  },
                  {
                    id: 'vegetarian',
                    title: 'Vegetarian',
                    desc: 'No meats, but includes dairy products and eggs.',
                    impact: '110 kgCO2/month',
                    color: 'from-cyan-500/10 to-teal-500/5 hover:border-teal-500'
                  },
                  {
                    id: 'non-veg',
                    title: 'Regular Omnivore',
                    desc: 'Regular consumption of poultry, meats, and seafood.',
                    impact: '210 kgCO2/month',
                    color: 'from-amber-500/10 to-red-500/5 hover:border-amber-500'
                  }
                ].map((item) => {
                  const isSelected = dietType === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setDietType(item.id as any)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-44 bg-gradient-to-b transition-all ${
                        isSelected 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                          : 'border-slate-200 dark:border-slate-850'
                      } ${item.color}`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">{item.title}</h4>
                          <UtensilsCrossed className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {item.impact}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Shopping, Fashion & Consumption */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1.5 text-slate-350" />
                  Online deliveries (purchases / month)
                </label>
                <input 
                  type="number" 
                  value={onlinePurchases} 
                  onChange={(e) => setOnlinePurchases(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 4"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1.5 text-slate-350" />
                  Clothing acquisitions (items / month)
                </label>
                <input 
                  type="number" 
                  value={clothingPurchases} 
                  onChange={(e) => setClothingPurchases(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 1"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs flex items-start space-x-2.5">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p>
                <strong>Audit note:</strong> Global fast-fashion logistics contribute to vast amounts of carbon and water usage. Lowering clothes shopping counts directly minimizes scope-3 carbon pollution.
              </p>
            </div>
          </div>
        )}

        {/* Buttons navigation */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 1}
            className="px-5 py-2.5 border border-slate-250 dark:border-slate-850 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-955 text-slate-450 dark:text-slate-400 disabled:opacity-40 transition-colors"
            id="calc_prev_button"
          >
            Back
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-slate-900 border border-transparent hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-xl font-bold text-sm text-white shadow-lg shadow-emerald-500/5 transition-all"
              id="calc_next_button"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-955 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all"
              id="calc_submit_button"
            >
              Save & Calculate
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
