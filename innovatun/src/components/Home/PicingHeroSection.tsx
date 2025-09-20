import { DollarSign, Smile, Star, Users, Zap } from "lucide-react";
import { Card } from "../ui/card";

export default function PicingHeroSection() {
  return (
    <div>
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
          A smarter way to build, launch and maintain a ERP site
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-pretty">
          We're not just a digital agency – we're your partners in technological evolution. At Innovatun, we blend cutting-edge technology with creative excellence to transform businesses for the digital age.

          Our Vision
          To pioneer digital transformation across industries, making advanced technology accessible and impactful for businesses of all sizes.

          Innovation Score
          98%
          Client Satisfaction
          100%

        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-6 text-left border-0 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Totally Async
            </h3>
            <p className="text-gray-600">
              A fully dedicated team that works with you as part of your team.
            </p>
          </Card>

          <Card className="p-6 text-left border-0 shadow-sm">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Top Creatives
            </h3>
            <p className="text-gray-600">
              Inspire designs and super clean ERP builds.
            </p>
          </Card>

          <Card className="p-6 text-left border-0 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Smile className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Frictionless
            </h3>
            <p className="text-gray-600">
              We can complete tasks in Trello wherever you want.
            </p>
          </Card>

          <Card className="p-6 text-left border-0 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Adaptable Pricing
            </h3>
            <p className="text-gray-600">
              Scale up or down as your site need. Pause whenever you need.
            </p>
          </Card>
        </div>

        {/* Testimonial */}
        <Card className="p-6 bg-gray-50 border-0 max-w-md mx-auto mb-16">
          <div className="flex justify-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-gray-700 mb-4 text-sm">
            "We’re extremely happy with this ERP SaaS team and highly recommend them. The solution is top-notch, and they deliver builds in a way that makes it simple for us to update and maintain everything on our own"
          </p>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">Anna Doe</p>
            <p className="text-xs text-gray-500">Head of Marketing & Growth</p>
            <p className="text-xs text-blue-600 font-medium">forum</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
