"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/section-heading";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";

const faqs = [
  {
    question: "Is CodeVault free?",
    answer:
      "Yes. CodeVault is open source under the MIT license — you can self-host it or use the hosted version at no cost.",
  },
  {
    question: "Do I need an account to browse public snippets?",
    answer:
      "Anyone can browse and view public snippets. An account is only required to create, edit, and manage your own private snippets.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "Anything you can type. Syntax highlighting covers the popular languages out of the box, and the Monaco editor handles dozens more.",
  },
  {
    question: "Can I keep snippets private?",
    answer:
      "Every snippet defaults to private. Flip a single switch to make it public and shareable whenever you want.",
  },
  {
    question: "Is my data portable?",
    answer:
      "It is your code. You can copy any snippet to your clipboard in one click, and the source is fully open if you'd rather self-host.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you might want to know before you start vaulting code."
        />

        <motion.div
          variants={staggerContainer(0.07)}
          {...inViewProps}
          className="mt-10"
        >
          <Accordion multiple defaultValue={["0"]} className="w-full">
            {faqs.map(({ question, answer }, index) => (
              <AccordionItem
                key={question}
                value={String(index)}
                className="border-border"
              >
                <motion.div variants={fadeUp}>
                  <AccordionTrigger className="py-4 text-[0.95rem] hover:no-underline">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="leading-relaxed">{answer}</p>
                  </AccordionContent>
                </motion.div>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
