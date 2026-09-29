/* 타코베베 메인 — 공구 일정 (카카오워크 캘린더 연동)
   상단공통페이지에서 <script src="https://takkobebe-link.vercel.app/tkbb-main.js?v=..."> 로 불러 쓴다.
   수정은 이 파일을 고치고 `npx vercel deploy --prod --yes --scope takko` 로 배포.
   되돌리려면 상단공통페이지의 script 한 줄만 지우면 이미지맵 캘린더가 그대로 다시 보인다. */
(function(){
	var CSS = ".tkbb-chips{display:flex;gap:7px;padding:11px 16px 3px;overflow-x:auto;-webkit-overflow-scrolling:touch;}\n.tkbb-chips::-webkit-scrollbar{display:none;}\n.tkbb-chip{flex:0 0 auto;display:flex;align-items:center;gap:7px;background:#F7F5EE;border-radius:10px;padding:7px 11px 7px 7px;text-decoration:none;}\n.tkbb-chip.live{background:#D1D798;}\n.tkbb-chip .th{width:31px;height:31px;flex:0 0 31px;background:#E3DFD2;border-radius:7px;overflow:hidden;}\n.tkbb-chip .th img{width:100%;height:100%;object-fit:cover;display:block;}\n.tkbb-chip .t1{font-size:11.5px;font-weight:400;color:#161616;line-height:1.25;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n.tkbb-chip .t2{font-size:10px;font-weight:300;color:#6A6A66;margin-top:2px;}\n.tkbb-chip.live .t2{color:#4A4E2A;}\n.tkbb-chip.live .th{background:#fff;}\n\n.tkbb-cal{padding:0 16px;}\n.tkbb-cal .st{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px;}\n.tkbb-cal .st h2{font-size:17px;font-weight:500;color:#161616;letter-spacing:-.03em;margin:0;}\n.tkbb-cal .st a{font-size:11px;font-weight:300;color:#6A6A66;text-decoration:none;}\n.tkbb-cal .sub{font-size:11.5px;font-weight:300;color:#6A6A66;margin:0 0 11px;line-height:1.4;}\n.tkbb-days{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;margin-bottom:12px;padding-bottom:2px;}\n.tkbb-days::-webkit-scrollbar{display:none;}\n.tkbb-day{flex:0 0 auto;display:flex;align-items:center;gap:4px;padding:3px 10px;background:#fff;border:1px solid #E7E4DA;border-radius:999px;}\n.tkbb-day .dd{font-size:11px;font-weight:400;color:#161616;}\n.tkbb-day .dw{font-size:9.5px;font-weight:300;color:#6A6A66;}\n.tkbb-day.on{background:#161616;border-color:#161616;}\n.tkbb-day.on .dd,.tkbb-day.on .dw{color:#fff;}\n.tkbb-day.has:after{content:'';width:3.5px;height:3.5px;border-radius:50%;background:#B9C077;}\n.tkbb-day.on.has:after{background:#D1D798;}\n.tkbb-list{margin:0;padding:0;list-style:none;}\n.tkbb-list li{display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid #EFEDE6;}\n.tkbb-list li:first-child{border-top:1px solid #DAD5C8;}\n.tkbb-list .dt{width:44px;flex:0 0 44px;text-align:center;}\n.tkbb-list .dt .m{font-size:9.5px;font-weight:300;color:#6A6A66;}\n.tkbb-list .dt .d{font-size:16.5px;font-weight:500;color:#161616;line-height:1.1;}\n.tkbb-list .tx{flex:1;min-width:0;}\n.tkbb-list .tx .n{font-size:12.5px;font-weight:400;color:#161616;line-height:1.35;}\n.tkbb-list .tx .s{font-size:10.5px;font-weight:300;color:#6A6A66;margin-top:2px;}\n.tkbb-list .go{font-size:10.5px;font-weight:300;color:#3E4220;background:#D1D798;padding:6px 10px;border-radius:3px;white-space:nowrap;text-decoration:none;}\n.tkbb-list .soonmark{font-size:10.5px;font-weight:300;color:#9a9682;white-space:nowrap;}\n.tkbb-cal .empty{font-size:12px;font-weight:300;color:#6A6A66;padding:14px 0;}\n.tkbb-hero{padding:0 0 0;}\n.tkbb-hero .ib{position:relative;overflow:hidden;background-position:center;background-size:cover;background-repeat:no-repeat;}\n.tkbb-hero .ib:before{content:'';position:absolute;inset:-60px;background:inherit;filter:blur(48px);}\n.tkbb-hero .ib .bg{position:absolute;top:-12px;bottom:-12px;width:34%;background-image:inherit;background-repeat:no-repeat;background-size:2000% 124%;filter:blur(5px);}\n.tkbb-hero .ib .bg.l{left:-12px;background-position:left center;}\n.tkbb-hero .ib .bg.r{right:-12px;background-position:right center;}\n.tkbb-hero .ib img{position:relative;z-index:1;width:100%;aspect-ratio:1/0.96;object-fit:contain;display:block;background:none;}\n.tkbb-hero .tag,.tkbb-hero .dday,.tkbb-hero .cta,.tkbb-hero .copy{z-index:2;}\n.tkbb-hero .tag{position:absolute;top:12px;left:12px;background:rgba(22,22,22,.66);color:#fff;font-size:10.5px;font-weight:300;padding:5px 9px;}\n.tkbb-hero .dday{position:absolute;top:12px;right:12px;background:rgba(82,114,138,.9);color:#fff;font-size:10.5px;font-weight:400;padding:5px 9px;}\n.tkbb-hero .cta{position:absolute;left:32px;right:32px;bottom:18px;background:rgba(255,255,255,.94);text-align:center;font-size:12.5px;font-weight:400;color:#161616;padding:8px 0;text-decoration:none;display:block;}\n.tkbb-hero .ib.full img{object-fit:cover;}\n.tkbb-hero .ib.full .bg,.tkbb-hero .ib.full:before{display:none;}\n.tkbb-hero .ib.nopic{aspect-ratio:auto;background:#EEEADF;padding:26px 20px 64px;text-align:center;}\n.tkbb-hero .ib.nopic:before,.tkbb-hero .ib.nopic .bg{display:none;}\n.tkbb-hero .ib.nopic .npn{position:relative;z-index:2;font-size:18px;font-weight:500;color:#161616;letter-spacing:-.03em;line-height:1.35;}\n.tkbb-hero .ib.nopic .npd{position:relative;z-index:2;font-size:12.5px;font-weight:300;color:#6A6A66;margin-top:7px;}\n.tkbb-hero .bd{padding:12px 16px 0;}\n.tkbb-hero .bd .nm{font-size:17.5px;font-weight:500;color:#161616;line-height:1.35;}\n.tkbb-hero .bd .ds{font-size:12px;font-weight:300;color:#6A6A66;margin-top:4px;line-height:1.45;}\n.tkbb-hero .bd .pr{margin-top:7px;font-size:19px;font-weight:600;color:#161616;}\n.tkbb-hero .bd .pr em{font-style:normal;font-size:13px;font-weight:400;color:#52728A;margin-right:7px;}\n.tkbb-hero .bd .pr s{margin-left:6px;font-size:12.5px;font-weight:300;color:#b5b2a8;text-decoration:line-through;}\n\n.tkbb-quick{display:flex;gap:5px;padding:18px 11px 16px;justify-content:space-between;margin-top:16px;border-top:1px solid #EFEDE6;overflow-x:auto;-webkit-overflow-scrolling:touch;}\n.tkbb-quick::-webkit-scrollbar{display:none;}\n.tkbb-qi{flex:0 0 auto;text-align:center;width:47px;text-decoration:none;}\n.tkbb-qi .cir{width:47px;height:47px;border-radius:50%;overflow:hidden;background:#EFEDE6;}\n.tkbb-qi .cir img{width:100%;height:100%;object-fit:cover;display:block;}\n.tkbb-qi .cir.on{box-shadow:0 0 0 2px #B9C077;}\n.tkbb-qi p{font-size:9.5px;letter-spacing:-.06em;white-space:nowrap;font-weight:300;color:#161616;margin:6px 0 0;line-height:1.25;}\n.tkbb-qi .num{font-size:9.5px;color:#7C8340;}\n.tkbb-next{margin:12px 16px 0;background:#EEEADF;padding:14px;display:flex;align-items:center;gap:13px;}\n.tkbb-next .th{width:62px;height:62px;flex:0 0 62px;background:#fff;border-radius:8px;overflow:hidden;}\n.tkbb-next .th img{width:100%;height:100%;object-fit:cover;display:block;}\n.tkbb-next .bd{flex:1;min-width:0;}\n.tkbb-next .lb{font-size:10.5px;font-weight:300;color:#7C8340;letter-spacing:.02em;}\n.tkbb-next .nm{font-size:16.5px;font-weight:500;color:#161616;line-height:1.35;margin-top:5px;}\n.tkbb-next .dt{font-size:12px;font-weight:300;color:#6A6A66;margin-top:5px;}\n.tkbb-next .dt span{display:inline-block;margin-left:6px;background:#D1D798;color:#3E4220;font-size:10.5px;padding:2px 7px;border-radius:999px;}\n.tkbb-sec{padding:22px 16px 0;}\n.tkbb-sec .st{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px;}\n.tkbb-sec .st h2{font-size:17px;font-weight:500;color:#161616;letter-spacing:-.03em;margin:0;}\n.tkbb-sec .st a{font-size:11px;font-weight:300;color:#6A6A66;text-decoration:none;}\n.tkbb-sec .sub{font-size:11.5px;font-weight:300;color:#6A6A66;margin:-5px 0 11px;line-height:1.4;}\n.tkbb-row{display:flex;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;}\n.tkbb-row::-webkit-scrollbar{display:none;}\n.tkbb-row .c{width:122px;flex:0 0 122px;text-decoration:none;}\n.tkbb-row .c .ib,.tkbb-grid .c .ib{position:relative;}\n.tkbb-row .c img{width:100%;aspect-ratio:1/1.2;object-fit:cover;display:block;background:#EFEDE6;}\n.tkbb-row .c .d,.tkbb-grid .c .d{position:absolute;left:0;bottom:0;right:0;background:rgba(22,22,22,.6);color:#fff;font-size:10px;font-weight:300;padding:4px 6px;}\n.tkbb-row .c p{font-size:11.5px;font-weight:300;color:#161616;line-height:1.35;margin:6px 0 0;height:30px;overflow:hidden;}\n.tkbb-row .c b{display:block;font-size:13px;font-weight:600;color:#161616;}\n.tkbb-row .c b s{font-weight:300;font-size:10.5px;color:#b5b2a8;margin-left:4px;text-decoration:line-through;}\n.tkbb-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px 8px;}\n.tkbb-grid .c{text-decoration:none;}\n.tkbb-grid .c img{width:100%;aspect-ratio:1/1.2;object-fit:cover;display:block;background:#EFEDE6;}\n.tkbb-grid .c p{font-size:11.5px;font-weight:300;color:#161616;line-height:1.35;margin:6px 0 0;height:30px;overflow:hidden;}\n.tkbb-grid .c b{display:block;font-size:13px;font-weight:600;color:#161616;}\n.tkbb-grid .c b s{font-weight:300;font-size:10.5px;color:#b5b2a8;margin-left:4px;text-decoration:line-through;}\n.tkbb-more{margin:14px 10px 0;display:block;background:#D1D798;border:0;border-radius:3px;text-align:center;font-size:12px;font-weight:400;color:#3E4220;padding:11px 0;text-decoration:none;}\n.tkbb-req{background:#EEEADF;margin-top:22px;padding:19px 16px;}\n.tkbb-req h2{font-size:16px;font-weight:500;color:#161616;margin:0;}\n.tkbb-req .p{font-size:11.5px;font-weight:300;color:#6A6A66;margin:4px 0 0;}\n.tkbb-req ul{margin:11px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;}\n.tkbb-req li a{display:flex;justify-content:space-between;gap:10px;background:#F7F5EE;padding:10px 12px;font-size:12.5px;font-weight:300;color:#161616;text-decoration:none;}\n.tkbb-req li span{color:#6A6A66;font-size:10.5px;white-space:nowrap;}\n.tkbb-req .cta2{margin-top:11px;display:block;background:#161616;color:#fff;text-align:center;font-size:12.5px;font-weight:400;padding:12px 0;text-decoration:none;}\n.tkbb-rec{display:flex;gap:8px;margin-top:10px;overflow-x:auto;-webkit-overflow-scrolling:touch;}\n.tkbb-rec::-webkit-scrollbar{display:none;}\n.tkbb-rec .c{width:118px;flex:0 0 118px;text-decoration:none;}\n.tkbb-rec .c .ph{width:100%;aspect-ratio:1/0.8;background:#EFEDE6;overflow:hidden;}\n.tkbb-rec .c .ph img{width:100%;height:100%;object-fit:cover;display:block;}\n.tkbb-rec .c p{font-size:11px;font-weight:300;color:#161616;line-height:1.35;margin:6px 0 0;}\n.tkbb-plist{margin:0;padding:0;list-style:none;border-top:1px solid #DAD5C8;}\n.tkbb-plist li{border-bottom:1px solid #EFEDE6;}\n.tkbb-plist li a{display:block;padding:11px 2px;font-size:12.5px;font-weight:300;color:#161616;text-decoration:none;line-height:1.35;}\n.tkbb-hero .copy{position:absolute;top:52px;left:16px;right:16px;font-size:14.5px;font-weight:500;color:#161616;line-height:1.4;letter-spacing:-.03em;text-shadow:0 1px 7px rgba(255,255,255,.8);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}\n.tkbb-hero .tag{left:12px;right:auto;}\n.tkbb-hero .cta{left:22px;right:22px;bottom:16px;background:rgba(255,255,255,.88);}\n.tkbb-hero .hs{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;}\n.tkbb-hero .hs::-webkit-scrollbar{display:none;}\n.tkbb-hero .sl{flex:0 0 100%;width:100%;scroll-snap-align:start;}\n.tkbb-hero .hdots{display:flex;justify-content:center;gap:6px;padding:11px 0 0;}\n.tkbb-hero .hdots i{display:block;width:6px;height:6px;border-radius:50%;background:#DAD5C8;transition:background .25s;}\n.tkbb-hero .hdots i.on{background:#161616;}\n/* 퀵메뉴에서 건너뛸 때 고정 헤더(50px)에 제목이 가리지 않게 */\n#tkbb-live{scroll-margin-top:62px;}\n.tkbb-sec,.tkbb-req,.tkbb-cal{scroll-margin-top:62px;}\n\n/* 상품상세 상단 : 평점 · 할인율 · 공구 마감 */\n.tkbb-dt-rate{display:flex;align-items:center;gap:7px;margin:7px 0 0;font-size:11.5px;font-weight:300;color:#6A6A66;}\n.tkbb-dt-rate .st{color:#161616;font-size:11px;letter-spacing:.5px;}\n.tkbb-dt-rate b{font-weight:500;color:#161616;font-size:12.5px;}\n.tkbb-dt-rate a{color:#6A6A66;text-decoration:underline;text-underline-offset:2px;}\n#detail .price .tkbb-per{font-style:normal;font-size:15px;font-weight:600;color:#52728A;margin-right:8px;}\n.tkbb-dt-dday{display:inline-block;margin:9px 0 0;padding:4px 11px;border-radius:999px;background:#D1D798;color:#3E4220;font-size:11.5px;font-weight:400;letter-spacing:-.02em;}\n.tkbb-dt-dday.end{background:#EFEDE6;color:#6A6A66;}\n.tkbb-dt-dday.soon{background:#E6ECF0;color:#52728A;}\n/* 공구 예정(상시판매) · 오픈 예정(오픈 전) 상자 — 검정 D안. 카카오톡 알림 버튼은 2026-09-21 사용자 요청으로 둘 다 뺐다 */\n.tkbb-dt-soon{margin:11px 0 0;padding:12px 14px 13px;background:#161616;border-radius:8px;}\n.tkbb-dt-soon .h{margin:0;display:flex;align-items:baseline;gap:8px;font-size:14.5px;font-weight:600;color:#fff;letter-spacing:-.02em;}\n.tkbb-dt-soon .h b{font-size:12.5px;font-weight:600;color:#D1D798;}\n.tkbb-dt-soon .t{margin:5px 0 0;font-size:13px;font-weight:400;color:rgba(255,255,255,.82);line-height:1.5;letter-spacing:-.02em;}\n.tkbb-dt-soon .t strong{font-weight:600;color:#D1D798;}\n#detail .price .consumer{margin-left:8px;}\n\n/* 관심상품(하트) 누른 뒤 잠깐 뜨는 안내 */\n#tkbb-toast{position:fixed;left:50%;bottom:104px;z-index:10000;transform:translate(-50%,8px);opacity:0;transition:opacity .2s,transform .2s;display:flex;align-items:center;gap:14px;padding:11px 18px;border-radius:999px;background:rgba(22,22,22,.9);color:#fff;font-size:13px;font-weight:400;letter-spacing:-.02em;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.18);}\n#tkbb-toast.on{opacity:1;transform:translate(-50%,0);}\n#tkbb-toast.pc{bottom:48px;}\n\n/* PC 메인 — 이번 주 공구 (C안) */\n#main .tkbb-pcw{width:1200px;max-width:calc(100% - 80px);margin:0 auto;padding:34px 0 44px;font-family:inherit;letter-spacing:-.02em;}\n#main .tkbb-pcw .top{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 16px;}\n#main .tkbb-pcw .ttl{margin:0;font-size:26px;font-weight:700;letter-spacing:-.04em;color:#161616;}\n#main .tkbb-pcw .top a{font-size:13px;font-weight:400;color:#6A6A66;text-decoration:none;}\n#main .tkbb-pcw .row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:16px;}\n#main .tkbb-pcw .cd{display:block;min-width:0;color:#161616;text-decoration:none;}\n#main .tkbb-pcw .im{position:relative;display:block;height:340px;border-radius:4px;background:#E9E5DA center/cover no-repeat;overflow:hidden;}\n#main .tkbb-pcw .im.none{display:flex;flex-direction:column;align-items:center;justify-content:center;background:#F7F5EE;}\n#main .tkbb-pcw .im.none b{font-size:34px;font-weight:700;color:#161616;letter-spacing:-.03em;}\n#main .tkbb-pcw .im.none i{font-style:normal;font-size:13px;color:#6A6A66;margin-top:4px;}\n#main .tkbb-pcw .tg{position:absolute;left:12px;top:12px;font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px;background:#fff;color:#52728A;}\n#main .tkbb-pcw .tg.live{background:#D1D798;color:#2E3517;}\n#main .tkbb-pcw .tg.gg{color:#7C8340;}\n#main .tkbb-pcw .nm{margin:12px 0 0;font-size:15px;font-weight:500;color:#161616;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n#main .tkbb-pcw .big .nm{font-size:19px;font-weight:700;}\n#main .tkbb-pcw .pr{margin:6px 0 0;display:flex;align-items:baseline;gap:10px;font-size:22px;font-weight:700;color:#161616;}\n#main .tkbb-pcw .pr em{font-style:normal;font-size:16px;font-weight:600;color:#52728A;}\n#main .tkbb-pcw .pr s{font-size:13px;font-weight:400;color:#b5b2a8;}\n#main .tkbb-pcw .sub{margin:6px 0 0;font-size:12.5px;color:#6A6A66;}\n#tkbb-toast span{color:#fff;font-size:13px;}\n#tkbb-toast a{color:#D1D798;font-weight:500;text-decoration:none;}";
	var st = document.createElement("style");
	st.type = "text/css";
	st.appendChild(document.createTextNode(CSS));
	(document.head || document.documentElement).appendChild(st);
})();

