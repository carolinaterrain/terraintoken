import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackToHome = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        aria-label="Navigate back to home page"
        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
    </div>
  );
};

export default BackToHome;
