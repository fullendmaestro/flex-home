import { Button } from "@/components/ui/button";

const EscalateButton = ({ handleEscalate, isDisabled }) => (
  <Button onClick={handleEscalate} disabled={isDisabled} className="mt-4">
    Escalate to Human Support
  </Button>
);

export default EscalateButton;
