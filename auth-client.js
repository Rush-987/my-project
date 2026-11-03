/* Shared Supabase client and UI helpers for LabBuddy. */
(() => {
  const cfg = window.LABBUDDY_CONFIG || {};
  const configured = cfg.supabaseUrl && !cfg.supabaseUrl.includes("YOUR_PROJECT_REF")
    && cfg.supabaseAnonKey && !cfg.supabaseAnonKey.includes("YOUR_SUPABASE");
  window.lbConfigured = Boolean(configured);
  window.lbSupabase = configured
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      })
    : null;

  window.lbMessage = (node, message, kind = "error") => {
    if (!node) return;
    node.textContent = message;
    node.className = `notice ${kind}`;
    node.hidden = false;
  };
  window.lbClearMessage = node => {
    if (node) { node.textContent = ""; node.hidden = true; }
  };
  window.lbRequireConfig = node => {
    if (window.lbConfigured) return true;
    window.lbMessage(node, "Authentication is not configured yet. Add your Supabase project URL and publishable key in config.js, then follow SETUP.md.", "error");
    return false;
  };
  window.lbSignOut = async () => {
    if (!window.lbSupabase) return;
    await window.lbSupabase.auth.signOut();
    location.href = "signin.html";
  };
})();