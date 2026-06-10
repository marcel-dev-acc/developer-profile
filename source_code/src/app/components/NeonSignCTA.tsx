import { useState, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';

interface NeonSignCTAProps {
  onOpenContact?: () => void;
}

export function NeonSignCTA({ onOpenContact }: NeonSignCTAProps) {
  const [isFlickering, setIsFlickering] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);

  useEffect(() => {
    // Initial flicker sequence
    const flickerSequence = [
      { delay: 0, visible: false },
      { delay: 100, visible: true },
      { delay: 150, visible: false },
      { delay: 200, visible: true },
      { delay: 250, visible: false },
      { delay: 400, visible: true },
      { delay: 450, visible: false },
      { delay: 500, visible: true },
      { delay: 600, visible: false },
      { delay: 650, visible: true },
    ];

    flickerSequence.forEach(({ delay, visible }) => {
      setTimeout(() => {
        setIsVisible(visible);
      }, delay);
    });

    setTimeout(() => {
      setIsFlickering(false);
      setIsVisible(true);
    }, 1000);
  }, []);

  return (
    <>
      <div className="relative my-16 py-12 flex flex-col items-center justify-center">
        {/* Electrical Glow Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-purple-500 blur-[100px] animate-pulse" />
        </div>

        {/* Neon Sign Text */}
        <div className={`relative transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2
            className="text-4xl md:text-6xl font-bold text-center mb-8 neon-text"
            style={{
              textShadow: isFlickering
                ? 'none'
                : '0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 30px #a855f7, 0 0 40px #a855f7, 0 0 70px #a855f7, 0 0 80px #a855f7, 0 0 100px #a855f7',
              animation: isFlickering ? 'none' : 'neon-flicker 3s infinite alternate',
            }}
          >
            NEED A WEBSITE?
          </h2>

          <p
            className="text-xl md:text-2xl text-center mb-8 neon-text-secondary"
            style={{
              textShadow: isFlickering
                ? 'none'
                : '0 0 5px #c084fc, 0 0 10px #c084fc, 0 0 15px #c084fc, 0 0 20px #c084fc',
              animation: isFlickering ? 'none' : 'neon-flicker 2s infinite alternate',
              animationDelay: '0.5s',
            }}
          >
            Let's Build Something Amazing Together
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowPriceModal(true)}
              className="group relative px-8 py-4 bg-transparent border-2 border-purple-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 10px #a855f7, 0 0 20px #a855f7, inset 0 0 10px rgba(168, 85, 247, 0.2)',
              }}
            >
              <div className="absolute inset-0 bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors" />
              <div className="relative flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <span
                  className="text-xl font-semibold text-purple-100"
                  style={{
                    textShadow: '0 0 10px #a855f7',
                  }}
                >
                  Get Price Estimate
                </span>
              </div>
            </button>
          </div>
        </div>

        <style>{`
          @keyframes neon-flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              text-shadow:
                0 0 10px #a855f7,
                0 0 20px #a855f7,
                0 0 30px #a855f7,
                0 0 40px #a855f7,
                0 0 70px #a855f7,
                0 0 80px #a855f7,
                0 0 100px #a855f7;
            }
            20%, 24%, 55% {
              text-shadow: none;
            }
          }

          .neon-text {
            color: #e9d5ff;
            animation: subtle-buzz 0.1s infinite alternate;
          }

          .neon-text-secondary {
            color: #d8b4fe;
          }

          @keyframes subtle-buzz {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(0.5px, 0.5px);
            }
          }
        `}</style>
      </div>

      {/* Price Estimate Modal */}
      {showPriceModal && (
        <PriceEstimateModal
          onClose={() => setShowPriceModal(false)}
          onOpenContact={onOpenContact}
        />
      )}
    </>
  );
}

interface PriceEstimateModalProps {
  onClose: () => void;
  onOpenContact?: () => void;
}

function PriceEstimateModal({ onClose, onOpenContact }: PriceEstimateModalProps) {
  const [projectType, setProjectType] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const projectTypes = [
    { value: 'info', label: 'Info Website', basePrice: 300 },
    { value: 'business', label: 'Business Website', basePrice: 1500 },
    { value: 'ecommerce', label: 'E-Commerce', basePrice: 3000 },
    { value: 'webapp', label: 'Web Application (SPA)', basePrice: 10000 },
  ];

  const availableFeatures = [
    { value: 'seo', label: 'SEO', price: 100 },
    { value: 'cms', label: 'Content Management', price: 1000 },
    { value: 'analytics', label: 'Analytics Integration', price: 250 },
    { value: 'auth', label: 'Authentication', price: 750 },
  ];

  const timelines = [
    { value: 'immediate', label: 'Immediate Start', extraCharge: 250 },
    { value: 'flexible', label: 'Flexible', extraCharge: 0 },
  ];

  const calculatePrice = () => {
    const selectedProject = projectTypes.find(p => p.value === projectType);
    if (!selectedProject) return;

    let total = selectedProject.basePrice;

    features.forEach(feature => {
      const feat = availableFeatures.find(f => f.value === feature);
      if (feat) total += feat.price;
    });

    const selectedTimeline = timelines.find(t => t.value === timeline);
    if (selectedTimeline) {
      total += selectedTimeline.extraCharge;
    }

    setEstimatedPrice(Math.round(total));
  };

  const toggleFeature = (value: string) => {
    setFeatures(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full h-full md:h-auto md:max-w-2xl bg-black/90 border-0 md:border border-purple-500/40 md:rounded-lg p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.5)] animate-[fadeIn_0.3s_ease-out] overflow-y-auto">
        <h3 className="text-2xl md:text-3xl mb-3 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent pt-2 md:pt-0">
          Project Price Estimator
        </h3>

        <p className="text-purple-300/80 text-sm mb-6 leading-relaxed">
          A formal quote will be generated before work commences and invoiced on completion. Annual invoices will be issued for maintenance or product service costs.
        </p>

        {/* Project Type */}
        <div className="mb-6">
          <label className="block text-purple-300 mb-3 text-sm md:text-base">Project Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setProjectType(type.value)}
                className={`p-3 rounded border transition-all ${
                  projectType === type.value
                    ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                    : 'border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/30'
                }`}
              >
                <div className="text-purple-100">{type.label}</div>
                <div className="text-sm text-purple-400">From £{type.basePrice.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <label className="block text-purple-300 mb-3 text-sm md:text-base">Additional Features</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableFeatures.map(feature => (
              <button
                key={feature.value}
                onClick={() => toggleFeature(feature.value)}
                className={`p-2 text-sm rounded border transition-all ${
                  features.includes(feature.value)
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/30'
                }`}
              >
                <div className="text-purple-100">{feature.label}</div>
                <div className="text-xs text-purple-400">+£{feature.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <label className="block text-purple-300 mb-3 text-sm md:text-base">Timeline</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timelines.map(time => (
              <button
                key={time.value}
                onClick={() => setTimeline(time.value)}
                className={`p-3 text-sm rounded border transition-all ${
                  timeline === time.value
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/30'
                }`}
              >
                <div className="text-purple-100">{time.label}</div>
                {time.extraCharge > 0 && (
                  <div className="text-xs text-purple-400">+£{time.extraCharge}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculatePrice}
          disabled={!projectType || !timeline}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 disabled:cursor-not-allowed text-white rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 mb-4"
        >
          Calculate Estimate
        </button>

        {/* Estimated Price */}
        {estimatedPrice !== null && (
          <div className="text-center p-6 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-4">
            <div className="text-purple-400 text-sm mb-2">Estimated Price Range</div>
            <div className="text-4xl font-bold text-purple-100" style={{ textShadow: '0 0 20px #a855f7' }}>
              £{estimatedPrice.toLocaleString()}
            </div>
            <div className="text-purple-400 text-sm mt-2">*Final price may vary based on specific requirements</div>
          </div>
        )}

        {/* Contact Me Button */}
        <button
          onClick={() => {
            onClose();
            onOpenContact?.();
          }}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Contact Me</span>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-purple-900/50 hover:bg-purple-800/50 text-purple-300 hover:text-purple-100 transition-colors z-20"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
