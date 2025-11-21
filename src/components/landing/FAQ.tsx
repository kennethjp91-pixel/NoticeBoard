"use client";


import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
    {
        question: "Is this really anonymous?",
        answer: "Yes. We don't display your name or profile picture. We only show a rough location approximation (e.g. 'Near Soi 24'). However, we do require a login to prevent spam and abuse."
    },
    {
        question: "How do you prevent abuse?",
        answer: "We have community reporting tools and automated filters. Repeated violations lead to account suspension. Since accounts are verified (via email/phone), banning is effective."
    },
    {
        question: "What happens if I move city?",
        answer: "Your 'home' location updates when you use the app in a new place. You'll see notices relevant to where you are right now."
    },
    {
        question: "How do private replies work?",
        answer: "Pro users can send a private message to a notice author. The system relays it without revealing either party's email address."
    }
];

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-ink/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-muted-blue"
            >
                {question}
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-200 ease-in-out",
                    isOpen ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"
                )}
            >
                <p className="text-sm text-ink/70">{answer}</p>
            </div>
        </div>
    );
}

export function FAQ() {
    return (
        <section className="py-20 bg-white/50">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                <h2 className="text-3xl font-bold font-marker mb-8 text-center">Common Questions</h2>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-ink/5">
                    {FAQS.map((faq, i) => (
                        <FAQItem key={i} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}
