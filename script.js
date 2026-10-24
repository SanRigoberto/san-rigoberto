const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const toast = $('#toast');
let toastTimer;
function notify(message){
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove('show'),2600);
}
function safeText(text){return text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

$('#focusPost').addEventListener('click',()=>{
  $('.composer').classList.add('expanded'); $('#postText').focus();
});
$('#postText').addEventListener('focus',()=>$('.composer').classList.add('expanded'));
$('#publishBtn').addEventListener('click',()=>{
  const box=$('#postText'), text=box.value.trim();
  if(!text){$('.composer').classList.add('expanded');box.focus();notify('Escribe algo antes de publicar.');return;}
  const article=document.createElement('article');
  article.className='post card';
  article.innerHTML=`<div class="post-header"><span class="avatar">M</span><div class="post-author"><strong>Misael Martínez</strong><small>Ahora mismo · 🌎</small></div><button class="more-btn" aria-label="Más opciones">•••</button></div><p class="post-copy">${safeText(text).replace(/\n/g,'<br>')}</p><div class="post-stats"><span class="reaction-stack"><b>👍</b></span><span class="like-count">0 reacciones</span><span class="comment-count">0 comentarios</span></div><div class="post-actions"><button class="like-btn">♡ <span>Me gusta</span></button><button class="comment-btn">▢ <span>Comentar</span></button><button class="share-btn">↗ <span>Compartir</span></button></div><div class="comment-area hidden"><input placeholder="Escribe un comentario..." aria-label="Escribe un comentario"><button class="send-comment">Enviar</button></div>`;
  $('#posts').prepend(article); box.value=''; $('.composer').classList.remove('expanded');
  notify('¡Tu publicación ya está en San Rigoberto!');
});
document.addEventListener('click',e=>{
  const like=e.target.closest('.like-btn');
  if(like){
    like.classList.toggle('liked');
    const liked=like.classList.contains('liked');
    like.innerHTML=(liked?'♥':'♡')+' <span>'+(liked?'Te gusta':'Me gusta')+'</span>';
    const post=like.closest('.post'), count=$('.like-count',post);
    const n=parseInt(count.dataset.base || count.textContent)||0;
    if(!count.dataset.base) count.dataset.base=n;
    count.textContent=(Math.max(0,n+(liked?1:-1)))+' reacciones';
    return;
  }
  const comment=e.target.closest('.comment-btn');
  if(comment){const area=$('.comment-area',comment.closest('.post'));area.classList.toggle('hidden');if(!area.classList.contains('hidden'))$('input',area).focus();return;}
  const send=e.target.closest('.send-comment');
  if(send){
    const area=send.closest('.comment-area'), input=$('input',area), value=input.value.trim();
    if(!value){notify('Escribe tu comentario primero.');return;}
    const post=send.closest('.post'), copy=document.createElement('p');
    copy.className='post-copy user-comment';copy.innerHTML='<strong>Tú:</strong> '+safeText(value);
    area.before(copy);input.value='';
    const count=$('.comment-count',post);const n=parseInt(count.dataset.base || count.textContent)||0;
    if(!count.dataset.base)count.dataset.base=n;count.dataset.base=n+1;count.textContent=(n+1)+' comentarios';
    notify('Comentario agregado.');return;
  }
  const share=e.target.closest('.share-btn');
  if(share){notify('¡Comparte San Rigoberto con tus amigos!');return;}
  const confirm=e.target.closest('.confirm-btn');
  if(confirm){const row=confirm.closest('.friend-request');row.innerHTML='<span class="group-icon green">✓</span><div class="friend-info"><strong>Solicitud aceptada</strong><small>Ahora son amigos en San Rigoberto.</small></div>';notify('¡Ahora son amigos!');return;}
  const del=e.target.closest('.delete-btn');
  if(del){del.closest('.friend-request').remove();notify('Solicitud eliminada.');return;}
  const nav=e.target.closest('[data-nav]');
  if(nav){$$('[data-nav]').forEach(b=>b.classList.toggle('active',b===nav));$$('.side-nav button').forEach(b=>b.classList.toggle('selected',b.dataset.nav===nav.dataset.nav));if(nav.dataset.nav!=='Inicio')notify(nav.dataset.nav+' estará disponible en la versión completa.');else window.scrollTo({top:0,behavior:'smooth'});return;}
  const story=e.target.closest('[data-story]');
  if(story){notify('Estás viendo la historia de '+story.dataset.story+'.');return;}
  const trend=e.target.closest('[data-tag]');
  if(trend){$('#searchInput').value=trend.dataset.tag;filterPosts(trend.dataset.tag);notify('Mostrando publicaciones relacionadas con '+trend.dataset.tag);return;}
});
$('#createStory').addEventListener('click',()=>notify('La creación de historias se puede añadir en la siguiente versión.'));
$('#allStories').addEventListener('click',()=>notify('Mostrando las historias recientes.'));
$('#joinBtn').addEventListener('click',()=>document.querySelector('.stories-section').scrollIntoView({behavior:'smooth',block:'center'}));
$('#seeRequests').addEventListener('click',()=>notify('Aquí aparecerán todas tus solicitudes.'));
$('#refreshTrends').addEventListener('click',()=>notify('Tendencias actualizadas.'));
$('#adBtn').addEventListener('click',()=>notify('¡Gracias por explorar San Rigoberto!'));
$('#filterBtn').addEventListener('click',()=>notify('Estás viendo las publicaciones más recientes.'));
function filterPosts(query){
  const q=query.toLowerCase().trim();
  $$('.post').forEach(post=>{post.style.display=!q||post.textContent.toLowerCase().includes(q)?'':'none';});
}
$('#searchInput').addEventListener('input',e=>filterPosts(e.target.value));
$('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter'){filterPosts(e.target.value);notify(e.target.value?'Resultados de búsqueda actualizados.':'Mostrando todas las publicaciones.');}});
