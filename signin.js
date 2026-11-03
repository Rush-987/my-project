(() => {
  const form = document.querySelector("#signin-form"), notice = document.querySelector("#notice");
  if (!lbRequireConfig(notice)) { form.querySelector("button[type=submit]").disabled = true; return; }
  const sb = lbSupabase;
  sb.auth.getSession().then(({data}) => { if (data.session) location.replace("dashboard.html"); });
  form.addEventListener("submit", async e => {
    e.preventDefault(); lbClearMessage(notice);
    const button = form.querySelector("button[type=submit]"); button.disabled = true; button.textContent = "Signing in…";
    const {data,error} = await sb.auth.signInWithPassword({
      email: form.email.value.trim(), password: form.password.value
    });
    button.disabled = false; button.innerHTML = 'Sign in <span>→</span>';
    if (error) return lbMessage(notice, error.message);
    if (data.session) location.replace("dashboard.html");
  });
  document.querySelector("#google").addEventListener("click", async () => {
    const {error} = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/dashboard.html` }
    });
    if (error) lbMessage(notice, error.message);
  });
})();