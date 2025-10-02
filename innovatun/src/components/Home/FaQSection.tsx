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
        <div className="max-w-5xl mx-auto">
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
                Why can’t I just hire an ERP developer?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-left">
                Great question! Hiring a full-time senior ERP developer can
                easily cost $100,000+ per year, plus benefits. On top of that,
                you may not always have enough ERP work to keep them busy
                year-round — meaning you end up paying for unused time. With our
                ERPNext SaaS plans, you get access to an experienced team when
                you need them, at a fraction of the cost.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                What does “unlimited tasks” mean?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-left">
                It means you can submit as many ERP customization, integration,
                or update requests as you’d like. We’ll work through them one by
                one, ensuring every task is delivered with quality and
                efficiency. There are no caps on the number of requests you can
                queue.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                Who are the designers and developers?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-left">
                Our team is made up of experienced ERPNext consultants,
                developers, and UI/UX designers who have implemented ERP systems
                across multiple industries — including manufacturing, retail,
                healthcare, and services. You get direct access to specialists
                without the overhead of hiring in-house.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                How quickly can I get a task completed?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-left">
                Most small requests (like minor customizations or reports) are
                completed within 24–48 hours. Larger tasks (like module setups
                or complex integrations) may take longer, but we’ll always give
                you an estimated timeline upfront.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                What if I just need your service for a few hours?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-left">
                Our plans are monthly subscriptions designed for flexibility.
                You can pause, upgrade, or downgrade anytime. If you only need
                limited support, you can subscribe for a month, get your tasks
                done, and pause until you need us again.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                What happens after I have signed up?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-left ">
                Once you sign up, you’ll get access to our onboarding process.
                We’ll set up your ERPNext site (or connect with your existing
                system), provide you with a dedicated workspace to submit tasks,
                and introduce you to your assigned ERP specialist. From there,
                you can start submitting requests right away.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
