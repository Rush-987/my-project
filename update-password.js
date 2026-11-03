(() => {
 const form=document.querySelector("#update-form"),notice=document.querySelector("#notice");
 if(!lbRequireConfig(notice)){form.querySelector("button").disabled=true;return;}
 lbSupabase.auth.getSession().then(({data,error})=>{
   if(error||!data.session) lbMessage(notice,"This reset link is invalid or expired. Request a new one.","error");
 });
 form.addEventListener("submit",async e=>{
  e.preventDefault();lbClearMessage(notice);
  if(form.password.value.length<10)return lbMessage(notice,"Use at least 10 characters.");
  if(form.password.value!==form.confirm.value)return lbMessage(notice,"Your passwords do not match.");
  const {error}=await lbSupabase.auth.updateUser({password:form.password.value});
  if(error)return lbMessage(notice,error.message);
  lbMessage(notice,"Password updated. You can now sign in with your new password.","success");
  form.reset();
 });
})();