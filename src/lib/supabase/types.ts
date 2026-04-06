// Este arquivo será substituído pelos tipos gerados automaticamente pelo Supabase CLI:
// npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
        Relationships: any[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
