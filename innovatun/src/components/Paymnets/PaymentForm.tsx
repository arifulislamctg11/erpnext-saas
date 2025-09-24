"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CreditCard, HelpCircle, ChevronDown } from "lucide-react";

const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "google-pay", "affirm", "cash-app"]),
  cardNumber: z
    .string()
    .min(19, "Card number is required")
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Invalid card number format"),
  expiration: z
    .string()
    .min(5, "Expiration date is required")
    .regex(/^\d{2} \/ \d{2}$/, "Invalid expiration format"),
  cvc: z.string().min(3, "CVC is required").max(4, "CVC must be 3-4 digits"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(5, "ZIP code is required"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function PaymentForm() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "card" | "google-pay" | "affirm" | "cash-app"
  >("card");

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "1234 1234 1234 1234",
      expiration: "",
      cvc: "",
      country: "United States",
      zip: "12345",
    },
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiration = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)} / ${v.substring(2, 4)}`;
    }
    return v;
  };

  const onSubmit = (data: PaymentFormData) => {
    console.log("Payment form submitted:", data);
  };

  return (
    <Card className="w-full max-w-[500px] mx-auto bg-white shadow-2xl">
      <CardContent className="p-6">
        {/* Amount Display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-2">$98.76</div>
          <div className="text-sm text-gray-600">
            $0.00 of $98.76 will remain after this payment:{" "}
            <span className="text-orange-500 font-medium">Michael</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Payment Method Selection */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant={
                  selectedPaymentMethod === "card" ? "default" : "outline"
                }
                className={`h-16 flex flex-col items-center justify-center gap-1 ${
                  selectedPaymentMethod === "card"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedPaymentMethod("card")}
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-xs font-medium">Card</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1 bg-white border-gray-200 text-gray-700"
                onClick={() => setSelectedPaymentMethod("google-pay")}
              >
                <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                  G Pay
                </div>
                <span className="text-xs">Google Pay</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1 bg-white border-gray-200 text-gray-700"
                onClick={() => setSelectedPaymentMethod("affirm")}
              >
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">a</span>
                </div>
                <span className="text-xs">Affirm</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1 bg-white border-gray-200 text-gray-700"
                onClick={() => setSelectedPaymentMethod("cash-app")}
              >
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <span className="text-xs">Cash App Pay</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {selectedPaymentMethod === "card" && (
              <>
                {/* Card Number */}
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Card number
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="1234 1234 1234 1234"
                            className="pr-20"
                            onChange={(e) => {
                              const formatted = formatCardNumber(
                                e.target.value
                              );
                              field.onChange(formatted);
                            }}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              V
                            </div>
                            <div className="w-6 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center">
                              ●●
                            </div>
                            <div className="w-6 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                              AE
                            </div>
                            <div className="w-6 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">
                              DC
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expiration and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Expiration
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="MM / YY"
                            onChange={(e) => {
                              const formatted = formatExpiration(
                                e.target.value
                              );
                              field.onChange(formatted);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          CVC
                          <HelpCircle className="h-3 w-3 text-gray-400" />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="CVC" maxLength={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Country and ZIP */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Country
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="United States">
                              United States
                            </SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United Kingdom">
                              United Kingdom
                            </SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          ZIP
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="12345" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4 cursor-pointer"
              disabled={!form.formState.isValid} // Disable the button if the form is not valid
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