(function(){
	if (window.__TKBB_CAL) return;
	window.__TKBB_CAL = 1;
	var P = location.pathname;
	if (P !== '/' && P !== '/index.php' && P !== '/main/index.php') return;
	// 메인 화면 꾸미기는 모바일 전용. PC 에도 이 파일을 불러오지만(상세페이지용) PC 메인은 건드리지 않는다
	if (window.browser_type === 'pc') return;

	// 일정 API 주소를 PC·모바일이 따로 쓴다(?o=pc / ?o=m). 같은 주소를 쓰면 브라우저가 PC용 응답을 모바일에 재사용해
	// CORS 로 막히고 모바일 메인 배너가 통째로 안 떴다(2026-09-21). 서버는 쿼리를 무시하고 같은 일정을 준다.
	var API = 'https://takkobebe-link.vercel.app/api/schedule?o=m';   // 이 블록은 모바일 메인 전용
	var WD = ['일','월','화','수','목','금','토'];
	var NEXT_EV = null;
	var DOC_CACHE = {};
	// 같은 상품 페이지를 여러 섹션이 쓰므로 한 번만 받아 재사용한다
	function getDoc(url){
		if (DOC_CACHE[url]) return Promise.resolve(DOC_CACHE[url]);
		return fetch(url).then(function(r){ return r.text(); }).then(function(t){
			var d = new DOMParser().parseFromString(t, 'text/html');
			DOC_CACHE[url] = d;
			return d;
		});
	}

	// 새 메인이 들어갈 자리. 템플릿의 <div id="tkbb-main"> 을 쓰고,
	// 아직 옛 템플릿이면 .calendar_bnr 의 부모를 기준으로 삼는다.
	function tkbbHost(){
		var a = document.getElementById('tkbb-main');
		if (a) return a;
		var b = document.querySelector('.calendar_bnr');
		return b ? b.parentNode : null;
	}

	function kstToday(){
		var d = new Date(Date.now() + 9*3600000);
		return d.toISOString().slice(0,10);
	}
	function ymd(s){ return (s||'').slice(0,10); }
	// 공구는 시작일 오전 10시에 연다 — 자정이 지났어도 10시 전이면 아직 '오픈 예정'
	var OPEN_HOUR = 10;
	function kstHour(){ return new Date(Date.now() + 9*3600000).getUTCHours(); }
	function opened(e, today){
		var s0 = ymd(e.start);
		return s0 < today || (s0 === today && kstHour() >= OPEN_HOUR);
	}
	function md(s){ var p = ymd(s).split('-'); return { m:+p[1], d:+p[2] }; }
	function wd(s){ var p = ymd(s).split('-'); return WD[new Date(Date.UTC(+p[0],+p[1]-1,+p[2])).getUTCDay()]; }
	function addDays(s, n){
		var p = ymd(s).split('-');
		var d = new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));
		d.setUTCDate(d.getUTCDate()+n);
		return d.toISOString().slice(0,10);
	}
	function esc(t){ return String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

	hideOld();   // 네트워크를 기다리지 않고 먼저 감춘다

	// 상단공통에서 미리 시작해 둔 요청이 있으면 그걸 쓴다 (스크립트 로딩을 기다리지 않게)
	var req = (window.__TKBB_PRE && typeof window.__TKBB_PRE.then === 'function')
	        ? window.__TKBB_PRE
	        : fetch(API).then(function(r){ return r.json(); });
	req.then(function(data){ if (data) run(data); }).catch(function(){});

	function run(data){
		var evs = (data && data.events) || [];
		if (!evs.length) return;
		// 캘린더 메모에 PC 주소(www)가 적혀 있으면 지금 보고 있는 주소(m 또는 www)로 바꾼다.
		// 다른 도메인으로 두면 브라우저가 CORS 로 막아서 배너·진행중 목록이 통째로 안 그려진다.
		for (var n=0;n<evs.length;n++){
			var u = evs[n].url;
			if (!u) continue;
			var m2 = String(u).match(/^https?:\/\/(?:www|m)\.takkobebe\.com(\/.*)$/i);
			if (m2) evs[n].url = location.origin + m2[1];
		}
		var today = kstToday();
		var live = [], soon = [];
		for (var i=0;i<evs.length;i++){
			var e = evs[i];
			if (ymd(e.end) < today) continue;
			if (opened(e, today)) live.push(e); else soon.push(e);
		}

		// 일정 API 가 상품 링크를 못 붙였을 때, 손님 브라우저에서 직접 쇼핑몰을 검색해 찾는다.
		// (서버에서 검색하면 쇼핑몰이 자동접근으로 보고 막을 때가 있어 브라우저 쪽을 믿는다)
		var SKIP = /\ud0c0\ucf54|\uae30\ud68d\uc804|\uacf5\uad6c|\uc624\ud508|\ub9c8\uac10|\ucc28$/;
		function findProduct(title){
			var base = String(title||'').replace(/\([^)]*\)/g,' ').replace(/\[[^\]]*\]/g,' ');
			var toks = (base.match(/[0-9A-Za-z\uac00-\ud7a3]{2,}/g) || []).filter(function(t){ return !SKIP.test(t); });
			if (toks.length < 2) return Promise.resolve(null);
			var cand = {};
			return toks.slice(0,3).reduce(function(chain, tok){
				return chain.then(function(){
					return fetch('/shop/search_result.php?search_str=' + encodeURIComponent(tok))
						.then(function(r){ return r.text(); })
						.then(function(t){
							var d = new DOMParser().parseFromString(t, 'text/html');
							var as = d.querySelectorAll('p.name a');
							for (var i=0;i<as.length;i++){
								var m = (as[i].getAttribute('href')||'').match(/pno=([A-F0-9]{16,})/);
								if (m) cand[m[1]] = as[i].textContent.replace(/\s+/g,' ').trim();
							}
						}).catch(function(){});
				});
			}, Promise.resolve()).then(function(){
				var best = null, bs = 0;
				for (var pno in cand){
					var nm = cand[pno], sc = 0;
					for (var i=0;i<toks.length;i++) if (nm.indexOf(toks[i]) > -1) sc++;
					if (sc > bs) { best = pno; bs = sc; }
				}
				// 낱말이 2개 이상 겹쳐야 인정 (한 단어로 엉뚱한 상품이 걸리는 것 방지)
				return (best && bs >= 2) ? '/shop/detail.php?pno=' + best : null;
			});
		}

		// 연결된 상품 페이지를 한 번씩만 읽어 대표사진을 챙긴다.
		var all = live.concat(soon);
		Promise.all(all.slice(0,6).map(function(e){
			if (e.url) return Promise.resolve();
			return findProduct(e.title).then(function(u){ if (u) e.url = u; }).catch(function(){});
		})).then(function(){
		return Promise.all(all.map(function(e){
			if (!e.url) return Promise.resolve();
			// 일정 API 가 대표사진까지 담아 보내면 상품 페이지를 따로 받지 않는다 (배너가 훨씬 빨리 뜬다)
			if (e.img) return Promise.resolve();
			return getDoc(e.url).then(function(d){
				var im = d.querySelector('meta[property="og:image"]');
				if (im && im.getAttribute('content')) e.img = im.getAttribute('content');
				var sm = d.querySelector('.summary');
				if (sm) { var tx = sm.textContent.replace(/\s+/g,' ').trim(); if (tx && tx.length < 60) e.copy = tx; }
				var as = d.querySelectorAll('a,button,input');
				for (var k=0;k<as.length;k++){
					var tx = (as[k].textContent || as[k].value || '').replace(/\s+/g,' ').trim();
					if (tx === '\ubc14\ub85c\uad6c\ub9e4') { e.onSale = true; break; }
				}
			}).catch(function(){});
		}));
		}).then(function(){
			var live2 = [], soon2 = [];
			for (var j=0;j<all.length;j++){
				var e = all[j];
				// 진행 중 / 오픈 예정은 캘린더 날짜 + 오픈 시각(오전 10시)으로만 나눈다.
				// 예전엔 '상품이 이미 살 수 있으면' 진행 중으로 올렸는데, 상시 판매 상품에 할인 일정을 걸면
				// 늘 살 수 있는 상태라 몇 주 전부터 '이번 공구'로 떴다(배도라지크림 9/30 할인, 2026-09-21).
				// 시작일 당일이라도 오전 10시 전이면 '오픈 예정'으로 둔다(2026-09-28 사용자 요청).
				if (opened(e, today)) live2.push(e); else soon2.push(e);
			}
			// 정렬하지 않는다 — 캘린더 순서(시작일 → 제목 앞 번호 → 캘린더에 적힌 순서)를 그대로 쓴다
			render2(live2, soon2, today);
		});

		function render2(live, soon, today){
			RENDERED = true;
			// 템플릿에 잡아둔 배너 자리지킴 블록 치우기
			var ph = document.getElementById('tkbb-ph');
			if (ph && ph.parentNode) ph.parentNode.removeChild(ph);
			NEXT_EV = soon.length ? soon[0] : null;
			drawChips(live, soon, today);
			drawHero(live, soon, today);
			drawQuick(live, soon);
			drawCal(live, soon, today);
			drawLive(live, today);
			drawAlways();
			drawBoards();
		}
	}

	// ── (1) 헤더 아래 일정 칩
	function drawChips(live, soon, today){
		// 본문 래퍼(.calendar_bnr 의 부모) 맨 위에 넣는다.
		// <header> 는 비어 있고 실제 헤더는 고정 요소라 그 뒤에 넣으면 겹친다.
		var host = tkbbHost();
		if (!host) return;
		var list = live.concat(soon).slice(0,6);
		if (!list.length) return;
		var h = '<div class="tkbb-chips">';
		for (var i=0;i<list.length;i++){
			// 앞쪽 live.length 개가 진행 중 (캘린더 날짜 기준)
			var e = list[i], isLive = i < live.length;
			var s = md(e.start), en = md(e.end);
			// 이미 파는 상품(상시판매)에 잡힌 공구는 '오픈'이 아니라 '공구' — 상세페이지 '공구 예정' 안내와 같은 기준
			var when = ymd(e.start) === today ? '오늘 오전 '+OPEN_HOUR+'시 ' : (s.m+'월 '+s.d+'일 ');
			var sub = isLive ? (en.m+'/'+en.d+' 마감') : (when+(e.onSale ? '공구' : '오픈'));
			var tag = e.url ? 'a href="'+e.url+'"' : 'div';
			var end = e.url ? 'a' : 'div';
			h += '<'+tag+' class="tkbb-chip'+(isLive?' live':'')+'">'
			   +   '<div class="th">' + (e.img ? '<img src="' + e.img + '">' : '') + '</div>'
			   +   '<div><div class="t1">'+esc(e.title)+'</div><div class="t2">'+sub+'</div></div>'
			   + '</'+end+'>';
		}
		h += '</div>';
		var wrap = document.createElement('div');
		wrap.innerHTML = h;
		// 상단 배너는 헤더까지 꽉 차는 구조라 그 위에 넣으면 헤더에 가린다 → 배너 바로 아래에 넣는다
		var banner = host.querySelector('.swiper-container');
		var ref = banner ? banner.nextElementSibling : host.firstElementChild;
		host.insertBefore(wrap.firstChild, ref);
	}

	// ── (2) 타코캘린더 자리 → 곧 열려요
	function drawCal(live, soon, today){
		// 옛 템플릿이면 '타코캘린더' 자리를 대신하고, 새 템플릿이면 그냥 순서대로 넣는다
		var box = document.querySelector('.calendar_bnr');
		var oldTitle = null;
		if (box) {
			var hs = box.querySelectorAll('h2.subtitle');
			for (var i=0;i<hs.length;i++){ if (/캘린더/.test(hs[i].textContent)) { oldTitle = hs[i]; break; } }
			var img = box.querySelector('img[usemap]');
			if (img) img.style.display = 'none';
			var oldBnr = box.querySelector('.calender_banner');
			if (oldBnr) oldBnr.style.display = 'none';
			if (oldTitle) oldTitle.style.display = 'none';
		}

		// 날짜 칩 14일치
		var days = '';
		for (var k=0;k<14;k++){
			var day = addDays(today, k);
			var has = false;
			for (var j=0;j<soon.length;j++){ if (ymd(soon[j].start) === day) { has = true; break; } }
			for (var j2=0;j2<live.length;j2++){ if (ymd(live[j2].end) === day) { has = true; break; } }
			var p = md(day);
			days += '<div class="tkbb-day'+(k===0?' on':'')+(has?' has':'')+'">'
			      +   '<span class="dd">'+p.m+'.'+p.d+'</span><span class="dw">'+wd(day)+'</span>'
			      + '</div>';
		}

		// 리스트
		var rows = '';
		var items = soon.slice(0,5);
		for (var n=0;n<items.length;n++){
			var e = items[n], s = md(e.start), en2 = md(e.end);
			var right = e.url ? '<a class="go" href="'+e.url+'">보러가기</a>' : '<span class="soonmark">오픈 예정</span>';
			rows += '<li>'
			     +   '<div class="dt"><div class="m">'+s.m+'월</div><div class="d">'+s.d+'</div></div>'
			     +   '<div class="tx"><div class="n">'+esc(e.title)+'</div>'
			     +     '<div class="s">'+s.m+'/'+s.d+' – '+en2.m+'/'+en2.d+'</div></div>'
			     +   right
			     + '</li>';
		}
		if (!rows) rows = '<li style="border:0"><div class="empty">예정된 공구가 곧 올라옵니다</div></li>';

		var html = '<div class="tkbb-cal">'
		         +   '<div class="st"><h2>곧 열려요</h2><a href="https://takkobebe-link.vercel.app/month.html" target="_blank">전체 일정 ›</a></div>'
		         +   '<div class="sub">공구 일정과 자동으로 맞춰집니다</div>'
		         +   '<div class="tkbb-days">'+days+'</div>'
		         +   '<ul class="tkbb-list">'+rows+'</ul>'
		         + '</div>';
		var wrap = document.createElement('div');
		wrap.innerHTML = html;
		if (oldTitle && oldTitle.parentNode) oldTitle.parentNode.insertBefore(wrap.firstChild, oldTitle);
		else appendSec(wrap.firstChild, 0);
	}

	// ── 이번 공구 : 진행 중인 것 중 가장 먼저 끝나는 공구 1개
	// 진행 중인 공구를 한 장씩 보여준다. 2개 이상이면 2초마다 자동으로 넘어간다.
	// 히어로 슬라이드 한 장. API 가 준 값과 상품 페이지에서 읽은 값 둘 다 여기로 들어온다.
	function heroSlide(tg, today, o){
		var p1 = today.split('-'), p2 = ymd(tg.end).split('-');
		var dleft = Math.round((Date.UTC(+p2[0],+p2[1]-1,+p2[2]) - Date.UTC(+p1[0],+p1[1]-1,+p1[2])) / 86400000);
		var dday = dleft <= 0 ? '\uc624\ub298 \ub9c8\uac10' : ('D-' + dleft);
		var rate = '';
		var n1 = parseInt((o.sell||'').replace(/[^0-9]/g,''), 10), n2 = parseInt((o.cons||'').replace(/[^0-9]/g,''), 10);
		if (n1 && n2 && n2 > n1) rate = '<em>' + Math.round((1 - n1/n2) * 100) + '%</em>';
		var sellTx = o.sell || '';
		if (sellTx && sellTx.indexOf('\uc6d0') < 0) sellTx += '\uc6d0';
		// 아직 안 연 공구(10시 전) — 딱지·버튼·설명을 '오픈 예정'으로 바꿔 배너를 계속 보여 준다
		var st = md(tg.start);
		var openTx = (ymd(tg.start) === today ? '\uc624\ub298' : (st.m + '\uc6d4 ' + st.d + '\uc77c'))
		           + ' \uc624\uc804 ' + OPEN_HOUR + '\uc2dc \uc624\ud508';
		var tagTx = o.soon ? '\uc624\ud508 \uc608\uc815' : '\uc774\ubc88 \uacf5\uad6c';
		var ctaTx = o.soon ? '\uc0c1\ud488 \ubbf8\ub9ac \ubcf4\uae30' : '\ucd5c\ub300 \ud61c\ud0dd\uac00 \uad6c\ub9e4\ud558\ub7ec \uac00\uae30';
		var dsTx = o.soon ? openTx : dday;
		var nm = esc(String(o.name||tg.title).split('|')[0].trim());
		// 사진을 못 읽는 공구(바깥 링크 등)도 배너는 보여 준다 — 글자만 있는 배너
		var box = o.img
		    ? '<div class="ib" style="background-image:url(\'' + o.img + '\')">'
		      +   '<i class="bg l"></i><i class="bg r"></i>'
		      +   '<img src="' + o.img + '">'
		      +   (o.copy ? '<div class="copy">' + esc(o.copy) + '</div>' : '')
		    : '<div class="ib nopic">'
		      +   '<div class="npn">' + nm + '</div>'
		      +   '<div class="npd">' + (o.copy ? esc(o.copy) : dsTx) + '</div>';
		return '<div class="sl">'
		     +   box
		     +     '<div class="tag">' + tagTx + '</div>'
		     +     '<a class="cta" href="' + tg.url + '">' + ctaTx + '</a>'
		     +   '</div>'
		     +   (o.img
		         ? '<div class="bd"><div class="nm">' + nm + '</div>'
		           + '<div class="ds">' + (o.ship ? esc(o.ship) + ' \u00b7 ' : '') + dsTx + '</div>'
		           + (sellTx ? '<div class="pr">' + rate + esc(sellTx) + (o.cons ? '<s>' + esc(o.cons) + '</s>' : '') + '</div>' : '')
		           + '</div>'
		         : '')
		     + '</div>';
	}

	function drawHero(live, soon, today){
		var host = tkbbHost();
		if (!host) return;
		var targets = [], isSoon = false;
		for (var i=0;i<live.length;i++){ if (live[i].url) targets.push(live[i]); }
		// 아직 10시가 안 된 오늘 공구도 배너로 보여 준다 (2026-09-28 사용자 요청 — 배너가 통째로 비면 안 됨)
		if (!targets.length) {
			for (var s2=0;s2<soon.length;s2++){ if (soon[s2].url && ymd(soon[s2].start) === today) targets.push(soon[s2]); }
			isSoon = targets.length > 0;
		}
		if (!targets.length) { drawNext(host, today); return; }
		// 캘린더에 적힌 순서 그대로. 같은 날짜에서 위로 올리려면 제목 앞에 '1.' '2.' 를 붙인다.

		Promise.all(targets.map(function(tg){
			if (tg.img) return Promise.resolve(heroSlide(tg, today, {
				img: tg.img, name: tg.name, sell: tg.sell, cons: tg.cons, ship: tg.ship, copy: tg.copy, soon: isSoon
			}));
			return fetch(tg.url).then(function(r){ return r.text(); }).then(function(t){
				var d = new DOMParser().parseFromString(t, 'text/html');
				function og(n){ var m = d.querySelector('meta[property="og:' + n + '"]'); return m ? m.getAttribute('content') : ''; }
				var img = og('image');
				if (!img) return heroSlide(tg, today, { soon: isSoon });
				var name = (og('title') || tg.title).split('|')[0].trim();
				var sellEl = d.querySelector('.sell strong, .sell');
				var consEl = d.querySelector('.consumer');
				var sell = sellEl ? sellEl.textContent.replace(/\s+/g,' ').trim() : '';
				var cons = consEl ? consEl.textContent.replace(/\s+/g,' ').trim() : '';
				var rows = {};
				var trs = d.querySelectorAll('tr');
				for (var k=0;k<trs.length;k++){
					var th = trs[k].querySelector('th'), td = trs[k].querySelector('td');
					if (!th || !td) continue;
					// 줄바꿈(<br>)은 가운뎃점으로 살려서 한 줄로 만든다
					var tmp = document.createElement('div');
					tmp.innerHTML = td.innerHTML.replace(/<br\s*\/?>/gi, ' \u00b7 ');
					rows[th.textContent.replace(/\s+/g,' ').trim()] = tmp.textContent.replace(/\s+/g,' ').trim();
				}
				var ship = (rows['\ubc30\uc1a1\uc815\ubcf4'] || '').slice(0, 40);
				var COPY = tg.copy || '';
				var endD = ymd(tg.end), p1 = today.split('-'), p2 = endD.split('-');
				var dleft = Math.round((Date.UTC(+p2[0],+p2[1]-1,+p2[2]) - Date.UTC(+p1[0],+p1[1]-1,+p1[2])) / 86400000);
				var dday = dleft <= 0 ? '\uc624\ub298 \ub9c8\uac10' : ('D-' + dleft);
				var rate = '';
				var n1 = parseInt((sell||'').replace(/[^0-9]/g,''), 10), n2 = parseInt((cons||'').replace(/[^0-9]/g,''), 10);
				if (n1 && n2 && n2 > n1) rate = '<em>' + Math.round((1 - n1/n2) * 100) + '%</em>';

				return heroSlide(tg, today, { img: img, name: name, sell: sell, cons: cons, ship: ship, copy: COPY, soon: isSoon });
			}).catch(function(){ return heroSlide(tg, today, { soon: isSoon }); });
		})).then(function(slides){
			slides = slides.filter(function(x){ return x; });
			if (!slides.length) { drawNext(host, today); return; }
			var dots = '';
			for (var j=0;j<slides.length;j++) dots += '<i' + (j===0 ? ' class="on"' : '') + '></i>';
			var h = '<div class="tkbb-hero"><div class="hs">' + slides.join('') + '</div>'
			      + (slides.length > 1 ? '<div class="hdots">' + dots + '</div>' : '')
			      + '</div>';
			var wrap = document.createElement('div');
			wrap.innerHTML = h;
			var el = wrap.firstChild;
			var chips = host.querySelector('.tkbb-chips');
			host.insertBefore(el, chips ? chips.nextSibling : host.firstElementChild);
			fitHero(el);
			if (slides.length > 1) autoSlide(el, slides.length);
		}).catch(function(){});
	}

	// 사진 비율이 배너 칸과 거의 같으면(15% 안쪽) 흐린 띠 없이 꽉 채운다.
	// 띠는 세로로 긴 사진(로고가 잘리면 안 되는 브랜드 이미지)에만 쓴다 — 조금만 남는 틈에 띠를 깔면 경계가 보인다.
	function fitHero(hero){
		var imgs = hero.querySelectorAll('.ib img');
		for (var i=0;i<imgs.length;i++) (function(img){
			function fit(){
				var ib = img.parentNode;
				if (!img.naturalWidth || !ib) return;
				var r = img.naturalWidth / img.naturalHeight;
				var b = ib.getBoundingClientRect();
				if (!b.width || !b.height) return;
				var br = b.width / b.height;
				if (Math.abs(r - br) / br <= 0.15) ib.className = ib.className + ' full';
			}
			if (img.complete) fit(); else img.addEventListener('load', fit);
		})(imgs[i]);
	}

	// 3초마다 다음 장으로(2026-09-23 사용자 요청, 3.2초 → 3초). 손으로 넘기면 6초 멈춘다.
	function autoSlide(hero, n){
		var hs = hero.querySelector('.hs');
		var dots = hero.querySelectorAll('.hdots i');
		var cur = 0, paused = false, st = null, pt = null;
		function go(i){
			cur = ((i % n) + n) % n;
			var x = hs.clientWidth * cur;
			try { hs.scrollTo({ left: x, behavior: 'smooth' }); } catch(e) { hs.scrollLeft = x; }
		}
		function mark(){
			var w = hs.clientWidth || 1;
			var i = Math.round(hs.scrollLeft / w);
			if (i < 0) i = 0; if (i > n-1) i = n-1;
			cur = i;
			for (var k=0;k<dots.length;k++) dots[k].className = (k === i ? 'on' : '');
		}
		hs.addEventListener('scroll', function(){ clearTimeout(st); st = setTimeout(mark, 90); }, { passive: true });
		['touchstart','pointerdown'].forEach(function(ev){
			hs.addEventListener(ev, function(){
				paused = true; clearTimeout(pt);
				pt = setTimeout(function(){ paused = false; }, 6000);
			}, { passive: true });
		});
		setInterval(function(){
			if (paused) return;
			if (document.visibilityState && document.visibilityState !== 'visible') return;
			go(cur + 1);
		}, 3000);
	}

	// ── 퀵메뉴 : 원형 사진 + 이름, 1행 가로 스크롤
	function drawQuick(live, soon){
		var host = tkbbHost();
		if (!host) return;
		// 템플릿에 고정으로 박아 둔 퀵메뉴가 있으면 '공구진행' 숫자만 채운다
		var fixed = host.querySelector('.tkbb-quick');
		if (fixed) {
			// 개수는 표시하지 않는다 (2026-09-21 사용자 요청) — 템플릿에 span 이 남아 있어도 비워 둔다
			var n0 = fixed.querySelector('.num');
			if (n0 && n0.parentNode) n0.parentNode.removeChild(n0);
			return;
		}
		// 메인에 이미 깔린 상품 사진을 재활용
		var pics = [];
		var imgs = document.querySelectorAll('.prdimg img');
		for (var i=0;i<imgs.length && pics.length<8;i++){ if (imgs[i].src) pics.push(imgs[i].src); }
		function pic(n){ return pics[n] || ''; }

		// 고정 아이콘 이미지. 파일이 없으면 onerror 로 기존 상품사진이 대신 들어간다.
		var QM = 'https://takkobebe-link.vercel.app/qm/';
		var items = [
			// 순서는 메인 템플릿 퀵메뉴와 같게 (2026-09-22 사용자: 공구진행 · 상시판매 · 공구달력 · 후기 · 영양제 · 화장품 · 학용품)
			{t:'공구진행', n:live.length, img:QM+'1.jpg', alt:pic(0), href:'#tkbb-live', on:true},
			{t:'상시판매', img:QM+'2.jpg', alt:pic(1), href:'/shop/big_section.php?cno1=1005'},
			{t:'공구달력', img:QM+'7.jpg', alt:pic(6), href:'https://takkobebe-link.vercel.app/month.html'},
			{t:'후기',     img:QM+'6.jpg', alt:pic(5), href:'/shop/product_review_list.php'},
			{t:'영양제',   img:QM+'3.jpg', alt:pic(2), href:'/shop/big_section.php?cno1=1067'},
			{t:'화장품',   img:QM+'4.jpg', alt:pic(3), href:'/shop/big_section.php?cno1=1002'},
			{t:'학용품',   img:QM+'5.jpg', alt:pic(4), href:'/shop/big_section.php?cno1=1001'}
		];
		var h = '<div class="tkbb-quick">';
		for (var j=0;j<items.length;j++){
			var it = items[j];
			h += '<a class="tkbb-qi" href="' + it.href + '">'
			  +    '<div class="cir' + (it.on ? ' on' : '') + '">'
			  +      (it.img ? '<img src="' + it.img + '"' + (it.alt ? ' data-alt="' + it.alt + '"' : '') + ' onerror="if(this.dataset.alt){this.src=this.dataset.alt;this.removeAttribute(\'data-alt\');}else{this.style.display=\'none\';}">' : '')
			  +    '</div>'
			  +    '<p>' + it.t + (it.n ? '<span class="num"> ' + it.n + '</span>' : '') + '</p>'
			  +  '</a>';
		}
		h += '</div>';
		var wrap = document.createElement('div');
		wrap.innerHTML = h;
		// 히어로(진행중 상품) 또는 다음공구 카드 뒤에 놓는다
		var hero = host.querySelector('.tkbb-hero') || host.querySelector('.tkbb-next');
		var chips = host.querySelector('.tkbb-chips');
		var ref = hero ? hero.nextSibling : (chips ? chips.nextSibling : host.firstElementChild);
		host.insertBefore(wrap.firstChild, ref);
	}


	// 진행 중인 공구가 없을 때 : 다음 공구 안내 카드
	function drawNext(host, today){
		if (!NEXT_EV) return;
		var e = NEXT_EV, s1 = md(e.start), e1 = md(e.end);
		var p1 = today.split('-'), p2 = ymd(e.start).split('-');
		var dl = Math.round((Date.UTC(+p2[0],+p2[1]-1,+p2[2]) - Date.UTC(+p1[0],+p1[1]-1,+p1[2])) / 86400000);
		var act = e.onSale ? '공구 시작' : '오픈';
		var when = dl <= 0 ? '오늘 ' + act : (dl === 1 ? '내일 ' + act : ('D-' + dl));
		var h = '<div class="tkbb-next">'
		      +   (e.img ? '<div class="th"><img src="' + e.img + '"></div>' : '')
		      +   '<div class="bd"><div class="lb">다음 공구</div>'
		      +     '<div class="nm">' + esc(e.title) + '</div>'
		      +     '<div class="dt">' + s1.m + '월 ' + s1.d + '일 – ' + e1.m + '월 ' + e1.d + '일 <span>' + when + '</span></div>'
		      +   '</div>'
		      + '</div>';
		var wrap = document.createElement('div');
		wrap.innerHTML = h;
		var chips = host.querySelector('.tkbb-chips');
		host.insertBefore(wrap.firstChild, chips ? chips.nextSibling : host.firstElementChild);
	}


	// 공통: 새 섹션을 '곧 열려요'(.tkbb-cal) 뒤에 차례로 붙인다
	// 비동기로 끝나는 순서와 상관없이 항상 같은 순서로 놓는다 (숫자가 작을수록 위)
	// 섹션을 data-tkbb-order 순서대로 넣는다.
	// 기준이 되는 요소(곧 열려요 / 퀵메뉴)가 어느 부모에 있든 그 부모에 맞춰 넣어야 한다.
	function appendSec(el, order){
		el.setAttribute('data-tkbb-order', order);
		var after = document.querySelector('.tkbb-cal') || document.querySelector('.tkbb-quick');
		var host = after ? after.parentNode : tkbbHost();
		if (!host) return;
		var sibs = host.querySelectorAll('[data-tkbb-order]');
		for (var i=0;i<sibs.length;i++){
			if (sibs[i].parentNode !== host) continue;
			if (+sibs[i].getAttribute('data-tkbb-order') < order) after = sibs[i];
		}
		if (after && after.parentNode === host) host.insertBefore(el, after.nextSibling);
		else host.appendChild(el);
	}
	function price(el){ var v = el ? el.textContent.replace(/\s+/g,' ').trim() : ''; return /^0\s*\uc6d0$/.test(v) ? '' : v; }
	function card(p, badge){
		return '<a class="c" href="' + p.href + '">'
		     +   '<div class="ib"><img src="' + p.img + '">' + (badge ? '<div class="d">' + badge + '</div>' : '') + '</div>'
		     +   '<p>' + esc(p.nm) + '</p>'
		     +   '<b>' + esc(p.sell) + (p.cons ? '<s>' + esc(p.cons) + '</s>' : '') + '</b>'
		     + '</a>';
	}
	function pickProducts(doc, n){
		var out = [], boxes = doc.querySelectorAll('.box');
		for (var i=0;i<boxes.length && out.length<n;i++){
			var b = boxes[i];
			if (!b.querySelector('.prdimg') || b.className.indexOf('out') > -1) continue;
			var a = b.querySelector('.prdimg a'), im = b.querySelector('.prdimg img');
			var nm = b.querySelector('.name'), se = b.querySelector('.sell'), co = b.querySelector('.consumer');
			if (!a || !im || !nm) continue;
			out.push({
				href: a.getAttribute('href'), img: im.getAttribute('src'),
				nm: nm.textContent.replace(/\s+/g,' ').trim(),
				sell: price(se),
				cons: co ? co.textContent.replace(/\s+/g,' ').trim() : ''
			});
		}
		return out;
	}

	// ── 지금 진행 중 : 진행 중인 공구 상품들
	function drawLive(live, today){
		var urls = [];
		for (var i=0;i<live.length;i++){ if (live[i].url) urls.push(live[i]); }
		if (!urls.length) return;
		// 캘린더 순서 유지
		Promise.all(urls.slice(0,6).map(function(e){
			return fetch(e.url).then(function(r){ return r.text(); }).then(function(t){
				var d = new DOMParser().parseFromString(t,'text/html');
				var og = function(n){ var m = d.querySelector('meta[property="og:' + n + '"]'); return m ? m.getAttribute('content') : ''; };
				var se = d.querySelector('.sell strong, .sell'), co = d.querySelector('.consumer');
				var en = md(e.end);
				return { href: e.url, img: og('image'),
					nm: (og('title') || e.title).split('|')[0].trim(),
					sell: price(se),
					cons: co ? co.textContent.replace(/\s+/g,' ').trim() : '',
					badge: '' };
			}).catch(function(){ return null; });
		})).then(function(ps){
			ps = ps.filter(function(x){ return x && x.img; });
			if (!ps.length) return;
			var h = '<div class="tkbb-sec" id="tkbb-live"><div class="st"><h2>지금 진행 중</h2><span style="font-size:11px;font-weight:300;color:#6A6A66">마감 임박순</span></div><div class="tkbb-row">';
			for (var i=0;i<ps.length;i++) h += card(ps[i], ps[i].badge);
			h += '</div></div>';
			var w = document.createElement('div'); w.innerHTML = h;
			appendSec(w.firstChild, 1);
		});
	}

	// ── 언제든 살 수 있어요 : 먹거리 분류에서 판매중 4개
	function drawAlways(){
		fetch('/shop/big_section.php?cno1=1005').then(function(r){ return r.text(); }).then(function(t){
			var d = new DOMParser().parseFromString(t,'text/html');
			var ps = pickProducts(d, 4);
			if (ps.length < 2) return;
			var h = '<div class="tkbb-sec"><div class="st"><h2>언제든 살 수 있어요</h2>'
			      + '<a href="/shop/big_section.php?cno1=1005">전체 보기 ›</a></div>'
			      + '<div class="sub">공구가 끝나도 계속 주문할 수 있는 상품들</div><div class="tkbb-grid">';
			for (var i=0;i<ps.length;i++) h += card(ps[i], '');
			h += '</div><a class="tkbb-more" href="/shop/big_section.php?cno1=1005">먹거리 전체 보기</a></div>';
			var w = document.createElement('div'); w.innerHTML = h;
			appendSec(w.firstChild, 2);
		}).catch(function(){});
	}

	// ── 이거 공구해주세요 + 밥상레시피
	function drawBoards(){
		function posts(db, n){
			return fetch('/board/?db=' + db).then(function(r){ return r.text(); }).then(function(t){
				var d = new DOMParser().parseFromString(t,'text/html');
				var ul = d.querySelector('ul.list');
				if (!ul) return [];
				var out = [];
				for (var i=0;i<ul.children.length && out.length<n;i++){
					var li = ul.children[i];
					var ti = li.querySelector('.title'), stat = li.querySelector('.stat');
					if (!ti) continue;
					var no = (li.getAttribute('onclick') || '').match(/'(\d+)'\s*\)/);
					var date = stat ? (stat.textContent.match(/\d{4}-\d{2}-\d{2}/) || [''])[0] : '';
					out.push({ t: ti.textContent.replace(/\s+/g,' ').trim(),
						d: date ? date.slice(5).replace('-', '/') : '',
						href: '/board/?db=' + db + (no ? '&no=' + no[1] + '&mari_mode=view%40view' : '') });
				}
				return out;
			}).catch(function(){ return []; });
		}
		posts('basic_2', 5).then(function(ls){
			if (!ls.length) return;
			var h = '<div class="tkbb-req"><h2>이거 공구해주세요</h2>'
			      + '<div class="p">엄마들이 직접 올린 요청이 쌓이고 있어요</div><ul>';
			for (var i=0;i<ls.length;i++) h += '<li><a href="' + ls[i].href + '">' + esc(ls[i].t) + '<span>' + ls[i].d + '</span></a></li>';
			h += '</ul><a class="cta2" href="/board/?db=basic_2">나도 요청하기</a></div>';
			var w = document.createElement('div'); w.innerHTML = h;
			appendSec(w.firstChild, 3);
		});
		// 밥상레시피(basic_3)는 최신글이 2020-05 이라 메인에서 내림(2026-09-21).
		// 글을 다시 채우면 posts('basic_3', 4) 블록을 되살리고 appendSec 순서 4 로 넣으면 된다.
	}


	// ── 확정 시안에 없는 기존 메인 섹션 숨기기
	//    (지우는 게 아니라 감추기만 하므로, 이 스크립트를 떼면 그대로 다시 보인다)
	// 옛 메인 구성을 감춘다. 네트워크를 기다리지 않고 스크립트가 뜨자마자 실행해야
	// 손님이 옛 화면을 먼저 보는 일이 없다. 대신 새 화면을 못 그리면 7초 뒤 되돌린다.
	var HIDE_ST = null, RENDERED = false;
	function hideOld(){
		if (HIDE_ST) return;
		var sels = [
			'.swiper-container.visual_slide', // 상단 배너 슬라이드
			'.recommend.main_slide',          // 이런 상품 어때요?
			'.season',                        // 추석 선물
			'.event',
			'.best',                          // 먹거리 베스트
			'.group_item',                    // 순한 성분 온가족 스킨케어 등
			'.homecook',                      // 테마별 MD추천
			'.review',                        // 베스트 리뷰
			'.mid_banner',
			'.calendar_bnr img[usemap]',      // 손으로 만들던 타코캘린더 이미지맵
			'.calendar_bnr map',
			'.calendar_bnr .calender_banner',
			'.calendar_bnr h2.subtitle'
		];
		// 배너를 감추면 본문이 헤더(높이 50px) 밑으로 파고들어 로고와 겹친다 → 그만큼 여백을 준다
		var css = sels.join(',') + '{display:none !important;}'
		        + '.tkbb-chips{margin-top:52px;}';
		HIDE_ST = document.createElement('style');
		HIDE_ST.setAttribute('data-tkbb-hide', '1');
		HIDE_ST.appendChild(document.createTextNode(css));
		(document.head || document.documentElement).appendChild(HIDE_ST);
		// 일정을 못 받아 새 화면을 못 그렸으면 원래 화면을 돌려준다 (빈 페이지 방지)
		setTimeout(function(){
			if (!RENDERED && HIDE_ST && HIDE_ST.parentNode) HIDE_ST.parentNode.removeChild(HIDE_ST);
		}, 7000);
	}

})();


