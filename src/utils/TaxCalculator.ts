
import { TaxData, TaxResults, FederalTaxBracket } from "@/types/TaxTypes";
import { US_STATES, FEDERAL_TAX_BRACKETS_2025 } from "@/utils/constants";

class TaxCalculator {
  private data: TaxData;
  private netIncome: number;

  constructor(data: TaxData) {
    this.data = data;
    this.netIncome = Math.max(0, data.annualIncome - data.deductions);
  }

  calculateSelfEmploymentTax(): number {
    // 15.3% of net earnings (12.4% Social Security + 2.9% Medicare)
    return this.netIncome * 0.153;
  }

  calculateFederalTax(): number {
    // Use 2025 tax brackets
    let brackets: FederalTaxBracket[];
    
    // Select the appropriate tax bracket based on business type
    // For simplicity, we'll use the same brackets for both (in reality, LLCs have different options)
    brackets = FEDERAL_TAX_BRACKETS_2025;

    let tax = 0;
    let remainingIncome = this.netIncome;
    
    // Self-employment tax deduction (50% of SE tax is deductible for income tax purposes)
    const seTax = this.calculateSelfEmploymentTax();
    const seDeduction = seTax * 0.5;
    remainingIncome -= seDeduction;
    
    // Standard deduction for 2025 (estimated)
    const standardDeduction = 14000;
    remainingIncome = Math.max(0, remainingIncome - standardDeduction);
    
    // Calculate tax based on brackets
    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      
      if (remainingIncome <= 0) break;
      
      if (i === brackets.length - 1) {
        // This is the highest bracket
        tax += remainingIncome * bracket.rate;
        break;
      }
      
      const nextBracket = brackets[i + 1];
      const incomeInBracket = Math.min(remainingIncome, nextBracket.min - bracket.min);
      
      tax += incomeInBracket * bracket.rate;
      remainingIncome -= incomeInBracket;
    }
    
    return tax;
  }

  calculateStateTax(): number {
    const state = US_STATES.find((s) => s.code === this.data.state);
    if (!state) return 0;
    
    // Simple calculation using flat rate
    return this.netIncome * state.taxRate;
  }

  calculateTotalTax(): number {
    const selfEmploymentTax = this.calculateSelfEmploymentTax();
    const federalTax = this.calculateFederalTax();
    const stateTax = this.calculateStateTax();
    
    return selfEmploymentTax + federalTax + stateTax;
  }

  calculateQuarterlyPayments(): number[] {
    const totalTax = this.calculateTotalTax();
    const quarterlyAmount = totalTax / 4;
    
    // Return array of 4 equal payments
    return [quarterlyAmount, quarterlyAmount, quarterlyAmount, quarterlyAmount];
  }

  calculateTaxes(): TaxResults {
    const selfEmploymentTax = this.calculateSelfEmploymentTax();
    const federalTax = this.calculateFederalTax();
    const stateTax = this.calculateStateTax();
    const totalTax = selfEmploymentTax + federalTax + stateTax;
    const quarterlyPayments = this.calculateQuarterlyPayments();
    
    const state = US_STATES.find((s) => s.code === this.data.state) || US_STATES[0];
    
    return {
      selfEmploymentTax,
      federalTax,
      stateTax,
      totalTax,
      quarterlyPayments,
      stateInfo: {
        code: state.code,
        name: state.name,
        taxRate: state.taxRate,
      },
    };
  }
}

export default TaxCalculator;
