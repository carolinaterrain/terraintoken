import { useEffect } from "react";

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    let lastKey = "";

    const handleKeyPress = (e: KeyboardEvent) => {
      // Check for 'g' prefix shortcuts
      if (lastKey === "g") {
        switch (e.key) {
          case "h":
            document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
            break;
          case "r":
            document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" });
            break;
        }
        lastKey = "";
        return;
      }

      // Copy contract address with 'c' key
      if (e.key === "c" && !e.ctrlKey && !e.metaKey) {
        const contractAddress = "Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m";
        navigator.clipboard.writeText(contractAddress);
      }

      // Show shortcuts modal with '?'
      if (e.key === "?") {
        // This will be implemented when we add the shortcuts modal
        console.log("Shortcuts modal - to be implemented");
      }

      lastKey = e.key;
      setTimeout(() => (lastKey = ""), 1000);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
};
