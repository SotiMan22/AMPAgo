import { supabase } from "./supabaseclientes.js";

/* ============================================
   OBTENER USUARIO ACTUAL
   ============================================ */

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error obteniendo usuario:", error.message);
    return null;
  }

  return data.user;
}

/* ============================================
   PROTEGER PÁGINAS SEGÚN ROL
   ============================================ */

export async function requireRole(rolesPermitidos = []) {
  const user = await getUser();

  // Si no hay usuario → fuera
  if (!user) {
    window.location.href = "../pages/login.html";
    return;
  }

  // Obtener perfil del usuario
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Error obteniendo perfil:", error?.message);
    window.location.href = "../pages/login.html";
    return;
  }

  const rolUsuario = profile.role;

  // Si el rol NO está permitido → fuera
  if (!rolesPermitidos.includes(rolUsuario)) {
    alert("No tienes permiso para acceder a esta página.");
    window.location.href = "../pages/login.html";
    return;
  }
}

/* ============================================
   PROTEGER PÁGINAS SOLO PARA LOGUEADOS
   ============================================ */

export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    window.location.href = "../pages/login.html";
  }
}
