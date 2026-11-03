(() => {
  const form=document.querySelector("#reset-form"), notice=document.querySelector("#notice");
  if (!lbRequireConfig(notice)) { form.querySelector("button").disabled=true; return; }
  form.addEventListener("submit",async e=>{
    e.preventDefault(); lbClearMessage(notice);
    const {error}=await lbSupabase.auth.resetPasswordForEmail(form.email.value.trim(), {
      redirectTo:`${location.origin}/update-password.html`
    });
    if(error) return lbMessage(notice,error.message);
    lbMessage(notice,"If an account exists for that address, a password reset link has been sent.","success");
  });
})();