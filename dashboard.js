(() => {
 const sb=lbSupabase,notice=document.querySelector("#notice");
 if(!lbRequireConfig(notice))return;
 let user;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const init=async()=>{
  const {data:{session},error}=await sb.auth.getSession();
  if(error||!session){location.replace("signin.html");return;}
  user=session.user;
  const {data:profile}=await sb.from("profiles").select("display_name").eq("id",user.id).maybeSingle();
  const name=profile?.display_name||user.user_metadata?.display_name||user.email.split("@")[0];
  document.querySelector("#display-name").textContent=name;
  document.querySelector("#profile-name").textContent=name;
  document.querySelector("#profile-email").textContent=user.email||"";
  document.querySelector("#avatar").textContent=name.slice(0,2).toUpperCase();
  await Promise.all([loadNotes(),loadProgress()]);
 };
 async function loadNotes(){
  const {data,error}=await sb.from("notes").select("id,title,body,created_at").order("created_at",{ascending:false}).limit(50);
  if(error){lbMessage(notice,"Could not load notes: "+error.message);return;}
  document.querySelector("#note-count").textContent=data.length;
  document.querySelector("#notes-list").innerHTML=data.length?data.map(n=>`<article class="saved-note"><div><strong>${esc(n.title)}</strong><small>${new Date(n.created_at).toLocaleString()}</small></div><p>${esc(n.body)}</p><button class="delete-note" data-id="${esc(n.id)}" aria-label="Delete note">Delete</button></article>`).join(""):'<p class="muted">No notes yet. Add your first field note above.</p>';
 }
 async function loadProgress(){
  const {data,error}=await sb.from("lab_progress").select("track_id,completed");
  if(error){lbMessage(notice,"Could not load progress: "+error.message);return;}
  const done=new Set(data.filter(x=>x.completed).map(x=>x.track_id));
  document.querySelector("#progress-count").textContent=done.size;
  document.querySelectorAll("[data-track]").forEach(b=>{
   const complete=done.has(b.dataset.track);b.textContent=complete?"Completed ✓":"Mark complete +";b.classList.toggle("is-complete",complete);
  });
 }
 document.querySelector("#signout").addEventListener("click",lbSignOut);
 document.querySelector("#note-form").addEventListener("submit",async e=>{
  e.preventDefault();const f=e.currentTarget,button=f.querySelector("button");button.disabled=true;
  const {error}=await sb.from("notes").insert({user_id:user.id,title:f["note-title"].value.trim(),body:f["note-body"].value.trim()});
  button.disabled=false;if(error)return lbMessage(notice,"Could not save note: "+error.message,"error");
  f.reset();lbClearMessage(notice);await loadNotes();
 });
 document.querySelector("#notes-list").addEventListener("click",async e=>{
  const b=e.target.closest("[data-id]");if(!b)return;
  const {error}=await sb.from("notes").delete().eq("id",b.dataset.id);
  if(error)return lbMessage(notice,error.message);await loadNotes();
 });
 document.querySelectorAll("[data-track]").forEach(b=>b.addEventListener("click",async()=>{
  b.disabled=true;const {error}=await sb.from("lab_progress").upsert({user_id:user.id,track_id:b.dataset.track,completed:true,completed_at:new Date().toISOString()},{onConflict:"user_id,track_id"});
  b.disabled=false;if(error)return lbMessage(notice,error.message);await loadProgress();
 }));
 sb.auth.onAuthStateChange((event,session)=>{if(event==="SIGNED_OUT"||!session)location.replace("signin.html");});
 init();
})();