/* ── 상품상세 상단 정리 : 평점 · 할인율 · 공구 마감일 ───────────────────
   되돌리려면 이 블록만 지우면 된다. 2026-09-21 */
(function(){
	if (window.__TKBB_DT) return; window.__TKBB_DT = 1;
	if (location.pathname.indexOf('/shop/detail.php') < 0) return;

	function txt(el){ return el ? el.textContent.replace(/\s+/g,' ').trim() : ''; }
	function num(t){ var n = parseInt(String(t).replace(/[^0-9]/g,''), 10); return isNaN(n) ? 0 : n; }

	// 이 일정이 아직 시작 전인지. 공구는 시작일 오전 10시에 연다 — 그날 10시 전인데 아직 품절이면(= 아직 안 열었으면) 시작 전으로 본다.
	// 10시가 지나서도 품절이면 진짜 품절(공구 중 재고 소진)이고, 이미 바로구매가 되면 날짜대로 진행 중이다.
	function tkbbNotYet(start, today, hour, buyable){
		var s = String(start).slice(0,10);
		return s > today || (s === today && hour < 10 && !buyable);
	}

	// 오픈 전 공구 상품의 구매 버튼 — '품절' 대신 '판매예정'(2026-09-22 사용자 요청).
	// 눌러도 수량 창이나 '품절된 상품은 주문하실 수 없습니다' 대신 오픈 시각만 짧게 알려 주고, 장바구니는 아직 못 담으니 흐리게 한다.
	// 모바일은 하단 구매바가 두 벌(처음 보이는 것 · 수량 창이 열린 뒤 것), PC 는 상품정보 안 버튼 묶음(.btn)이다.
	function soonButtons(root, msg){
		function say(e){
			if (e && e.preventDefault) e.preventDefault();
			if (window.__tkbbToast) window.__tkbbToast(msg); else alert(msg);
			return false;
		}
		var as = root.querySelectorAll('a');
		for (var i=0;i<as.length;i++){
			if (as[i].textContent.replace(/\s+/g,'') !== '품절') continue;
			var box = as[i].parentNode && as[i].parentNode.parentNode;   // span.box_btn → 버튼 묶음
			var group = box ? box.querySelectorAll('a') : [as[i]];
			for (var j=0;j<group.length;j++){
				var a = group[j], t = a.textContent.replace(/\s+/g,'');
				if (t === '품절') a.textContent = '판매예정';
				else if (t === '장바구니') a.style.opacity = '.4';
				else continue;
				a.removeAttribute('onclick');
				if (a.hasAttribute('href')) a.setAttribute('href', 'javascript:;');
				a.onclick = say;
			}
		}
	}

	function run(){
		var root = document.getElementById('detail');
		if (!root) return;
		// 상품명 — 모바일은 h2, PC 는 h3.name.
		// 상세설명(.detail_info) 안의 h2(새 상세페이지 제목)는 건너뛴다 — PC 에는 상품명 h2 가 없어서
		// 평점 줄이 상세설명 제목 아래로 들어갔었음(2026-09-21)
		var h2 = null, h2s = root.querySelectorAll('h2');
		for (var q = 0; q < h2s.length && !h2; q++) {
			var up = h2s[q], inDesc = false;
			while (up && up !== root) {
				if (up.classList && up.classList.contains('detail_info')) { inDesc = true; break; }
				up = up.parentNode;
			}
			if (!inDesc) h2 = h2s[q];
		}
		if (!h2) h2 = root.querySelector('h3.name');
		if (!h2) return;

		// ① 할인율 — 정가가 판매가보다 높을 때만
		var price = root.querySelector('.price');
		if (price && !price.querySelector('.tkbb-per')) {
			var sell = price.querySelector('.sell'), cons = price.querySelector('.consumer');
			var n1 = num(txt(sell)), n2 = num(txt(cons));
			if (n1 && n2 && n2 > n1) {
				var em = document.createElement('em');
				em.className = 'tkbb-per';
				em.textContent = Math.round((1 - n1 / n2) * 100) + '%';
				// 스킨은 정가를 앞에 두는데, 메인과 똑같이 '할인율 → 판매가 → 정가' 순으로 다시 놓는다
				var top = sell;
				while (top.parentNode && top.parentNode !== price) top = top.parentNode;
				price.insertBefore(em, top);
				var ctop = cons;
				while (ctop && ctop.parentNode && ctop.parentNode !== price) ctop = ctop.parentNode;
				if (ctop && ctop.parentNode === price) price.appendChild(ctop);
			}
		}

		// ② 평점 · 후기 수 — 상품명 바로 아래로 끌어올린다
		if (!root.querySelector('.tkbb-dt-rate')) {
			var score = 0, cnt = 0;
			var hs = root.querySelectorAll('h3');
			for (var i=0;i<hs.length;i++){
				var m = txt(hs[i]).match(/\uc804\uccb4\ud6c4\uae30\s*([0-9,]+)\uac74/);
				if (m) { cnt = num(m[1]); break; }
			}
			var h4s = root.querySelectorAll('h4');
			for (var j=0;j<h4s.length;j++){
				if (txt(h4s[j]).indexOf('\ucd1d \ud3c9\uc810') < 0) continue;
				var box = h4s[j].parentElement;
				var st = box && box.querySelector('strong');
				var sv = parseFloat(txt(st));
				if (sv > 0 && sv <= 5) score = sv;
				break;
			}
			if (cnt > 0 && score > 0) {
				var full = Math.round(score);
				var stars = '';
				for (var k=0;k<5;k++) stars += (k < full ? '\u2605' : '\u2606');
				var d = document.createElement('div');
				d.className = 'tkbb-dt-rate';
				d.innerHTML = '<span class="st">' + stars + '</span><b>' + score.toFixed(1) + '</b>'
				            + '<a href="#review">\ud6c4\uae30 ' + cnt + '\uac74</a>';
				h2.parentNode.insertBefore(d, h2.nextSibling);
			}
		}

		// ③ 공구 일정 — 캘린더 일정에서 이 상품을 찾아, 시작 전·진행 중·끝난 뒤를 나눠 보여 준다
		var pnoEl = root.querySelector('input[name=pno]');
		if (!pnoEl || root.querySelector('.tkbb-dt-dday, .tkbb-dt-soon')) return;
		// fetch 가 끝나기 전에 run 이 한 번 더 돌면 칩이 두 개 붙는다. 요청 전에 미리 잠근다
		if (window.__TKBB_DDAY) return;
		window.__TKBB_DDAY = 1;
		var pno = pnoEl.value;
		fetch('https://takkobebe-link.vercel.app/api/schedule' + (window.browser_type === 'pc' ? '?o=pc' : '?o=m'))   // PC·모바일 캐시를 나눈다
			.then(function(r){ return r.json(); })
			.then(function(data){
				var evs = (data && data.events) || [];
				var now = new Date(Date.now() + 9*3600000);   // 한국 시각
				var today = now.toISOString().slice(0,10);
				function day(v){ return String(v).slice(0,10); }

				// 지금 살 수 있는 상품인지 — '바로구매' 버튼이 있으면 판매 중(오픈 전 공구 상품은 '품절'로 바뀐다)
				// 모바일은 하단 구매바, PC 는 상품정보 안에 버튼이 있어 #detail 전체에서 찾는다
				var buyable = false, bs = root.querySelectorAll('a');
				for (var k=0;k<bs.length;k++){ if (bs[k].textContent.replace(/\s+/g,'') === '\ubc14\ub85c\uad6c\ub9e4') { buyable = true; break; } }

				// 한 상품에 일정이 여러 개면 진행 중 → 가장 가까운 예정 → 가장 최근에 끝난 것 순으로 고른다
				var live = null, soon = null, past = null;
				for (var i=0;i<evs.length;i++){
					var ev = evs[i];
					if (!ev.url || ev.url.indexOf(pno) < 0) continue;
					if (tkbbNotYet(ev.start, today, now.getUTCHours(), buyable)) { if (!soon) soon = ev; }
					else if (day(ev.end) < today) past = ev;
					else if (!live) live = ev;
				}
				var me = live || soon || past;
				if (!me) return;
				var pr = root.querySelector('.price');
				if (!pr) return;

				var WD = ['\uc77c','\uc6d4','\ud654','\uc218','\ubaa9','\uae08','\ud1a0'];
				function md(v, wd){
					var p = day(v).split('-'), t = (+p[1]) + '/' + (+p[2]);
					return wd ? t + '(' + WD[new Date(Date.UTC(+p[0],+p[1]-1,+p[2])).getUTCDay()] + ')' : t;
				}
				var b = document.createElement('div');
				if (me === soon && buyable) {
					// 상시 판매 상품에 공구가 잡혀 있다 = 그 기간에 값을 내린다는 뜻. 판매는 그대로 하고 기간을 알려 준다
					b.className = 'tkbb-dt-soon';
					b.innerHTML = '<p class="h"><b>' + '\uacf5\uad6c \uc608\uc815' + '</b>' + md(me.start, 1) + ' \u2013 ' + md(me.end, 1) + '</p>'
					            + '<p class="t">' + '\uacf5\uad6c \uae30\uac04\uc5d0\ub294 ' + '<strong>' + '\ub354 \ub0ae\uc740 \uac00\uaca9' + '</strong>' + '\uc73c\ub85c \ud310\ub9e4\ud569\ub2c8\ub2e4.' + '<br>' + '\uc774 \uae30\uac04\uc5d0 \uad6c\ub9e4\ud558\uc2dc\uae38 \uad8c\ud574\ub4dc\ub9bd\ub2c8\ub2e4.' + '</p>';
				} else if (me === soon) {
					// 아직 열기 전인 공구 상품 — 같은 검정 상자에 오픈 기간만
					// (예전엔 끝나는 날만 보고 '9/27 마감 · D-6' 처럼 이미 연 것처럼 나왔다)
					b.className = 'tkbb-dt-soon';
					b.innerHTML = '<p class="h"><b>' + '\uc624\ud508 \uc608\uc815' + '</b>' + md(me.start, 1) + ' \u2013 ' + md(me.end, 1) + '</p>';
					// 구매 버튼도 '품절' 대신 '판매예정' — 누르면 '10/12(월) 오전 10시에 판매를 시작합니다' (오픈 당일이면 '오늘')
					soonButtons(root, (day(me.start) === today ? '\uc624\ub298' : md(me.start, 1)) + ' \uc624\uc804 10\uc2dc\uc5d0 \ud310\ub9e4\ub97c \uc2dc\uc791\ud569\ub2c8\ub2e4');
				} else if (me === live) {
					var p1 = today.split('-'), p2 = day(me.end).split('-');
					var left = Math.round((Date.UTC(+p2[0],+p2[1]-1,+p2[2]) - Date.UTC(+p1[0],+p1[1]-1,+p1[2])) / 86400000);
					b.className = 'tkbb-dt-dday';
					b.textContent = left === 0 ? '\uc624\ub298 \ub9c8\uac10' : md(me.end) + ' ' + '\ub9c8\uac10' + ' \u00b7 D-' + left;
				} else {
					// 끝난 공구. 상시 판매 상품은 평소처럼 계속 파니 '마감된 공구'를 붙이지 않는다
					if (buyable) return;
					b.className = 'tkbb-dt-dday end';
					b.textContent = md(me.end) + ' ' + '\ub9c8\uac10\ub41c \uacf5\uad6c';
				}
				// 상품에 적어 둔 '판매기간'(추가항목, 글자일 뿐 판매를 막지는 않음)이 캘린더와 다르면 캘린더 날짜로 바꿔 보여 준다.
				// 날짜만 바꾸고 '11시'·'자정' 같은 나머지 글자는 그대로 둔다. (사용자 요청: 기간이 다르면 캘린더 우선)
				var ths = root.querySelectorAll('th');
				for (var q=0;q<ths.length;q++){
					if (ths[q].textContent.replace(/\s+/g,'') !== '\ud310\ub9e4\uae30\uac04') continue;
					var td = ths[q].nextElementSibling;
					if (!td) break;
					var tg = td.querySelector('strong') || td, t0 = tg.textContent;
					var ds = t0.match(/\d{1,2}\/\d{1,2}/g) || [];
					var same = !ds.length || (ds[0] === md(me.start) && (ds.length < 2 || ds[1] === md(me.end)));
					if (!same) {
						var want = [md(me.start, 1), md(me.end, 1)], n = 0;
						tg.textContent = t0.replace(/\d{1,2}\/\d{1,2}(\([^)]*\))?/g, function(){ return want[Math.min(n++, 1)]; });
					}
					break;
				}
				pr.parentNode.insertBefore(b, pr.nextSibling);
			}).catch(function(){});
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
	else run();
	// 후기 영역이 늦게 그려지면 한 번 더
	setTimeout(run, 2200);
})();

