import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateContractorProfile } from "./actions";
import { revalidatePath } from "next/cache";

// Mock Supabase Server Client
const mockUpdate = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockImplementation(() => Promise.resolve({ error: null }));
const mockFrom = vi.fn().mockReturnValue({
  update: mockUpdate,
  eq: mockEq,
});
const mockGetUser = vi.fn().mockResolvedValue({
  data: { user: { id: "user-123" } },
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: () => mockGetUser(),
    },
    from: (table: string) => mockFrom(table),
  }),
  createServiceClient: vi.fn(),
}));

// Mock Next.js cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock Next.js headers
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: () => "http://localhost:3000",
  }),
}));

describe("minha-conta actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateContractorProfile", () => {
    it("should return error if user is not authenticated", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });

      const response = await updateContractorProfile({
        full_name: "Gabriel Minatti",
        phone: "11987654321",
      });

      expect(response).toEqual({ error: "Não autenticado" });
    });

    it("should return success when updating profile correctly", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: "user-123" } } });
      mockEq.mockResolvedValueOnce({ error: null });

      const response = await updateContractorProfile({
        full_name: "Gabriel Minatti",
        phone: "11987654321",
      });

      expect(response).toEqual({ success: true });
      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockUpdate).toHaveBeenCalledWith({
        name: "Gabriel Minatti",
        phone: "11987654321",
      });
      expect(mockEq).toHaveBeenCalledWith("id", "user-123");
      expect(revalidatePath).toHaveBeenCalledWith("/minha-conta");
    });

    it("should return error if database update fails", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: "user-123" } } });
      mockEq.mockResolvedValueOnce({ error: { message: "DB Error" } });

      const response = await updateContractorProfile({
        full_name: "Gabriel Minatti",
        phone: "11987654321",
      });

      expect(response).toEqual({ error: "Erro ao salvar perfil" });
    });
  });
});
