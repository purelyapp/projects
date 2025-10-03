import { render, screen } from "@testing-library/react";
import { LoadingSpinner, LoadingSpinnerOverlay, LoadingSpinnerInline } from "@/components/LoadingSpinner";

// Mock the cn utility function
jest.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" "),
}));

describe("LoadingSpinner", () => {
  describe("Basic functionality", () => {
    it("renders with default props", () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute("aria-label", "Loading");
    });

    it("renders with custom text", () => {
      render(<LoadingSpinner text="Loading data..." />);
      
      expect(screen.getByText("Loading data...")).toBeInTheDocument();
    });

    it("does not render when visible is false", () => {
      render(<LoadingSpinner visible={false} />);
      
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("Size variants", () => {
    it("renders small size", () => {
      render(<LoadingSpinner size="small" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("w-4", "h-4");
    });

    it("renders medium size (default)", () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("w-6", "h-6");
    });

    it("renders large size", () => {
      render(<LoadingSpinner size="large" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("w-8", "h-8");
    });

    it("renders xl size", () => {
      render(<LoadingSpinner size="xl" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("w-12", "h-12");
    });
  });

  describe("Color variants", () => {
    it("renders primary variant (default)", () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("border-blue-600");
    });

    it("renders secondary variant", () => {
      render(<LoadingSpinner variant="secondary" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("border-gray-600");
    });

    it("renders success variant", () => {
      render(<LoadingSpinner variant="success" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("border-green-600");
    });

    it("renders warning variant", () => {
      render(<LoadingSpinner variant="warning" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("border-yellow-600");
    });

    it("renders error variant", () => {
      render(<LoadingSpinner variant="error" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("border-red-600");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<LoadingSpinner aria-label="Custom loading text" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner).toHaveAttribute("aria-label", "Custom loading text");
    });

    it("has role status for screen readers", () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Custom styling", () => {
    it("applies custom className", () => {
      render(<LoadingSpinner className="custom-class" />);
      
      const spinner = screen.getByRole("status");
      expect(spinner.firstChild).toHaveClass("custom-class");
    });
  });
});

describe("LoadingSpinnerOverlay", () => {
  it("renders full screen overlay", () => {
    render(<LoadingSpinnerOverlay text="Loading application..." />);
    
    const overlay = screen.getByRole("status");
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass("fixed", "inset-0", "z-50");
    expect(screen.getByText("Loading application...")).toBeInTheDocument();
  });

  it("renders with default text", () => {
    render(<LoadingSpinnerOverlay />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("applies custom className to overlay", () => {
    render(<LoadingSpinnerOverlay className="custom-overlay" />);
    
    const overlay = screen.getByRole("status");
    expect(overlay).toHaveClass("custom-overlay");
  });
});

describe("LoadingSpinnerInline", () => {
  it("renders inline spinner", () => {
    render(<LoadingSpinnerInline />);
    
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("w-4", "h-4"); // small size by default
  });

  it("renders with custom size", () => {
    render(<LoadingSpinnerInline size="medium" />);
    
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-6", "h-6");
  });

  it("renders with custom variant", () => {
    render(<LoadingSpinnerInline variant="success" />);
    
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("border-green-600");
  });

  it("applies custom className", () => {
    render(<LoadingSpinnerInline className="custom-inline" />);
    
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-inline");
  });
});
