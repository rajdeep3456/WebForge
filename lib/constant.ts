import { HomeIcon, Key, LayoutDashboard, User } from "lucide-react";

export const suggestions = [
  {
    label: "Dashboard",
    prompt:
      "Create an analytics dashboard to track customers and revenue data for a SaaS company.",
    icon: LayoutDashboard,
  },
  {
    label: "Sign Up Form",
    prompt:
      "Create a modern sign up form with email/password fields, Google and Facebook login options, and terms checkbox",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a little subtle gradient effect, subtitle, CTA, small social proof and an image",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt:
      "Create a modern user profile card with a profile picture, name, job title, location, and social links. The card should be responsive and look good on mobile and desktop",
    icon: User,
  },
];

export const PROMPT = `
userInput: {userInput}

RULES:
- If the user input is a greeting or general conversation (e.g. "Hi", "Hello", "How are you?"), respond with a SHORT friendly text message. Do NOT generate any code.
- If the user input asks to create, build, design, or generate something, follow the CODE GENERATION rules below.

CODE GENERATION RULES:

OUTPUT FORMAT:
- Return ONLY HTML code inside a single \`\`\`html code fence block.
- Do NOT include any text, explanation, or commentary before or after the code fence.
- Do NOT generate <html>, <head>, or <body> tags. The platform provides these. Generate only the BODY CONTENT.

STYLING:
- Use Tailwind CSS utility classes for ALL styling. No inline styles. No <style> tags.
- Prefer a dark color scheme (bg-slate-900, bg-slate-800, text-white, etc.) unless the user specifies otherwise.
- Use modern design: rounded corners (rounded-xl), shadows (shadow-lg), smooth transitions (transition-all duration-300), hover effects (hover:scale-105, hover:bg-opacity-80).
- Ensure proper spacing with padding (p-4, p-6, p-8) and margin (m-2, m-4, mb-6) on ALL elements.
- Use Tailwind responsive prefixes (sm:, md:, lg:, xl:) to make layouts responsive.

LAYOUT:
- Use CSS Grid (grid, grid-cols-2, md:grid-cols-3, lg:grid-cols-4, gap-6) for card-based layouts.
- Use Flexbox (flex, items-center, justify-between) for navigation bars and inline elements.
- Do NOT use external carousel/slider libraries. Use CSS grid with overflow-x-auto and snap scrolling for horizontal scrolling sections.

IMAGES:
- For placeholder images, use: https://picsum.photos/seed/{KEYWORD}/{WIDTH}/{HEIGHT}
- Use a DIFFERENT keyword for each image so they look different. Example keywords: movie1, sci-fi, adventure, drama, hero-banner, poster-action.
- Always include a descriptive alt attribute on every <img> tag.

ICONS:
- Use Font Awesome 6 solid icons: <i class="fa-solid fa-star"></i>, <i class="fa-solid fa-play"></i>, etc.

INTERACTIVITY:
- For simple interactivity (toggles, dropdowns, modals), use inline vanilla JavaScript with <script> tags at the end of your HTML.
- Keep JavaScript minimal and functional.

HTML QUALITY (CRITICAL):
- Every HTML tag MUST be properly opened AND closed.
- Every attribute MUST have a space before it: CORRECT: <div class="foo" id="bar">  WRONG: <div class="foo"id="bar">
- Use double quotes for ALL attribute values.
- Self-closing tags must end with />: <img />, <br />, <hr />
- Do NOT generate malformed or truncated HTML. Validate your output mentally before returning.
- Keep line lengths reasonable. Break long class lists across multiple lines if needed.

DESIGN QUALITY:
- Make the design look PREMIUM and POLISHED — like a real production website.
- Use gradient backgrounds where appropriate (bg-gradient-to-r, from-blue-600, to-purple-600).
- Add subtle animations and hover states to make the UI feel alive.
- Use proper typography hierarchy (text-4xl font-bold for headings, text-sm text-gray-400 for metadata).
- Ensure visual consistency across all sections.
`;

export const HTML_CODE = `
    <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="AI Website Builder - Modern TailwindCSS Template" />
      <title>AI Website Builder</title>

      <!-- Tailwind CSS -->
      <script src="https://cdn.tailwindcss.com"></script>

      <!-- Flowbite CSS & JS -->
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

      <!-- Lucide -->
      <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
      <!-- Chart.js -->
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    </head>

    <body id="root">
      {generatedCode}
    </body>
    </html>
`;
