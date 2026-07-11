import { getInspectorScript } from "./inspector-script";

/**
 * Prepares AI-generated code for rendering in iframe.
 * If it's a full HTML document, injects inspector script before </body>.
 * If it's partial content, wraps it in a basic HTML template with dependencies.
 */
export function prepareIframeContent(code: string): string {
  if (!code) return getEmptyTemplate();

  // Clean code fence markers - be careful not to remove 'html' from tags like <html>
  let cleaned = code
    .replace(/```html\s*/gi, "") // Remove ```html (with optional whitespace)
    .replace(/```\s*/g, "") // Remove closing ```
    .replace(/^html\s*(?=\n|$)/im, "") // Remove standalone 'html' word only at line start
    .trim();

  if (!cleaned) return getEmptyTemplate();

  const isFullDocument =
    /<html[\s>]/i.test(cleaned) || /<!DOCTYPE/i.test(cleaned);
  const inspectorScript = getInspectorScript();

  if (isFullDocument) {
    // Inject inspector script before </body>
    if (/<\/body>/i.test(cleaned)) {
      return cleaned.replace(/<\/body>/i, inspectorScript + "</body>");
    } else if (/<\/html>/i.test(cleaned)) {
      return cleaned.replace(/<\/html>/i, inspectorScript + "</html>");
    } else {
      return cleaned + inspectorScript;
    }
  } else {
    // Wrap in basic template with Tailwind + common libraries
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Website Builder</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>
  
  <!-- Flowbite CSS & JS (backward compat) -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <!-- Swiper CSS & JS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; margin: 0; }
    /* Smooth horizontal scroll sections */
    .scroll-container { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
    .scroll-container > * { scroll-snap-align: start; }
    /* Hide scrollbar but keep scrolling */
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
  </style>
</head>
<body>
  ${cleaned}
  ${inspectorScript}
</body>
</html>`;
  }
}

function getEmptyTemplate(): string {
  const inspectorScript = getInspectorScript();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Website Builder</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
</head>
<body class="flex items-center justify-center min-h-screen bg-gray-50">
  <div class="text-center text-gray-400">
    <p class="text-lg">Start by sending a prompt to generate your website</p>
  </div>
  ${inspectorScript}
</body>
</html>`;
}
