import { supabase } from "./supabaseclientes.js";

/* ============================================
   REGISTRO (ADMIN)
   ============================================ */

export async function register(email, password, nombre, apellidos, role) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Error al registrar: " + error.message);
    return;
  }

  if (!data.user) {
    alert("Usuario no creado. Puede que la verificación por email esté activada.");
    return;
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email,
      nombre,
      apellidos,
      role
    });

  if (profileError) {
    alert("Error al crear el perfil: " + profileError.message);
    return;
  }

  alert("Usuario registrado correctamente");
  return true;
}

/* ============================================
   LOGIN + REDIRECCIÓN
   ============================================ */

export async function login(email, password) {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Error al iniciar sesión: " + error.message);
    return;
  }

  const userId = data.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError) {
    alert("Error al obtener el rol del usuario: " + profileError.message);
    return;
  }

  if (!profile || !profile.role) {
    alert("No se encontró el rol del usuario");
    return;
  }

  redirigir(profile.role);
}

/* ============================================
   REDIRECCIÓN POR ROL
   ============================================ */

function redirigir(role) {
  switch (role) {
    case "admin":
      window.location.href = "./pages/admin.html";
      break;
    case "monitor":
      window.location.href = "./pages/monitor.html";
      break;
    case "familiar":
      window.location.href = "./pages/familiar.html";
      break;
    default:
      window.location.href = "./pages/login.html";
  }
}

/* ============================================
   INVITADO
   ============================================ */

export function entrarInvitado() {
  localStorage.setItem("invitado", "true");
  window.location.href = "./pages/invitado.html";
}

/* ============================================
   LOGOUT
   ============================================ */

export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem("invitado");
  window.location.href = "./pages/login.html";
}
