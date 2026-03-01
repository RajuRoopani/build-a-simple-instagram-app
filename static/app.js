/**
 * app.js — Instagram Clone Frontend Logic
 * Single clean IIFE. No duplicates.
 */
(function () {
  'use strict';

  /* ═══ 1. MOCK DATA ═══ */
  var MOCK_DATA = {
    currentUser: {
      user_id:'u1', username:'you', display_name:'Your Name',
      profile_picture_url:'https://ui-avatars.com/api/?name=Your+Name&background=e0e0e0&color=555&size=150',
      bio:'Living the moment', follower_count:842, following_count:310
    },
    users: [
      {user_id:'u2',username:'alex_wanderer',display_name:'Alex Chen',profile_picture_url:'https://ui-avatars.com/api/?name=Alex+Chen&background=ffdde1&color=c0392b&size=56',follower_count:4201},
      {user_id:'u3',username:'sunsetlens',display_name:'Maya Torres',profile_picture_url:'https://ui-avatars.com/api/?name=Maya+Torres&background=d4f1f4&color=1a6b7a&size=56',follower_count:12800},
      {user_id:'u4',username:'foodie_felix',display_name:'Felix Bauer',profile_picture_url:'https://ui-avatars.com/api/?name=Felix+Bauer&background=fff3cd&color=856404&size=56',follower_count:7654},
      {user_id:'u5',username:'neon_nights',display_name:'Priya Sharma',profile_picture_url:'https://ui-avatars.com/api/?name=Priya+Sharma&background=e8d5f5&color=6a1b9a&size=56',follower_count:3310},
      {user_id:'u6',username:'mountain_mo',display_name:'Morgan Hill',profile_picture_url:'https://ui-avatars.com/api/?name=Morgan+Hill&background=d5f5e3&color=1e8449&size=56',follower_count:5500},
      {user_id:'u7',username:'studio_sab',display_name:'Sabrina Lowe',profile_picture_url:'https://ui-avatars.com/api/?name=Sabrina+Lowe&background=fde8d8&color=a04000&size=56',follower_count:9870},
      {user_id:'u8',username:'coastal_kai',display_name:'Kai Nakamura',profile_picture_url:'https://ui-avatars.com/api/?name=Kai+Nakamura&background=d6eaf8&color=1a5276&size=56',follower_count:6200},
      {user_id:'u9',username:'urban_iris',display_name:'Iris Vance',profile_picture_url:'https://ui-avatars.com/api/?name=Iris+Vance&background=f9ebea&color=922b21&size=56',follower_count:2980}
    ],
    posts: [
      {post_id:'p1',user_id:'u2',like_count:842,caption:'Golden hour never gets old #travel',content_url:'https://picsum.photos/seed/p1/600/600',created_at:new Date(Date.now()-2*3600e3).toISOString()},
      {post_id:'p2',user_id:'u3',like_count:2341,caption:'Caught this at 5am. Worth it',content_url:'https://picsum.photos/seed/p2/600/600',created_at:new Date(Date.now()-5*3600e3).toISOString()},
      {post_id:'p3',user_id:'u4',like_count:1105,caption:'Homemade ramen from scratch',content_url:'https://picsum.photos/seed/p3/600/600',created_at:new Date(Date.now()-8*3600e3).toISOString()},
      {post_id:'p4',user_id:'u5',like_count:678,caption:'The city never sleeps #neonlights',content_url:'https://picsum.photos/seed/p4/600/600',created_at:new Date(Date.now()-12*3600e3).toISOString()},
      {post_id:'p5',user_id:'u6',like_count:3200,caption:'Summit reached #hiking',content_url:'https://picsum.photos/seed/p5/600/600',created_at:new Date(Date.now()-86400e3).toISOString()},
      {post_id:'p6',user_id:'u7',like_count:1876,caption:'New branding project',content_url:'https://picsum.photos/seed/p6/600/600',created_at:new Date(Date.now()-1.5*86400e3).toISOString()},
      {post_id:'p7',user_id:'u8',like_count:990,caption:'Dawn patrol - Perfect conditions',content_url:'https://picsum.photos/seed/p7/600/600',created_at:new Date(Date.now()-2*86400e3).toISOString()},
      {post_id:'p8',user_id:'u9',like_count:542,caption:'Hidden mural on Grand Ave',content_url:'https://picsum.photos/seed/p8/600/600',created_at:new Date(Date.now()-3*86400e3).toISOString()},
      {post_id:'p9',user_id:'u2',like_count:721,caption:'Road trip day 3 - Nevada',content_url:'https://picsum.photos/seed/p9/600/600',created_at:new Date(Date.now()-4*86400e3).toISOString()},
      {post_id:'p10',user_id:'u3',like_count:4120,caption:'Long exposure waterfall',content_url:'https://picsum.photos/seed/p10/600/600',created_at:new Date(Date.now()-5*86400e3).toISOString()},
      {post_id:'p11',user_id:'u4',like_count:2890,caption:'Tokyo street food haul',content_url:'https://picsum.photos/seed/p11/600/600',created_at:new Date(Date.now()-6*86400e3).toISOString()},
      {post_id:'p12',user_id:'u6',like_count:1650,caption:'Wildflower season #pnw',content_url:'https://picsum.photos/seed/p12/600/600',created_at:new Date(Date.now()-7*86400e3).toISOString()}
    ],
    comments: {
      p1:[{user_id:'u3',text:'Stunning!'},{user_id:'u6',text:'Where is this?'}],
      p2:[{user_id:'u5',text:'The light is insane'}],
      p3:[{user_id:'u8',text:'Recipe please!'},{user_id:'u2',text:'Looks comforting!'}],
      p5:[{user_id:'u2',text:'Which trail?'},{user_id:'u3',text:'Need to do this!'}],
      p6:[{user_id:'u9',text:'Great typography'}],
      p7:[{user_id:'u6',text:'What a session!'}],
      p10:[{user_id:'u6',text:'Silky water'},{user_id:'u5',text:'Exposure time?'}],
      p11:[{user_id:'u9',text:'Tokyo food is amazing'}]
    },
    stories: [
      {user_id:'u2',seen:false},{user_id:'u3',seen:false},{user_id:'u4',seen:true},
      {user_id:'u5',seen:false},{user_id:'u6',seen:true},{user_id:'u7',seen:false},
      {user_id:'u8',seen:true},{user_id:'u9',seen:false}
    ],
    suggestions: ['u5','u7','u9']
  };

  /* ═══ 2. STATE ═══ */
  var state = {likedPosts:{},bookmarkedPosts:{},followedUsers:{},likeCounts:{},storyTimer:null,storyIndex:-1,toastTimer:null,tapTimer:null,lastTapWrap:null};
  MOCK_DATA.posts.forEach(function(p){state.likeCounts[p.post_id]=p.like_count;});
  var _overlay=null,_progBar=null;

  /* ═══ 3. HELPERS ═══ */
  function esc(s){var d=document.createElement('div');d.appendChild(document.createTextNode(s));return d.innerHTML;}
  function timeAgo(iso){var s=Math.floor((Date.now()-new Date(iso).getTime())/1000);if(s<60)return'just now';if(s<3600)return Math.floor(s/60)+'m';if(s<86400)return Math.floor(s/3600)+'h';return Math.floor(s/86400)+'d';}
  function userById(id){if(id===MOCK_DATA.currentUser.user_id)return MOCK_DATA.currentUser;for(var i=0;i<MOCK_DATA.users.length;i++){if(MOCK_DATA.users[i].user_id===id)return MOCK_DATA.users[i];}return null;}
  function commentsFor(pid){return MOCK_DATA.comments[pid]||[];}
  function fmtCount(n){if(n>=1e6)return(n/1e6).toFixed(1).replace(/\.0$/,'')+'m';if(n>=1e4)return(n/1e3).toFixed(1).replace(/\.0$/,'')+'k';if(n>=1e3)return n.toLocaleString();return''+n;}

  /* ═══ 4. RENDER ═══ */
  function renderStories(){
    var bar=document.getElementById('storiesBar');if(!bar)return;
    var html='',cu=MOCK_DATA.currentUser;
    html+='<div class="story-item story-item--own" role="listitem"><div class="story-item__ring"><img src="'+cu.profile_picture_url+'" alt="'+esc(cu.display_name)+'" class="story-item__avatar" /></div><span class="story-item__label">Your story</span></div>';
    MOCK_DATA.stories.forEach(function(s,i){
      var u=userById(s.user_id);if(!u)return;
      var sc=s.seen?' story-item--seen':'';
      html+='<div class="story-item'+sc+'" role="listitem" data-story-index="'+i+'"><div class="story-item__ring"><img src="'+u.profile_picture_url+'" alt="'+esc(u.display_name)+'" class="story-item__avatar" /></div><span class="story-item__label">'+esc(u.username)+'</span></div>';
    });
    bar.innerHTML=html;
    var items=bar.querySelectorAll('.story-item[data-story-index]');
    for(var i=0;i<items.length;i++){items[i].addEventListener('click',(function(idx){return function(){openStory(idx);};})(parseInt(items[i].getAttribute('data-story-index'),10)));}
  }

  function renderFeed(){
    var feed=document.getElementById('postFeed');if(!feed)return;
    var html='';
    MOCK_DATA.posts.forEach(function(p){
      var u=userById(p.user_id);if(!u)return;
      html+=buildPostCard(p,u,!!state.likedPosts[p.post_id],!!state.bookmarkedPosts[p.post_id],state.likeCounts[p.post_id]||p.like_count,commentsFor(p.post_id));
    });
    feed.innerHTML=html;
    attachPostEvents(feed);
  }

  function buildPostCard(p,u,liked,saved,lc,cmts){
    var hf=liked?'#ed4956':'none',hs=liked?'#ed4956':'currentColor',bf=saved?'currentColor':'none';
    var lCls=liked?' post-card__like-btn--active':'',sCls=saved?' post-card__save-btn--active':'';
    var h='<article class="post-card" data-post-id="'+p.post_id+'">'+
      '<header class="post-card__header">'+
      '<img class="post-card__avatar" src="'+u.profile_picture_url+'" alt="'+esc(u.display_name)+'" />'+
      '<div class="post-card__user-info"><span class="post-card__username">'+esc(u.username)+'</span><span class="post-card__time">'+timeAgo(p.created_at)+'</span></div>'+
      '<button class="post-card__more" aria-label="More options">\u00b7\u00b7\u00b7</button></header>'+
      '<div class="post-card__image-wrap">'+
      '<img class="post-card__image" src="'+p.content_url+'" alt="Post by '+esc(u.username)+'" loading="lazy" />'+
      '<div class="post-card__heart-overlay"><svg viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>'+
      '<div class="post-card__actions"><div class="post-card__actions-left">'+
      '<button class="post-card__like-btn'+lCls+'" aria-label="Like"><svg viewBox="0 0 24 24" fill="'+hf+'" stroke="'+hs+'" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>'+
      '<button class="post-card__comment-btn" aria-label="Comment"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>'+
      '<button class="post-card__share-btn" aria-label="Share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button></div>'+
      '<button class="post-card__save-btn'+sCls+'" aria-label="Save"><svg viewBox="0 0 24 24" fill="'+bf+'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button></div>'+
      '<div class="post-card__likes">'+fmtCount(lc)+' likes</div>'+
      '<div class="post-card__caption"><span class="post-card__caption-user">'+esc(u.username)+'</span> '+esc(p.caption)+'</div>';
    if(cmts.length>2)h+='<button class="post-card__view-comments">View all '+cmts.length+' comments</button>';
    cmts.slice(-2).forEach(function(c){var cu2=userById(c.user_id);h+='<div class="post-card__comment"><span class="post-card__comment-user">'+esc(cu2?cu2.username:'user')+'</span> '+esc(c.text)+'</div>';});
    h+='<form class="post-card__add-comment"><input type="text" class="post-card__comment-input" placeholder="Add a comment\u2026" aria-label="Add a comment" /><button type="submit" class="post-card__comment-submit" disabled>Post</button></form></article>';
    return h;
  }

  function attachPostEvents(feed){
    var lb=feed.querySelectorAll('.post-card__like-btn');
    for(var i=0;i<lb.length;i++){lb[i].addEventListener('click',function(){var c=this.closest('.post-card');if(c)toggleLike(c.getAttribute('data-post-id'));});}
    var sb=feed.querySelectorAll('.post-card__save-btn');
    for(var j=0;j<sb.length;j++){sb[j].addEventListener('click',function(){var c=this.closest('.post-card');if(c)toggleBookmark(c.getAttribute('data-post-id'));});}
    var iw=feed.querySelectorAll('.post-card__image-wrap');
    for(var k=0;k<iw.length;k++){iw[k].addEventListener('click',function(){
      var wrap=this,card=wrap.closest('.post-card');if(!card)return;
      var pid=card.getAttribute('data-post-id');
      if(state.lastTapWrap===wrap&&state.tapTimer){clearTimeout(state.tapTimer);state.tapTimer=null;state.lastTapWrap=null;if(!state.likedPosts[pid])toggleLike(pid);var ol=wrap.querySelector('.post-card__heart-overlay');if(ol){ol.classList.add('post-card__heart-overlay--show');setTimeout(function(){ol.classList.remove('post-card__heart-overlay--show');},900);}}
      else{state.lastTapWrap=wrap;state.tapTimer=setTimeout(function(){state.tapTimer=null;state.lastTapWrap=null;},350);}
    });}
    var fs=feed.querySelectorAll('.post-card__add-comment');
    for(var m=0;m<fs.length;m++){(function(form){
      var inp=form.querySelector('.post-card__comment-input'),btn=form.querySelector('.post-card__comment-submit');
      if(inp&&btn)inp.addEventListener('input',function(){btn.disabled=!inp.value.trim();});
      form.addEventListener('submit',function(e){e.preventDefault();var card=form.closest('.post-card');if(!card||!inp)return;submitComment(card.getAttribute('data-post-id'),inp.value.trim());inp.value='';if(btn)btn.disabled=true;});
    })(fs[m]);}
  }

  function renderSidebar(){
    var prof=document.getElementById('sidebarProfile');
    if(prof){var cu=MOCK_DATA.currentUser;prof.innerHTML='<div class="sidebar__profile-row"><img class="sidebar__profile-avatar" src="'+cu.profile_picture_url+'" alt="'+esc(cu.display_name)+'" /><div class="sidebar__profile-info"><span class="sidebar__profile-username">'+esc(cu.username)+'</span><span class="sidebar__profile-name">'+esc(cu.display_name)+'</span></div><button class="sidebar__switch-btn">Switch</button></div>';}
    var list=document.getElementById('suggestionsList');
    if(list){
      var html='';
      MOCK_DATA.suggestions.forEach(function(uid){var u=userById(uid);if(!u)return;var f=!!state.followedUsers[uid];var bc=f?'suggestion__btn suggestion__btn--following':'suggestion__btn';var bt=f?'Following':'Follow';html+='<div class="suggestion" data-user-id="'+uid+'"><img class="suggestion__avatar" src="'+u.profile_picture_url+'" alt="'+esc(u.display_name)+'" /><div class="suggestion__info"><span class="suggestion__username">'+esc(u.username)+'</span><span class="suggestion__meta">Suggested for you</span></div><button class="'+bc+'">'+bt+'</button></div>';});
      list.innerHTML=html;
      var btns=list.querySelectorAll('.suggestion__btn');
      for(var i=0;i<btns.length;i++){btns[i].addEventListener('click',function(){var sug=this.closest('.suggestion');if(sug)toggleFollow(sug.getAttribute('data-user-id'));});}
    }
  }

  /* ═══ 5. HANDLERS ═══ */
  function toggleLike(pid){
    var card=document.querySelector('.post-card[data-post-id="'+pid+'"]');if(!card)return;
    var btn=card.querySelector('.post-card__like-btn'),ld=card.querySelector('.post-card__likes');
    if(state.likedPosts[pid]){delete state.likedPosts[pid];state.likeCounts[pid]=(state.likeCounts[pid]||1)-1;if(btn){btn.classList.remove('post-card__like-btn--active');btn.querySelector('svg').setAttribute('fill','none');btn.querySelector('svg').setAttribute('stroke','currentColor');}}
    else{state.likedPosts[pid]=true;state.likeCounts[pid]=(state.likeCounts[pid]||0)+1;if(btn){btn.classList.add('post-card__like-btn--active');btn.querySelector('svg').setAttribute('fill','#ed4956');btn.querySelector('svg').setAttribute('stroke','#ed4956');btn.classList.add('post-card__like-btn--pop');setTimeout(function(){btn.classList.remove('post-card__like-btn--pop');},400);}}
    if(ld)ld.textContent=fmtCount(state.likeCounts[pid])+' likes';
  }

  function toggleBookmark(pid){
    var card=document.querySelector('.post-card[data-post-id="'+pid+'"]');if(!card)return;
    var btn=card.querySelector('.post-card__save-btn');
    if(state.bookmarkedPosts[pid]){delete state.bookmarkedPosts[pid];if(btn){btn.classList.remove('post-card__save-btn--active');btn.querySelector('svg').setAttribute('fill','none');}showToast('Post removed from saved');}
    else{state.bookmarkedPosts[pid]=true;if(btn){btn.classList.add('post-card__save-btn--active');btn.querySelector('svg').setAttribute('fill','currentColor');}showToast('Post saved');}
  }

  function toggleFollow(uid){
    if(state.followedUsers[uid])delete state.followedUsers[uid];else state.followedUsers[uid]=true;
    renderSidebar();
  }

  function submitComment(pid,text){
    if(!text)return;
    if(!MOCK_DATA.comments[pid])MOCK_DATA.comments[pid]=[];
    MOCK_DATA.comments[pid].push({user_id:MOCK_DATA.currentUser.user_id,text:text});
    var card=document.querySelector('.post-card[data-post-id="'+pid+'"]');if(!card)return;
    var cmts=commentsFor(pid),html='';
    if(cmts.length>2)html+='<button class="post-card__view-comments">View all '+cmts.length+' comments</button>';
    cmts.slice(-2).forEach(function(c){var cu2=userById(c.user_id);html+='<div class="post-card__comment"><span class="post-card__comment-user">'+esc(cu2?cu2.username:'user')+'</span> '+esc(c.text)+'</div>';});
    var old=card.querySelectorAll('.post-card__comment,.post-card__view-comments');for(var i=0;i<old.length;i++)old[i].remove();
    var form=card.querySelector('.post-card__add-comment');
    if(form){var tmp=document.createElement('div');tmp.innerHTML=html;while(tmp.firstChild)card.insertBefore(tmp.firstChild,form);}
    showToast('Comment added');
  }

  /* ═══ 6. STORIES ═══ */
  function openStory(idx){
    if(idx<0||idx>=MOCK_DATA.stories.length)return;
    state.storyIndex=idx;var s=MOCK_DATA.stories[idx],u=userById(s.user_id);if(!u||!_overlay)return;
    s.seen=true;
    document.getElementById('storyAvatar').src=u.profile_picture_url;
    document.getElementById('storyAvatar').alt=u.display_name;
    document.getElementById('storyUsername').textContent=u.username;
    document.getElementById('storyTime').textContent='2h';
    document.getElementById('storyImage').src='https://picsum.photos/seed/story'+u.user_id+'/400/700';
    document.getElementById('storyImage').alt='Story by '+u.username;
    _overlay.classList.add('story-overlay--active');
    document.body.style.overflow='hidden';
    if(_progBar){_progBar.style.transition='none';_progBar.style.width='0%';void _progBar.offsetWidth;_progBar.style.transition='width 5s linear';_progBar.style.width='100%';}
    clearTimeout(state.storyTimer);state.storyTimer=setTimeout(function(){advanceStory();},5000);
    var items=document.querySelectorAll('.story-item[data-story-index="'+idx+'"]');for(var i=0;i<items.length;i++)items[i].classList.add('story-item--seen');
  }
  function advanceStory(){var next=state.storyIndex+1;if(next<MOCK_DATA.stories.length)openStory(next);else closeStory();}
  function closeStory(){clearTimeout(state.storyTimer);state.storyIndex=-1;if(_overlay)_overlay.classList.remove('story-overlay--active');document.body.style.overflow='';}

  /* ═══ 7. TOAST ═══ */
  function showToast(msg){var t=document.getElementById('newPostsToast');if(!t)return;t.textContent=msg;t.classList.add('new-posts-toast--visible');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(function(){t.classList.remove('new-posts-toast--visible');},3000);}
  function setupToast(){var t=document.getElementById('newPostsToast');if(!t)return;t.addEventListener('click',function(){t.classList.remove('new-posts-toast--visible');window.scrollTo({top:0,behavior:'smooth'});});setTimeout(function(){showToast('New posts available');},30000);}

  /* ═══ 8. INIT ═══ */
  document.addEventListener('DOMContentLoaded',function(){
    _overlay=document.getElementById('storyOverlay');
    _progBar=document.getElementById('storyProgressBar');
    var cb=document.getElementById('storyClose');if(cb)cb.addEventListener('click',closeStory);
    if(_overlay)_overlay.addEventListener('click',function(e){if(e.target===_overlay)closeStory();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&_overlay&&_overlay.classList.contains('story-overlay--active'))closeStory();});
    renderStories();renderFeed();renderSidebar();setupToast();
  });
})();
