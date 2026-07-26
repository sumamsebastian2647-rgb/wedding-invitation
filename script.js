const GUESTBOOK_API = "https://script.google.com/macros/s/AKfycbzFfSmQQmPJUUZV5VICG3D_5GbaiKf2T4VMSP_ZZfsB9Uz8eVEgY6jXS3Hth5iOo6Ei/exec";

const menu = document.getElementById('menu');
const links = document.getElementById('links');
if (menu) menu.addEventListener('click', () => links.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

const weddingDate = new Date('2026-09-15T11:00:00+05:30').getTime();
function countdown(){
  let d = weddingDate - Date.now();
  if(d < 0) d = 0;
  document.getElementById('days').textContent = Math.floor(d/86400000);
  document.getElementById('hours').textContent = Math.floor(d%86400000/3600000);
  document.getElementById('mins').textContent = Math.floor(d%3600000/60000);
  document.getElementById('secs').textContent = Math.floor(d%60000/1000);
}
countdown();
setInterval(countdown,1000);

const topBtn=document.getElementById('top');
window.addEventListener('scroll',()=>topBtn.style.display=scrollY>500?'block':'none');
topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});

/* =========================
   SHARED WEDDING GUESTBOOK
========================= */
function openGuestbook(){
  const modal=document.getElementById('guestbookModal');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  setTimeout(()=>document.getElementById('guestName').focus(),100);
}

function closeGuestbook(){
  const modal=document.getElementById('guestbookModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}

const guestbookModal=document.getElementById('guestbookModal');
if(guestbookModal){
  guestbookModal.addEventListener('click',e=>{
    if(e.target===guestbookModal) closeGuestbook();
  });
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeGuestbook(); });

const guestbookForm=document.getElementById('guestbookForm');
if(guestbookForm){
  guestbookForm.addEventListener('submit',async function(event){
    event.preventDefault();
    const name=document.getElementById('guestName').value.trim();
    const message=document.getElementById('guestMessage').value.trim();
    const button=document.getElementById('publishButton');
    const status=document.getElementById('guestbookStatus');
    if(!name || !message){ status.textContent='Please enter your name and message.'; return; }
    button.disabled=true;
    button.textContent='Publishing...';
    status.textContent='';
    try{
      await fetch(GUESTBOOK_API,{
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify({name,message})
      });
      status.textContent='Thank you! Your blessing has been published ♥';
      guestbookForm.reset();
      setTimeout(()=>{ closeGuestbook(); loadWishes(); },1500);
    }catch(error){
      console.error(error);
      status.textContent='Something went wrong. Please try again.';
    }
    button.disabled=false;
    button.textContent='Publish ♥';
  });
}

async function loadWishes(){
  const wishesList=document.getElementById('wishesList');
  if(!wishesList) return;
  try{
    const response=await fetch(GUESTBOOK_API,{cache:'no-store'});
    const wishes=await response.json();
    if(!wishes.length){
      wishesList.innerHTML='<p class="loading-wishes">Be the first to leave a blessing ♥</p>';
      return;
    }
    wishesList.innerHTML='';
    wishes.forEach(wish=>{
      const card=document.createElement('article');
      card.className='wish-card';
      const name=document.createElement('div');
      name.className='wish-name';
      name.textContent=wish.name || 'A dear guest';
      const message=document.createElement('div');
      message.className='wish-message';
      message.textContent=wish.message || '';
      card.appendChild(name);
      card.appendChild(message);
      wishesList.appendChild(card);
    });
  }catch(error){
    console.error(error);
    wishesList.innerHTML='<p class="loading-wishes">Our guestbook will appear here soon ♥</p>';
  }
}

document.addEventListener('DOMContentLoaded',loadWishes);

/* Music button placeholder */
const music=document.getElementById('music'), audio=document.getElementById('audio');
music.onclick=()=>{
  if(!audio.src){toastMsg('Add your wedding MP3 file in the audio src in this page.');return}
  audio.paused?(audio.play(),music.textContent='❚❚'):(audio.pause(),music.textContent='♫');
};
function toastMsg(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("guestbookModal");
    const openBtn = document.getElementById("openGuestbookBtn");
    const closeBtn = document.querySelector(".close-btn");

    if (openBtn) {
        openBtn.addEventListener("click", function () {
            modal.classList.add("show");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            modal.classList.remove("show");
        });
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.remove("show");
            }
        });

    }

});
