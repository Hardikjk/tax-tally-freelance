
import React, { useState } from "react";
import { motion } from "framer-motion";
import TaxForm from "@/components/TaxForm";
import TaxResults from "@/components/TaxResults";
import TaxCalculator from "@/utils/TaxCalculator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { TaxData, TaxResults as TaxResultsType } from "@/types/TaxTypes";

const Index = () => {
  const [taxResults, setTaxResults] = useState<TaxResultsType | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleCalculate = (data: TaxData) => {
    const calculator = new TaxCalculator(data);
    const results = calculator.calculateTaxes();
    setTaxResults(results);
    setFormSubmitted(true);
  };
  
  const handleReset = () => {
    setTaxResults(null);
    setFormSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Freelancer Tax Calculator</h1>
          <p className="text-lg text-gray-600">Estimate your 2025 taxes and quarterly payments</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {!formSubmitted ? (
            <TaxForm onCalculate={handleCalculate} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tax Estimate Results</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="flex items-center gap-1 text-gray-600"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
              
              {taxResults && <TaxResults results={taxResults} />}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
