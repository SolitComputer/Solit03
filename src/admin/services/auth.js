import { supabase } from "../../services/supabase";

export async function loginAdmin(email, password) {

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  if (error) throw error;

  return data;
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}