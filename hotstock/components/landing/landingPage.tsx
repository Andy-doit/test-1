"use client";

import React from "react";
import { HeroSection } from "./heroSection";
import { ServicesSection } from "./servicesSection";
import { NewsCarouselSection } from "./newsCarouselSection";
import { TeamSection } from "./teamSection";
import { PricingSection } from "./pricingSection";
import { FAQSection } from "./fAQSection";
import { ContactFormSection } from "./contactFormSection";

export function LandingPage() {
  return (
    <section className="relative py-25 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-10">
        <HeroSection />
        <ServicesSection />
        <NewsCarouselSection />
        <TeamSection />
        <PricingSection />
        <FAQSection />
        <ContactFormSection />
      </div>
      <style jsx global>{`
        .animate-float { animation: mf 8s ease-in-out infinite; }
        .animate-drift { animation: md 9s ease-in-out infinite; }
        @keyframes mf { 0% { transform: translate(0,0) } 50% { transform: translate(14px,-16px) } 100% { transform: translate(0,0) } }
        @keyframes md { 0% { transform: translate(0,0) } 50% { transform: translate(-16px,12px) } 100% { transform: translate(0,0) } }
        @keyframes pulse { 
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes orb-glow {
          0%, 100% { opacity: 0.4; transform: rotate(0deg); }
          50% { opacity: 0.7; transform: rotate(180deg); }
        }
        .animate-orb-glow { animation: orb-glow 8s ease-in-out infinite; }
        .animated-border { animation: spinGradient 12s linear infinite; }
        @keyframes spinGradient {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .animate-marquee { animation: marquee 28s linear infinite; }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .timeline-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .timeline-layer {
          --line-offset: clamp(22px, 2.8vw, 34px);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          padding-left: calc(var(--line-offset) + clamp(18px, 2.5vw, 36px));
          margin-left: clamp(0px, 1.2vw, 28px);
        }
        .timeline-layer:first-child {
          margin-left: 0;
        }
        .timeline-layer--heading {
          --line-offset: clamp(26px, 3vw, 40px);
          margin-left: 0;
          gap: 1.3rem;
        }
        .timeline-layer--heading::before {
          top: 2px;
          bottom: -0.5rem;
        }
        .timeline-layer--heading::after {
          top: -8px;
          width: 12px;
          height: 12px;
        }
        .timeline-layer::before {
          content: "";
          position: absolute;
          top: 10px;
          bottom: 0;
          left: var(--line-offset);
          width: 2px;
          background: linear-gradient(180deg, rgba(196,153,255,0.95), rgba(196,153,255,0.15));
        }
        .timeline-layer::after {
          content: "";
          position: absolute;
          top: 0;
          left: calc(var(--line-offset) - 5px);
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #C499FF;
          box-shadow: 0 0 10px rgba(196,153,255,0.9);
        }
        .timeline-layer > .timeline-layer {
          margin-top: 0.5rem;
        }
        .timeline-layer--stats {
          --line-offset: clamp(18px, 2.4vw, 28px);
          gap: 1.75rem;
          padding-left: calc(var(--line-offset) + clamp(16px, 2vw, 28px));
        }
        .timeline-layer--stats::after {
          display: none;
        }
        .timeline-layer--stats::before {
          background: linear-gradient(180deg, rgba(196,153,255,0.6), rgba(196,153,255,0));
        }
        .timeline-text {
          color: #000000;
          font-size: clamp(1.05rem, 1.8vw, 1.35rem);
          line-height: 1.72;
          font-weight: 400;
        }
        :global(.dark) .timeline-text {
          color: #f4f4ff !important;
        }
        .timeline-heading-text {
          font-size: clamp(1.5rem, 2.6vw, 2.3rem);
          line-height: 1.58;
          font-weight: 700;
          color: #000000;
        }
        :global(.dark) .timeline-heading-text {
          color: #f8f8ff;
        }
        .timeline-metric-card {
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 26px;
          padding: 1.75rem 1.25rem;
          text-align: center;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 10px 30px rgba(15,23,42,0.08);
        }
        :global(.dark) .timeline-metric-card {
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(12,12,12,0.75);
          box-shadow: none;
        }
        .timeline-metric-number {
          font-size: clamp(2rem, 2.8vw, 2.8rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.4rem;
        }
        :global(.dark) .timeline-metric-number {
          color: white;
        }
        .timeline-metric-label {
          color: rgba(15,23,42,0.65);
          font-size: 0.95rem;
        }
        :global(.dark) .timeline-metric-label {
          color: rgba(255,255,255,0.8);
        }
        .timeline-metric-icon {
          width: 44px;
          height: 44px;
          margin: 0 auto 0.75rem;
          padding: 10px;
          border-radius: 999px;
          background: #ede9fe;
          color: #5b21b6;
          box-shadow: 0 5px 18px rgba(91,33,182,0.15);
        }
        :global(.dark) .timeline-metric-icon {
          background: rgba(255,255,255,0.08);
          color: #dcd7ff;
          box-shadow: none;
        }
        .timeline-quality-card {
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 26px;
          padding: 1.6rem 1.4rem;
          text-align: center;
          color: #0f172a;
          background: rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 30px rgba(15,23,42,0.08);
        }
        :global(.dark) .timeline-quality-card {
          border: 1px solid rgba(255,255,255,0.22);
          color: white;
          background: rgba(8,8,8,0.75);
          box-shadow: none;
        }
        .timeline-quality-icon {
          display: inline-flex;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 10px 30px rgba(79,70,229,0.35);
          align-items: center;
          justify-content: center;
        }
        :global(.dark) .timeline-quality-icon {
          background: rgba(255,255,255,0.12);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .timeline-quality-icon-inner {
          width: 26px;
          height: 26px;
          color: #5b21b6;
        }
        :global(.dark) .timeline-quality-icon-inner {
          color: #e8ddff;
        }
        .timeline-quality-title {
          font-weight: 600;
          font-size: 1rem;
          color: #0f172a;
        }
        :global(.dark) .timeline-quality-title {
          color: white !important;
        }
        .timeline-quality-desc {
          font-size: 0.9rem;
          color: rgba(15,23,42,0.65);
          line-height: 1.55;
        }
        :global(.dark) .timeline-quality-desc {
          color: rgba(255,255,255,0.75) !important;
        }
        .animate-faqIn { animation: faqIn .35s ease-out; }
        @keyframes faqIn {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
