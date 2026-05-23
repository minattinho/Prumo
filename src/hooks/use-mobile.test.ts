import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return true when window matches mobile media query", () => {
    // Mock window.matchMedia returning matches: true
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    vi.stubGlobal("innerWidth", 500);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should return false when window matches desktop media query", () => {
    // Mock window.matchMedia returning matches: false
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    vi.stubGlobal("innerWidth", 1024);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should update isMobile when screen matches media query changes", () => {
    let changeHandler: (() => void) | null = null;
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn().mockImplementation((event, handler) => {
        if (event === "change") changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
    })));
    vi.stubGlobal("innerWidth", 1024);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Agora simula mudança de tamanho de tela para mobile
    vi.stubGlobal("innerWidth", 500);
    
    // Dispara a callback manualmente envolvida em act
    act(() => {
      if (changeHandler) {
        changeHandler();
      }
    });

    // Como o hook atualiza o estado, renderHook atualiza o valor
    expect(result.current).toBe(true);
  });
});
