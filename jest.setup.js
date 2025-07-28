// Mock environment variables

// Suppress React JSX transform warning in tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.("outdated JSX transform")) {
    return; // Suppress this specific warning
  }
  originalConsoleWarn(...args);
};


// Mock next-intl
jest.mock("next-intl", () => ({
  useLocale: jest.fn(() => "en"),
  useTranslations: jest.fn(() => (key) => key),
  useFormatter: jest.fn(() => ({
    dateTime: jest.fn((date) => date.toString()),
  })),
  NextIntlClientProvider: ({ children }) => children,
}));

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  getLocale: jest.fn(() => Promise.resolve("en")),
  getTranslations: jest.fn(() => Promise.resolve((key) => key)),
}));

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.innerWidth for mobile detection
Object.defineProperty(window, "innerWidth", {
  writable: true,
  value: 1024, // Default to desktop width
});

// Mock ResizeObserver for tests
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

// Mock QuickTooltip to handle button roles and accessibility correctly
jest.mock("@shared-ui/components/ui/quick-tooltip", () => {
  const React = require("react");
  return {
    QuickTooltip: (props) => {
      const { content, children } = props;

      // Handle button elements and elements with button role
      if (React.isValidElement(children)) {
        const isButton =
          children.type === "button" ||
          children.props.role === "button" ||
          children.type?.displayName?.includes?.("Button");

        if (isButton) {
          return React.cloneElement(children, {
            "aria-label": content,
            "data-tooltip": content, // Add data attribute for testing
            ...children.props, // Preserve existing props
          });
        }
      }

      // For non-button elements, wrap in a div with tooltip attributes
      return React.createElement(
        "div",
        {
          "data-tooltip": content,
          title: content,
        },
        children,
      );
    },
  };
});
