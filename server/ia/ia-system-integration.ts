import { RulesEngine } from "../../../ia-system/src/rules/rules-engine";
import { TrustEngine } from "../../../ia-system/src/engine/trust-engine";
import { DecisionEngine } from "../../../ia-system/src/engine/decision-engine";
import { VerificationPipeline } from "../../../ia-system/src/pipelines/verification-pipeline";
import { WhatsAppValidationPipeline } from "../../../ia-system/src/pipelines/whatsapp-validation";
import { join } from "path";

// Initialize the IA system components
const rulesPath = join(process.cwd(), "ia-system/rules");

const rulesEngine = new RulesEngine(rulesPath);
const trustEngine = new TrustEngine(rulesEngine);
const decisionEngine = new DecisionEngine(trustEngine);
const verificationPipeline = new VerificationPipeline(trustEngine);
const whatsappPipeline = new WhatsAppValidationPipeline();

// Load rules once at startup
rulesEngine.loadRules().catch(err => {
  console.error("Failed to load IA rules:", err);
});

export {
  rulesEngine,
  trustEngine,
  decisionEngine,
  verificationPipeline,
  whatsappPipeline
};
