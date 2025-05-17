
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TaxData } from "@/types/TaxTypes";
import { US_STATES } from "@/utils/constants";

const formSchema = z.object({
  annualIncome: z.coerce.number().min(1, "Income must be at least $1").max(10000000, "Income must be realistic"),
  state: z.string().min(1, "Please select a state"),
  businessType: z.enum(["sole-proprietor", "llc"], { required_error: "Please select a business type" }),
  deductions: z.coerce.number().min(0, "Deductions cannot be negative").default(0),
});

interface TaxFormProps {
  onCalculate: (data: TaxData) => void;
}

const TaxForm: React.FC<TaxFormProps> = ({ onCalculate }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualIncome: 0,
      state: "CA",
      businessType: "sole-proprietor",
      deductions: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onCalculate(values as TaxData);
  };

  return (
    <div className="p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="annualIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">Annual Income (USD)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input placeholder="0" className="pl-7 text-lg h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">US State</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-lg h-12">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-medium">Business Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-x-6 sm:space-y-0"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="sole-proprietor" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Sole Proprietor</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="llc" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">LLC</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deductions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">Estimated Deductions (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input placeholder="0" className="pl-7 text-lg h-12" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 transition-colors">
            Calculate Taxes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TaxForm;
