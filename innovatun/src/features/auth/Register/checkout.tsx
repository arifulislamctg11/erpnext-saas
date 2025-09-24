"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";


const stripePromise: Promise<Stripe | null> = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [country, setCountry] = useState("US");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    const regData = localStorage.getItem("registrationData");
    if (regData) {
      console.log("User registered:", JSON.parse(regData));
    }
  }, []);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);

    try {
      const res = await fetch("https://backend-ten-red-40.vercel.app/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }), 
      });

      const data = await res.json();
      const clientSecret: string = data.clientSecret;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName || undefined,
            email: email || undefined,
            address: {
              country: country || undefined,
              postal_code: postalCode || undefined,
            },
          },
        },
        receipt_email: email || undefined,
      });

      if (error) {
        console.error(error);
        alert("Payment failed: " + error.message);
      } else if (paymentIntent?.status === "succeeded") {
        alert("Payment successful! ✅");
      }
    } catch (err: unknown) {
      console.error(err);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          className="w-full h-11 rounded-md border border-gray-300 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Card information</label>
        <div className="w-full rounded-md border border-gray-300 p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  '::placeholder': { color: "#9ca3af" },
                },
                invalid: { color: "#b91c1c" },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Name on card</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Name on card"
          className="w-full h-11 rounded-md border border-gray-300 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Country or region</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="h-11 rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
          </select>
          <input
            type="text"
            inputMode="numeric"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Postal code"
            className="h-11 rounded-md border border-gray-300 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-12 rounded-md bg-indigo-600 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? "Processing…" : "Pay"}
        <span aria-hidden>🔒</span>
      </button>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Checkout</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
