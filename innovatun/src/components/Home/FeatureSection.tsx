import { CheckCircle, Clock } from "lucide-react";

export default function FeatureSection() {
  return (
    <div>
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center max-w-4xl">
          <p className="text-sm text-muted-foreground mb-2">
            THE ERP TEAM YOU NEED
          </p>
          <h2 className="text-4xl font-bold mb-16 text-balance">
            An ERP subscription
            <br />
            to help you scale
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                {/* <Users className="h-6 w-6 text-purple-600" /> */}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Three Plans Available
              </h3>
              <p className="text-muted-foreground text-sm">
                We have a suitable plan for your plan and Pro plan.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">48h Turn Around</h3>
              <p className="text-muted-foreground text-sm">
                Receive ERP updates, pages, and more within 48hrs average.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Satisfaction</h3>
              <p className="text-muted-foreground text-sm">
                We'll revise the designs until you're 100% satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
