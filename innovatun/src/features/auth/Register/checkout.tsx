// import { useEffect, useMemo, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import type { Stripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { toast } from "sonner";
// // import { api } from "../../../api/index";


// const stripePromise: Promise<Stripe | null> = loadStripe(
//   import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
// );

// type CheckoutFormProps = {
//   planTitle: string;
//   amountCents: number;
// };

// const CheckoutForm: React.FC<CheckoutFormProps> = ({ planTitle, amountCents }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [cardholderName, setCardholderName] = useState("");
//   const [country, setCountry] = useState("US");
//   const [postalCode, setPostalCode] = useState("");
//   const postalDigitsByCountry: Record<string, number> = {
//     US: 5,
//     IN: 6,
//     AU: 4,
//     GB: 6,
//     CA: 6,
//   };
//   const requiredPostalDigits = postalDigitsByCountry[country] || 6;

//   useEffect(() => {
//     const regData = localStorage.getItem("registrationData");
//     if (regData) {
//       console.log("User registered:", JSON.parse(regData));
//     }
//   }, []);

//   const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) return;

//     setLoading(true);

//     try {
//       const res = await fetch("https://backend-ten-red-40.vercel.app/create-payment-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: amountCents }), 
//       });

//       const data = await res.json();
//       const clientSecret: string = data.clientSecret;

//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: cardElement,
//           billing_details: {
//             name: cardholderName || undefined,
//             email: email || undefined,
//             address: {
//               country: country || undefined,
//               postal_code: postalCode || undefined,
//             },
//           },
//         },
//         receipt_email: email || undefined,
//       });

//       if (error) {
//         console.error(error);
//         toast.error(`Payment failed: ${error.message}`);
//       } else if (paymentIntent?.status === "succeeded") {
//         toast.success(`Payment successful! ✅ Plan: ${planTitle}`);
//       }
//     } catch (err: unknown) {
//       console.error(err);
//       toast.error("Payment error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handlePayment} className="space-y-6">
//       <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
//         <div className="text-xs tracking-wide text-gray-500 uppercase">Selected plan</div>
//         <div className="mt-1.5 font-semibold text-gray-900">{planTitle}</div>
//       </div>
//       <div className="space-y-2">
//         <label className="text-left block text-sm font-medium text-gray-800">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//           className="w-full h-11 rounded-lg border border-gray-300 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="text-left block text-sm font-medium text-gray-800">Card information</label>
//         <div className="w-full rounded-lg border border-gray-300 p-3">
//           <CardElement
//             options={{
//               style: {
//                 base: {
//                   fontSize: "16px",
//                   color: "#1f2937",
//                   '::placeholder': { color: "#9ca3af" },
//                 },
//                 invalid: { color: "#b91c1c" },
//               },
//               hidePostalCode: true,
//             }}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <label className="text-left block text-sm font-medium text-gray-800">Name on card</label>
//         <input
//           type="text"
//           value={cardholderName}
//           onChange={(e) => setCardholderName(e.target.value)}
//           placeholder="Name on card"
//           className="w-full h-11 rounded-lg border border-gray-300 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="text-left block text-sm font-medium text-gray-800">Country or region</label>
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//           <select
//             value={country}
//             onChange={(e) => setCountry(e.target.value)}
//             className="h-11 rounded-lg border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//           >
//             <option value="US">United States</option>
//             <option value="CA">Canada</option>
//             <option value="GB">United Kingdom</option>
//             <option value="AU">Australia</option>
//             <option value="IN">India</option>
//           </select>
//           <input
//             type="text"
//             inputMode="numeric"
//             value={postalCode}
//             onChange={(e) =>
//               setPostalCode(
//                 e.target.value.replace(/\D/g, "").slice(0, requiredPostalDigits)
//               )
//             }
//             placeholder={"".padEnd(requiredPostalDigits, "0")}
//             className="h-11 rounded-lg border border-gray-300 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//           />
//           <p className="text-xs text-gray-500 sm:col-span-2">Enter {requiredPostalDigits}-digit postal code</p>
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={!stripe || loading}
//         className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-100 disabled:cursor-not-allowed transition-colors text-white font-medium flex items-center justify-center gap-2"
//       >
//         {loading ? "Processing…" : "Pay now"}
//         <span aria-hidden>🔒</span>
//       </button>
//     </form>
//   );
// };

// const CheckoutPage: React.FC = () => {
//   const [selectedPlan, setSelectedPlan] = useState<"starter" | "professional">("starter");
//   const location = useLocation();
//   const planFromPricing = useMemo(() => {
//     const qs = new URLSearchParams(location.search);
//     return qs.get("plan") || "";
//   }, [location.search]);
  
//   const priceIdFromUrl = useMemo(() => {
//     const qs = new URLSearchParams(location.search);
//     return qs.get("priceId") || "";
//   }, [location.search]);

//   const plans: Record<string, { title: string; priceDisplay: string; amountCents: number; subText: string; illustration: string }> = {
//     starter: { title: "Starter", priceDisplay: "$12", amountCents: 1200, subText: "per month", illustration: "🎯" },
//     professional: { title: "Professional", priceDisplay: "$18", amountCents: 1800, subText: "per month", illustration: "🚀" },
//   };
//   useEffect(() => {
//     // Map incoming plan titles from pricing to our keys
//     const mapping: Record<string, "starter" | "professional"> = {
//       "Starter ERP": "starter",
//       "Pro ERP (Most Popular)": "professional",
//       "Enterprise ERP": "professional",
//     };
//     const mapped = mapping[planFromPricing];
//     if (mapped) setSelectedPlan(mapped);
//   }, [planFromPricing]);

