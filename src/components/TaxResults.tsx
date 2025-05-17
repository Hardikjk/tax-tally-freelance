
import React from "react";
import { motion } from "framer-motion";
import { TaxResults as TaxResultsType } from "@/types/TaxTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";

interface TaxResultsProps {
  results: TaxResultsType;
}

const TaxResults: React.FC<TaxResultsProps> = ({ results }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <TaxCard
          title="Self-Employment Tax"
          amount={results.selfEmploymentTax}
          description="15.3% of net earnings"
          variants={item}
        />
        <TaxCard
          title="Federal Income Tax"
          amount={results.federalTax}
          description="Based on 2025 tax brackets"
          variants={item}
        />
        <TaxCard
          title="State Income Tax"
          amount={results.stateTax}
          description={`Based on ${results.stateInfo.name} tax rate`}
          variants={item}
        />
        <TaxCard
          title="Total Annual Tax"
          amount={results.totalTax}
          description="Combined tax liability"
          variants={item}
          highlight
        />
      </motion.div>

      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="bg-blue-50 rounded-lg p-6 border border-blue-100"
      >
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Quarterly Tax Payments</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.quarterlyPayments.map((payment, index) => (
            <div key={index} className="text-center">
              <p className="text-sm text-blue-700">Q{index + 1} Payment</p>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(payment)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Tax Card Component for individual tax items
const TaxCard = ({ title, amount, description, variants, highlight = false }) => (
  <motion.div variants={variants}>
    <Card className={highlight ? "bg-blue-50 border-blue-200" : ""}>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <p className={`text-2xl font-bold mt-1 ${highlight ? "text-blue-700" : "text-gray-900"}`}>
          {formatCurrency(amount)}
        </p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default TaxResults;
