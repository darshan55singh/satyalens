const Footer = () => {
  return (
    <footer className="border-t border-border/20 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-display text-sm font-bold text-primary mb-3 glow-text">SatyaLens</h4>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              AI-powered image authenticity detection. Built for trust in the age of generative AI.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground mb-3 uppercase tracking-wider">About</h4>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              SatyaLens uses advanced AI vision models to analyze images for signs of AI generation, helping
              verify digital media authenticity.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground font-body">
              <li className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Disclaimer</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Contact</h4>
            <p className="text-xs text-muted-foreground font-body">
              hello@satyalens.com
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass-card p-4 mb-8 border-verdict-uncertain/20">
          <p className="text-[11px] text-muted-foreground font-body text-center leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> This tool provides probabilistic AI-based analysis and does not
            guarantee absolute accuracy. Results should not be used as definitive proof of image origin.
            SatyaLens is a forensic aid, not a legal instrument.
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground/50 font-body">
          Built by Darshan 🚀 &middot; © {new Date().getFullYear()} SatyaLens
        </div>
      </div>
    </footer>
  );
};

export default Footer;
