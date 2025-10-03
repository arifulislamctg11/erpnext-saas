import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../contexts/use-auth";
import { api } from "../../api";

export const plans = [
    {
      slug: "free-trial",
      title: "Enterprise ERP",
      price: "Free Trial",
      priceId: "price_1SBGoXBhJuA7Ng1FK9jJt1p0",
      description:
        "For enterprises needing advanced, tailored ERP systems with white-glove support.",
      features: [
        "Everything in Starter & Pro",
        "Bespoke ERP module development",
        "Unlimited revisions & customization requests",
        "Advanced integrations (Payment gateways, Logistics, BI Tools, etc.)",
        "Cloud deployment & security hardening",
        "Dedicated ERP consultant & support team",
        "Private Slack/Teams channel for direct communication",
        "On-demand training sessions for your staff",
        "Advanced analytics & custom reports",
      ],
      note: "📌 Best for large enterprises with complex operations and global teams.",
      buttonText: "Get Start Free",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      slug: "starter-erp",
      title: "Starter ERP",
      price: "$3,000 / month",
      priceId: "price_1SBGpcBhJuA7Ng1FCNpbrJcA",
      description:
        "Perfect for small to mid-sized businesses starting their ERP journey.",
      features: [
        "Core ERP setup & configuration (HR, Accounting, Inventory, CRM)",
        "Native ERP customizations",
        "Basic website integration & updates",
        "Responsive design for portals",
        "Unlimited monthly support tasks",
        "Basic API & third-party integrations",
        "Standard reporting & dashboards",
        "Schema markup for SEO-ready websites",
      ],
      note: "📌 Best for companies implementing ERP for the first time.",
      buttonText: "Get started",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      slug: "pro-erp",
      title: "Pro ERP (Most Popular)",
      price: "$4,500 / month",
      priceId: "price_1SBGtTBhJuA7Ng1FCzYOWyDL",
      description:
        "Designed for growing businesses that need deeper customization & support.",
      features: [
        "Everything in Starter ERP",
        "Figma-driven ERP UI/UX design",
        "Custom workflows & role-based access setup",
        "Advanced API & third-party integrations",
        "Unlimited monthly tasks with faster turnaround",
        "Automated invoicing & payroll setup",
        "Industry-specific module customization (e.g. Manufacturing, Retail, Healthcare)",
        "Priority support & maintenance",
      ],
      note: "📌 Best for businesses scaling with ERP and requiring flexibility.",
      buttonText: "Get started",
      buttonStyle: "bg-white text-gray-900 hover:bg-gray-100",
      badge: "MOST POPULAR",
    },
    {
      slug: "enterprise-erp",
      title: "Enterprise ERP",
      price: "$6,000+ / month",
      priceId: "price_1SBGuBBhJuA7Ng1F77C4XZIx",
      description:
        "For enterprises needing advanced, tailored ERP systems with white-glove support.",
      features: [
        "Everything in Starter & Pro",
        "Bespoke ERP module development",
        "Unlimited revisions & customization requests",
        "Advanced integrations (Payment gateways, Logistics, BI Tools, etc.)",
        "Cloud deployment & security hardening",
        "Dedicated ERP consultant & support team",
        "Private Slack/Teams channel for direct communication",
        "On-demand training sessions for your staff",
        "Advanced analytics & custom reports",
      ],
      note: "📌 Best for large enterprises with complex operations and global teams.",
      buttonText: "Schedule a Call",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  ];

export default function PicingSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscription = async (priceId: string) => {
    if (!user) {
      navigate("/register", { state: { priceId } });
      return;
    }

    const selectedPlan = plans.find(p => p.priceId === priceId);
    if (!selectedPlan) {
      toast.error("Plan not found. Please try again.");
      return;
    }

    try {

      toast.loading(`Starting subscription for ${selectedPlan.title}...`, {
        description: `Price: ${selectedPlan.price}`,
        id: 'subscription-loading'
      });

      const res = await fetch(
       ` ${api.baseUrl}${api.createCheckoutSession}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            customerEmail: user.email,
            planName: selectedPlan.title,
            planAmount: selectedPlan.price,
            successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&plan_name=${encodeURIComponent(selectedPlan.title)}&plan_amount=${encodeURIComponent(selectedPlan.price)}`,
            cancelUrl: `${window.location.origin}/cancel`
          }),
        }
      );


      toast.dismiss('subscription-loading');

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message ||` HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (data?.url) {



        toast.success(`Redirecting to payment for ${selectedPlan.title}`, {
          description: `Price: ${selectedPlan.price}`
        });


        setTimeout(() => {
          window.location.href = data.url as string;
        }, 1000);

        return;
      }
      throw new Error("No checkout URL received from server");
    } catch (error) {
      console.error('Payment error:', error);


      toast.dismiss('subscription-loading');

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast.error("Network Error", {
            description: "Unable to connect to payment server. Please check your internet connection and try again."
          });
        } else {
          toast.error("Payment Error", {
            description: error.message || "Unable to start subscription. Please try again."
          });
        }
      } else {
        toast.error("Payment Error", {
          description: "Unable to start subscription. Please try again."
        });
      }
    }
  };

  const addOns = [
    "Dedicated server hosting & monitoring",
    "24/7 emergency support",
    "Multi-language & multi-currency setup",
    "Data migration & audit compliance services",
  ];

  return (
    <div>
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-[1450px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              FLEXIBLE APPROACH
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ERP Pricing Plans
            </h2>
            <p className="text-gray-600">
              Choose the plan that works best for you and your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 ${
                  plan.badge
                    ? "bg-gray-900  text-white shadow-lg relative"
                    : "bg-white border-0 shadow-sm hover:bg-gray-900 group hover:text-white hover:shadow-lg relative"
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    {plan.badge}
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                  <div className="text-4xl font-bold mb-1">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-500">
                      /mo
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold mb-4">What's included:</h4>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center text-sm ${
                          plan.badge
                            ? "text-gray-300"
                            : "text-gray-600 group-hover:text-white"
                        }`}
                      >
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={plan.buttonStyle}
                  onClick={() => handleSubscription(plan.priceId)}
                >
                  {plan.buttonText}
                </Button>

                <p className="text-sm mt-4 text-gray-500">{plan.note}</p>
              </Card>
            ))}
          </div>

          {/* Optional Add-ons */}
          <div className="bg-white p-6 rounded-lg shadow-sm mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ⚡ Optional Add-ons
            </h3>
            <ul className=" pl-5 text-sm text-gray-600">
              {addOns.map((addOn, index) => (
                <li key={index}>{addOn}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
 </div>
);
}