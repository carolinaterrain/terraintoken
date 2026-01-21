import { motion } from "framer-motion";
import { 
  Shield, 
  Fingerprint, 
  Satellite, 
  ScanLine, 
  CheckCircle2,
  AlertTriangle,
  Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const verificationSteps = [
  {
    icon: <ScanLine className="h-6 w-6" />,
    title: "3D Point Cloud Capture",
    description: "Drone or ground-based LiDAR captures precise terrain geometry",
    status: "input"
  },
  {
    icon: <Satellite className="h-6 w-6" />,
    title: "Satellite DEM Comparison",
    description: "Cross-reference against publicly available Digital Elevation Models",
    status: "process"
  },
  {
    icon: <Fingerprint className="h-6 w-6" />,
    title: "Terrain Fingerprinting",
    description: "AI generates unique signature from surface characteristics",
    status: "process"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Spoof-Proof Verification",
    description: "Immutable record anchored to blockchain with proof of location",
    status: "output"
  }
];

export function IndustrialVerification() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-slate-950 relative">
      <div className="container">
        <div className="text-center mb-16">
          <Badge 
            variant="outline" 
            className="mb-4 border-solana-purple/30 text-solana-purple font-mono"
          >
            <Lock className="h-3 w-3 mr-2" />
            Enterprise Grade
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Industrial <span className="text-solana-purple">Verification</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
            Proof over Promises — Our Terrain Fingerprinting algorithm prevents data 
            spoofing by comparing drone point clouds against satellite DEMs.
          </p>
        </div>

        {/* Verification pipeline */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {verificationSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection line */}
              {index < verificationSteps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-slate-700 to-slate-800 z-0" />
              )}
              
              <div className="relative z-10 bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-full">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  step.status === "input" && "bg-blue-500/20 text-blue-400",
                  step.status === "process" && "bg-solana-purple/20 text-solana-purple",
                  step.status === "output" && "bg-safety-green/20 text-safety-green"
                )}>
                  {step.icon}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison diagram */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Verified data */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-safety-green/10 to-transparent border border-safety-green/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="h-6 w-6 text-safety-green" />
              <h3 className="text-xl font-bold">Verified Terrain Data</h3>
            </div>
            <ul className="space-y-3">
              {[
                "GPS coordinates match satellite imagery",
                "Point cloud density meets quality threshold",
                "Elevation data correlates with public DEMs",
                "Timestamp and device attestation verified",
                "Unique terrain fingerprint generated"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-safety-green" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Rejected data */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-destructive/10 to-transparent border border-destructive/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h3 className="text-xl font-bold">Rejected Submissions</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Synthetic or lab-generated point clouds",
                "Recycled data from previous submissions",
                "GPS spoofing detected via DEM mismatch",
                "Insufficient point density or coverage",
                "Failed device attestation check"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Algorithm highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center"
        >
          <Fingerprint className="h-12 w-12 mx-auto mb-4 text-solana-purple" />
          <h3 className="text-xl font-bold mb-2">Terrain Fingerprinting Algorithm</h3>
          <p className="text-muted-foreground font-mono max-w-2xl mx-auto text-sm">
            Each verified terrain capture generates a unique cryptographic fingerprint based on 
            surface roughness patterns, elevation gradients, and vegetation density. This 
            fingerprint is impossible to forge without physically visiting the location.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default IndustrialVerification;
