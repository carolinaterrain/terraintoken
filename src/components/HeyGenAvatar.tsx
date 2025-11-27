import { useEffect } from 'react';

interface HeyGenAvatarProps {
  enabled?: boolean;
}

/**
 * HeyGen Interactive AI Avatar Component
 * 
 * Embeds an AI-powered avatar that can answer questions about TRN,
 * tokenomics, roadmap, and investment opportunities in real-time.
 * 
 * Features:
 * - Floating bottom-left circular avatar
 * - Expands to full chat interface on interaction
 * - Knowledge base integration
 * - Mobile responsive
 * - Auto-cleanup on unmount
 * 
 * @param enabled - Toggle avatar visibility (default: true)
 */
export const HeyGenAvatar = ({ enabled = true }: HeyGenAvatarProps) => {
  useEffect(() => {
    if (!enabled) return;

    // Inject HeyGen streaming embed script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(window){
        const host="https://labs.heygen.com",
        url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJCcnlhbl9JVF9TaXR0aW5nX3B1YmxpYyIs%0D%0AInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3YzLzMzYzlhYzRh%0D%0AZWFkNDRkZmM4YmMwMDgyYTM1MDYyYTcwXzQ1NTgwL3ByZXZpZXdfdGFsa18zLndlYnAiLCJuZWVk%0D%0AUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6IjRjYzAwMDI5ODI2MDRm%0D%0AY2I5MmY0MGZkNzZhYTJhZGE5IiwidXNlcm5hbWUiOiIwMGE0N2E3YzgzYWM0ZTg1ODllODI1OTVk%0D%0ANjhmMTI0ZiJ9&inIFrame=1",
        clientWidth=document.body.clientWidth,
        wrapDiv=document.createElement("div");
        
        wrapDiv.id="heygen-streaming-embed";
        const container=document.createElement("div");
        container.id="heygen-streaming-container";
        
        const stylesheet=document.createElement("style");
        stylesheet.innerHTML=\`
          #heygen-streaming-embed {
            z-index: 9998;
            position: fixed;
            left: 40px;
            bottom: 40px;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
            transition: all linear 0.1s;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
          }
          
          #heygen-streaming-embed.show {
            opacity: 1;
            visibility: visible;
          }
          
          #heygen-streaming-embed.expand {
            \${clientWidth<540?"height: 266px; width: 96%; left: 50%; transform: translateX(-50%);":"height: 366px; width: calc(366px * 16 / 9);"}
            border: 0;
            border-radius: 8px;
          }
          
          #heygen-streaming-container {
            width: 100%;
            height: 100%;
          }
          
          #heygen-streaming-container iframe {
            width: 100%;
            height: 100%;
            border: 0;
          }
          
          /* Accessibility: Ensure keyboard focus is visible */
          #heygen-streaming-embed:focus-within {
            outline: 2px solid hsl(var(--primary));
            outline-offset: 2px;
          }
          
          /* Mobile adjustments to avoid overlap with bottom nav */
          @media (max-width: 768px) {
            #heygen-streaming-embed {
              bottom: 80px;
              left: 20px;
              width: 150px;
              height: 150px;
            }
          }
        \`;
        
        const iframe=document.createElement("iframe");
        iframe.allowFullscreen=false;
        iframe.title="AI Assistant - Ask questions about Terrain Token";
        iframe.role="dialog";
        iframe.allow="microphone";
        iframe.setAttribute("aria-label", "Interactive AI avatar for answering questions about TRN");
        iframe.src=url;
        
        let visible=false;
        let initial=false;
        
        window.addEventListener("message",(e=>{
          if(e.origin===host && e.data && e.data.type && "streaming-embed"===e.data.type) {
            if("init"===e.data.action) {
              initial=true;
              wrapDiv.classList.toggle("show",initial);
            } else if("show"===e.data.action) {
              visible=true;
              wrapDiv.classList.toggle("expand",visible);
            } else if("hide"===e.data.action) {
              visible=false;
              wrapDiv.classList.toggle("expand",visible);
            }
          }
        }));
        
        container.appendChild(iframe);
        wrapDiv.appendChild(stylesheet);
        wrapDiv.appendChild(container);
        document.body.appendChild(wrapDiv);
      }(globalThis);
    `;
    
    document.body.appendChild(script);

    // Cleanup function to remove all injected elements
    return () => {
      const embed = document.getElementById('heygen-streaming-embed');
      if (embed) {
        embed.remove();
      }
      
      // Remove the script tag
      const scripts = document.querySelectorAll('script');
      scripts.forEach((s) => {
        if (s.innerHTML.includes('heygen-streaming-embed')) {
          s.remove();
        }
      });
    };
  }, [enabled]);

  // Component doesn't render anything - script handles its own DOM
  return null;
};

export default HeyGenAvatar;