//   const plan = plans[selectedPlan];
//   // const showSelector = planFromPricing === ""; // selector hidden in this design
//   const slugMap: Record<string, { title: string; priceDisplay: string; amountCents: number; subText: string }> = {
//     "free-trial": { title: "Enterprise ERP", priceDisplay: "Free Trial", amountCents: 0, subText: "per month" },
//     "starter-erp": { title: "Starter ERP", priceDisplay: "$3,000", amountCents: 300000, subText: "per month" },
//     "pro-erp": { title: "Pro ERP (Most Popular)", priceDisplay: "$4,500", amountCents: 450000, subText: "per month" },
//     "enterprise-erp": { title: "Enterprise ERP", priceDisplay: "$6,000+", amountCents: 600000, subText: "per month" },
//   };
  
//   const priceIdMap: Record<string, { title: string; priceDisplay: string; amountCents: number; subText: string }> = {
//     "price_1SBGoXBhJuA7Ng1FK9jJt1p0": { title: "Enterprise ERP", priceDisplay: "Free Trial", amountCents: 0, subText: "per month" },
//     "price_1SBGpcBhJuA7Ng1FCNpbrJcA": { title: "Starter ERP", priceDisplay: "$3,000", amountCents: 300000, subText: "per month" },
//     "price_1SBGtTBhJuA7Ng1FCzYOWyDL": { title: "Pro ERP (Most Popular)", priceDisplay: "$4,500", amountCents: 450000, subText: "per month" },
//     "price_1SBGuBBhJuA7Ng1F77C4XZIx": { title: "Enterprise ERP", priceDisplay: "$6,000+", amountCents: 600000, subText: "per month" },
//   };
//   const slugInfo = slugMap[planFromPricing];
//   const priceIdInfo = priceIdMap[priceIdFromUrl];
//   const planInfo = priceIdInfo || slugInfo;
//   const amountCentsForCheckout = planInfo ? planInfo.amountCents : plan.amountCents;
//   const displayTitle = planInfo ? planInfo.title : (planFromPricing || plan.title);
//   // const priceDisplay = planInfo ? planInfo.priceDisplay : plan.priceDisplay;
//   // const subTextDisplay = planInfo ? planInfo.subText : plans[selectedPlan].subText;
//   const priceNumber = Math.max(0, Math.round(amountCentsForCheckout) / 100);
//   const tax = +(priceNumber * 0.1).toFixed(2);
//   const total = +(priceNumber + tax).toFixed(2);
//   const includedFeatures: string[] = [
//     "Unlimited projects",
//     "Advanced analytics",
//     "Priority support",
//     "Custom integrations",
//     "Team collaboration",
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center py-8">
//           <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
//             <span className="text-white text-sm font-medium">Secure Checkout</span>
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Complete Your Subscription</h1>
//           <p className="text-blue-200">Join thousands of satisfied customers</p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left: Plan details */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-white">Your Plan</h2>
//               <div className="flex items-center space-x-1">
//                 <span className="text-yellow-400 font-medium">Popular</span>
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h3 className="text-2xl font-bold text-white">{displayTitle}</h3>
//                   <p className="text-purple-100">Perfect for growing businesses</p>
//                 </div>
//                 <span className="text-yellow-300">⚡</span>
//               </div>
//               <div className="flex items-baseline">
//                 <span className="text-4xl font-bold text-white">${priceNumber}</span>
//                 <span className="text-purple-200 ml-2">/month</span>
//               </div>
//             </div>

//             <div className="space-y-3 mb-6">
//               <h4 className="text-lg font-semibold text-white">What's included:</h4>
//               {includedFeatures.map((feature, index) => (
//                 <div key={index} className="flex items-center space-x-3">
//                   <span className="text-green-400">✔</span>
//                   <span className="text-blue-100">{feature}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//               <h4 className="text-lg font-semibold text-white mb-3">Order Summary</h4>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-blue-100">
//                   <span>{displayTitle} (monthly)</span>
//                   <span>${priceNumber.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-blue-100">
//                   <span>Tax</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="border-t border-white/20 pt-2 mt-2">
//                   <div className="flex justify-between text-white font-bold text-lg">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right: Payment form */}
//           <div className="bg-white rounded-2xl p-8 shadow-2xl">
//             <div className="flex items-center space-x-2 mb-6">
//               <span className="text-green-600">🔒</span>
//               <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
//             </div>

//             <div className="space-y-6">
//               {/* <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button type="button" className="p-4 rounded-lg border-2 border-purple-500 bg-purple-50">
//                     <span className="text-sm font-medium">Card</span>
//                   </button>
//                   <button type="button" className="p-4 rounded-lg border-2 border-gray-200 text-gray-400" disabled>
//                     <span className="text-sm font-medium">PayPal</span>
//                   </button>
//                 </div>
//               </div> */}

//               {/* Selected plan box is already shown on the left summary; removing duplicate here */}

//               <Elements stripe={stripePromise}>
//                 <CheckoutForm planTitle={displayTitle} amountCents={amountCentsForCheckout} />
//               </Elements>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
