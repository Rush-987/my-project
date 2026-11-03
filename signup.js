(() => {
  const form = document.querySelector("#signup-form"), notice = document.querySelector("#notice");
  if (!lbRequireConfig(notice)) { form.querySelector("button[type=submit]").disabled = true; return; }
  const sb = lbSupabase;
  form.addEventListener("submit", async e => {
    e.preventDefault(); lbClearMessage(notice);
    const name = form.name.value.trim(), email = form.email.value.trim();
    const password = form.password.value;
    if (password !== form.confirm.value) return lbMessage(notice, "Your passwords do not match.");
    if (password.length < 10) return lbMessage(notice, "Use at least 10 characters for your password.");
    const button = form.querySelector("button[type=submit]"); button.disabled = true; button.textContent = "Creating account…";
    const {data,error} = await sb.auth.signUp({
      email, password,
      options: {
        data: { display_name: name },
        emailRedirectTo: `${location.origin}/dashboard.html`
      }
    });
    button.disabled = false; button.innerHTML = 'Create account <span>→</span>';
    if (error) return lbMessage(notice, error.message);
    if (data.session) location.replace("dashboard.html");
    else {
      form.reset();
      lbMessage(notice, "Account created. Check your email and verify your address before signing in.", "success");
    }
  });
  document.querySelector("#google").addEventListener("click", async () => {
    const {error} = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/dashboard.html` }
    });
    if (error) lbMessage(notice, error.message);
  });
})();