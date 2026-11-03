"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/site/section-heading";
import {
  easeOutExpo,
  fadeUp,
  staggerContainer,
  inViewProps,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-[84px] sm:py-[120px]">
      <div className="wrap">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="accent-serif">answered</span>
            </>
          }
          description="Everything you might want to know before you start vaulting code."
        />

        <motion.div
          variants={staggerContainer(0.06)}
          {...inViewProps}
          className="mx-auto mt-10 max-w-[760px] border-t border-line"
        >
          {faqs.map(({ question, answer }, index) => {
            const open = openIndex === index;

            return (
              <motion.div
                key={question}
                variants={fadeUp}
                className="group border-b border-line"
              >
                <h3>
                  <button
                    type="button"
                    id={`faq-question-${index}`}
                    aria-expanded={open}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left text-[19px] font-semibold tracking-[-0.02em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                      open ? "text-foreground" : "text-foreground/85 hover:text-foreground",
                    )}
                  >
                    <span>{question}</span>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ duration: 0.32, ease: easeOutExpo }}
                      className={cn(
                        "flex-none text-[26px] font-normal leading-none transition-colors duration-200",
                        open ? "text-foreground" : "text-soft",
                      )}
                    >
                      +
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.38, ease: easeOutExpo },
                        opacity: { duration: 0.24, ease: easeOutExpo },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[640px] pb-6 pr-8 text-[16.5px] leading-relaxed text-soft">
                        {answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
