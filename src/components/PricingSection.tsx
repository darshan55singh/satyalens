import { motion } from "framer-motion";
import { Zap, Crown, Building2, Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    icon: Zap,
    features: ["3 scans per week", "Basic AI analysis", "Community support"],
    cta: "Current Plan",
    disabled: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    icon: Crown,
    features: ["Unlimited scans", "Priority AI analysis", "Detailed reports", "Email support"],
    cta: "Coming Soon",
    disabled: true,
    highlight: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    icon: Building2,
    features: ["Everything in Pro", "API access", "Bulk analysis", "Dedicated support", "Custom integrations"],
    cta: "Coming Soon",
    disabled: true,
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Pricing <span className="text-primary glow-text">Plans</span>
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            Start free, upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card-hover p-6 flex flex-col ${
                plan.highlight ? "border-primary/30 relative" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-wider">
                  Popular
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <plan.icon className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg font-bold text-foreground">{plan.name}</h3>
              </div>
              <div className="mb-5">
                <span className="font-display text-3xl font-black text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm font-body">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-secondary-foreground font-body">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.disabled}
                className={`w-full py-2.5 rounded-lg font-heading font-bold text-sm uppercase tracking-wider transition-all ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground opacity-50 cursor-not-allowed"
                    : "border border-border/40 text-muted-foreground cursor-not-allowed opacity-50"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
