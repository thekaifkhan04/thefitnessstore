import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

test("Theme System - app/globals.css contains correct light and dark tokens", () => {
  const cssContent = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf-8");

  // Light theme tokens
  assert.match(cssContent, /--background:\s*#FFFFFF/i, "Light theme background token must be #FFFFFF");
  assert.match(cssContent, /--background-secondary:\s*#F7F7F8/i, "Light theme secondary background must be #F7F7F8");
  assert.match(cssContent, /--card:\s*#FFFFFF/i, "Light theme card background must be #FFFFFF");
  assert.match(cssContent, /--surface-elevated:\s*#F1F2F4/i, "Light theme elevated surface must be #F1F2F4");
  assert.match(cssContent, /--border:\s*#E2E4E8/i, "Light theme border must be #E2E4E8");
  assert.match(cssContent, /--brand-red:\s*#D7192D/i, "Light theme brand red must be #D7192D");
  assert.match(cssContent, /--text-primary:\s*#171717/i, "Light theme primary text must be #171717");
  assert.match(cssContent, /--text-secondary:\s*#60646C/i, "Light theme secondary text must be #60646C");
  assert.match(cssContent, /--input:\s*#FFFFFF/i, "Light theme input background must be #FFFFFF");

  // Dark theme tokens
  assert.match(cssContent, /--background:\s*#080808/i, "Dark theme background token must be #080808");
  assert.match(cssContent, /--background-secondary:\s*#111111/i, "Dark theme secondary background must be #111111");
  assert.match(cssContent, /--card:\s*#151515/i, "Dark theme card background must be #151515");
  assert.match(cssContent, /--surface-elevated:\s*#1B1B1B/i, "Dark theme elevated surface must be #1B1B1B");
  assert.match(cssContent, /--border:\s*#2B2B2B/i, "Dark theme border must be #2B2B2B");
  assert.match(cssContent, /--brand-red:\s*#E31E2F/i, "Dark theme brand red must be #E31E2F");
  assert.match(cssContent, /--text-primary:\s*#FFFFFF/i, "Dark theme primary text must be #FFFFFF");
  assert.match(cssContent, /--text-secondary:\s*#B3B3B3/i, "Dark theme secondary text must be #B3B3B3");
  assert.match(cssContent, /--input:\s*#121212/i, "Dark theme input background must be #121212");

  // Red elements preserve bright white text
  assert.ok(
    cssContent.includes("color: #FFFFFF !important"),
    "Red buttons and accents must preserve #FFFFFF text in both modes"
  );

  // Smooth transition with prefers-reduced-motion check
  assert.ok(
    cssContent.includes("prefers-reduced-motion: no-preference"),
    "Transitions must respect prefers-reduced-motion"
  );
  assert.ok(
    cssContent.includes("200ms ease"),
    "Theme transitions must use a subtle 150-250ms duration"
  );
});

test("Theme System - Zero-FOUC initialization script in app/layout.tsx", () => {
  const layoutContent = fs.readFileSync(path.join(process.cwd(), "app/layout.tsx"), "utf-8");

  // suppressHydrationWarning
  assert.ok(
    layoutContent.includes("suppressHydrationWarning"),
    "html tag must have suppressHydrationWarning to prevent hydration mismatch"
  );

  // Inline script id
  assert.ok(
    layoutContent.includes('id="tfs-theme-init"'),
    "Inline script tfs-theme-init must be present in head"
  );

  // Checks stored preference and prefers-color-scheme
  assert.ok(
    layoutContent.includes("localStorage.getItem('tfs_theme')") ||
    layoutContent.includes('localStorage.getItem("tfs_theme")'),
    "Inline script must check localStorage for user preference"
  );
  assert.ok(
    layoutContent.includes("prefers-color-scheme: dark"),
    "Inline script must detect prefers-color-scheme for system default"
  );
  assert.ok(
    layoutContent.includes("classList.add('dark')") && layoutContent.includes("classList.add('light')"),
    "Inline script must synchronously toggle dark and light class before paint"
  );
  assert.ok(
    layoutContent.includes("setAttribute('data-theme'"),
    "Inline script must set data-theme attribute on document root"
  );
});

test("Theme System - ThemeContext handles system, light, and dark modes", () => {
  const contextContent = fs.readFileSync(path.join(process.cwd(), "context/theme-context.tsx"), "utf-8");

  assert.ok(
    contextContent.includes('"system" | "light" | "dark"'),
    "ThemeContext must support system, light, and dark modes"
  );
  assert.ok(
    contextContent.includes("tfs_theme"),
    "ThemeContext must persist theme key in localStorage"
  );
  assert.ok(
    contextContent.includes("matchMedia(\"(prefers-color-scheme: dark)\")") ||
    contextContent.includes("matchMedia('(prefers-color-scheme: dark)')"),
    "ThemeContext must listen to system preference changes"
  );
  assert.ok(
    contextContent.includes("addEventListener(\"change\"") ||
    contextContent.includes("addEventListener('change'"),
    "ThemeContext must update live on system theme changes"
  );
});

test("Theme System - ThemeToggle component provides accessible 3-mode selector", () => {
  const toggleContent = fs.readFileSync(path.join(process.cwd(), "components/layout/theme-toggle.tsx"), "utf-8");

  // Lucide Icons
  assert.ok(toggleContent.includes("Sun"), "ThemeToggle must use Lucide Sun icon for light mode");
  assert.ok(toggleContent.includes("Moon"), "ThemeToggle must use Lucide Moon icon for dark mode");
  assert.ok(toggleContent.includes("Monitor"), "ThemeToggle must use Lucide Monitor icon for system mode");

  // Accessibility
  assert.ok(
    toggleContent.includes("aria-label"),
    "ThemeToggle must have accessible aria-label"
  );
  assert.ok(
    toggleContent.includes("Escape"),
    "ThemeToggle must close on Escape key"
  );
  assert.ok(
    toggleContent.includes("handleClickOutside") || toggleContent.includes("mousedown"),
    "ThemeToggle must close on outside click"
  );
});

test("Theme System - ThemeToggle is integrated across Public Navbar, Mobile Menu, Admin Navbar, and Settings", () => {
  const navbarContent = fs.readFileSync(path.join(process.cwd(), "components/layout/navbar.tsx"), "utf-8");
  const adminNavbarContent = fs.readFileSync(path.join(process.cwd(), "components/admin/admin-navbar.tsx"), "utf-8");
  const settingsFormContent = fs.readFileSync(path.join(process.cwd(), "components/admin/settings-form.tsx"), "utf-8");
  const adminLoginContent = fs.readFileSync(path.join(process.cwd(), "app/admin/login/page.tsx"), "utf-8");

  // Public Navbar & Mobile drawer
  assert.ok(
    navbarContent.includes("<ThemeToggle"),
    "Public desktop navbar must contain ThemeToggle"
  );
  assert.ok(
    navbarContent.includes('variant="segmented"'),
    "Mobile navigation drawer must contain ThemeToggle segmented control"
  );

  // Admin Navbar
  assert.ok(
    adminNavbarContent.includes("<ThemeToggle"),
    "Admin navbar must contain ThemeToggle"
  );

  // Admin Login
  assert.ok(
    adminLoginContent.includes("<ThemeToggle"),
    "Admin login page must contain ThemeToggle"
  );

  // Admin Settings Form
  assert.ok(
    settingsFormContent.includes("<ThemeToggle"),
    "Admin settings form must contain ThemeToggle preview selector"
  );
});

test("Theme System - Live HTML response includes zero-FOUC script and ThemeToggle on homepage", async () => {
  const res = await fetch("http://localhost:3000/");
  assert.strictEqual(res.status, 200, "Homepage must return 200 OK");
  const html = await res.text();

  assert.ok(
    html.includes('id="tfs-theme-init"'),
    "Live HTML must serve the inline tfs-theme-init zero-FOUC script in head"
  );
  assert.ok(
    html.includes("tfs_theme"),
    "Live HTML inline script must contain tfs_theme reference"
  );
  assert.ok(
    html.includes("suppressHydrationWarning"),
    "Live HTML must have suppressHydrationWarning"
  );
  assert.ok(
    html.includes("Theme settings") || html.includes("Select theme") || html.includes("Theme"),
    "Live HTML must render ThemeToggle button"
  );
});

test("Theme System - Admin Settings form supports dual-theme text and protects light mode", () => {
  const settingsFormContent = fs.readFileSync(path.join(process.cwd(), "components/admin/settings-form.tsx"), "utf-8");
  const settingsContextContent = fs.readFileSync(path.join(process.cwd(), "context/settings-context.tsx"), "utf-8");

  // Headers and labels have light and dark classes
  assert.ok(
    settingsFormContent.includes("text-neutral-900 dark:text-white"),
    "Admin settings form titles must use text-neutral-900 dark:text-white"
  );
  assert.ok(
    settingsFormContent.includes("text-neutral-700 dark:text-neutral-400") ||
    settingsFormContent.includes("text-neutral-600 dark:text-neutral-400"),
    "Admin settings form labels must adapt to light mode"
  );
  assert.ok(
    settingsFormContent.includes("bg-white dark:bg-[#121212]"),
    "Admin settings form card containers must adapt to light mode"
  );

  // Settings context does not force white text in light mode
  assert.ok(
    settingsContextContent.includes("isLight"),
    "SettingsContext applyThemeStyles must check if light mode is active"
  );
  assert.ok(
    settingsContextContent.includes("removeProperty(\"--text-primary\")"),
    "SettingsContext applyThemeStyles must remove inline text override in light mode"
  );
});
