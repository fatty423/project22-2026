import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function jsonResponse(
  data: Record<string, unknown>,
  status = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization header" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const {
      data: { user: caller },
      error: authError,
    } = await serviceClient.auth.getUser(token);

    if (authError || !caller) {
      return jsonResponse({ error: "Invalid authentication" }, 401);
    }

    const { data: adminRecord } = await serviceClient
      .from("admin_users")
      .select("role")
      .eq("id", caller.id)
      .maybeSingle();

    if (!adminRecord || adminRecord.role !== "super_admin") {
      return jsonResponse(
        { error: "Access denied. Super admin privileges required." },
        403
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      const { email, password, role } = body;

      if (!email || !password) {
        return jsonResponse({ error: "Email and password are required" }, 400);
      }

      const validRole = role === "super_admin" ? "super_admin" : "admin";

      const { data: newUser, error: createError } =
        await serviceClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (createError) {
        return jsonResponse({ error: createError.message }, 400);
      }

      const { error: insertError } = await serviceClient
        .from("admin_users")
        .insert({ id: newUser.user.id, email, role: validRole });

      if (insertError) {
        await serviceClient.auth.admin.deleteUser(newUser.user.id);
        return jsonResponse({ error: insertError.message }, 400);
      }

      return jsonResponse({
        success: true,
        user: {
          id: newUser.user.id,
          email,
          role: validRole,
          created_at: new Date().toISOString(),
        },
      });
    }

    if (action === "update") {
      const { userId, role, password } = body;

      if (!userId) {
        return jsonResponse({ error: "User ID is required" }, 400);
      }

      if (role) {
        const validRole = role === "super_admin" ? "super_admin" : "admin";

        if (userId === caller.id && validRole !== "super_admin") {
          return jsonResponse(
            { error: "Cannot downgrade your own role" },
            400
          );
        }

        const { error: updateError } = await serviceClient
          .from("admin_users")
          .update({ role: validRole })
          .eq("id", userId);

        if (updateError) {
          return jsonResponse({ error: updateError.message }, 400);
        }
      }

      if (password) {
        const { error: pwError } =
          await serviceClient.auth.admin.updateUserById(userId, { password });

        if (pwError) {
          return jsonResponse({ error: pwError.message }, 400);
        }
      }

      return jsonResponse({ success: true });
    }

    if (action === "delete") {
      const { userId } = body;

      if (!userId) {
        return jsonResponse({ error: "User ID is required" }, 400);
      }

      if (userId === caller.id) {
        return jsonResponse({ error: "Cannot delete your own account" }, 400);
      }

      const { count } = await serviceClient
        .from("admin_users")
        .select("id", { count: "exact", head: true })
        .eq("role", "super_admin")
        .neq("id", userId);

      if (!count || count < 1) {
        return jsonResponse(
          { error: "Cannot delete the last super admin" },
          400
        );
      }

      const { error: deleteError } = await serviceClient
        .from("admin_users")
        .delete()
        .eq("id", userId);

      if (deleteError) {
        return jsonResponse({ error: deleteError.message }, 400);
      }

      const { error: authDeleteError } =
        await serviceClient.auth.admin.deleteUser(userId);

      if (authDeleteError) {
        console.error("Failed to delete auth user:", authDeleteError.message);
      }

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Invalid action" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});
