import { motion } from "framer-motion";
import { ScanEye } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-24 pb-12 px-4">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
            <ScanEye className="w-4 h-4 text-primary" />
            <span className="text-xs font-heading font-semibold text-primary uppercase tracking-wider">
              AI-Powered Image Forensics
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            <span className="text-foreground">Detect </span>
            <span className="text-primary glow-text">AI-Generated</span>
            <br />
            <span className="text-foreground">Images Instantly</span>
          </h1>
          <p className="text-muted-foreground font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-4">
            Upload any image and our advanced AI model analyzes artifacts,
            textures, and patterns to determine its authenticity with confidence
            scoring.
          </p>
          <p className="text-xs text-muted-foreground/60 font-body italic">
            ⚡ This tool provides probabilistic AI-based analysis and does not
            guarantee absolute accuracy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
