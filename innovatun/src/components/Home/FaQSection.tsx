import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function FaQSection() {
  return (
    <div>
      <section className="px-6 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              FAQ
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                Why can't I just hire a ERP developer?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Great question! For starters, the annual cost of a full-time
                senior-level designer now exceeds $100,000, plus benefits (and
                good luck finding one available). Aside from that, you may not
                always have enough work to keep them busy at all times, so
                you're stuck paying for time you aren't able to utilize.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                What does unlimited tasks mean?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Once subscribed, you're able to add as many design requests to
                your queue as you'd like, and they will be delivered one by one.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                Who are the designers and developers?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our team consists of experienced designers and ERP developers
                who have worked with companies of all sizes, from startups to
                Fortune 500 companies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                How quick can I get a task completed?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                On average, most requests are completed in just two days or
                less. However, more complex requests can take longer.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                What if I just need your service for a amount of hours?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                No problem! You can pause your subscription when finished and
                return when you have additional design needs. There's no need to
                let the remainder of your subscription go to waste.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                What happens after I have signed up?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                After signing up, you'll receive access to your client portal
                where you can submit requests, track progress, and communicate
                with your dedicated team.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
