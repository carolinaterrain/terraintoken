import DesktopNav from "./DesktopNav";
import { memo } from "react";

const SmartHeader = memo(() => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] transition-transform duration-300">
      <div className="bg-background/95 backdrop-blur-lg border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <DesktopNav />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SmartHeader.displayName = 'SmartHeader';

export default SmartHeader;