/* ===== 관심상품(하트) 확인창 없애기 =====
   위사 addWish 는 저장에 성공하면 "위시리스트에 추가하였습니다. 위시리스트로 이동하시겠습니까?" 를 confirm 으로 띄운다.
   저장은 이 창이 뜨기 전에 이미 끝나 있으므로(동기 ajax), 창만 '취소'로 건너뛰고
   하트가 채워지면서 아래에 짧은 안내를 띄운다. 이미 담긴 상품을 다시 누르면 빠진다(위사 동작 그대로).
   로그인이 필요하다는 alert 같은 다른 안내는 건드리지 않는다.
   되돌리려면 이 블록만 지우면 된다. 2026-09-21 */
(function(){
	if (window.__TKBB_WISH) return; window.__TKBB_WISH = 1;
	window.__tkbbToast = toast;   // 상세페이지 '판매예정' 버튼도 같은 안내를 쓴다

	function toast(msg, withLink){
		var old = document.getElementById('tkbb-toast');
		if (old && old.parentNode) old.parentNode.removeChild(old);
		var t = document.createElement('div');
		t.id = 'tkbb-toast';
		t.innerHTML = '<span>' + msg + '</span>' + (withLink ? '<a href="/mypage/wish_list.php">보기</a>' : '');
		document.body.appendChild(t);
		var base = window.browser_type === 'pc' ? 'pc' : '';
		t.className = base;
		requestAnimationFrame(function(){ requestAnimationFrame(function(){ t.className = base + ' on'; }); });
		setTimeout(function(){
			t.className = base;
			setTimeout(function(){ if (t.parentNode) t.parentNode.removeChild(t); }, 300);
		}, 2200);
	}

	function isOn(f){
		var el = f && f.getElementsByClassName ? f.getElementsByClassName('wish')[0] : null;
		return el ? /(^|\s)on(\s|$)/.test(el.className) : null;
	}

	function wrap(){
		var orig = window.addWish;
		if (typeof orig !== 'function') return false;
		if (orig.__tkbb) return true;
		var w = function(f){
			// 모바일은 confirm, PC 는 위사 자체 팝업(dialogConfirm) 으로 묻는다 — 둘 다 이 순간만 막는다
			var before = isOn(f), asked = false, oc = window.confirm, od = window.dialogConfirm;
			window.confirm = function(){ asked = true; return false; };
			if (typeof od === 'function') window.dialogConfirm = function(){ asked = true; };
			try { return orig.apply(this, arguments); }
			finally {
				window.confirm = oc;
				if (typeof od === 'function') window.dialogConfirm = od;
				if (asked) toast('관심상품에 담았어요', true);
				else if (before === true && isOn(f) === false) toast('관심상품에서 뺐어요', false);
			}
		};
		w.__tkbb = 1;
		window.addWish = w;
		return true;
	}

	if (!wrap()) {
		document.addEventListener('DOMContentLoaded', wrap);
		setTimeout(wrap, 1500);
	}
})();

