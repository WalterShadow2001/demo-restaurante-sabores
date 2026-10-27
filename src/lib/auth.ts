import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get(ADMIN_COOKIE);
  return cookie?.value === "true";
}

export async function requireAdmin():
  | { ok: true }
  | { ok: false; status: number; message: string } {
  if (!(await isAuthenticated())) {
    return {
      ok: false,
      status: 401,
      message: "No autorizado. Inicia sesión como administrador.",
    };
  }
  return { ok: true };
}
