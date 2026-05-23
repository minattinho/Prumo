import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatPhone, slugify, formatDate } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    });

    it("should handle conditional classes", () => {
      expect(cn("bg-red-500", false && "text-white", "p-4")).toBe("bg-red-500 p-4");
      expect(cn("bg-red-500", true && "text-white", "p-4")).toBe("bg-red-500 text-white p-4");
    });

    it("should resolve conflicts using tailwind-merge", () => {
      expect(cn("p-2", "p-4")).toBe("p-4");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });
  });

  describe("formatCurrency", () => {
    it("should format number as BRL currency", () => {
      const formatted = formatCurrency(1234.56);
      // BRL format has non-breaking spaces, check for currency symbol and numbers
      expect(formatted).toContain("R$");
      expect(formatted).toContain("1.234,56");
    });

    it("should handle zero and negative numbers", () => {
      expect(formatCurrency(0)).toContain("0,00");
      expect(formatCurrency(-50)).toContain("-");
      expect(formatCurrency(-50)).toContain("50,00");
    });
  });

  describe("formatPhone", () => {
    it("should format 11-digit mobile phone correctly", () => {
      expect(formatPhone("11987654321")).toBe("(11) 98765-4321");
      expect(formatPhone("11 9 8765-4321")).toBe("(11) 98765-4321");
    });

    it("should format 10-digit landline phone correctly", () => {
      expect(formatPhone("1134567890")).toBe("(11) 3456-7890");
    });

    it("should handle clean-up of non-digit characters first", () => {
      expect(formatPhone("(11) 98765-4321")).toBe("(11) 98765-4321");
      expect(formatPhone("11-98765-4321")).toBe("(11) 98765-4321");
    });
  });

  describe("slugify", () => {
    it("should normalize and convert text to lower case slug", () => {
      expect(slugify("Olá Mundo")).toBe("ola-mundo");
      expect(slugify("Prumo Serviços de Engenharia")).toBe("prumo-servicos-de-engenharia");
    });

    it("should remove special characters and spaces correctly", () => {
      expect(slugify("React 19 & Next.js 16!")).toBe("react-19-nextjs-16");
    });

    it("should handle multiple spaces and trim edges", () => {
      expect(slugify("   test  slug   ")).toBe("test-slug");
    });
  });

  describe("formatDate", () => {
    it("should format date string to pt-BR format", () => {
      expect(formatDate("2026-05-23T12:00:00Z")).toBe("23/05/2026");
    });

    it("should format Date object to pt-BR format", () => {
      const date = new Date(2026, 4, 23); // May is index 4
      expect(formatDate(date)).toBe("23/05/2026");
    });
  });
});
