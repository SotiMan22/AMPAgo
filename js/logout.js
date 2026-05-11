import { supabase } from "./supabaseclientes.js";

/* ============================================
   LOGOUT
   ============================================ */

export async function logout() {
  // Cerrar sesión en Supabase
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Error al cerrar sesión: " + error.message);
    return;
  }

  // Eliminar modo invitado si existe
  localStorage.removeItem("invitado");

  // Redirigir al login
  window.location.href = "../pages/login.html";
}
