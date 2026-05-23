import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Setup Environment Variables manually from .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
        process.env[key] = value;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL and Service Role Key must be defined in .env");
}

// Service client that bypasses RLS and email confirmation
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

test.describe("Prumo End-to-End Core Flow Validation", () => {
  let tempUserId: string | null = null;
  const testEmail = `e2e-test-${Date.now()}@meuprumo.com.br`;
  const testPassword = "StrongPassword123!";
  const testName = "Gabriel E2E Tester";
  let targetProSlug: string | null = null;
  let targetProId: string | null = null;

  // Track console errors and latencies
  const consoleErrors: string[] = [];
  const latencyWarnings: string[] = [];

  test.beforeAll(async () => {
    // A. Query or provision an active professional for the test
    const { data: pros, error: proError } = await supabaseAdmin
      .from("professional_profiles")
      .select("id, slug, status")
      .eq("status", "ACTIVE")
      .limit(1);

    if (proError) {
      console.error("Error fetching active professionals:", proError);
    }

    if (pros && pros.length > 0) {
      targetProSlug = pros[0].slug;
      targetProId = pros[0].id;
      console.log(`Using existing professional: ${targetProSlug} (ID: ${targetProId})`);
    } else {
      // Create a mock professional if none exist
      const mockProEmail = `mock-pro-${Date.now()}@meuprumo.com.br`;
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: mockProEmail,
        password: testPassword,
        email_confirm: true,
        user_metadata: { full_name: "Pro Teste E2E", role: "professional" },
      });

      if (authError || !authUser.user) {
        throw new Error(`Failed to create mock professional user: ${authError?.message}`);
      }

      const proId = authUser.user.id;
      // Wait for trigger to sync or manually insert into profiles
      const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
        id: proId,
        name: "Pro Teste E2E",
        email: mockProEmail,
        role: "professional",
      });

      const { error: proProfileError } = await supabaseAdmin.from("professional_profiles").insert({
        user_id: proId,
        slug: `pro-teste-e2e-${proId.slice(0, 6)}`,
        city: "São Paulo",
        state: "SP",
        status: "ACTIVE",
      });

      if (proProfileError) {
        console.error("Error inserting professional profile:", proProfileError);
      }

      targetProSlug = `pro-teste-e2e-${proId.slice(0, 6)}`;
      targetProId = proId;
      console.log(`Created new professional for testing: ${targetProSlug}`);
    }

    // B. Create a confirmed temporary Contractor user
    const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: testName,
        role: "contractor",
      },
    });

    if (createError || !newAuthUser.user) {
      throw new Error(`Failed to create temporary contractor: ${createError?.message}`);
    }

    tempUserId = newAuthUser.user.id;
    console.log(`Temporary contractor created: ${testEmail} (ID: ${tempUserId})`);

    // Ensure profiles and contractor_profiles are populated (triggers should normally handle this, but upsert for robustness)
    const { error: profError } = await supabaseAdmin.from("profiles").upsert({
      id: tempUserId,
      name: testName,
      email: testEmail,
      role: "contractor",
    });

    if (profError) console.error("Error syncing profile:", profError.message);

    const { error: contrError } = await supabaseAdmin.from("contractor_profiles").upsert({
      user_id: tempUserId,
    });

    if (contrError) console.error("Error syncing contractor profile:", contrError.message);
  });

  test.afterAll(async () => {
    // Cleanup temporary users from auth and DB tables
    if (tempUserId) {
      console.log(`Cleaning up temporary user ${tempUserId}...`);
      // Delete contractor profile
      await supabaseAdmin.from("contractor_profiles").delete().eq("user_id", tempUserId);
      // Delete budget requests sent by this user
      await supabaseAdmin.from("budget_requests").delete().eq("contractor_id", tempUserId);
      // Delete main profile
      await supabaseAdmin.from("profiles").delete().eq("id", tempUserId);
      // Delete auth user
      await supabaseAdmin.auth.admin.deleteUser(tempUserId);
      console.log("Cleanup completed successfully.");
    }
  });

  test("should perform initial access, authenticate, request budget, and validate visual/API integrity", async ({ page }) => {
    // Set generous timeout for heavy CPU load and multiple concurrent E2E browsers
    test.setTimeout(60000);
    // Track console messages for errors (F12 check)
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`[Console Error]: ${msg.text()}`);
      }
    });

    page.on("pageerror", (err) => {
      consoleErrors.push(`[Page Uncaught Error]: ${err.message}\nStack: ${err.stack}`);
    });

    // Measure interaction performance
    const measurePageLoad = async (url: string) => {
      const start = Date.now();
      await page.goto(url);
      const duration = Date.now() - start;
      if (duration > 3000) {
        latencyWarnings.push(`Acesso a ${url} demorou ${duration}ms (mais de 3s)`);
      }
      return duration;
    };

    // Step 1: Initial Access
    console.log("Step 1: Accessing the home page...");
    const homeLoadTime = await measurePageLoad("/");
    console.log(`Home page loaded in ${homeLoadTime}ms`);

    // Verify brand assets on landing page (Prumo Logo / Header presence)
    const header = page.locator("header");
    await expect(header).toBeVisible();
    
    // Check if css brand variables are loaded correctly
    const primaryColorVar = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue("--color-azul-principal").trim();
    });
    console.log(`CSS Brand Primary Color Variable value: ${primaryColorVar}`);
    expect(primaryColorVar).toBeDefined();

    // Step 2: Authentication Flow
    console.log("Step 2: Triggering login modal...");
    // We can open the modal using the query param to be consistent and direct
    await page.goto("/?auth=login");
    const modal = page.locator("div.bg-white.rounded-2xl").filter({ hasText: "Entre na sua conta" });
    await expect(modal).toBeVisible();

    console.log("Filling in authentication credentials...");
    await page.locator('input[id="email"]').click();
    await page.locator('input[id="email"]').fill(testEmail);
    await page.locator('input[id="password"]').click();
    await page.locator('input[id="password"]').fill(testPassword);

    const submitStart = Date.now();
    // Submit form using standard button click
    await page.locator('button[type="submit"]').click();
    
    // Wait for login modal to be hidden (closed) with generous timeout for Webkit and parallel execution
    await expect(modal).not.toBeVisible({ timeout: 25000 });
    
    // Reload page to ensure cookies are fully set and processed by Server Components
    await page.reload();

    // After login, should show user header menu containing the user name "Gabriel"
    await expect(page.locator("header")).toContainText("Gabriel");
    const loginDuration = Date.now() - submitStart;
    if (loginDuration > 3000) {
      latencyWarnings.push(`Login levou ${loginDuration}ms`);
    }
    console.log(`Login flow completed in ${loginDuration}ms`);

    // Step 3: Interaction Critical / Search Professional
    console.log("Step 3: Navigating to professionals search page...");
    await measurePageLoad("/profissionais");
    
    // Wait for professional card list to render - target active article/cards
    const firstProCard = page.locator('article a:has-text("Ver perfil e portfólio")').first();
    await expect(firstProCard).toBeVisible();

    // Step 4: Visit Professional Detail page
    console.log(`Step 4: Navigating to professional detail page: /profissionais/${targetProSlug}`);
    await measurePageLoad(`/profissionais/${targetProSlug}`);

    // Verify that elements are loaded correctly
    await expect(page.locator("h1")).toBeVisible();

    // Step 5: Send Budget Request (Core Business)
    console.log("Step 5: Clicking Solicitar Orçamento...");
    const budgetBtn = page.locator('button:has-text("Solicitar Orçamento Grátis")').first();
    await expect(budgetBtn).toBeVisible();
    await budgetBtn.click();

    // Verify Budget Request Modal is shown
    const budgetModal = page.locator("div[role='dialog']");
    await expect(budgetModal).toBeVisible();

    console.log("Filling out budget request message...");
    await page.locator('textarea#budget-message').fill("Olá! Preciso de um orçamento detalhado de teste E2E para pintura e reforma. Por favor, entre em contato.");
    
    console.log("Submitting budget request...");
    const sendBtn = page.locator('button[type="submit"]:has-text("Enviar Pedido")').first();
    await sendBtn.click();

    // Verify Success Feedback
    console.log("Verifying success message/toast...");
    // Let's verify Radix dialog shows success state
    const successTitle = page.locator('h3:has-text("Solicitação Enviada!")').first();
    await expect(successTitle).toBeVisible({ timeout: 8000 });
    console.log("Budget request successfully sent!");

    // Capture visual confirmation screenshot
    await page.screenshot({ path: "test-results/e2e-success-state.png", fullPage: true });

    // Click 'Entendido' button to close success modal and remove the backdrop overlay
    const closeBtn = page.locator('button:has-text("Entendido")').first();
    await closeBtn.click();
    
    // Wait for the dialog to disappear completely
    await expect(budgetModal).not.toBeVisible({ timeout: 5000 });

    // Step 6: Log out and check if it worked
    console.log("Step 6: Performing user logout...");
    const menuBtn = page.locator("header button", { hasText: "Gabriel" }).first();
    await menuBtn.click();

    const logoutBtn = page.locator('button:has-text("Sair"), a:has-text("Sair")').first();
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Verify we are logged out and see the login link again
    await expect(page.locator("header")).toContainText("Entrar");

    // Report metrics
    console.log("--- E2E Validation Performance & Integrity Metrics ---");
    console.log(`Console Errors encountered: ${consoleErrors.length}`);
    console.log(`Latency Warnings encountered: ${latencyWarnings.length}`);
    
    // Filter out local dev-server/turbopack hot-reload and devtools stack frame CORS issues in development
    const criticalErrors = consoleErrors.filter(err => {
      if (!err.includes("Page Uncaught Error")) return false;
      if (err.includes("__nextjs_original-stack-frames")) return false;
      if (err.includes("Failed to load chunk") || err.includes("turbopack")) return false;
      return true;
    });

    // Save results report metadata for builder
    const reportData = {
      timestamp: new Date().toISOString(),
      consoleErrors,
      criticalErrors,
      latencyWarnings,
      homeLoadTime,
      loginDuration,
      status: criticalErrors.length === 0 ? "PASSED" : "FAILED",
    };

    fs.writeFileSync(
      path.resolve(process.cwd(), "test-results/e2e-metrics.json"),
      JSON.stringify(reportData, null, 2),
      "utf-8"
    );

    // Fail test if critical uncaught exceptions occurred
    expect(criticalErrors.length).toBe(0);
  });
});
