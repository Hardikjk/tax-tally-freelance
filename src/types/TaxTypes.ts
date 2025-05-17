
export interface TaxData {
  annualIncome: number;
  state: string;
  businessType: 'sole-proprietor' | 'llc';
  deductions: number;
}

export interface USState {
  code: string;
  name: string;
  taxRate: number;
}

export interface FederalTaxBracket {
  min: number;
  rate: number;
}

export interface TaxResults {
  selfEmploymentTax: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  quarterlyPayments: number[];
  stateInfo: {
    code: string;
    name: string;
    taxRate: number;
  };
}