/* ===== PC 메인 — 이번 주 공구 (C안, 2026-09-21 사용자 선택) =====
   PC 메인 맨 위 큰 배너 자리(.visual_slide, 736px)가 슬라이드 0개라 통째로 비어 보였다.
   캘린더 일정으로 '이번 주 공구' 카드 줄을 그린다 — 첫 칸은 넓게(진행 중 공구, 없으면 가장 가까운 예정),
   나머지 세 칸은 다음 공구. 사진이 없는 공구는 날짜 카드로 보인다.
   배너 자리에 사진이 하나라도 있으면(나중에 PC 배너를 올리면) 그 배너는 그대로 두고 이 줄을 그 아래에 넣는다.
   되돌리려면 이 블록만 지우면 된다. */
(function(){
	if (window.__TKBB_PCMAIN) return; window.__TKBB_PCMAIN = 1;
	if (window.browser_type !== 'pc') return;
	var P = location.pathname;
	if (P !== '/' && P !== '/index.php' && P !== '/main/index.php') return;

	var API = 'https://takkobebe-link.vercel.app/api/schedule?o=pc';   // PC 전용 주소 (모바일과 캐시를 나눈다)
	var SCHED = 'https://takkobebe-link.vercel.app/month.html';   // 전체 일정 = 손님용 공구 달력 (2026-09-22)
	var WD = ['\uc77c','\uc6d4','\ud654','\uc218','\ubaa9','\uae08','\ud1a0'];
	function day(v){ return String(v).slice(0,10); }
	function md(v, wd){
		var p = day(v).split('-'), t = (+p[1]) + '/' + (+p[2]);
		return wd ? t + '(' + WD[new Date(Date.UTC(+p[0],+p[1]-1,+p[2])).getUTCDay()] + ')' : t;
	}
	function wday(v){ var p = day(v).split('-'); return WD[new Date(Date.UTC(+p[0],+p[1]-1,+p[2])).getUTCDay()]; }
	function esc(t){ return String(t == null ? '' : t).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
	function num(t){ var n = parseInt(String(t || '').replace(/[^0-9]/g,''), 10); return isNaN(n) ? 0 : n; }
	// 일정 링크는 모바일 주소(m.)로 적혀 있다 — PC 손님은 PC 화면으로 보낸다
	function here(u){ return u ? String(u).replace(/^https?:\/\/(?:m|www)\.takkobebe\.com/i, location.origin) : ''; }

	function start(){
		var main = document.getElementById('main');
		if (!main || main.querySelector('.tkbb-pcw')) return;
		var vs = main.querySelector('.visual_slide');
		// 비어 있는 배너 자리는 바로 접는다 (사진이 있으면 사장님이 올린 배너라 그대로 둔다).
		// 이 칸이 고정 헤더 밑 여백(margin-top 185px)을 잡고 있어서 숨기면(display:none) 아래 내용이 헤더 밑으로 파고든다.
		// 그래서 숨기지 않고 높이만 0 으로 접는다 — 일정을 못 불러와도 빈칸 없이 바로 아래 상품이 보인다.
		if (vs && !vs.querySelector('img')) {
			vs.style.setProperty('height', '0', 'important');
			vs.style.setProperty('min-height', '0', 'important');
			vs.style.setProperty('padding', '0', 'important');
			vs.style.setProperty('overflow', 'hidden', 'important');
		}

		fetch(API).then(function(r){ return r.json(); }).then(function(data){
			var today = new Date(Date.now() + 9*3600000).toISOString().slice(0,10);
			var evs = (data && data.events) || [], live = [], soon = [];
			for (var i=0;i<evs.length;i++){
				var e = evs[i];
				if (day(e.end) < today) continue;
				(day(e.start) <= today ? live : soon).push(e);
			}
			var list = live.concat(soon).slice(0, 4);
			if (!list.length || main.querySelector('.tkbb-pcw')) return;

			var h = '<div class="tkbb-pcw"><div class="top"><p class="ttl">' + '\uc774\ubc88 \uc8fc \uacf5\uad6c' + '</p>'
			      + '<a href="' + SCHED + '" target="_blank" rel="noopener">' + '\uc804\uccb4 \uc77c\uc815 \u203a' + '</a></div><div class="row">';
			for (var j=0;j<list.length;j++){
				var ev = list[j], isLive = day(ev.start) <= today, big = j === 0;
				var tag, tc = '';
				if (isLive) { tag = md(ev.end) + ' ' + '\ub9c8\uac10'; if (big) tag = '\uc9c4\ud589 \uc911' + ' \u00b7 ' + tag; tc = ' live'; }
				else if (ev.onSale) { tag = md(ev.start, 1) + ' ' + '\uacf5\uad6c'; tc = ' gg'; }   // 이미 파는 상품의 공구
				else tag = md(ev.start, 1) + ' ' + '\uc624\ud508';
				var href = here(ev.url) || SCHED, ext = !ev.url;
				var im = ev.img
					? '<span class="im" style="background-image:url(&quot;' + esc(ev.img) + '&quot;)"><span class="tg' + tc + '">' + tag + '</span></span>'
					: '<span class="im none"><b>' + md(isLive ? ev.end : ev.start) + '</b><i>'
					  + (isLive ? '\ub9c8\uac10' : wday(ev.start) + '\uc694\uc77c ' + (ev.onSale ? '\uacf5\uad6c' : '\uc624\ud508')) + '</i></span>';
				var body = '<p class="nm">' + esc(ev.title) + '</p>';
				var s1 = num(ev.sell), c1 = num(ev.cons);
				if (big && s1) {
					body += '<p class="pr">' + (c1 > s1 ? '<em>' + Math.round((1 - s1 / c1) * 100) + '%</em>' : '')
					      + s1.toLocaleString('ko-KR') + '\uc6d0' + (c1 > s1 ? '<s>' + c1.toLocaleString('ko-KR') + '\uc6d0' + '</s>' : '') + '</p>';
				} else {
					body += '<p class="sub">' + md(ev.start) + ' \u2013 ' + md(ev.end) + '</p>';
				}
				h += '<a class="cd' + (big ? ' big' : '') + '" href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + im + body + '</a>';
			}
			h += '</div></div>';
			var box = document.createElement('div');
			box.innerHTML = h;
			var sec = box.firstChild;
			if (vs && vs.parentNode === main) main.insertBefore(sec, vs.nextSibling);
			else main.insertBefore(sec, main.firstChild);
		}).catch(function(){});
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
	else start();
})();

/* ===== 상품후기 — 목록의 상품 사진·이름으로도 후기 창 · 후기 창 하단 '이 상품 구매하러 가기' =====
   ① 전체 후기·포토후기 목록(#review_list_body)에서 상품 사진·이름을 누르면 원래는 상품 페이지로 갔다
      → 그 줄의 후기 창(openReviewDetail)을 연다.
   ② 후기 창(.layer_review_list)이 열려 있는 동안 아래 탭바(.fix_footer) 대신 연두 '이 상품 구매하러 가기' 바를 띄운다.
      그 상품의 상세페이지 안에서 연 후기 창에는 안 붙인다(이미 그 상품 페이지).
      PC 넓은 화면(600px 이상)에서는 480px 칸(--tk-l / --tk-w) 안에 둔다.
   ③ 후기 쓰기 창의 적립금 안내 칸(하늘색 말풍선)을 꼭지 없는 검정 네모로, 글은 흰색 '리뷰 작성(최대 N원)' 한 줄로.
      N 은 칸에 찍힌 적립금(글 + 사진)을 더한 값이라 관리자 적립금 설정을 바꾸면 저절로 따라간다.
      로그인 안 한 손님(mlv 10)은 적립금을 못 받으므로 '리뷰 작성(회원 최대 N원)'.
   되돌리려면 이 블록만 지우면 된다. 2026-09-22 사용자 요청 */
(function(){
	if (window.__TKBB_REV) return; window.__TKBB_REV = 1;

	// 바 높이 72px = 글씨 줄 54px + 아래 빈칸 18px (처음 88px 은 두껍다고 해서 줄임)
	var CSS = '.tkbb-revbuy{position:fixed;left:var(--tk-l,0);width:var(--tk-w,100%);bottom:0;z-index:101;height:72px;padding:0 0 18px;box-sizing:border-box;background:#D1D798;}'
		+ '.tkbb-revbuy a{display:block;height:54px;line-height:54px;text-align:center;color:#2E3517;font-size:15px;font-weight:500;letter-spacing:-.02em;text-decoration:none;}'
		+ '.layer_review_list.tkbb-hasbuy{padding-bottom:72px !important;box-sizing:border-box;}'
		+ 'body.tkbb-revopen .fix_footer{display:none !important;}'
		// 검정 네모 칸 — 말풍선 꼭지(:before)를 빼고, 위 내용칸에 붙어 있던 것(margin-top -15px)도 다른 칸처럼 띄운다(-4px 이면 칸 사이 11px 로 다른 칸과 같다). 글씨는 전부 흰색
		+ '.qnarev_write fieldset > div.msg_milage{margin-top:-4px !important;background-color:#161616 !important;border-color:#161616 !important;}'
		+ '.qnarev_write fieldset > div.msg_milage:before{display:none !important;}'
		+ '.qnarev_write fieldset > div.msg_milage .tkbb-mg{color:#fff;font-size:13.5px;font-weight:400;letter-spacing:-.02em;}'
		+ '.qnarev_write fieldset > div.msg_milage .tkbb-mg b{color:#fff;font-size:13.5px;font-weight:500;}';
	var st = document.createElement('style');
	st.appendChild(document.createTextNode(CSS));
	(document.head || document.documentElement).appendChild(st);

	// ① 목록의 상품 사진·이름 → 그 줄의 후기 창 (더 보기로 늘어난 줄도 되게 문서 전체에서 받는다)
	document.addEventListener('click', function(e){
		var t = e.target;
		if (!t || !t.closest || typeof window.openReviewDetail !== 'function') return;
		var a = t.closest('#review_list_body a[href*="detail.php"]');
		var li = a && a.closest('li');
		var op = li && li.querySelector('[onclick*="openReviewDetail"]');
		var m = op && op.getAttribute('onclick').match(/openReviewDetail\(\s*(\d+)\s*,\s*'?(\d*)'?/);
		if (!m) return;
		e.preventDefault();
		e.stopPropagation();   // 이름 칸을 감싼 줄의 onClick 이 한 번 더 열지 않게
		window.openReviewDetail(+m[1], m[2]);
	}, true);

	// 지금 보고 있는 상품상세의 상품번호 (상세가 아니면 빈 값)
	function herePno(){
		if (location.pathname.indexOf('/shop/detail.php') < 0) return '';
		var m = location.search.match(/[?&]pno=([A-F0-9]+)/i);
		return m ? m[1].toUpperCase() : '';
	}

	function onChange(){
		// ② 후기 창
		var L = document.querySelector('#revWriteAjaxDiv .layer_review_list');
		if (L && !L.getAttribute('data-tkbb')) {
			L.setAttribute('data-tkbb', '1');
			var a = L.querySelector('.prd a[href*="pno="]');
			var href = a && a.getAttribute('href');
			var m = href && href.match(/pno=([A-F0-9]+)/i);
			if (m && m[1].toUpperCase() !== herePno()) {
				var bar = document.createElement('div');
				bar.className = 'tkbb-revbuy';
				var go = document.createElement('a');
				go.href = href;
				go.textContent = '이 상품 구매하러 가기';
				bar.appendChild(go);
				L.appendChild(bar);
				L.className += ' tkbb-hasbuy';
			}
		}
		// 바가 붙은 후기 창이 열려 있을 때만 탭바를 숨긴다 (창을 닫으면 #revWriteAjaxDiv 째 지워진다)
		var open = !!(L && L.querySelector('.tkbb-revbuy'));
		if (open) document.body.classList.add('tkbb-revopen');
		else document.body.classList.remove('tkbb-revopen');

		// ③ 후기 쓰기 창 적립금 칸 → '리뷰 작성(최대 N원)'
		var ms = document.querySelector('#revWriteAjaxDiv .msg_milage');
		if (ms && !ms.getAttribute('data-tkbb')) {
			ms.setAttribute('data-tkbb', '1');
			var sum = 0, bs = ms.getElementsByTagName('strong');
			for (var i = 0; i < bs.length; i++) sum += parseInt(bs[i].textContent.replace(/[^0-9]/g, ''), 10) || 0;
			if (sum > 0) {
				var guest = String(window.mlv) === '10';   // 로그인 안 한 손님은 적립금을 못 받는다
				ms.innerHTML = '<span class="tkbb-mg">리뷰 작성<b>(' + (guest ? '회원 ' : '') + '최대 ' + sum.toLocaleString('ko-KR') + '원)</b></span>';
			}
		}
	}

	function start(){
		if (!window.MutationObserver || !document.body) return;
		new MutationObserver(onChange).observe(document.body, { childList: true });
	}
	if (document.body) start();
	else document.addEventListener('DOMContentLoaded', start);
})();

/* ===== 상품후기 쓰기 — '분류 선택' 대신 '상품선택' =====
   후기 목록에서 글쓰기를 누르면 상품이 정해지지 않은 쓰기 창(form revFrm, pno 빈 값)이 열린다.
   '분류' 칸(select cate, 항목은 '상품' 하나)을 '상품선택' 칸으로 바꾸고, 누르면 목록 창을 띄운다.
     · 로그인 안 한 손님: 지금 공구 중 + 자주 찾는 상품 + 지금 판매 중 + 최근 한 달 판매 (https://takkobebe-link.vercel.app/api/review-products)
     · 로그인한 손님: 내가 구매한 상품 전부 (손님 브라우저가 마이페이지 주문내역·주문 상세를 직접 읽는다 — 주문 정보는 밖으로 안 보낸다).
       구매한 상품이 하나도 안 잡히면 로그인 안 한 손님과 같은 목록.
   고르면 폼의 pno(상품 해시)를 채운다. 분류 값은 계속 '상품'으로 보낸다(목록의 '[상품]' 머리말 유지).
   상품 상세에서 연 쓰기 창은 이미 그 상품이 정해져 있어서 칸에 상품명만 보여 준다.
   상품을 안 고르고 확인을 누르면 '상품을 선택해 주세요.'
   폰 기본 목록(select)은 글씨 굵기·크기를 못 바꿔서(사용자 요청: 얇게·10% 작게) 같은 모양으로 직접 그린다.
   되돌리려면 이 블록만 지우면 된다. 2026-09-23 사용자 요청 */
(function(){
	if (window.__TKBB_REVP) return; window.__TKBB_REVP = 1;

	var API = 'https://takkobebe-link.vercel.app/api/review-products';
	var CSS = '.tkbb-pk-back{position:fixed;left:0;top:0;right:0;bottom:0;z-index:1999;background:transparent;}'
		+ '.tkbb-pk{position:fixed;z-index:2000;box-sizing:border-box;background:rgba(88,88,88,.97);border-radius:22px;padding:9px 0 11px;box-shadow:0 10px 30px rgba(0,0,0,.28);overflow-y:auto;-webkit-overflow-scrolling:touch;text-align:left;}'
		+ '.tkbb-pk .g{color:rgba(255,255,255,.55);font-size:11.3px;font-weight:300;line-height:1.35;padding:9px 20px 3px;}'
		+ '.tkbb-pk .o{position:relative;color:#fff;font-size:13.5px;font-weight:300;line-height:1.35;padding:6.5px 20px 6.5px 44px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em;cursor:pointer;}'
		+ '.tkbb-pk .o.on:before{content:"\\2713";position:absolute;left:20px;top:6px;color:#fff;font-size:13.5px;font-weight:300;}'
		+ '.tkbb-pk .msg{color:rgba(255,255,255,.62);font-size:12px;font-weight:300;line-height:1.45;padding:10px 20px;}'
		+ '.qnarev_write select.tkbb-pk-fixed{background-image:none;padding-left:15px;color:#333;}';
	var st = document.createElement('style');
	st.appendChild(document.createTextNode(CSS));
	(document.head || document.documentElement).appendChild(st);

	function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
	function ymd(d){ return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
	function member(){ return String(window.mlv) !== '10'; }   // 10 = 비회원
	function sget(k){ try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } }
	function sset(k, v){ try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
	function lget(k){ try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
	function lset(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

	// ── 로그인 안 한 손님 목록 (10분 동안은 다시 받지 않는다) ──
	function guestGroups(){
		var c = sget('tkbb_revp_api');
		if (c && Date.now() - c.t < 600000) return Promise.resolve(c.g);
		return fetch(API).then(function(r){ return r.json(); }).then(function(d){
			var g = [];
			if (d.live && d.live.length) g.push({ t: '지금 공구 중', items: d.live });        // 항상 맨 위
			if (d.top && d.top.length) g.push({ t: '자주 찾는 상품', items: d.top });         // 계란·쌀빵·참기름·치즈
			if (d.now && d.now.length) g.push({ t: '지금 판매 중', items: d.now });
			if (d.recent && d.recent.length) g.push({ t: '최근 한 달 판매', items: d.recent });
			if (g.length) sset('tkbb_revp_api', { t: Date.now(), g: g });
			return g;
		});
	}

	// ── 로그인한 손님: 주문내역 → 주문 상세 → 상품 ──
	// 주문 상세에서 읽은 상품은 주문번호별로 이 폰에만 남겨 둔다(다음에 열 때 빠르게). 가격·주소는 남기지 않는다.
	var ORD_KEY = 'tkbb_revp_ord1';
	function getDoc(url){
		return fetch(url, { credentials: 'same-origin' }).then(function(r){ return r.text(); })
			.then(function(t){ return new DOMParser().parseFromString(t, 'text/html'); });
	}
	function onosIn(doc){
		var out = [], as = doc.querySelectorAll('a[href*="ono="], [onclick*="ono="]');
		for (var i = 0; i < as.length; i++) {
			var s = as[i].getAttribute('href') || as[i].getAttribute('onclick') || '';
			var m = s.match(/ono=([0-9A-Za-z-]+)/);
			if (m && out.indexOf(m[1]) < 0) out.push(m[1]);
		}
		return out;
	}
	function productsIn(doc){
		var out = [], lis = doc.querySelectorAll('.list_cart li');
		for (var i = 0; i < lis.length; i++) {
			var a = lis[i].querySelector('a[href*="pno="]');
			var m = a && a.getAttribute('href').match(/pno=([A-F0-9]{16,})/i);
			var nm = lis[i].querySelector('.info p');
			var name = nm ? nm.textContent.replace(/\s+/g, ' ').trim() : '';
			if (m && name && !/개인결제/.test(name)) out.push([m[1].toUpperCase(), name]);
		}
		return out;
	}
	// 주문번호를 최근 것부터 모은다 (쪽 번호가 있으면 따라간다, 최대 20쪽)
	function allOnos(){
		var base = '/mypage/order_list.php?start_date=2015-01-01&finish_date=' + ymd(new Date());
		var onos = [], seenPages = {};
		function page(url, n){
			return getDoc(url).then(function(doc){
				var got = onosIn(doc), fresh = 0;
				for (var i = 0; i < got.length; i++) if (onos.indexOf(got[i]) < 0) { onos.push(got[i]); fresh++; }
				if (!fresh || n >= 20) return onos;
				var next = null, ps = doc.querySelectorAll('.paging a[href*="page="]');
				for (var j = 0; j < ps.length; j++) {
					var h = ps[j].getAttribute('href'), pm = h.match(/page=(\d+)/);
					if (pm && +pm[1] === n + 1 && !seenPages[pm[1]]) { next = h; break; }
				}
				if (!next) return onos;
				seenPages[n + 1] = 1;
				return page(next, n + 1);
			});
		}
		return page(base, 1);
	}
	function mineGroups(onProgress){
		var c = sget('tkbb_revp_mine');
		if (c && Date.now() - c.t < 600000) return Promise.resolve(c.g);
		var cache = lget(ORD_KEY) || {};
		return allOnos().then(function(onos){
			var i = 0, done = 0;
			function list(){
				var items = [], seen = {};
				for (var k = 0; k < onos.length; k++) {
					var ps = cache[onos[k]] || [];
					for (var j = 0; j < ps.length; j++) if (!seen[ps[j][0]]) { seen[ps[j][0]] = 1; items.push({ pno: ps[j][0], name: ps[j][1] }); }
				}
				return items.length ? [{ t: '내가 구매한 상품', items: items }] : [];
			}
			function worker(){
				while (i < onos.length && cache[onos[i]]) { i++; done++; }
				if (i >= onos.length) return Promise.resolve();
				var ono = onos[i++];
				return getDoc('/mypage/order_detail.php?ono=' + encodeURIComponent(ono)).then(function(doc){
					cache[ono] = productsIn(doc);
				}, function(){}).then(function(){
					done++;
					if (onProgress) onProgress(list(), done, onos.length);
					return worker();
				});
			}
			return Promise.all([worker(), worker(), worker()]).then(function(){
				lset(ORD_KEY, cache);
				var g = list();
				if (g.length) sset('tkbb_revp_mine', { t: Date.now(), g: g });
				return g;
			});
		});
	}

	// ── 목록 창 ──
	var POP = null;
	function closePop(){
		if (!POP) return;
		if (POP.back.parentNode) POP.back.parentNode.removeChild(POP.back);
		if (POP.box.parentNode) POP.box.parentNode.removeChild(POP.box);
		if (POP.scroller) POP.scroller.removeEventListener('scroll', closePop);
		window.removeEventListener('resize', closePop);
		POP = null;
	}
	function render(box, groups, cur, note){
		var h = '';
		for (var i = 0; i < groups.length; i++) {
			h += '<div class="g">' + esc(groups[i].t) + '</div>';
			for (var j = 0; j < groups[i].items.length; j++) {
				var it = groups[i].items[j];
				h += '<div class="o' + (it.pno === cur ? ' on' : '') + '" data-pno="' + esc(it.pno) + '">' + esc(it.name) + '</div>';
			}
		}
		if (note) h += '<div class="msg">' + esc(note) + '</div>';
		box.innerHTML = h || '<div class="msg">' + esc(note || '') + '</div>';
		// 이미 고른 상품이 있으면 그 줄이 보이게
		var on = box.querySelector('.o.on');
		if (on && !box.getAttribute('data-scrolled')) {
			box.setAttribute('data-scrolled', '1');
			box.scrollTop = Math.max(0, on.offsetTop - box.clientHeight / 2);
		}
	}
	function openPop(f, sel){
		closePop();
		var r = sel.getBoundingClientRect();
		var back = document.createElement('div'); back.className = 'tkbb-pk-back';
		var box = document.createElement('div'); box.className = 'tkbb-pk';
		var top = Math.round(r.bottom - 6);
		box.style.left = Math.round(r.left + 14) + 'px';
		box.style.width = Math.round(r.width - 28) + 'px';
		box.style.top = top + 'px';
		box.style.maxHeight = Math.max(220, window.innerHeight - top - 24) + 'px';
		document.body.appendChild(back); document.body.appendChild(box);
		var scroller = sel.closest ? sel.closest('.qnarev_write') : null;
		POP = { back: back, box: box, scroller: scroller };
		back.addEventListener('click', closePop);
		if (scroller) scroller.addEventListener('scroll', closePop);
		window.addEventListener('resize', closePop);
		box.addEventListener('click', function(e){
			var o = e.target.closest ? e.target.closest('.o') : null;
			if (!o) return;
			f.pno.value = o.getAttribute('data-pno');
			sel.options[0].text = o.textContent;
			sel.setAttribute('data-picked', '1');
			closePop();
		});

		var cur = f.pno.value;
		render(box, [], cur, '불러오는 중…');
		function guest(prefix){
			return guestGroups().then(function(g){
				if (POP && POP.box === box) render(box, g, cur, g.length ? prefix : '지금 고를 수 있는 상품이 없어요.');
			});
		}
		var job = member()
			? mineGroups(function(g, done, total){
				if (POP && POP.box === box && g.length) render(box, g, cur, done < total ? '주문내역을 읽는 중… ' + done + '/' + total : '');
			}).then(function(g){
				if (!(POP && POP.box === box)) return;
				if (g.length) render(box, g, cur, '');
				else return guest('');
			})
			: guest('');
		job.catch(function(){
			if (POP && POP.box === box) render(box, [], cur, '목록을 불러오지 못했어요. 잠시 뒤 다시 눌러 주세요.');
		});
	}

	// ── 쓰기 창이 열리면 '분류' 칸을 바꾼다 ──
	function setup(){
		var f = document.querySelector('#revWriteAjaxDiv form[name="revFrm"]');
		if (!f || f.getAttribute('data-tkbb-pk') || !f.cate || !f.pno) return;
		f.setAttribute('data-tkbb-pk', '1');
		var sel = f.cate, row = sel.parentNode;
		var lb = row.querySelector('label'); if (lb) lb.textContent = '상품';
		if (f.pno.value) {
			// 상품 상세에서 연 창 — 그 상품으로 정해져 있다
			var og = document.querySelector('meta[property="og:title"]');
			var name = og ? og.getAttribute('content').split('|')[0].trim() : '';
			sel.innerHTML = '<option value="상품">' + esc(name || '이 상품') + '</option>';
			sel.className += ' tkbb-pk-fixed';
			sel.style.pointerEvents = 'none';
			return;
		}
		sel.innerHTML = '<option value="상품">상품선택</option>';
		sel.style.pointerEvents = 'none';   // 폰 기본 목록 대신 아래 목록 창
		row.style.cursor = 'pointer';
		row.addEventListener('click', function(e){ e.preventDefault(); openPop(f, sel); });
	}

	// 상품을 안 고르면 확인을 막는다 (위사 checkRevFrm 앞에서)
	function wrapCheck(){
		var orig = window.checkRevFrm;
		if (typeof orig !== 'function' || orig.__tkbb) return;
		var w = function(f){
			if (f && f.getAttribute && f.getAttribute('data-tkbb-pk') && f.pno && !f.pno.value) {
				window.alert('상품을 선택해 주세요.');
				return false;
			}
			return orig.apply(this, arguments);
		};
		w.__tkbb = 1;
		window.checkRevFrm = w;
	}

	function start(){
		if (!window.MutationObserver || !document.body) return;
		new MutationObserver(function(){ wrapCheck(); setup(); if (POP && !document.querySelector('#revWriteAjaxDiv form[name="revFrm"]')) closePop(); })
			.observe(document.body, { childList: true });
	}
	if (document.body) start();
	else document.addEventListener('DOMContentLoaded', start);
})();

/* ===== 카테고리 바(NOW · 먹거리 · 화장품 …) — 모든 카테고리 화면에 고정 노출 (2026-09-29) =====
   메인 맨 위 카테고리 바는 메인 페이지 HTML(#main .tkbb-cats)에만 있어서 카테고리로 넘어가면 사라졌다.
   모바일 카테고리 화면(big_section.php)에도 같은 바를 로고 바로 아래에 넣고, 지금 보고 있는 카테고리를 진하게 표시한다.
   메인·카테고리 모두 화면을 내려도 바가 맨 위에 붙어 따라온다(sticky).
   카테고리를 더하거나 순서를 바꾸면 아래 CATS 와 메인 페이지 HTML 의 .tkbb-cats 를 같이 고친다.
   되돌리려면 이 블록만 지우면 된다. */
(function(){
	if (window.__TKBB_CATBAR) return; window.__TKBB_CATBAR = 1;
	if (window.browser_type === 'pc') return;   // PC 스킨은 따로 메뉴가 있다

	var CATS = [
		['1005', '먹거리'],
		['1002', '화장품'],
		['1001', '키즈 학용품'],
		['1121', '패션'],
		['1067', '영양제'],
		['1006', '생활']
	];
	var CSS = ''
		// 메인·카테고리 공통: 화면을 내려도 로고 줄 바로 아래에 붙어 따라오게.
		// 스킨이 스크롤하면 로고 줄(header .gnb_wrap, 높이 50px, z-index 10)을 맨 위에 고정하므로 top 을 50px 로 둔다.
		// 흰 바탕을 깔아야 아래 상품이 비쳐 보이지 않는다
		+ '#main .tkbb-cats,.tkbb-cats.tkbb-cats-sub{position:-webkit-sticky;position:sticky;top:50px;z-index:9;background:#fff;}'
		// 카테고리 화면용 모양 — 메인 스킨의 #main .tkbb-cats 규칙과 같게 맞춘다
		+ '.tkbb-cats.tkbb-cats-sub{display:flex;align-items:baseline;justify-content:space-between;gap:9px;padding:10px 16px 4px;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;border-bottom:1px solid #EFEDE6;}'
		+ '.tkbb-cats.tkbb-cats-sub::-webkit-scrollbar{display:none;}'
		+ '.tkbb-cats.tkbb-cats-sub a{flex:0 0 auto;padding:4px 0;font-size:15px;font-weight:300;letter-spacing:-.03em;line-height:1.3;color:#5F5F5F;text-decoration:none;}'
		+ '.tkbb-cats.tkbb-cats-sub a:first-child{color:#161616;font-size:17.5px;font-weight:700;}'
		+ '.tkbb-cats.tkbb-cats-sub a.on{color:#161616;font-weight:600;box-shadow:inset 0 -2px 0 #161616;}'
		// NOW·퀵메뉴로 섹션에 건너뛸 때 제목이 로고 줄(50px)+카테고리 바(약 46px) 뒤에 가려지지 않게 (예전 62px)
		+ '#tkbb-live,.tkbb-sec,.tkbb-req,.tkbb-cal{scroll-margin-top:104px;}'
		// 카테고리 화면에서는 바가 지금 카테고리를 보여 주므로 그 아래 카테고리 제목(h2.subtitle '먹거리' 등)은 숨긴다 (2026-09-29 사용자 요청).
		// 바가 들어간 카테고리 화면에서만 숨긴다 — 마이페이지·게시판 등 다른 화면의 제목은 그대로
		+ '.tkbb-cats-sub ~ #cnt > h2.subtitle{display:none;}';

	function addCss(){
		var st = document.createElement('style');
		st.type = 'text/css';
		st.appendChild(document.createTextNode(CSS));
		(document.head || document.documentElement).appendChild(st);
	}

	function start(){
		addCss();
		// 메인은 페이지 HTML 에 이미 바가 있다 — 위 CSS 로 고정만 한다
		if (document.querySelector('.tkbb-cats')) return;
		if (location.pathname.indexOf('/shop/big_section.php') < 0) return;

		var cur = (location.search.match(/[?&]cno1=(\d+)/) || [])[1] || '';
		var h = '<a href="/#tkbb-live">NOW</a>';
		for (var i = 0; i < CATS.length; i++) {
			h += '<a href="/shop/big_section.php?cno1=' + CATS[i][0] + '"' + (CATS[i][0] === cur ? ' class="on" aria-current="page"' : '') + '>' + CATS[i][1] + '</a>';
		}
		var bar = document.createElement('div');
		bar.className = 'tkbb-cats tkbb-cats-sub';
		bar.innerHTML = h;

		var header = document.querySelector('header');
		if (header && header.parentNode) header.parentNode.insertBefore(bar, header.nextSibling);
		else document.body.insertBefore(bar, document.body.firstChild);

		// 지금 카테고리가 오른쪽 끝에 있으면 바를 밀어서 보이게 한다
		var on = bar.querySelector('a.on');
		if (on && on.offsetLeft + on.offsetWidth > bar.clientWidth) bar.scrollLeft = on.offsetLeft - 16;
	}
	if (document.body) start();
	else document.addEventListener('DOMContentLoaded', start);
})();

/* ===== 마이페이지 (29CM 스타일, 타코베베 컬러) — 2026-09-29 =====
   /mypage/mypage.php 의 원래 내용(#mypage)을 읽어서 새 모양으로 다시 그린다.
   원래 화면은 지우지 않고 숨기기만 한다. 주소 끝에 ?tkbb_old=1 을 붙이면 원래 화면이 보인다.
   되돌리려면 이 블록(시작~끝)만 지우면 된다. */
(function(){
	if (window.__TKBB_MYPAGE) return; window.__TKBB_MYPAGE = 1;
	if (window.browser_type === 'pc') return;
	if (location.pathname !== '/mypage/mypage.php') return;
	if (/[?&]tkbb_old=1/.test(location.search)) return;

	var CSS = ''
		+ '#cnt.tkbb-mp-on > h2.subtitle,#cnt.tkbb-mp-on > select.top_select_menu{display:none !important;}'
		+ '#mypage.tkbb-mp-on > :not(.tkbb-mp){display:none !important;}'
		+ '.tkbb-mp{font-family:inherit;color:#161616;letter-spacing:-.02em;background:#fff;padding-bottom:8px;}'
		+ '.tkbb-mp a{color:inherit;text-decoration:none;}'
		+ '.tkbb-mp .nt{display:flex;align-items:center;justify-content:space-between;min-height:44px;padding:0 16px;background:#161616;color:#fff;font-size:13px;}'
		+ '.tkbb-mp .nt a{display:flex;align-items:center;gap:8px;flex:1;min-width:0;}'
		+ '.tkbb-mp .nt em{font-style:normal;background:#D1D798;color:#161616;font-size:11px;font-weight:700;padding:3px 7px;border-radius:2px;flex:0 0 auto;}'
		+ '.tkbb-mp .nt span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}'
		+ '.tkbb-mp .nt button{flex:0 0 44px;width:44px;height:44px;margin-right:-14px;border:0;background:none;padding:0;display:flex;align-items:center;justify-content:center;}'
		+ '.tkbb-mp .hi{padding:28px 20px 22px;}'
		+ '.tkbb-mp .hi h2{margin:0;font-size:26px;font-weight:900;letter-spacing:-.04em;line-height:1.3;}'
		+ '.tkbb-mp .hi h2 small{font-size:26px;font-weight:500;}'
		+ '.tkbb-mp .hi p{margin:4px 0 0;font-size:14px;color:#6A6A66;}'
		+ '.tkbb-mp .gr{display:flex;align-items:center;justify-content:space-between;height:52px;box-sizing:border-box;margin-top:16px;padding:0 16px;background:#F7F5EE;border-radius:4px;}'
		+ '.tkbb-mp .gr div{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700;}'
		+ '.tkbb-mp .gr i{width:22px;height:22px;border-radius:50%;background:#D1D798;display:inline-block;}'
		+ '.tkbb-mp .gr small{font-size:13px;font-weight:400;color:#6A6A66;}'
		+ '.tkbb-mp .sm{display:flex;margin:0 20px;height:84px;box-sizing:border-box;border-top:1px solid #DAD5C8;border-bottom:1px solid #DAD5C8;}'
		+ '.tkbb-mp .sm a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;}'
		+ '.tkbb-mp .sm a + a{border-left:1px solid #EFEDE6;}'
		+ '.tkbb-mp .sm span{font-size:13px;color:#6A6A66;}'
		+ '.tkbb-mp .sm b{font-size:18px;font-weight:700;}'
		+ '.tkbb-mp .sm b small{font-size:13px;font-weight:500;}'
		+ '.tkbb-mp .em{margin:0 20px;height:56px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #EFEDE6;font-size:14px;}'
		+ '.tkbb-mp .em span{color:#6A6A66;}'
		+ '.tkbb-mp .em b{display:flex;align-items:center;gap:6px;font-weight:700;}'
		+ '.tkbb-mp .os{padding:28px 20px 8px;}'
		+ '.tkbb-mp .hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;}'
		+ '.tkbb-mp .hd h3{margin:0;font-size:17px;font-weight:900;letter-spacing:-.03em;}'
		+ '.tkbb-mp .hd a{font-size:13px;color:#6A6A66;}'
		+ '.tkbb-mp .os ul{display:flex;margin:0;padding:18px 4px;list-style:none;background:#F7F5EE;border-radius:4px;}'
		+ '.tkbb-mp .os li{flex:1;text-align:center;}'
		+ '.tkbb-mp .os li b{display:block;font-size:20px;font-weight:700;}'
		+ '.tkbb-mp .os li span{display:block;font-size:12px;color:#6A6A66;margin-top:4px;}'
		+ '.tkbb-mp .os li.on b,.tkbb-mp .os li.on span{color:#52728A;}'
		+ '.tkbb-mp .os p{margin:8px 2px 0;font-size:11.5px;color:#6A6A66;}'
		+ '.tkbb-mp .bn{display:flex;align-items:center;justify-content:space-between;margin:24px 20px 8px;height:88px;box-sizing:border-box;padding:0 20px;background:#D1D798;border-radius:4px;}'
		+ '.tkbb-mp .bn small{display:block;font-size:12px;font-weight:700;color:#3E4220;letter-spacing:.03em;}'
		+ '.tkbb-mp .bn b{display:block;font-size:17px;font-weight:900;letter-spacing:-.03em;margin-top:4px;}'
		+ '.tkbb-mp .sc{padding:28px 20px 0;display:flex;flex-direction:column;gap:32px;}'
		+ '.tkbb-mp .sc h3{margin:0;padding-bottom:12px;border-bottom:2px solid #161616;font-size:17px;font-weight:900;letter-spacing:-.03em;}'
		+ '.tkbb-mp .sc a{display:flex;align-items:center;justify-content:space-between;min-height:52px;border-bottom:1px solid #EFEDE6;font-size:15px;}'
		+ '.tkbb-mp .cs{margin-top:36px;padding:28px 20px 40px;background:#F7F5EE;display:flex;flex-direction:column;gap:16px;}'
		+ '.tkbb-mp .cs b{font-size:15px;font-weight:700;}'
		+ '.tkbb-mp .cs p{margin:6px 0 0;font-size:13px;color:#6A6A66;line-height:1.5;}'
		+ '.tkbb-mp .cs .bt{display:flex;gap:8px;}'
		+ '.tkbb-mp .cs .bt a{flex:1;height:48px;display:flex;align-items:center;justify-content:center;background:#fff;border:1px solid #161616;border-radius:4px;font-size:14px;font-weight:700;}'
		+ '.tkbb-mp .cs .bt a + a{background:#161616;color:#fff;}'
		+ '.tkbb-mp .cs .lk{display:flex;justify-content:center;gap:20px;font-size:13px;color:#6A6A66;margin-top:8px;}'
		+ '.tkbb-mp .cs .lk i{font-style:normal;color:#DAD5C8;}';

	var ARW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9A94" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
	var ARW_D = ARW.replace('#9A9A94', '#161616');

	function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
	function num(s){ var n = String(s || '').replace(/[^\d]/g, ''); return n ? Number(n).toLocaleString('ko-KR') : '0'; }

	function build(){
		var root = document.getElementById('mypage');
		var cnt = document.getElementById('cnt');
		if (!root || !cnt || root.querySelector('.tkbb-mp')) return;

		// 1) 원래 화면에서 값 읽기
		var info = {};
		var lis = root.querySelectorAll('.my_info li');
		for (var i = 0; i < lis.length; i++) {
			var sp = lis[i].querySelector('span');
			var a = lis[i].querySelector('a');
			if (!sp || !a) continue;
			var key = (a.textContent || '').replace((sp.textContent || ''), '').replace(/\s+/g, '');
			info[key] = (sp.textContent || '').trim();
		}
		if (!info['회원등급']) return; // 예상과 다르면 원래 화면 그대로 둔다

		// 최근 3개월 주문 상태 세기
		var cnt5 = { '입금대기': 0, '결제완료': 0, '배송준비': 0, '배송중': 0, '배송완료': 0 };
		var sts = root.querySelectorAll('.ord_latest .p_color');
		for (var j = 0; j < sts.length; j++) {
			var t = (sts[j].textContent || '').replace(/\s+/g, '');
			if (t.indexOf('입금대기') >= 0) cnt5['입금대기']++;
			else if (t.indexOf('결제완료') >= 0) cnt5['결제완료']++;
			else if (t.indexOf('배송준비') >= 0 || t.indexOf('상품준비') >= 0) cnt5['배송준비']++;
			else if (t.indexOf('배송중') >= 0) cnt5['배송중']++;
			else if (t.indexOf('배송완료') >= 0) cnt5['배송완료']++;
		}

		// 메뉴는 원래 드롭다운(select)에 있는 것만 쓴다 (숨김 처리된 항목 .dn 은 뺀다)
		var menu = {};
		var opts = cnt.querySelectorAll('select.top_select_menu option');
		for (var k = 0; k < opts.length; k++) {
			var v = opts[k].getAttribute('value');
			if (!v || /(^|\s)dn(\s|$)/.test(opts[k].className)) continue;
			menu[v.split('?')[0] + (v.indexOf('sbscr=Y') > -1 ? '?sbscr=Y' : '')] = opts[k].textContent.replace(/\s+/g, ' ').trim();
		}
		function item(path, fallback){ return menu[path] ? '<a href="' + path + '"><span>' + esc(menu[path]) + '</span>' + ARW + '</a>' : ''; }
		function sect(title, paths){
			var h = ''; for (var p = 0; p < paths.length; p++) h += item(paths[p]);
			return h ? '<div><h3>' + title + '</h3>' + h + '</div>' : '';
		}

		var logout = document.querySelector('header a[href*="logout"]');
		var logoutHref = logout ? logout.getAttribute('href') : '/member/logout.php';

		var h = '';
		h += '<div class="nt"><a href="/#tkbb-live"><em>공지</em><span>이번 주 공동구매 일정을 확인해보세요</span></a>'
			+ '<button type="button" aria-label="공지 닫기"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
		h += '<div class="hi"><h2>회원<small>님</small></h2><p>오늘도 타코베베와 함께해요</p>'
			+ '<a class="gr" href="/member/edit_step1.php"><div><i></i>' + esc(info['회원등급']) + ' <small>내 정보 보기</small></div>' + ARW_D + '</a></div>';
		h += '<div class="sm">'
			+ '<a href="/mypage/coupon_down_list.php"><span>쿠폰</span><b>' + num(info['쿠폰']) + '<small>장</small></b></a>'
			+ '<a href="/mypage/wish_list.php"><span>관심상품</span><b>' + num(info['관심상품']) + '<small>개</small></b></a>'
			+ '<a href="/mypage/milage.php"><span>적립금</span><b>' + num(info['적립금']) + '<small>원</small></b></a></div>';
		if (info['예치금'] != null) h += '<a class="em" href="/mypage/emoney.php"><span>예치금</span><b>' + num(info['예치금']) + '원' + ARW_D + '</b></a>';
		h += '<div class="os"><div class="hd"><h3>주문·배송 현황</h3><a href="/mypage/order_list.php">전체보기</a></div><ul>';
		var names = ['입금대기', '결제완료', '배송준비', '배송중', '배송완료'];
		for (var n = 0; n < names.length; n++) h += '<li' + (names[n] === '배송중' ? ' class="on"' : '') + '><b>' + cnt5[names[n]] + '</b><span>' + names[n] + '</span></li>';
		h += '</ul><p>최근 3개월 기준</p></div>';
		h += '<a class="bn" href="/#tkbb-live"><div><small>GROUP BUY</small><b>이번 주 공동구매 일정 보기</b></div>'
			+ '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#161616" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
		h += '<div class="sc">'
			+ sect('나의 쇼핑정보', ['/mypage/order_list.php', '/mypage/order_list.php?sbscr=Y', '/mypage/wish_list.php', '/shop/click_prd.php'])
			+ sect('나의 계정정보', ['/member/edit_step1.php', '/mypage/milage.php', '/mypage/emoney.php', '/mypage/coupon_down_list.php'])
			+ sect('고객지원', ['/mypage/counsel_list.php', '/mypage/qna_list.php', '/mypage/review_list.php', '/mypage/notify_restock.php'])
			+ '</div>';
		h += '<div class="cs"><div><b>고객센터</b><p>전화 041-572-3307<br>이메일 market_takkobebe@takkobebe.com</p></div>'
			+ '<div class="bt"><a href="/mypage/counsel_list.php">1:1 문의하기</a><a href="/shop/product_qna_list.php">상품 문의</a></div>'
			+ '<div class="lk"><a href="' + esc(logoutHref) + '">로그아웃</a><i>|</i><a href="/mypage/withdraw_step1.php">회원 탈퇴</a></div></div>';

		var box = document.createElement('div');
		box.className = 'tkbb-mp';
		box.innerHTML = h;
		var x = box.querySelector('.nt button');
		if (x) x.addEventListener('click', function(){ var nt = box.querySelector('.nt'); if (nt) nt.style.display = 'none'; });

		var st = document.createElement('style');
		st.appendChild(document.createTextNode(CSS));
		(document.head || document.documentElement).appendChild(st);
		root.insertBefore(box, root.firstChild);
		root.classList.add('tkbb-mp-on');
		cnt.classList.add('tkbb-mp-on');
	}

	function start(){ try { build(); } catch (e) { /* 실패하면 원래 화면이 그대로 보인다 */ } }
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
	else start();
})();
/* ===== 마이페이지 끝 ===== */
