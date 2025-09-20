import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export default function PicingSection() {
  return (
    <div>
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              FLEXIBLE APPROACH
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Membership Levels
            </h2>
            <p className="text-gray-600">
              Choose the plan that works best for you and your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Standard Designer */}
            <Card className="p-8 bg-white border-0 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Standard Designer
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  $3,000
                  <span className="text-lg font-normal text-gray-500">/m</span>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">
                  What's included:
                </h4>
                <ul className="space-y-3">
                  {[
                    "Native ERP Development",
                    "Custom JS Functionality",
                    "Website changes or updates",
                    "Responsive Design",
                    "Unlimited Monthly tasks",
                    "Basic API Integrations",
                    "Schema Markup",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Get started
              </Button>
            </Card>

            {/* Pro Webflow Designer - Featured */}
            <Card className="p-8 bg-gray-900 text-white border-0 shadow-lg relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                MOST POPULAR
              </Badge>

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Pro ERP Designer</h3>
                <div className="text-4xl font-bold mb-1">
                  $4,500
                  <span className="text-lg font-normal text-gray-300">/mo</span>
                </div>
                <p className="text-sm text-gray-300">
                  Pause or cancel any time
                </p>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {[
                    "Native ERP Development",
                    "Figma ERP Design",
                    "Your Own Team Pro",
                    "Website changes or updates",
                    "Unlimited Monthly tasks",
                    "Advanced API Integrations",
                    "Schema Markup",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
                Get started
              </Button>
            </Card>

            {/* Enterprise Designer */}
            <Card className="p-8 bg-white border-0 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Enterprise Designer
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  +$6,000
                  <span className="text-lg font-normal text-gray-500">/m</span>
                </div>
                <p className="text-sm text-gray-500">
                  Pause or cancel any time
                </p>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">
                  What's included:
                </h4>
                <ul className="space-y-3">
                  {[
                    "Everything in Standard and Pro",
                    "Bespoke Services",
                    "Unlimited Revisions",
                    "1 request at a time",
                    "Advanced Integration and API setup",
                    "Slack Channel for priority support",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Schedule a Call
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
