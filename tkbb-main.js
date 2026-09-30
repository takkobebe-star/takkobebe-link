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

/* ===== 마이페이지 (B안: 오아시스마켓 스타일 카드형, 타코베베 컬러) — 2026-09-30 =====
   /mypage/mypage.php 의 원래 내용(#mypage)을 읽어서 새 모양으로 다시 그린다.
   원래 화면은 지우지 않고 숨기기만 한다. 주소 끝에 ?tkbb_old=1 을 붙이면 원래 화면이 보인다.
   회원 이름은 위사 '마이페이지 메인' 페이지 코드에 숨겨 둔 <span id="tkbb-mem-name">{{$회원명}}</span> 에서 읽는다.
   되돌리려면 이 블록(시작~끝)만 지우면 된다. (A안 29CM 스타일은 git 기록 2026-09-29 에 있다) */
(function(){
	if (window.__TKBB_MYPAGE) return; window.__TKBB_MYPAGE = 1;
	if (window.browser_type === 'pc') return;
	if (location.pathname !== '/mypage/mypage.php') return;
	if (/[?&]tkbb_old=1/.test(location.search)) return;

	var CSS = ''
		+ '#cnt.tkbb-mp-on > h2.subtitle,#cnt.tkbb-mp-on > select.top_select_menu{display:none !important;}'
		+ '#mypage.tkbb-mp-on > :not(.tkbb-mp){display:none !important;}'
		+ '#cnt.tkbb-mp-on{background:#F4F2EC;}'
		+ '.tkbb-mp{font-family:inherit;color:#161616;letter-spacing:-.02em;background:#F4F2EC;padding:0 0 8px;}'
		+ '.tkbb-mp a{color:inherit;text-decoration:none;}'
		+ '.tkbb-mp .hi{display:flex;align-items:flex-end;justify-content:space-between;padding:20px 16px 16px;}'
		+ '.tkbb-mp .hi .bd{display:inline-flex;align-items:center;gap:2px;background:#7C8340;color:#fff;font-size:11px;font-weight:600;padding:3px 6px 3px 8px;border-radius:3px;}'
		+ '.tkbb-mp .hi h2{margin:8px 0 0;font-size:22px;font-weight:600;letter-spacing:-.03em;line-height:1.3;}'
		+ '.tkbb-mp .hi h2 small{font-size:22px;font-weight:400;}'
		+ '.tkbb-mp .hi .ed{display:flex;align-items:center;gap:4px;font-size:13px;color:#6A6A66;padding-bottom:4px;}'
		+ '.tkbb-mp .wr{padding:0 16px;display:flex;flex-direction:column;gap:10px;}'
		+ '.tkbb-mp .cd{background:#fff;border-radius:12px;}'
		+ '.tkbb-mp .pt{display:flex;height:92px;}'
		+ '.tkbb-mp .pt a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}'
		+ '.tkbb-mp .pt a + a{border-left:1px solid #EFEDE6;margin:22px 0;padding:0;}'
		+ '.tkbb-mp .pt span{font-size:14px;color:#6A6A66;}'
		+ '.tkbb-mp .pt b{font-size:20px;font-weight:700;}'
		+ '.tkbb-mp .pt b small{font-size:15px;font-weight:500;}'
		+ '.tkbb-mp .em{display:flex;align-items:center;justify-content:space-between;height:48px;box-sizing:border-box;padding:0 16px;border:1px solid #7C8340;border-radius:10px;background:#fff;font-size:14px;}'
		+ '.tkbb-mp .em span{color:#7C8340;font-weight:600;}'
		+ '.tkbb-mp .em b{display:flex;align-items:center;gap:6px;font-weight:600;}'
		+ '.tkbb-mp .os{display:flex;padding:18px 8px;}'
		+ '.tkbb-mp .os a{flex:1;text-align:center;}'
		+ '.tkbb-mp .os span{display:block;font-size:12px;color:#6A6A66;}'
		+ '.tkbb-mp .os b{display:block;font-size:18px;font-weight:700;margin-top:8px;}'
		+ '.tkbb-mp .os a.on span,.tkbb-mp .os a.on b{color:#52728A;}'
		+ '.tkbb-mp .bx{padding:18px 16px;}'
		+ '.tkbb-mp .ht{display:flex;align-items:center;justify-content:space-between;font-size:16px;font-weight:600;}'
		+ '#mypage .tkbb-mp .ht h3{margin:0;padding:0;font-size:16px;font-weight:600;line-height:1.4;}'
		+ '.tkbb-mp .ro{display:flex;align-items:center;gap:12px;margin-top:14px;}'
		+ '.tkbb-mp .ro .th{width:56px;height:56px;flex:0 0 56px;border-radius:8px;background:#EEEADF;display:flex;align-items:center;justify-content:center;overflow:hidden;}'
		+ '.tkbb-mp .ro .th img{width:100%;height:100%;object-fit:cover;display:block;}'
		+ '.tkbb-mp .ro .tx{min-width:0;}'
		+ '.tkbb-mp .ro .nm{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
		+ '.tkbb-mp .ro .pr{display:flex;align-items:baseline;gap:8px;margin-top:4px;}'
		+ '.tkbb-mp .ro .pr b{font-size:16px;font-weight:700;}'
		+ '.tkbb-mp .ro .pr span{font-size:12px;color:#52728A;}'
		+ '.tkbb-mp .ep{margin:14px 0 0;font-size:13px;color:#6A6A66;}'
		+ '.tkbb-mp .ic{display:grid;grid-template-columns:1fr 1fr 1fr;row-gap:20px;padding:18px 8px;}'
		+ '.tkbb-mp .ic a{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:13px;color:#3E3E3A;}'
		+ '.tkbb-mp .bn{display:flex;align-items:center;justify-content:space-between;height:68px;box-sizing:border-box;padding:0 18px;background:#D1D798;border-radius:10px;}'
		+ '.tkbb-mp .bn b{display:block;font-size:15px;font-weight:700;}'
		+ '.tkbb-mp .bn small{display:block;font-size:12px;color:#3E4220;margin-top:3px;}'
		+ '.tkbb-mp .lt{display:flex;gap:8px;margin-top:14px;}'
		+ '.tkbb-mp .lt a{width:calc((100% - 24px) / 4);aspect-ratio:1/1;border-radius:8px;overflow:hidden;background:#EEEADF;}'
		+ '.tkbb-mp .lt img{width:100%;height:100%;object-fit:cover;display:block;}'
		+ '.tkbb-mp .g2{display:grid;grid-template-columns:1fr 1fr;margin-top:6px;}'
		+ '.tkbb-mp .g2 a{display:flex;align-items:center;gap:8px;min-height:44px;font-size:14px;}'
		+ '.tkbb-mp .cb{display:flex;gap:8px;margin-top:14px;}'
		+ '.tkbb-mp .cb a{flex:1;height:48px;display:flex;align-items:center;justify-content:center;border:1px solid #DAD5C8;border-radius:8px;background:#F7F5EE;font-size:14px;font-weight:500;}'
		+ '.tkbb-mp .ci{margin-top:10px;padding-top:14px;border-top:1px solid #EFEDE6;font-size:13px;color:#6A6A66;line-height:1.6;}'
		+ '.tkbb-mp .ci b{color:#161616;font-weight:600;}'
		+ '.tkbb-mp .lk{display:flex;justify-content:center;gap:18px;padding:28px 16px 32px;font-size:13px;color:#6A6A66;}'
		+ '.tkbb-mp .lk i{font-style:normal;color:#DAD5C8;}';

	function sv(d, sw){ return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#161616" stroke-width="' + (sw || 1.5) + '" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; }
	function sv18(d){ return sv(d, 1.6).replace('width="24" height="24"', 'width="18" height="18"'); }
	var ARW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#161616" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
	var ARW_O = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C8340" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
	var I = {
		order: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
		wish: '<path d="M20.8 6.6a5 5 0 00-8.8-1.6 5 5 0 00-8.8 1.6c-1 2.6.5 5.2 2.3 7 1.8 1.9 4.2 3.7 6.5 5.4 2.3-1.7 4.7-3.5 6.5-5.4 1.8-1.8 3.3-4.4 2.3-7z"/>',
		eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
		cart: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
		sub: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M9 15l2 2 4-4"/>',
		qna: '<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/><path d="M9.5 10a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 16h.01"/>',
		user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
		mil: '<circle cx="12" cy="12" r="9"/><path d="M9 9h4.5a2 2 0 010 4H9V9zM9 13v4"/>',
		emo: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>',
		cpn: '<path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4V8z"/><path d="M10 9v6"/>',
		rev: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3z"/>',
		cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
		box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/>'
	};
	var QNA = 'https://m.takkobebe.com/shop/product_qna_list.php';

	function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
	function num(s){ if (s == null) return '-'; var n = String(s).replace(/[^\d]/g, ''); return n ? Number(n).toLocaleString('ko-KR') : '0'; }
	function txt(el){ return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

	function build(){
		var root = document.getElementById('mypage');
		var cnt = document.getElementById('cnt');
		if (!root || !cnt || root.querySelector('.tkbb-mp')) return;
		if (!root.querySelector('.my_info li')) return; // 예상과 다르면 원래 화면 그대로 둔다

		// 1) 원래 화면에서 값 읽기 (위사가 로그인한 회원 기준으로 채워 준 값)
		var info = {};
		var lis = root.querySelectorAll('.my_info li');
		for (var i = 0; i < lis.length; i++) {
			var sp = lis[i].querySelector('span'), a = lis[i].querySelector('a');
			if (!sp || !a) continue;
			info[(a.textContent || '').replace((sp.textContent || ''), '').replace(/\s+/g, '')] = (sp.textContent || '').trim();
		}
		var grade = (info['회원등급'] || '').trim() || '회원';
		var nmEl = document.getElementById('tkbb-mem-name');
		var memName = txt(nmEl) || '회원';

		// 2) 최근 3개월 주문 상태 세기 + 가장 최근 주문 1건
		var cnt5 = { '입금대기': 0, '결제완료': 0, '배송준비': 0, '배송중': 0, '배송완료': 0 };
		var ords = root.querySelectorAll('.ord_latest .list > li');
		for (var j = 0; j < ords.length; j++) {
			var t = txt(ords[j].querySelector('.p_color')).replace(/\s+/g, '');
			if (t.indexOf('입금대기') >= 0 || t.indexOf('미입금') >= 0) cnt5['입금대기']++;   // 위사는 무통장 미입금 주문을 '미입금' 으로 표시한다
			else if (t.indexOf('결제완료') >= 0 || t.indexOf('입금완료') >= 0 || t.indexOf('입금확인') >= 0) cnt5['결제완료']++;
			else if (t.indexOf('배송준비') >= 0 || t.indexOf('상품준비') >= 0) cnt5['배송준비']++;
			else if (t.indexOf('배송중') >= 0) cnt5['배송중']++;
			else if (t.indexOf('배송완료') >= 0) cnt5['배송완료']++;
		}
		var last = null;
		if (ords.length) {
			var o = ords[0], ps = o.querySelectorAll('.info p'), la = o.querySelector('.no a');
			last = { name: txt(ps[0]), pay: txt(o.querySelector('.info strong')), st: txt(o.querySelector('.p_color')), href: la ? la.getAttribute('href') : '/mypage/order_list.php' };
		}

		// 3) 최근 본 상품 (최대 4개)
		var seen = [];
		var sa = root.querySelectorAll('.prd_latest .latest li a');
		for (var s = 0; s < sa.length && seen.length < 4; s++) {
			var im = sa[s].querySelector('img');
			if (im) seen.push({ href: sa[s].getAttribute('href'), src: im.getAttribute('src') });
		}

		// 4) 메뉴는 원래 드롭다운(select)에 있는 것만 쓴다 (숨김 처리된 항목 .dn 은 뺀다)
		var menu = {};
		var opts = cnt.querySelectorAll('select.top_select_menu option');
		for (var k = 0; k < opts.length; k++) {
			var v = opts[k].getAttribute('value');
			if (!v || /(^|\s)dn(\s|$)/.test(opts[k].className)) continue;
			menu[v.split('?')[0] + (v.indexOf('sbscr=Y') > -1 ? '?sbscr=Y' : '')] = 1;
		}
		function has(p){ return !!menu[p]; }

		var logout = document.querySelector('header a[href*="logout"]');
		var logoutHref = logout ? logout.getAttribute('href') : '/member/logout.php';

		var h = '';
		// 등급 + 이름
		h += '<div class="hi"><div><a class="bd" href="/member/edit_step1.php">' + esc(grade) + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></a>'
			+ '<h2>' + esc(memName) + '<small>님</small></h2></div>'
			+ '<a class="ed" href="/member/edit_step1.php"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6A6A66" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>회원정보관리</a></div>';
		h += '<div class="wr">';
		// 적립금 / 쿠폰
		h += '<div class="cd pt">'
			+ (info['적립금'] != null ? '<a href="/mypage/milage.php"><span>적립금</span><b>' + num(info['적립금']) + '<small>원</small></b></a>' : '')
			+ '<a href="/mypage/coupon_down_list.php"><span>쿠폰</span><b>' + num(info['쿠폰']) + '<small>장</small></b></a></div>';
		// 예치금
		if (info['예치금'] != null) h += '<a class="em" href="/mypage/emoney.php"><span>예치금</span><b>' + num(info['예치금']) + '원' + ARW_O + '</b></a>';
		// 주문·배송 현황
		h += '<div class="cd os">';
		var names = ['입금대기', '결제완료', '배송준비', '배송중', '배송완료'];
		for (var n = 0; n < names.length; n++) h += '<a href="/mypage/order_list.php"' + (names[n] === '배송중' ? ' class="on"' : '') + '><span>' + names[n] + '</span><b>' + cnt5[names[n]] + '</b></a>';
		h += '</div>';
		// 최근 주문내역
		h += '<div class="cd bx"><a class="ht" href="/mypage/order_list.php"><h3>최근 주문내역</h3>' + ARW + '</a>';
		if (last) h += '<a class="ro" href="' + esc(last.href) + '"><div class="th">' + sv(I.box, 1.6).replace(/#161616/, '#9A9A94').replace('width="24" height="24"', 'width="22" height="22"') + '</div>'
			+ '<div class="tx"><div class="nm">' + esc(last.name) + '</div><div class="pr"><b>' + esc(last.pay) + '</b><span>' + esc(last.st) + '</span></div></div></a>';
		else h += '<p class="ep">최근 3개월 주문 내역이 없어요.</p>';
		h += '</div>';
		// 아이콘 메뉴
		h += '<div class="cd ic">'
			+ '<a href="/mypage/order_list.php">' + sv(I.order) + '주문내역</a>'
			+ '<a href="/mypage/wish_list.php">' + sv(I.wish) + '관심상품</a>'
			+ '<a href="/shop/click_prd.php">' + sv(I.eye) + '최근 본 상품</a>'
			+ '<a href="/shop/cart.php">' + sv(I.cart) + '장바구니</a>'
			+ (has('/mypage/order_list.php?sbscr=Y') ? '<a href="/mypage/order_list.php?sbscr=Y">' + sv(I.sub) + '정기배송</a>' : '')
			+ '<a href="' + QNA + '">' + sv(I.qna) + '상품문의</a></div>';
		// 공동구매 배너
		h += '<a class="bn" href="https://takkobebe-link.vercel.app/month.html"><div><b>이번 주 공동구매 일정 보기</b><small>진행 중 · 오픈 예정 공구를 한눈에</small></div>' + ARW + '</a>';
		// 최근 본 상품
		h += '<div class="cd bx"><a class="ht" href="/shop/click_prd.php"><h3>최근 본 상품</h3>' + ARW + '</a>';
		if (seen.length) { h += '<div class="lt">'; for (var q = 0; q < seen.length; q++) h += '<a href="' + esc(seen[q].href) + '"><img src="' + esc(seen[q].src) + '" alt="" loading="lazy"></a>'; h += '</div>'; }
		else h += '<p class="ep">최근 본 상품이 없어요.</p>';
		h += '</div>';
		// 나의 정보
		h += '<div class="cd bx"><div class="ht"><h3>나의 정보</h3></div><div class="g2">'
			+ '<a href="/member/edit_step1.php">' + sv18(I.user) + '나의 정보수정</a>'
			+ (has('/mypage/milage.php') ? '<a href="/mypage/milage.php">' + sv18(I.mil) + '적립금 내역</a>' : '')
			+ (has('/mypage/emoney.php') ? '<a href="/mypage/emoney.php">' + sv18(I.emo) + '예치금 내역</a>' : '')
			+ '<a href="/mypage/coupon_down_list.php">' + sv18(I.cpn) + '쿠폰함</a>'
			+ '<a href="/mypage/review_list.php">' + sv18(I.rev) + '나의 상품후기</a>'
			+ (has('/mypage/order_list.php?sbscr=Y') ? '<a href="/mypage/order_list.php?sbscr=Y">' + sv18(I.cal) + '정기배송 내역</a>' : '')
			+ '</div></div>';
		// 고객센터
		h += '<div class="cd bx"><div class="ht"><h3>고객센터</h3></div><div>'
			+ '</div><div class="cb"><a href="' + QNA + '">상품문의</a><a href="/mypage/qna_list.php">나의 상품문의</a></div></div>';
		h += '</div>';
		h += '<div class="lk"><a href="' + esc(logoutHref) + '">로그아웃</a><i>|</i><a href="/mypage/withdraw_step1.php">회원 탈퇴</a></div>';

		var box = document.createElement('div');
		box.className = 'tkbb-mp';
		box.innerHTML = h;
		var st = document.createElement('style');
		st.appendChild(document.createTextNode(CSS));
		(document.head || document.documentElement).appendChild(st);
		root.insertBefore(box, root.firstChild);
		root.classList.add('tkbb-mp-on');
		cnt.classList.add('tkbb-mp-on');
		if (last && last.name) loadThumb(box.querySelector('.ro .th'), last.name);
	}

	// 최근 주문 상품 사진: 주문 목록에는 사진이 없어서, 상품명으로 쇼핑몰을 검색해 같은 이름 상품의 사진을 쓴다.
	// 못 찾으면 상자 아이콘이 그대로 남는다.
	function loadThumb(th, name){
		if (!th || !window.fetch || !window.DOMParser) return;
		var q = name.replace(/\[[^\]]*\]|\([^)]*\)/g, ' ').replace(/\s(外|외)\s*\d+\s*건?\s*$/, '').replace(/\s+/g, ' ').trim();
		if (!q) return;
		var key = function(s){ return String(s || '').replace(/\[[^\]]*\]|\([^)]*\)|\s/g, ''); };
		fetch('/shop/search_result.php?search_str=' + encodeURIComponent(q), { credentials: 'include' })
			.then(function(r){ return r.text(); })
			.then(function(html){
				var d = new DOMParser().parseFromString(html, 'text/html');
				var bs = d.querySelectorAll('.box'), pick = null, first = null;
				for (var i = 0; i < bs.length; i++) {
					var im = bs[i].querySelector('img'), nm = bs[i].querySelector('.name');
					if (!im || !im.getAttribute('src')) continue;
					if (!first) first = im;
					if (nm && key(nm.textContent) === key(q)) { pick = im; break; }
				}
				pick = pick || first;
				if (pick) th.innerHTML = '<img src="' + esc(pick.getAttribute('src')) + '" alt="">';
			})
			.catch(function(){});
	}

	function start(){ try { build(); } catch (e) { /* 실패하면 원래 화면이 그대로 보인다 */ } }
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
	else start();
})();
/* ===== 마이페이지 끝 ===== */

/* ===== 마이페이지 하위 메뉴 (마켓컬리식 카드, 타코베베 컬러) — 2026-09-30 =====
   위사가 만든 원래 화면 요소를 그대로 옮기거나 읽어서 카드 모양으로 다시 배치한다.
   버튼·폼은 원래 요소를 옮겨 쓰므로 위사 기능(주문조회, 배송지 변경, 주문 문의 등)은 그대로 동작한다.
   주소 끝에 ?tkbb_old=1 을 붙이면 원래 화면. 실패하면 원래 화면이 그대로 보인다.
   되돌리려면 이 블록(시작~끝)만 지우면 된다. */
(function(){
	if (window.__TKBB_MYSUB) return; window.__TKBB_MYSUB = 1;
	if (window.browser_type === 'pc') return;
	if (/[?&]tkbb_old=1/.test(location.search)) return;
	var P = location.pathname;
	var PAGES = { '/mypage/order_list.php': orderList, '/mypage/order_detail.php': orderDetail,
		'/mypage/wish_list.php': wishList, '/shop/click_prd.php': recentList,
		'/mypage/milage.php': function(c){ return pointPage(c, 'milage', '적립금', '사용 가능 적립금'); },
		'/mypage/emoney.php': function(c){ return pointPage(c, 'emoney', '예치금', '보유 예치금'); },
		'/mypage/coupon_down_list.php': couponList,
		'/mypage/counsel_list.php': counselList, '/mypage/qna_list.php': qnaList, '/mypage/review_list.php': reviewList,
		'/mypage/notify_restock.php': function(c){ return simpleCard(c, 'restock', '재입고 알림'); },
		'/shop/product_qna_list.php': qnaBoard, '/shop/product_qna.php': qnaBoard, '/shop/order_finish.php': orderFinish, '/shop/order.php': orderForm,
		'/member/edit_step1.php': editInfo, '/member/edit_step2.php': editInfo, '/mypage/withdraw_step1.php': withdraw };
	if (!PAGES[P]) return;

	var CSS = ''
		+ '#cnt.tkbb-my{background:#F4F2EC;padding:0 0 24px;letter-spacing:-.02em;color:#161616;}'
		+ '#cnt.tkbb-my > h2.subtitle,#cnt.tkbb-my > select.top_select_menu{display:none !important;}'
		+ '#cnt.tkbb-my a{text-decoration:none;}'
		+ '.tkbb-my .tk-hd{display:flex;align-items:center;gap:4px;height:52px;padding:0 8px;background:#fff;}'
		+ '.tkbb-my .tk-hd a{width:44px;height:44px;display:flex;align-items:center;justify-content:center;}'
		+ '.tkbb-my .tk-hd h2{margin:0;padding:0;font-size:18px;font-weight:600;color:#161616;}'
		+ '.tkbb-my .tk-wr{padding:14px;display:flex;flex-direction:column;gap:12px;}'
		+ '.tkbb-my .tk-cd{background:#fff;border-radius:16px;padding:20px 18px;}'
		+ '.tkbb-my .tk-t{font-size:17px;font-weight:700;margin:0 0 14px;padding:0;color:#161616;}'
		+ '.tkbb-my .tk-date{font-size:20px;font-weight:700;color:#161616;}'
		+ '.tkbb-my .tk-ono{display:flex;align-items:center;gap:4px;margin-top:6px;font-size:14px;color:#6A6A66;}'
		+ '.tkbb-my .tk-ono button{width:30px;height:30px;border:0;background:none;padding:0;display:flex;align-items:center;justify-content:center;}'
		+ '.tkbb-my .tk-top{display:flex;align-items:center;justify-content:space-between;color:#161616;}'
		+ '.tkbb-my .tk-hr{height:1px;background:#EFEDE6;margin:18px 0;}'
		+ '.tkbb-my .tk-st{font-size:19px;font-weight:700;color:#7C8340;}'
		+ '.tkbb-my .tk-st.blue{color:#52728A;}.tkbb-my .tk-st.gray{color:#6A6A66;}'
		+ '.tkbb-my .tk-pr{display:flex;align-items:center;gap:14px;margin-top:16px;}'
		+ '.tkbb-my .tk-pr .th{width:64px;height:80px;flex:0 0 64px;border-radius:8px;background:#EEEADF;overflow:hidden;display:flex;align-items:center;justify-content:center;}'
		+ '.tkbb-my .tk-pr .th img{width:100%;height:100%;object-fit:cover;display:block;}'
		+ '.tkbb-my .tk-pr .tx{flex:1;min-width:0;}'
		+ '.tkbb-my .tk-pr .nm{font-size:15px;line-height:1.4;color:#161616;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}'
		+ '.tkbb-my .tk-pr .pc{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:15px;color:#6A6A66;}'
		+ '.tkbb-my .tk-pr .pc b{font-size:17px;font-weight:700;color:#161616;}'
		+ '.tkbb-my .tk-pr .pc i{width:1px;height:12px;background:#DAD5C8;}'
		+ '.tkbb-my .tk-cart{width:44px;height:44px;flex:0 0 44px;border:1px solid #DAD5C8;border-radius:8px;display:flex;align-items:center;justify-content:center;}'
		+ '.tkbb-my .tk-cart[hidden]{display:none;}'
		+ '.tkbb-my .tk-bt{display:flex;gap:8px;margin-top:20px;}'
		+ '.tkbb-my .tk-bt a{flex:1;height:48px;border-radius:8px;background:#EFEDE6;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:#161616;}'
		+ '.tkbb-my .tk-black{display:flex;align-items:center;justify-content:center;height:52px;border-radius:10px;background:#161616;color:#fff !important;font-size:15px;font-weight:600;}'
		+ '.tkbb-my .tk-more{display:flex;align-items:center;justify-content:center;height:48px;border-radius:10px;border:1px solid #DAD5C8;background:#fff;font-size:14px;color:#161616;}'
		// 표(결제 정보)
		+ '.tkbb-my .tk-cd table.tbl_order{width:100%;border:0;border-collapse:collapse;}'
		+ '.tkbb-my .tk-cd table.tbl_order th,.tkbb-my .tk-cd table.tbl_order td{border:0;padding:6px 0;font-size:15px;background:none;vertical-align:top;}'
		+ '.tkbb-my .tk-cd table.tbl_order th{text-align:left;font-weight:400;color:#6A6A66;white-space:nowrap;padding-right:16px;}'
		+ '.tkbb-my .tk-cd table.tbl_order td{text-align:right;color:#161616;}'
		+ '.tkbb-my .tk-cd table.tbl_order tr.total_prc th{padding-top:16px;border-top:1px solid #EFEDE6;font-size:16px;font-weight:600;color:#161616;}'
		+ '.tkbb-my .tk-cd table.tbl_order tr.total_prc td{padding-top:16px;border-top:1px solid #EFEDE6;font-size:20px;font-weight:700;}'
		+ '.tkbb-my .tk-cd .def_info,.tkbb-my .tk-cd .wrap_inner{padding:0;margin:0;border:0;background:none;}'
		+ '.tkbb-my .tk-cd .def_info p{margin:0;font-size:14px;color:#6A6A66;line-height:1.6;}'
		+ '.tkbb-my .tk-cd .def_info p strong{display:block;font-size:15px;font-weight:600;color:#161616;margin-bottom:4px;}'
		+ '.tkbb-my .tk-cd .def_info .box_btn{display:none;}'
		+ '.tkbb-my .tk-cd .tk-tt{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}'
		+ '.tkbb-my .tk-cd .tk-tt .tk-t{margin:0;}'
		+ '.tkbb-my .tk-cd .tk-sm{height:32px;padding:0 12px;border:1px solid #DAD5C8;border-radius:6px;background:#fff;font-size:13px;color:#161616;display:flex;align-items:center;}'
		+ '.tkbb-my .tk-cd ul.tab{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;padding:0;list-style:none;border:0;}'
		+ '.tkbb-my .tk-cd ul.tab li{float:none;width:auto;margin:0;padding:0;border:0;}'
		+ '.tkbb-my .tk-cd ul.tab li a{display:flex;align-items:center;justify-content:center;height:46px;border:1px solid #DAD5C8;border-radius:8px;background:#fff;font-size:14px;color:#161616;}'
		+ '.tkbb-my .tk-cd p.empty{margin:14px 0 0;padding:0;font-size:13px;color:#9A9A94;text-align:left;border:0;}'
		// 주문내역: 기간 버튼
		+ '.tkbb-my .tk-per{background:#fff;padding:4px 16px 16px;}'
		+ '.tkbb-my .tk-per .date{display:flex;gap:6px;margin:0;padding:0;}'
		+ '#cnt.tkbb-my .tk-per .date .box_btn{flex:1 1 0;min-width:0;width:auto;margin:0;padding:0;border:0;background:none;float:none;}'
		+ '#cnt.tkbb-my .tk-per .date input{width:100%;height:36px;padding:0;border-radius:999px;border:1px solid #DAD5C8;background:#fff;color:#161616;font-size:13px;font-family:inherit;}'
		+ '.tkbb-my .tk-per .date .on input{background:#161616;border-color:#161616;color:#fff;}'
		+ '.tkbb-my .tk-per .date_input{display:flex;align-items:center;gap:6px;margin:12px 0 0;font-size:14px;color:#6A6A66;}'
		+ '.tkbb-my .tk-per .date_input input{flex:1;min-width:0;height:40px;border:1px solid #DAD5C8;border-radius:8px;padding:0 10px;font-size:14px;background:#fff;}'
		+ '.tkbb-my .tk-per > .box_btn{display:block;margin:8px 0 0;padding:0;border:0;background:none;}'
		+ '#cnt.tkbb-my .tk-per > .box_btn input{width:100%;height:42px;border:0 !important;border-radius:8px;background:#161616 !important;color:#fff !important;font-size:14px;font-weight:600;font-family:inherit;}'
		+ '.tkbb-my .tk-per .date{scrollbar-width:none;}.tkbb-my .tk-per .date::-webkit-scrollbar{display:none;}'
		+ '#cnt.tkbb-my .tk-per .date .box_btn input{background:#fff !important;border:1px solid #DAD5C8 !important;color:#161616 !important;}'
		+ '#cnt.tkbb-my .tk-per .date .box_btn.on input{background:#161616 !important;border-color:#161616 !important;color:#fff !important;}'
		+ '.tkbb-my .tk-empty{padding:40px 20px;text-align:center;font-size:15px;color:#6A6A66;}'
		+ '.tkbb-my .tk-bt a.rv{flex-direction:column;gap:2px;height:56px;}'
		+ '.tkbb-my .tk-bt a.rv small{font-size:12px;font-weight:700;color:#7C8340;}'
		+ '.tkbb-my .tk-pr .op{font-size:13px;color:#6A6A66;margin-top:4px;line-height:1.4;}'
		+ '.tkbb-my .tk-cd table.tbl_order tr.tk-stack th,.tkbb-my .tk-cd table.tbl_order tr.tk-stack td{display:block;text-align:left;padding:6px 0 0;}'
		+ '.tkbb-my .tk-cd table.tbl_order tr.tk-stack td{white-space:nowrap;font-size:14px;padding:2px 0 6px;}'
		+ '.tkbb-my .tk-cd table.tbl_order tr.tk-stack td strong{display:block;font-size:13px;font-weight:400;color:#7C8340;white-space:normal;}'
		// 요약 카드·내역
		+ '.tkbb-my .tk-lb{font-size:14px;color:#6A6A66;}'
		+ '.tkbb-my .tk-big{font-size:30px;font-weight:700;margin-top:6px;letter-spacing:-.02em;color:#161616;}'
		+ '.tkbb-my .tk-big small{font-size:20px;font-weight:500;}'
		+ '.tkbb-my .tk-note{margin-top:14px;padding:12px 14px;border-radius:8px;background:#F7F5EE;font-size:13px;color:#6A6A66;line-height:1.5;}'
		+ '.tkbb-my .tk-chips{display:flex;gap:8px;margin:0 0 6px;}'
		+ '.tkbb-my .tk-chips button{height:34px;padding:0 14px;border-radius:999px;border:1px solid #DAD5C8;background:#fff;color:#161616;font-size:13px;font-family:inherit;}'
		+ '.tkbb-my .tk-chips button.on{background:#161616;border-color:#161616;color:#fff;}'
		+ '.tkbb-my .tk-row{display:flex;justify-content:space-between;gap:12px;padding:16px 0;border-bottom:1px solid #EFEDE6;}'
		+ '.tkbb-my .tk-row:last-child{border-bottom:0;padding-bottom:0;}'
		+ '.tkbb-my .tk-row .d{font-size:13px;color:#9A9A94;}'
		+ '.tkbb-my .tk-row .r{font-size:15px;margin-top:4px;color:#161616;line-height:1.4;word-break:keep-all;}'
		+ '.tkbb-my .tk-row .s{font-size:12px;color:#9A9A94;margin-top:4px;}'
		+ '.tkbb-my .tk-row .a{flex:0 0 auto;text-align:right;}'
		+ '.tkbb-my .tk-row .a b{display:block;font-size:16px;font-weight:700;color:#161616;}'
		+ '.tkbb-my .tk-row .a b.plus{color:#7C8340;}'
		+ '.tkbb-my .tk-row .a span{font-size:12px;color:#9A9A94;}'
		// 탭
		+ '.tkbb-my .tk-tabs{display:flex;background:#fff;padding:0 16px;border-bottom:1px solid #EFEDE6;}'
		+ '.tkbb-my .tk-tabs button{flex:1;height:48px;border:0;border-bottom:2px solid transparent;background:none;font-size:15px;color:#6A6A66;font-family:inherit;}'
		+ '.tkbb-my .tk-tabs button.on{border-bottom-color:#161616;color:#161616;font-weight:600;}'
		+ '.tkbb-my .tk-tabs button em{font-style:normal;color:#7C8340;margin-left:4px;}'
		// 쿠폰
		+ '.tkbb-my .tk-cp{background:#fff;border-radius:16px;display:flex;overflow:hidden;}'
		+ '.tkbb-my .tk-cp .l{flex:1;min-width:0;padding:20px 18px;}'
		+ '.tkbb-my .tk-cp .v{font-size:24px;font-weight:700;color:#7C8340;}'
		+ '.tkbb-my .tk-cp .n{font-size:15px;margin-top:6px;line-height:1.4;color:#161616;}'
		+ '.tkbb-my .tk-cp .c{font-size:13px;color:#6A6A66;margin-top:10px;line-height:1.6;}'
		+ '.tkbb-my .tk-cp .r{width:64px;flex:0 0 64px;border-left:1px dashed #DAD5C8;background:#F7F5EE;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#7C8340;writing-mode:vertical-rl;}'
		+ '.tkbb-my .tk-cp.off .v,.tkbb-my .tk-cp.off .n,.tkbb-my .tk-cp.off .c,.tkbb-my .tk-cp.off .r{color:#B5B2A8;}'
		// 관심상품 (위사 원래 목록을 카드 안에서 정리)
		+ '.tkbb-my .tk-cd #wish_list,.tkbb-my .tk-cd #wish_list form{padding:0;margin:0;}'
		+ '.tkbb-my .tk-cd #wish_list p.empty{padding:36px 0;margin:0;border:0;text-align:center;font-size:15px;color:#6A6A66;}'
		+ '.tkbb-my .tk-cd .paging{display:none;}'
		+ '.tkbb-my .tk-pg .paging{display:flex;justify-content:center;gap:4px;margin:0;padding:0;}'
		+ '.tkbb-my .tk-cd p.empty{padding:28px 0;margin:0;border:0;text-align:center;font-size:15px;color:#6A6A66;background:none;}'
		+ '.tkbb-my .tk-cd .wrap_inner{padding:0;margin:0;}'
		+ '#cnt.tkbb-my .tk-wr > .wrap_inner,#cnt.tkbb-my .tk-wr > #join_input,#cnt.tkbb-my .tk-wr > #draw_input{padding:0 !important;margin:0 !important;}'
		+ '.tkbb-my .tk-badge{display:inline-block;font-size:12px;font-weight:600;padding:3px 8px;border-radius:999px;background:#EFEDE6;color:#6A6A66;}'
		+ '.tkbb-my .tk-badge.done{background:#D1D798;color:#3E4220;}'
		// 상품문의·후기: 위사 목록 한 줄을 카드로
		+ '.tkbb-my .tk-wr ul.list_qnarev{margin:0;padding:0;list-style:none;border:0;display:flex;flex-direction:column;gap:12px;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev > li{position:relative;background:#fff;border-radius:16px;padding:20px 18px;border:0;margin:0;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .subject{padding:0;margin:0;cursor:pointer;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .subject p{margin:0;padding:0;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .title{font-size:15px;color:#161616;line-height:1.5;margin-top:10px !important;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .title img{display:none;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .stat{font-size:13px;color:#9A9A94;margin-top:6px !important;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .content{margin:14px 0 0;padding:0;font-size:14px;line-height:1.6;color:#3E3E3A;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .content:empty{display:none;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .prdimg{float:none;position:absolute;left:18px;top:20px;width:48px;height:48px;border-radius:8px;overflow:hidden;background:#EEEADF;margin:0;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .prdimg img{width:100%;height:100%;object-fit:cover;display:block;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .subject.prd{padding-left:0;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .prdname{min-height:48px;padding:0 0 16px 60px !important;border-bottom:1px solid #EFEDE6;margin-bottom:14px !important;font-size:14px;color:#6A6A66;display:flex;align-items:center;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .prdname a{color:#6A6A66;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .gradebox{display:none;}'
		+ '.tkbb-my .tk-stars{display:inline-flex;gap:2px;vertical-align:middle;}'
		+ '.tkbb-my .tk-wr ul.list_qnarev .grade{display:none;}'
		+ '.tkbb-my .tk-banner{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-radius:12px;background:#D1D798;color:#161616;}'
		+ '.tkbb-my .tk-banner b{display:block;font-size:15px;font-weight:700;}'
		+ '.tkbb-my .tk-banner small{display:block;font-size:12px;color:#3E4220;margin-top:3px;}'
		// 정보수정·탈퇴 폼
		+ '.tkbb-my #join_input,.tkbb-my #draw_input{padding:0;margin:0;}'
		+ '#cnt.tkbb-my #join_input,#cnt.tkbb-my #join_input fieldset,#cnt.tkbb-my #draw_input{background:none !important;}'
		+ '.tkbb-my #join_input fieldset{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}'
		+ '.tkbb-my #join_input legend{display:none;}'
		+ '.tkbb-my #join_input .box{background:#fff;border-radius:16px;padding:20px 18px;margin:0;border:0;}'
		+ '.tkbb-my #join_input .box > div{margin:0 0 16px;padding:0;border:0;}'
		+ '.tkbb-my #join_input .box > div:last-child{margin-bottom:0;}'
		+ '.tkbb-my #join_input .box > div > label,.tkbb-my #join_input .box > div > label:first-child{display:block;float:none;width:auto;margin:0 0 6px;padding:0;font-size:13px;color:#6A6A66;}'
		+ '.tkbb-my #join_input .input_area{float:none;width:auto;margin:0;padding:0;}'
		+ '.tkbb-my #join_input .form_input,.tkbb-my #draw_input .form_input{width:100%;box-sizing:border-box;height:48px;padding:0 14px;border:1px solid #DAD5C8;border-radius:8px;background:#fff;font-size:15px;margin:0 0 8px;}'
		+ '.tkbb-my #join_input .form_input.readonly{background:#F7F5EE;border-color:#EFEDE6;color:#6A6A66;}'
		+ '.tkbb-my #join_input .box_btn.gray2{display:block;margin:0 0 8px;padding:0;border:0;background:none;}'
		+ '.tkbb-my #join_input .box_btn.gray2 a{display:flex;align-items:center;justify-content:center;height:44px;border:1px solid #161616;border-radius:8px;background:#fff;color:#161616;font-size:14px;font-weight:600;}'
		+ '.tkbb-my #join_input .msg p{margin:0;font-size:12px;color:#6A6A66;}'
		+ '.tkbb-my #join_input .check_chg,.tkbb-my #join_input .radio_chg{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-size:15px;}'
		+ '.tkbb-my #join_input .check_chg label,.tkbb-my #join_input .radio_chg label{font-size:15px;color:#161616;margin:0;}'
		+ '.tkbb-my #join_input ul.integrate{margin:0;padding:0;list-style:none;}'
		+ '.tkbb-my #join_input ul.integrate li{display:flex;align-items:center;gap:10px;min-height:52px;border-bottom:1px solid #EFEDE6;padding:0;margin:0;float:none;width:auto;}'
		+ '.tkbb-my #join_input ul.integrate li:last-child{border-bottom:0;}'
		+ '.tkbb-my #join_input ul.integrate .name{flex:1;margin:0;font-size:15px;color:#161616;background:none;padding:0;}'
		+ '.tkbb-my #join_input ul.integrate .state{order:2;margin:0;font-size:12px;color:#9A9A94;}'
		+ '.tkbb-my #join_input ul.integrate .box_btn{order:3;margin:0;padding:0;border:0;background:none;}'
		+ '.tkbb-my #join_input ul.integrate .box_btn a{display:flex;align-items:center;height:32px;padding:0 12px;border:1px solid #DAD5C8;border-radius:6px;background:#fff;color:#161616;font-size:13px;}'
		+ '.tkbb-my .tk-h{margin:0 0 16px;padding:0;font-size:17px;font-weight:700;color:#161616;}'
		+ '.tkbb-my #join_input .btn,.tkbb-my #draw_input .btn{margin:12px 0 0;padding:0;}'
		+ '#cnt.tkbb-my #join_input .btn .box_btn,#cnt.tkbb-my #draw_input .btn .box_btn{display:block;margin:0;padding:0;border:0;background:none;}'
		+ '#cnt.tkbb-my #join_input .btn input[type=submit]{width:100%;height:52px;border:0 !important;border-radius:10px;background:#161616 !important;color:#fff !important;font-size:15px;font-weight:600;font-family:inherit;}'
		+ '.tkbb-my .tk-link{display:block;text-align:center;padding:14px;font-size:13px;color:#9A9A94 !important;text-decoration:underline !important;}'
		+ '.tkbb-my #draw_input form{text-align:left !important;}'
		+ '.tkbb-my #draw_input .box{background:#fff;border-radius:16px;padding:22px 18px;margin:0;border:0;}'
		+ '.tkbb-my #draw_input .msg{margin:0 0 18px;padding:0;font-size:14px;line-height:1.6;color:#3E3E3A;text-align:left;border:0;background:none;}'
		+ '.tkbb-my #draw_input textarea.form_input{height:96px;padding:12px 14px;resize:none;}'
		+ '#cnt.tkbb-my #draw_input .btn{display:flex;gap:8px;}'
		+ '#cnt.tkbb-my #draw_input .btn .box_btn{flex:1;width:auto;}'
		+ '#cnt.tkbb-my #draw_input .btn .box_btn input,#cnt.tkbb-my #draw_input .btn .box_btn a{display:flex;align-items:center;justify-content:center;width:100%;height:52px;border-radius:10px;font-size:15px;font-family:inherit;}'
		+ '#cnt.tkbb-my #draw_input .btn .box_btn input{border:1px solid #DAD5C8 !important;background:#fff !important;color:#6A6A66 !important;}'
		+ '#cnt.tkbb-my #draw_input .btn .box_btn a{border:0;background:#161616 !important;color:#fff !important;font-weight:600;}'
		+ '#cnt.tkbb-my #counsel > .box_btn{display:none;}'
		// Q&A 게시판
		+ '.tkbb-my .tk-qa .prdname{display:none !important;}'
		+ '.tkbb-my .tk-qa ul.list_qnarev .title{margin-top:0 !important;}'
		+ '.tkbb-my .tk-qa ul.list_qnarev .stat{display:inline-block;margin-right:8px;}'
		+ '.tkbb-my .tk-qa ul.list_qnarev .content .question,.tkbb-my .tk-qa ul.list_qnarev .content .answer{margin:0;padding:0;}'
		+ '.tkbb-my .tk-qa ul.list_qnarev .content .answer:not(:empty){margin-top:12px;padding:14px;border-radius:10px;background:#F7F5EE;}'
		+ '.tkbb-my .tk-qa ul.list_qnarev .content .btn{margin:10px 0 0;}'
		+ '.tkbb-my .tk-srch form{display:flex;gap:8px;margin:0;}'
		+ '.tkbb-my .tk-srch select{flex:0 0 92px;height:44px;border:1px solid #DAD5C8;border-radius:8px;background:#fff;padding:0 8px;font-size:14px;}'
		+ '.tkbb-my .tk-srch input.form_input{flex:1;min-width:0;height:44px;border:1px solid #DAD5C8;border-radius:8px;padding:0 12px;font-size:14px;margin:0;}'
		+ '#cnt.tkbb-my .tk-srch .btn_search{flex:0 0 auto;width:auto;height:44px;padding:0 16px;border:0;border-radius:8px;background:#161616;color:#fff;font-size:14px;text-indent:0;font-family:inherit;}'
		+ '.tkbb-my .tk-qw fieldset{border:0;margin:0;padding:0;}'
		+ '.tkbb-my .tk-qw fieldset > div{margin:0 0 14px;}'
		+ '.tkbb-my .tk-qw label{display:block;font-size:13px;color:#6A6A66;margin:0 0 6px;}'
		+ '.tkbb-my .tk-qw select,.tkbb-my .tk-qw .form_input{width:100%;box-sizing:border-box;min-height:46px;border:1px solid #DAD5C8;border-radius:8px;background:#fff;padding:0 12px;font-size:15px;}'
		+ '.tkbb-my .tk-qw textarea.form_input{height:180px;padding:12px;line-height:1.6;}'
		+ '#cnt.tkbb-my .tk-qw .btn .box_btn{display:block;margin:0;padding:0;border:0;background:none;}'
		+ '#cnt.tkbb-my .tk-qw .btn input[type=submit]{width:100%;height:52px;border:0 !important;border-radius:10px;background:#161616 !important;color:#fff !important;font-size:15px;font-weight:600;font-family:inherit;}'
		+ '#cnt.tkbb-my .tk-qa .more_btn,#cnt.tkbb-my .tk-qa .btn_col .box_btn.white{display:block;margin:0;padding:0;border:0;background:none;}'
		+ '#cnt.tkbb-my .tk-qa .more_btn a,#cnt.tkbb-my .tk-qa .btn_col .box_btn.white a{display:flex;align-items:center;justify-content:center;height:48px;border-radius:10px;border:1px solid #DAD5C8;background:#fff;color:#161616;font-size:14px;}'
		+ '#cnt.tkbb-my .tk-qa > .btn_col .box_btn:not(.white){display:none;}'
		// 주문완료
		+ '.tkbb-my .tk-done{text-align:center;padding:30px 18px 26px;}'
		+ '.tkbb-my .tk-done .ic{width:56px;height:56px;margin:0 auto;border-radius:50%;background:#D1D798;display:flex;align-items:center;justify-content:center;}'
		+ '.tkbb-my .tk-done h3{margin:16px 0 0;padding:0;font-size:21px;font-weight:700;color:#161616;}'
		+ '.tkbb-my .tk-done p{margin:8px 0 0;font-size:14px;color:#6A6A66;line-height:1.5;}'
		+ '.tkbb-my .tk-done .tk-ono{justify-content:center;}'
		+ '.tkbb-my .tk-2bt{display:flex;gap:8px;}'
		+ '.tkbb-my .tk-2bt a{flex:1;display:flex;align-items:center;justify-content:center;height:52px;border-radius:10px;font-size:15px;font-weight:600;border:1px solid #DAD5C8;background:#fff;color:#161616;}'
		+ '.tkbb-my .tk-2bt a.k{background:#161616;border-color:#161616;color:#fff;}'
		// 주문서 (위사 폼 안에서 칸 묶음만 카드로 감싼다)
		+ '#cnt.tkbb-my #order{padding:0 !important;margin:0 !important;background:none !important;}'
		+ '#cnt.tkbb-my #order form[name=ordFrm]{display:flex;flex-direction:column;gap:12px;padding:14px;}'
		+ '#cnt.tkbb-my #order .tk-sec{background:#fff;border-radius:16px;padding:20px 18px;}'
		+ '#cnt.tkbb-my #order .tk-sec > h3.title{position:relative;margin:0;padding:0 28px 0 0;border:0;background:none;font-size:17px;font-weight:700;color:#161616;line-height:1.4;cursor:pointer;}'
		+ '#cnt.tkbb-my #order .tk-sec > h3.title:before,#cnt.tkbb-my #order .tk-sec > h3.title:after{display:none;}'
		+ '#cnt.tkbb-my #order .tk-sec > h3.title .tk-chev{position:absolute;right:0;top:2px;transition:transform .2s;}'
		+ '#cnt.tkbb-my #order .tk-sec > h3.title.tk-closed .tk-chev{transform:rotate(180deg);}'
		+ '#cnt.tkbb-my #order .tk-sec > div{margin:14px 0 0;padding:0;border:0;background:none;}'
		+ '#cnt.tkbb-my #order .def_info{position:relative;padding:0 64px 0 0;margin:0;border:0;background:none;}'
		+ '#cnt.tkbb-my #order .def_info p{margin:0;font-size:14px;color:#6A6A66;line-height:1.6;}'
		+ '#cnt.tkbb-my #order .def_info p strong{font-size:15px;font-weight:600;color:#161616;}'
		+ '#cnt.tkbb-my #order .def_info .addr_def{display:inline-block;margin-left:6px;padding:2px 7px;border-radius:999px;background:#D1D798;color:#3E4220;font-size:11px;font-weight:600;vertical-align:middle;}'
		+ '#cnt.tkbb-my #order .def_info .box_btn{position:absolute;right:0;top:0;margin:0;padding:0;border:0;background:none;width:auto;}'
		+ '#cnt.tkbb-my #order .def_info .box_btn a{display:flex;align-items:center;height:32px;padding:0 12px;border:1px solid #DAD5C8;border-radius:6px;background:#fff;color:#161616;font-size:13px;}'
		+ '#cnt.tkbb-my #order fieldset{border:0;margin:0;padding:0;}'
		+ '#cnt.tkbb-my #order fieldset.write > div{margin:12px 0 0;}'
		+ '#cnt.tkbb-my #order label{font-size:13px;color:#6A6A66;}'
		+ '#cnt.tkbb-my #order fieldset.write label{display:block;margin:0 0 6px;}'
		+ '#cnt.tkbb-my #order .form_input,#cnt.tkbb-my #order select{width:100%;box-sizing:border-box;height:48px;padding:0 14px;border:1px solid #DAD5C8 !important;border-radius:8px;background:#fff;font-size:15px;margin:0 0 8px;}'
		+ '#cnt.tkbb-my #order .box_btn.gray2{display:block;margin:0 0 8px;padding:0;border:0;background:none;width:auto;}'
		+ '#cnt.tkbb-my #order .box_btn.gray2 a{display:flex;align-items:center;justify-content:center;height:44px;padding:0 14px;border:1px solid #161616;border-radius:8px;background:#fff;color:#161616;font-size:14px;font-weight:600;}'
		+ '#cnt.tkbb-my #order .part_prd .msg_delivery{margin:0 0 4px;font-size:13px;color:#6A6A66;}'
		+ '#cnt.tkbb-my #order .part_prd .msg_delivery strong{color:#161616;}'
		+ '#cnt.tkbb-my #order ul.list_cart{margin:0;padding:0;list-style:none;border:0;}'
		+ '#cnt.tkbb-my #order ul.list_cart > li{padding:14px 0;margin:0;border:0;border-bottom:1px solid #EFEDE6;}'
		+ '#cnt.tkbb-my #order ul.list_cart > li:last-child{border-bottom:0;}'
		+ '#cnt.tkbb-my #order ul.list_cart .box{display:flex;gap:14px;align-items:flex-start;padding:0;margin:0;border:0;background:none;}'
		+ '#cnt.tkbb-my #order ul.list_cart .img{width:64px;height:80px;flex:0 0 64px;border-radius:8px;overflow:hidden;background:#EEEADF;float:none;margin:0;}'
		+ '#cnt.tkbb-my #order ul.list_cart .img img{width:100%;height:100%;object-fit:cover;display:block;}'
		+ '#cnt.tkbb-my #order ul.list_cart .info{flex:1;min-width:0;padding:0;margin:0;float:none;font-size:13px;color:#6A6A66;line-height:1.5;}'
		+ '#cnt.tkbb-my #order ul.list_cart .info p{margin:0;}'
		+ '#cnt.tkbb-my #order ul.list_cart .info p:first-child a{font-size:15px;color:#161616;}'
		+ '#cnt.tkbb-my #order ul.list_cart .info strong{font-size:16px;font-weight:700;color:#161616;}'
		+ '#cnt.tkbb-my #order ul.list_cart .total{margin:8px 0 0 78px;padding:0;border:0;background:none;text-align:left;font-size:13px;color:#6A6A66;}'
		+ '#cnt.tkbb-my #order ul.list_cart .total strong{font-size:15px;color:#161616;}'
		+ '#cnt.tkbb-my #order .part_prd > p.msg,#cnt.tkbb-my #order .order_cancel_msg{margin:10px 0 0;font-size:12px;color:#9A9A94;}'
		+ '#cnt.tkbb-my #order .part_discount > div{margin:0 0 16px;}'
		+ '#cnt.tkbb-my #order .part_discount > div:last-child{margin:0;}'
		+ '#cnt.tkbb-my #order .part_discount h4{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 8px;font-size:15px;font-weight:600;color:#161616;}'
		+ '#cnt.tkbb-my #order .part_discount h4 span{font-size:13px;font-weight:400;color:#6A6A66;}'
		+ '#cnt.tkbb-my #order .part_discount h4 span strong{color:#7C8340;}'
		+ '#cnt.tkbb-my #order .part_discount .input_wrap{display:flex;gap:8px;}'
		+ '#cnt.tkbb-my #order .part_discount .input_wrap .form_input{flex:1;min-width:0;margin:0;width:auto;}'
		+ '#cnt.tkbb-my #order .part_discount .input_wrap .box_btn{flex:0 0 auto;margin:0;width:auto;}'
		+ '#cnt.tkbb-my #order .part_discount .input_wrap .box_btn a{height:48px;margin:0;}'
		+ '#cnt.tkbb-my #order ul.pay_type_list{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:0;padding:0;list-style:none;border:0;}'
		+ '#cnt.tkbb-my #order ul.pay_type_list li{position:relative;margin:0;padding:0;border:0;float:none;width:auto;}'
		+ '#cnt.tkbb-my #order ul.pay_type_list input{position:absolute;opacity:0;width:1px;height:1px;}'
		+ '#cnt.tkbb-my #order ul.pay_type_list label{display:flex;align-items:center;justify-content:center;height:48px;margin:0;padding:0 4px;border:1px solid #DAD5C8;border-radius:8px;background:#fff;font-size:14px;color:#161616;text-align:center;cursor:pointer;}'
		+ '#cnt.tkbb-my #order ul.pay_type_list input:checked + label{border-color:#161616;background:#161616;color:#fff;font-weight:600;}'
		+ '#cnt.tkbb-my #order ul.pay_type_list input:focus-visible + label{outline:2px solid #7C8340;outline-offset:2px;}'
		+ '#cnt.tkbb-my #order .pay_bank{margin:14px 0 0;padding:16px 0 0;border-top:1px solid #EFEDE6;}'
		+ '#cnt.tkbb-my #order .pay_bank h4{margin:8px 0 6px;font-size:13px;font-weight:400;color:#6A6A66;}'
		+ '#cnt.tkbb-my #order table.tbl_order{width:100%;border:0;border-collapse:collapse;margin:0;}'
		+ '#cnt.tkbb-my #order table.tbl_order th,#cnt.tkbb-my #order table.tbl_order td{border:0;padding:6px 0;font-size:15px;background:none;vertical-align:top;}'
		+ '#cnt.tkbb-my #order table.tbl_order th{text-align:left;font-weight:400;color:#6A6A66;}'
		+ '#cnt.tkbb-my #order table.tbl_order td{text-align:right;color:#161616;}'
		+ '#cnt.tkbb-my #order table.tbl_order .view_info th,#cnt.tkbb-my #order table.tbl_order .view_info td{font-size:13px;color:#9A9A94;padding:0 0 6px;}'
		+ '#cnt.tkbb-my #order table.tbl_order.total{margin-top:10px;border-top:1px solid #EFEDE6;}'
		+ '#cnt.tkbb-my #order table.tbl_order.total th{padding-top:16px;font-size:16px;font-weight:600;color:#161616;}'
		+ '#cnt.tkbb-my #order table.tbl_order.total td{padding-top:16px;font-size:20px;font-weight:700;}'
		+ '#cnt.tkbb-my #order .reconfirm{background:#fff;border-radius:16px;padding:18px;margin:0;border:0;}'
		+ '#cnt.tkbb-my #order .reconfirm label{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#161616;line-height:1.5;}'
		+ '#cnt.tkbb-my #order .reconfirm input{width:20px;height:20px;flex:0 0 20px;margin:0;accent-color:#7C8340;}'
		+ '#cnt.tkbb-my #order #order3{padding:4px 0 0 !important;margin:0;background:none;border:0;}'
		+ '#cnt.tkbb-my #order #order3 .paytype_gr1{margin:0;text-align:center;font-size:15px;color:#161616;}'
		+ '#cnt.tkbb-my #order #order3 .paytype_gr1 strong{font-size:18px;font-weight:700;color:#7C8340;}'
		+ '#cnt.tkbb-my #order #order3 .msg{margin:4px 0 12px;text-align:center;font-size:12px;color:#9A9A94;}'
		+ '#cnt.tkbb-my #order #order3 .btn_col{display:flex;gap:8px;margin:0;padding:0;}'
		+ '#cnt.tkbb-my #order #order3 .btn_col .box_btn{display:block;margin:0;padding:0;border:0;background:none;width:auto;float:none;}'
		+ '#cnt.tkbb-my #order #order3 .btn_col .box_btn.white{flex:0 0 96px;}'
		+ '#cnt.tkbb-my #order #order3 .btn_col .box_btn:not(.white){flex:1;}'
		+ '#cnt.tkbb-my #order #order3 .btn_col a,#cnt.tkbb-my #order #order3 .btn_col input{display:flex;align-items:center;justify-content:center;width:100%;height:56px;border-radius:10px;font-size:16px;font-weight:600;font-family:inherit;}'
		+ '#cnt.tkbb-my #order #order3 .btn_col a{border:1px solid #DAD5C8 !important;background:#fff !important;color:#161616 !important;}'
		+ '#cnt.tkbb-my #order #order3 .btn_col input{border:0 !important;background:#161616 !important;color:#fff !important;}';

	var ARW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#161616" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
	var CART = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#161616" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>';
	var BOX = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9A9A94" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>';
	var COPY = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A9A94" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/></svg>';

	function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
	function txt(el){ return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
	function el(tag, cls, html){ var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
	// 표에서 긴 값(입금계좌)은 제목 아래 한 줄로
	function stackLong(root){
		var ths = root.querySelectorAll('table.tbl_order th');
		for (var i = 0; i < ths.length; i++) if (/입금계좌|가상계좌/.test(txt(ths[i]))) ths[i].parentNode.className += ' tk-stack';
	}
	function hide(e){ e.style.display = 'none'; e.setAttribute('data-tk-hid', '1'); }
	function dot(d){ return String(d || '').replace(/[\/-]/g, '.'); }
	function stCls(t){ return /취소|환불|반품/.test(t) ? ' gray' : (/배송중|배송완료/.test(t) ? ' blue' : ''); }
	function stName(t){ return /^미입금$/.test(t) ? '입금대기' : t; }
	function header(title){
		var back = document.referrer && document.referrer.indexOf(location.host) > -1 ? 'javascript:history.back()' : '/mypage/mypage.php';
		return el('div', 'tk-hd', '<a href="' + back + '" aria-label="뒤로가기"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#161616" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></a><h2>' + esc(title) + '</h2>');
	}
	function copyBtn(v){
		var b = el('button', '', COPY); b.type = 'button'; b.setAttribute('aria-label', '주문번호 복사');
		b.addEventListener('click', function(){ try { navigator.clipboard.writeText(v); } catch (e) {} });
		return b;
	}

	// 상품명으로 검색해서 사진·상품 링크 찾기 (주문 목록에는 사진이 없다). 결과는 세션 동안 기억한다.
	var CACHE = {};
	try { CACHE = JSON.parse(sessionStorage.getItem('tkbb_thumbs') || '{}'); } catch (e) {}
	function findProduct(name, cb, done){
		done = done || function(){};
		var q = String(name || '').replace(/\[[^\]]*\]|\([^)]*\)/g, ' ').replace(/\s(外|외)\s*\d+\s*건?\s*$/, '').replace(/\s+/g, ' ').trim();
		if (!q || !window.fetch) { done(); return; }
		if (CACHE[q] !== undefined) { if (CACHE[q]) cb(CACHE[q]); done(); return; }
		var key = function(s){ return String(s || '').replace(/\[[^\]]*\]|\([^)]*\)|\s/g, ''); };
		fetch('/shop/search_result.php?search_str=' + encodeURIComponent(q), { credentials: 'include' })
			.then(function(r){ return r.text(); })
			.then(function(html){
				var d = new DOMParser().parseFromString(html, 'text/html');
				var bs = d.querySelectorAll('.box'), pick = null, first = null;
				for (var i = 0; i < bs.length; i++) {
					var im = bs[i].querySelector('img'), nm = bs[i].querySelector('.name'), a = bs[i].querySelector('a[href*="pno="]');
					if (!im || !im.getAttribute('src')) continue;
					var it = { img: im.getAttribute('src'), href: a ? a.getAttribute('href').replace(/&rURL=[^&]*/, '') : '' };
					if (!first) first = it;
					if (nm && key(nm.textContent) === key(q)) { pick = it; break; }
				}
				CACHE[q] = pick || first || null;
				try { sessionStorage.setItem('tkbb_thumbs', JSON.stringify(CACHE)); } catch (e) {}
				if (CACHE[q]) cb(CACHE[q]);
				done();
			}).catch(function(){ done(); });
	}
	function fillThumb(card, name, done){
		findProduct(name, function(it){
			var th = card.querySelector('.th'); if (th && it.img) th.innerHTML = '<img src="' + esc(it.img) + '" alt="">';
			var c = card.querySelector('.tk-cart'); if (c && it.href) { c.setAttribute('href', it.href); c.hidden = false; }
		}, done);
	}

	/* ---------- 주문내역 ---------- */
	var REVIEW_LABEL = '후기 작성<small>최대 700원 적립</small>';
	function orderCard(li){
		var a = li.querySelector('.no a'), ps = li.querySelectorAll('.info p');
		var ono = txt(a), date = txt(li.querySelector('.no span')), href = a ? a.getAttribute('href') : '#';
		var name = txt(ps[0]), pay = txt(li.querySelector('.info strong')), stEl = li.querySelector('.p_color'), st = txt(stEl);
		var track = stEl ? stEl.querySelector('a[href*="delivery"]') : null;
		var cd = el('div', 'tk-cd');
		cd.innerHTML = '<a class="tk-top" href="' + esc(href) + '"><div><div class="tk-date">' + esc(dot(date)) + '</div><div class="tk-ono">주문번호 ' + esc(ono) + '</div></div>' + ARW + '</a>'
			+ '<div class="tk-hr"></div><div class="tk-st' + stCls(st) + '">' + esc(stName(st)) + '</div>'
			+ '<div class="tk-pr"><div class="th">' + BOX + '</div><div class="tx"><div class="nm">' + esc(name) + '</div><div class="pc"><b>' + esc(pay) + '</b></div></div>'
			+ '<a class="tk-cart" hidden aria-label="상품 보기">' + CART + '</a></div>'
			+ (track || /배송완료/.test(st) ? '<div class="tk-bt">' + (track ? '<a href="' + esc(track.getAttribute('href')) + '" target="_blank" rel="noopener">배송 조회</a>' : '') + (/배송완료/.test(st) ? '<a class="rv" href="' + esc(href) + '">' + REVIEW_LABEL + '</a>' : '') + '</div>' : '');
		cd.setAttribute('data-name', name);
		return cd;
	}

	/* ---------- 주문내역 ---------- */
	function orderList(cnt){
		var box = document.getElementById('order_list');
		if (!box) return false;
		var sbscr = /sbscr=Y/.test(location.search);
		var wrap = el('div', 'tk-wr');
		var more = el('a', 'tk-more', '더보기'); more.href = 'javascript:void(0)';
		var cards = [], shown = 0;
		// 사진 검색은 3개씩 차례로 (보이는 10개만)
		var queue = [], running = 0;
		function pump(){
			while (running < 3 && queue.length) {
				var c = queue.shift(); running++;
				fillThumb(c, c.getAttribute('data-name'), function(){ running--; pump(); });
			}
		}
		function showMore(){
			for (var k = shown; k < Math.min(shown + 10, cards.length); k++) { cards[k].style.display = ''; queue.push(cards[k]); }
			pump();
			shown = Math.min(shown + 10, cards.length);
			more.style.display = shown < cards.length ? '' : 'none';
		}
		more.addEventListener('click', showMore);
		function render(lis, emptyMsg){
			wrap.innerHTML = ''; cards = []; shown = 0;
			for (var i = 0; i < lis.length; i++) { var cd = orderCard(lis[i]); cd.style.display = 'none'; wrap.appendChild(cd); cards.push(cd); }
			if (!lis.length) wrap.appendChild(el('div', 'tk-cd tk-empty', emptyMsg || '주문 내역이 없어요.'));
			wrap.appendChild(more);
			showMore();
		}
		var lis = box.querySelectorAll('ul.list > li');
		if (sbscr && !lis.length && window.fetch) {
			// 위사 정기배송 목록은 '정기배송 신청' 주문만 보여준다. 일반 주문으로 산 [정기배송] 상품도 여기서 보이게 한다.
			render([], '정기배송 주문을 불러오는 중이에요…');
			fetch('/mypage/order_list.php', { credentials: 'include' }).then(function(r){ return r.text(); }).then(function(html){
				var d = new DOMParser().parseFromString(html, 'text/html');
				var all = d.querySelectorAll('#order_list ul.list > li'), pick = [];
				for (var i = 0; i < all.length; i++) if (/정기배송/.test(txt(all[i].querySelector('.info p')))) pick.push(all[i]);
				render(pick, '정기배송 주문이 없어요.');
			}).catch(function(){ render([], '정기배송 주문이 없어요.'); });
		} else {
			render(lis);
		}

		// 기간 버튼·날짜 조회는 원래 요소를 옮겨 쓴다 (위사 기능 그대로)
		var per = el('div', 'tk-per');
		var search = box.querySelector('.search');
		if (search) { while (search.firstChild) per.appendChild(search.firstChild); }
		if (!per.children.length) per.style.display = 'none';

		hide(box);
		var title = /sbscr=Y/.test(location.search) ? '정기배송 주문내역' : '주문내역';
		cnt.insertBefore(wrap, box); cnt.insertBefore(per, wrap); cnt.insertBefore(header(title), per);
		return true;
	}

	/* ---------- 주문 상세 ---------- */
	function orderDetail(cnt){
		var od = document.getElementById('order_detail');
		if (!od) return false;
		var msg = od.querySelector('p.msg');
		var ono = txt(msg && msg.querySelector('strong'));
		var date = msg ? (msg.innerHTML.split(/<br\s*\/?>/i)[1] || '').replace(/<[^>]+>/g, '').trim() : '';
		var lis = od.querySelectorAll('ul.list_cart > li');
		var st = '';
		if (lis.length) { var sEl = lis[0].querySelector('.stat'); if (sEl) { var sc = sEl.cloneNode(true); var bb = sc.querySelectorAll('.box_btn'); for (var q = 0; q < bb.length; q++) bb[q].parentNode.removeChild(bb[q]); st = txt(sc); } }

		var wrap = el('div', 'tk-wr');
		// 1) 주문 카드
		var top = el('div', 'tk-cd');
		top.innerHTML = '<div class="tk-date">' + esc(dot(date)) + '</div><div class="tk-ono">주문번호 ' + esc(ono) + '</div><div class="tk-hr"></div>'
			+ '<div class="tk-st' + stCls(st) + '">' + esc(stName(st)) + (/미입금|입금대기/.test(st) ? ' <span style="font-size:14px;font-weight:400;">아래 계좌로 입금해 주세요</span>' : '') + '</div>';
		top.querySelector('.tk-ono').appendChild(copyBtn(ono));
		var track = null, review = null;
		for (var i = 0; i < lis.length; i++) {
			var li = lis[i], img = li.querySelector('.img img'), a = li.querySelector('.info a'), ps = li.querySelectorAll('.info p');
			var pc = txt(ps[1]); var m = pc.match(/^(.*?)\s*\|\s*(.*)$/);
			var row = el('div', 'tk-pr', '<div class="th">' + (img ? '<img src="' + esc(img.getAttribute('src')) + '" alt="">' : BOX) + '</div>'
				+ '<div class="tx"><div class="nm">' + esc(txt(a) || txt(ps[0])) + '</div>' + (txt(ps[2]) ? '<div class="op">' + esc(txt(ps[2]).replace(/^\((.*)\)$/, '$1')) + '</div>' : '') + '<div class="pc"><b>' + esc(m ? m[1] : pc) + '</b>' + (m ? '<i></i>' + esc(m[2].replace(/\s+/g, '')) : '') + '</div></div>'
				+ (a ? '<a class="tk-cart" href="' + esc(a.getAttribute('href')) + '" aria-label="상품 보기">' + CART + '</a>' : ''));
			top.appendChild(row);
			track = track || li.querySelector('a[href*="delivery"]');
			review = review || li.querySelector('.stat .box_btn a');
		}
		if (track || review) {
			var bt = el('div', 'tk-bt');
			if (track) bt.appendChild(el('a', '', '배송 조회')).setAttribute('href', track.getAttribute('href'));
			if (review) { review.innerHTML = REVIEW_LABEL; review.className += ' rv'; bt.appendChild(review); }
			if (track) bt.firstChild.setAttribute('target', '_blank');
			top.appendChild(bt);
		}
		wrap.appendChild(top);

		// 2) 나머지 섹션: 제목(h3) + 바로 다음 상자를 카드 하나로 옮긴다
		var secs = {}, h3s = od.querySelectorAll('h3.title');
		for (var j = 0; j < h3s.length; j++) {
			var t = txt(h3s[j]), body = h3s[j].nextElementSibling;
			if (!body || t === '주문상품') continue;
			var cd = el('div', 'tk-cd');
			var tt = el('div', 'tk-tt', '<h3 class="tk-t">' + esc(t === '주문 1:1문의' ? '주문 문의' : t) + '</h3>');
			cd.appendChild(tt);
			if (t === '배송지 정보') {
				var cb = body.querySelector('.box_btn a');
				if (cb) { var ch = el('a', 'tk-sm', '변경'); ch.href = 'javascript:void(0)'; ch.onclick = (function(orig){ return function(){ orig.click(); return false; }; })(cb); tt.appendChild(ch); }
			}
			body.style.display = '';
			cd.appendChild(body);
			secs[t] = cd;
		}
		var ORDER = ['결제정보', '결제수단 정보', '배송지 정보', '주문자 정보', '주문 1:1문의'];
		for (var k = 0; k < ORDER.length; k++) if (secs[ORDER[k]]) { wrap.appendChild(secs[ORDER[k]]); delete secs[ORDER[k]]; }
		for (var rest in secs) wrap.appendChild(secs[rest]);
		wrap.appendChild(el('a', 'tk-black', '주문 목록으로')).setAttribute('href', '/mypage/order_list.php');
		stackLong(wrap);

		hide(od);
		cnt.insertBefore(wrap, od);
		cnt.insertBefore(header('주문 상세'), wrap);
		return true;
	}

	/* ---------- 관심상품: 위사 목록(폼·버튼 포함)을 카드 안으로 옮긴다 ---------- */
	function wishList(cnt){
		var box = document.getElementById('wish_list');
		if (!box) return false;
		var wrap = el('div', 'tk-wr'), cd = el('div', 'tk-cd');
		box.parentNode.insertBefore(wrap, box);
		cd.appendChild(box); wrap.appendChild(cd);
		cnt.insertBefore(header('관심상품'), wrap);
		return true;
	}

	/* ---------- 최근 본 상품 ---------- */
	function recentList(cnt){
		var box = document.getElementById('click_prd');
		if (!box) return false;
		var lis = box.querySelectorAll('ul.prd_basic > li');
		var wrap = el('div', 'tk-wr'), cd = el('div', 'tk-cd');
		cd.innerHTML = '<h3 class="tk-t">최근 본 상품 <span style="color:#7C8340">' + lis.length + '</span></h3>';
		for (var i = 0; i < lis.length; i++) {
			var b = lis[i], a = b.querySelector('.name a') || b.querySelector('a[href*="pno="]'), img = b.querySelector('.prdimg img');
			var so = b.querySelector('.soldout'), sell = txt(b.querySelector('.sell strong')) || txt(b.querySelector('.discount strong')), cons = txt(b.querySelector('.consumer'));
			var href = a ? a.getAttribute('href').replace(/&rURL=[^&]*/, '') : '#';
			var n = parseInt(sell.replace(/[^\d]/g, ''), 10), c = parseInt(cons.replace(/[^\d]/g, ''), 10);
			var rate = (n && c && c > n) ? Math.round((1 - n / c) * 100) : 0;
			var row = el('div', 'tk-pr');
			row.style.cssText = 'margin:0;padding:14px 0;border-bottom:1px solid #EFEDE6;';
			row.innerHTML = '<a class="th" href="' + esc(href) + '" style="position:relative">' + (img ? '<img src="' + esc(img.getAttribute('src')) + '" alt="">' : BOX)
				+ (so && getComputedStyle(so).display !== 'none' ? '<span style="position:absolute;inset:0;background:rgba(22,22,22,.48);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;text-align:center">' + esc(txt(so)) + '</span>' : '') + '</a>'
				+ '<a class="tx" href="' + esc(href) + '"><div class="nm">' + esc(txt(a)) + '</div><div class="pc">' + (rate ? '<span style="color:#52728A;font-weight:700">' + rate + '%</span>' : '') + '<b>' + esc(sell) + '</b></div></a>'
				+ '<a class="tk-cart" href="' + esc(href) + '" aria-label="상품 보기">' + CART + '</a>';
			cd.appendChild(row);
		}
		if (cd.lastChild && cd.lastChild.style) cd.lastChild.style.borderBottom = '0';
		if (!lis.length) cd.appendChild(el('div', 'tk-empty', '최근 본 상품이 없어요.'));
		wrap.appendChild(cd);
		hide(box);
		cnt.insertBefore(wrap, box); cnt.insertBefore(header('최근 본 상품'), wrap);
		return true;
	}

	/* ---------- 적립금 · 예치금 ---------- */
	function pointPage(cnt, id, title, label){
		var box = document.getElementById(id);
		if (!box) return false;
		var have = txt(box.querySelector('.box_mp .have span'));
		var lis = box.querySelectorAll('ul.list_common > li');
		var wrap = el('div', 'tk-wr');
		var sum = el('div', 'tk-cd', '<div class="tk-lb">' + esc(label) + '</div><div class="tk-big">' + esc(have || '0') + '<small>원</small></div>'
			+ (id === 'emoney' ? '<div class="tk-note">예치금은 결제할 때 현금처럼 사용할 수 있어요.</div>' : ''));
		wrap.appendChild(sum);
		var cd = el('div', 'tk-cd', '<h3 class="tk-t">' + (id === 'emoney' ? '입금 · 사용 내역' : '적립 · 사용 내역') + '</h3>');
		var chips = el('div', 'tk-chips', '<button type="button" class="on" data-f="all">전체</button><button type="button" data-f="plus">' + (id === 'emoney' ? '입금' : '적립') + '</button><button type="button" data-f="minus">사용</button>');
		cd.appendChild(chips);
		var list = el('div', ''); cd.appendChild(list);
		var rows = [];
		for (var i = 0; i < lis.length; i++) {
			var li = lis[i], ps = li.querySelectorAll('.right_area p'), st = li.querySelectorAll('.right_area p strong');
			var plus = parseInt(txt(st[0]).replace(/[^\d]/g, ''), 10) || 0, minus = parseInt(txt(st[1]).replace(/[^\d]/g, ''), 10) || 0;
			var reason = txt(ps[0]), subtotal = txt(ps[2]).replace(/^소계\s*/, ''), exp = ps[3] ? txt(ps[3]).replace(/^만료일\s*/, '') : '';
			var mm = reason.match(/^상품 구매 \((\S+)\s*\|\s*(.*)\)$/);
			var r = el('div', 'tk-row');
			r.setAttribute('data-k', plus > 0 ? 'plus' : 'minus');
			r.innerHTML = '<div style="min-width:0"><div class="d">' + esc(dot(txt(li.querySelector('.left_area')))) + '</div>'
				+ '<div class="r">' + esc(mm ? '상품 구매 사용' : reason.replace(/^기타 \((.*)\)$/, '$1')) + '</div>'
				+ (mm ? '<div class="s">' + esc(mm[2]) + '</div>' : '') + (plus > 0 && exp ? '<div class="s">만료일 ' + esc(dot(exp)) + '</div>' : '') + '</div>'
				+ '<div class="a">' + (plus > 0 ? '<b class="plus">+' + plus.toLocaleString('ko-KR') + '원</b>' : '<b>−' + minus.toLocaleString('ko-KR') + '원</b>')
				+ (id === 'emoney' && subtotal ? '<span>소계 ' + esc(subtotal) + '</span>' : '') + '</div>';
			list.appendChild(r); rows.push(r);
		}
		if (!lis.length) list.appendChild(el('div', 'tk-empty', '내역이 없어요.'));
		wrap.appendChild(cd);
		var more = el('a', 'tk-more', '더보기'); more.href = 'javascript:void(0)'; wrap.appendChild(more);
		var f = 'all', limit = 10;
		function render(){
			var n = 0, total = 0;
			for (var k = 0; k < rows.length; k++) {
				var ok = f === 'all' || rows[k].getAttribute('data-k') === f;
				if (ok) total++;
				rows[k].style.display = ok && n < limit ? '' : 'none';
				if (ok && n < limit) n++;
			}
			more.style.display = total > limit ? '' : 'none';
		}
		chips.addEventListener('click', function(e){
			var b = e.target.closest ? e.target.closest('button') : null; if (!b) return;
			f = b.getAttribute('data-f'); limit = 10;
			var bs = chips.querySelectorAll('button'); for (var k = 0; k < bs.length; k++) bs[k].className = bs[k] === b ? 'on' : '';
			render();
		});
		more.addEventListener('click', function(){ limit += 10; render(); });
		render();
		var pg = box.querySelector('ul.paging'); if (pg && pg.querySelectorAll('li a').length) { var pw = el('div', 'tk-pg'); pw.appendChild(pg); wrap.appendChild(pw); }
		hide(box);
		cnt.insertBefore(wrap, box); cnt.insertBefore(header(title), wrap);
		return true;
	}

	/* ---------- 쿠폰 ---------- */
	function couponList(cnt){
		var box = document.getElementById('coupon');
		if (!box) return false;
		var lis = box.querySelectorAll('ul.list_common > li');
		var today = new Date(); today.setHours(0, 0, 0, 0);
		var on = [], off = [];
		for (var i = 0; i < lis.length; i++) {
			var li = lis[i], ps = li.querySelectorAll('.right_area p');
			var val = txt(li.querySelector('.left_area')).replace(/\s+/g, '').replace(/원$/, '원');
			var name = txt(ps[0]), end = txt(ps[1]), lim = txt(ps[2]).replace(/^제한금액\s*:\s*/, ''), max = txt(ps[3]).replace(/^최대할인\s*:\s*/, ''), used = txt(ps[5]).replace(/^사용날짜\s*:\s*/, '');
			var ed = new Date(end.replace(/-/g, '/')); var isUsed = used && used !== '미사용';
			var expired = !isNaN(ed) && ed < today;
			var left = !isNaN(ed) ? Math.round((ed - today) / 864e5) : null;
			var ok = !isUsed && !expired;
			var c = el('div', 'tk-cp' + (ok ? '' : ' off'));
			c.innerHTML = '<div class="l"><div class="v">' + esc(val) + '</div><div class="n">' + esc(name) + '</div>'
				+ '<div class="c">' + esc(lim.replace(/\s+/g, '')) + ' 이상 구매 시' + (max ? ' · 최대 ' + esc(max.replace(/\s+/g, '')) : '') + '<br>' + esc(dot(end)) + (ok ? '까지' : (isUsed ? ' · 사용 완료' : ' 만료')) + '</div></div>'
				+ '<div class="r">' + (ok ? (left === 0 ? '오늘까지' : 'D-' + left) : (isUsed ? '사용' : '만료')) + '</div>';
			(ok ? on : off).push(c);
		}
		var tabs = el('div', 'tk-tabs', '<button type="button" class="on" data-t="on">사용 가능<em>' + on.length + '</em></button><button type="button" data-t="off">사용 · 만료</button>');
		var wrap = el('div', 'tk-wr');
		function show(t){
			wrap.innerHTML = '';
			var arr = t === 'on' ? on : off;
			for (var k = 0; k < arr.length; k++) wrap.appendChild(arr[k]);
			if (!arr.length) wrap.appendChild(el('div', 'tk-cd tk-empty', t === 'on' ? '사용할 수 있는 쿠폰이 없어요.' : '사용하거나 만료된 쿠폰이 없어요.'));
			var bs = tabs.querySelectorAll('button'); for (var k2 = 0; k2 < bs.length; k2++) bs[k2].className = bs[k2].getAttribute('data-t') === t ? 'on' : '';
		}
		tabs.addEventListener('click', function(e){ var b = e.target.closest ? e.target.closest('button') : null; if (b) show(b.getAttribute('data-t')); });
		show('on');
		hide(box);
		cnt.insertBefore(wrap, box); cnt.insertBefore(tabs, wrap); cnt.insertBefore(header('쿠폰'), tabs);
		return true;
	}

	/* ---------- 위사 상자를 카드 안에 그대로 넣는 단순 페이지 ---------- */
	function simpleCard(cnt, id, title){
		var box = document.getElementById(id);
		if (!box) return false;
		var wrap = el('div', 'tk-wr'), cd = el('div', 'tk-cd');
		box.parentNode.insertBefore(wrap, box);
		cd.appendChild(box); wrap.appendChild(cd);
		cnt.insertBefore(header(title), wrap);
		return wrap;
	}

	/* ---------- 1:1 문의 ---------- */
	function counselList(cnt){
		var box = document.getElementById('counsel');
		var w = simpleCard(cnt, 'counsel', '1:1 문의');
		if (!w) return false;
		var wbtn = box.querySelector('.box_btn a');
		var b = el('a', 'tk-black', '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>&nbsp;문의하기');
		b.href = wbtn ? wbtn.getAttribute('href') : '/mypage/counsel_step1.php';
		w.insertBefore(b, w.firstChild);
		return true;
	}

	/* ---------- 나의 상품문의 ---------- */
	function qnaList(cnt){
		var box = document.getElementById('mypage_qna_list');
		if (!box) return false;
		var wrap = el('div', 'tk-wr');
		box.parentNode.insertBefore(wrap, box);
		wrap.appendChild(box);
		var lis = box.querySelectorAll('ul.list_qnarev > li');
		for (var i = 0; i < lis.length; i++) {
			var stImg = lis[i].querySelector('.stat img');
			if (stImg) {
				var done = !/없음|before/.test((stImg.getAttribute('alt') || '') + stImg.getAttribute('src'));
				var bd = el('span', 'tk-badge' + (done ? ' done' : ''), done ? '답변완료' : '답변대기');
				stImg.parentNode.replaceChild(bd, stImg);
			}
		}
		if (!lis.length) { var e = box.querySelector('p.empty'); var cd = el('div', 'tk-cd'); box.parentNode.insertBefore(cd, box); cd.appendChild(box); }
		wrap.appendChild(el('a', 'tk-black', '상품 문의 게시판 가기')).setAttribute('href', 'https://m.takkobebe.com/shop/product_qna_list.php');
		cnt.insertBefore(header('나의 상품문의'), wrap);
		return true;
	}

	/* ---------- 나의 상품후기 ---------- */
	function reviewList(cnt){
		var box = document.getElementById('mypage_review_list');
		if (!box) return false;
		var wrap = el('div', 'tk-wr');
		box.parentNode.insertBefore(wrap, box);
		var bn = el('a', 'tk-banner', '<div><b>후기 쓰고 적립금 받으세요</b><small>배송완료된 주문에서 후기를 쓸 수 있어요</small></div>' + ARW);
		bn.href = '/mypage/order_list.php';
		wrap.appendChild(bn);
		wrap.appendChild(box);
		var STAR = function(on){ return '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (on ? '#7C8340' : '#DAD5C8') + '"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3z"/></svg>'; };
		var gs = box.querySelectorAll('.grade');
		for (var i = 0; i < gs.length; i++) {
			var n = parseInt(txt(gs[i]), 10) || 0, h = '';
			for (var k = 1; k <= 5; k++) h += STAR(k <= n);
			var st = el('span', 'tk-stars', h); st.setAttribute('aria-label', '별점 ' + n + '점');
			gs[i].parentNode.insertBefore(st, gs[i]);
		}
		if (!box.querySelector('ul.list_qnarev > li')) { var cd = el('div', 'tk-cd'); box.parentNode.insertBefore(cd, box); cd.appendChild(box); }
		cnt.insertBefore(header('나의 상품후기'), wrap);
		return true;
	}

	/* ---------- 나의 정보수정: 위사 폼 그대로, 칸 묶음마다 카드 + 제목 ---------- */
	function editInfo(cnt){
		var box = document.getElementById('join_input');
		if (!box) return false;
		var sub = cnt.querySelector('h2.subtitle'); if (sub) sub.style.display = 'none';
		var boxes = box.querySelectorAll('fieldset > .box');
		for (var i = 0; i < boxes.length; i++) {
			var t = boxes[i].querySelector('.sns') ? 'SNS 계정 연결' : boxes[i].querySelector('#join_sms') ? '혜택 · 알림 수신' : boxes[i].querySelector('#join_cell') ? '연락처 · 주소' : boxes[i].querySelector('#join_pw') ? '로그인 정보' : '';
			if (t) boxes[i].insertBefore(el('h3', 'tk-h', t), boxes[i].firstChild);
		}
		var sb = box.querySelector('.btn input[type=submit]'); if (sb) sb.value = '저장하기';
		var wrap = el('div', 'tk-wr');
		box.parentNode.insertBefore(wrap, box);
		wrap.appendChild(box);
		wrap.appendChild(el('a', 'tk-link', '회원 탈퇴')).setAttribute('href', '/mypage/withdraw_step1.php');
		cnt.insertBefore(header('나의 정보수정'), wrap);
		return true;
	}

	/* ---------- 회원 탈퇴 ---------- */
	function withdraw(cnt){
		var box = document.getElementById('draw_input');
		if (!box) return false;
		var inner = box.querySelector('.box');
		if (inner) inner.insertBefore(el('h3', 'tk-h', '탈퇴하기 전에 꼭 확인해 주세요'), inner.firstChild);
		var pw = box.querySelector('input[name=pwd]'); if (pw) pw.setAttribute('aria-label', '비밀번호');
		var ta = box.querySelector('textarea'); if (ta) { ta.setAttribute('placeholder', '탈퇴 사유 (선택) · 더 나은 타코베베가 될 수 있도록 알려주세요'); ta.setAttribute('aria-label', '탈퇴 사유'); }
		var btn = box.querySelector('.btn');
		if (btn) {
			var sb = btn.querySelector('input[type=submit]'), cancel = btn.querySelector('a');
			if (sb) sb.value = '탈퇴하기';
			if (cancel) { cancel.textContent = '계속 이용하기'; cancel.setAttribute('href', '/mypage/mypage.php'); btn.insertBefore(cancel.parentNode, btn.firstChild); }
		}
		var wrap = el('div', 'tk-wr');
		box.parentNode.insertBefore(wrap, box);
		wrap.appendChild(box);
		cnt.insertBefore(header('회원 탈퇴'), wrap);
		return true;
	}

	/* ---------- Q&A 게시판 (목록·글 보기) ---------- */
	function qnaBoard(cnt){
		var box = document.getElementById('qnarev_list_all') || document.getElementById('qna_list');
		if (!box) return false;
		box.classList.add('tk-qa');
		var wrap = el('div', 'tk-wr tk-qa');
		box.parentNode.insertBefore(wrap, box);
		// 검색
		var sr = box.querySelector('.board_search');
		if (sr) { var sc = el('div', 'tk-cd tk-srch'); sc.appendChild(sr); wrap.appendChild(sc); }
		// 글쓰기 버튼 (위사 writeQna 그대로)
		var wb = box.querySelector('a[href*="writeQna"]');
		if (wb) { var b = el('a', 'tk-black', '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>&nbsp;문의하기'); b.href = wb.getAttribute('href'); wrap.appendChild(b); }
		// 글쓰기 폼
		var qw = box.querySelector('.qnarev_write');
		if (qw) { var qc = el('div', 'tk-cd tk-qw'); qc.appendChild(qw); wrap.appendChild(qc); qc.style.display = 'none';
			var qd = qw.querySelector('#qnaWriteDiv');
			if (qd && window.MutationObserver) new MutationObserver(function(){ qc.style.display = qd.style.display === 'none' ? 'none' : ''; }).observe(qd, { attributes: true, attributeFilter: ['style'] });
		}
		var ul = box.querySelector('ul.list_qnarev');
		if (ul) {
			wrap.appendChild(ul);
			var badge = function(){
				var ims = ul.querySelectorAll('.stat img');
				for (var i = 0; i < ims.length; i++) {
					var done = !/없음|before/.test((ims[i].getAttribute('alt') || '') + ims[i].getAttribute('src'));
					ims[i].parentNode.replaceChild(el('span', 'tk-badge' + (done ? ' done' : ''), done ? '답변완료' : '답변대기'), ims[i]);
				}
			};
			badge();
			if (window.MutationObserver) new MutationObserver(badge).observe(ul, { childList: true, subtree: true });
		}
		var rest = box.querySelectorAll('.more_btn, .btn_col');
		for (var r = 0; r < rest.length; r++) wrap.appendChild(rest[r]);
		hide(box);
		cnt.insertBefore(header('Q&A'), wrap);
		return true;
	}

	/* ---------- 주문완료 ---------- */
	function orderFinish(cnt){
		var of = document.getElementById('orderfin');
		if (!of) return false;
		var sub = cnt.querySelector('h2.subtitle'); if (sub) sub.style.display = 'none';
		var msg = of.querySelector('p.msg');
		var ono = txt(msg && msg.querySelector('strong'));
		var wrap = el('div', 'tk-wr');
		var top = el('div', 'tk-cd tk-done', '<div class="ic"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#161616" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></div>'
			+ '<h3>주문이 완료되었어요</h3><div class="tk-ono">주문번호 ' + esc(ono) + '</div>');
		top.querySelector('.tk-ono').appendChild(copyBtn(ono));
		var pay = txt(of.querySelector('.box_payment .payment'));
		if (/무통장/.test(pay)) top.appendChild(el('p', '', '아래 계좌로 입금해 주시면 주문이 확인돼요.'));
		wrap.appendChild(top);
		// 주문 상품
		var lis = of.querySelectorAll('ul.list_cart > li');
		if (lis.length) {
			var pc = el('div', 'tk-cd', '<h3 class="tk-t">주문 상품</h3>');
			for (var i = 0; i < lis.length; i++) {
				var li = lis[i], img = li.querySelector('.img img'), a = li.querySelector('.info a'), ps = li.querySelectorAll('.info p'), opt = li.querySelector('.info > div');
				var pr = txt(ps[1]); var m = pr.match(/^(.*?)\s*\|\s*(.*)$/);
				pc.appendChild(el('div', 'tk-pr', '<div class="th">' + (img ? '<img src="' + esc(img.getAttribute('src')) + '" alt="">' : BOX) + '</div>'
					+ '<div class="tx"><div class="nm">' + esc(txt(a) || txt(ps[0])) + '</div>' + (txt(opt) ? '<div class="op">' + esc(txt(opt)) + '</div>' : '')
					+ '<div class="pc"><b>' + esc(txt(li.querySelector('.total strong')) || (m ? m[1] : pr)) + '</b>' + (m ? '<i></i>' + esc(m[2].replace(/\s+/g, '')) : '') + '</div></div>'));
			}
			wrap.appendChild(pc);
		}
		// 결제 정보 (위사 표를 카드로). 적립금·예치금 사용은 주문 상세에서 가져와 채운다
		var pb = of.querySelector('.box_payment');
		if (pb) {
			var pcd = el('div', 'tk-cd', '<h3 class="tk-t">결제 정보</h3>');
			var tbs = pb.querySelectorAll('table.tbl_order');
			for (var t = 0; t < tbs.length; t++) { if (t) pcd.appendChild(el('div', 'tk-hr')); pcd.appendChild(tbs[t]); }
			wrap.appendChild(pcd);
			if (ono && window.fetch) fetch('/mypage/order_detail.php?ono=' + encodeURIComponent(ono), { credentials: 'include' }).then(function(r){ return r.text(); }).then(function(html){
				var d = new DOMParser().parseFromString(html, 'text/html'), rows = d.querySelectorAll('#order_detail table.tbl_order tr');
				var first = tbs[0] && tbs[0].querySelector('tr.total_prc');
				for (var k = 0; k < rows.length; k++) if (/적립금|예치금|쿠폰|할인/.test(txt(rows[k].querySelector('th'))) && first) first.parentNode.insertBefore(document.importNode(rows[k], true), first);
			}).catch(function(){});
		}
		// 배송지
		var ad = of.querySelector('.box_addr .def_info');
		if (ad) { var ac = el('div', 'tk-cd', '<h3 class="tk-t">배송지</h3>'); ac.appendChild(ad); wrap.appendChild(ac); }
		// 안내
		var em = of.querySelector('p.email');
		if (em) { var ec = el('div', 'tk-cd'); em.style.cssText = 'margin:0;font-size:14px;color:#6A6A66;line-height:1.6;'; ec.appendChild(em); wrap.appendChild(ec); }
		// 버튼
		var bt = el('div', 'tk-2bt', '<a href="/">쇼핑 계속하기</a><a class="k" href="' + (ono ? '/mypage/order_detail.php?ono=' + encodeURIComponent(ono) : '/mypage/order_list.php') + '">주문 상세 보기</a>');
		wrap.appendChild(bt);
		// 사은품 선택 등 남은 폼은 그대로 뒤에 둔다
		var forms = of.querySelectorAll('form'); for (var f = 0; f < forms.length; f++) wrap.appendChild(forms[f]);
		stackLong(wrap);
		hide(of);
		cnt.insertBefore(wrap, of);
		cnt.insertBefore(header('주문 완료'), wrap);
		return true;
	}

	/* ---------- 주문서: 폼 밖으로 아무것도 옮기지 않는다 (결제에 필요한 입력값이 폼에 그대로 남도록) ---------- */
	function orderForm(cnt){
		var box = document.getElementById('order');
		var form = box && box.querySelector('form[name=ordFrm]');
		if (!form) return false;
		var sub = cnt.querySelector('h2.subtitle'); if (sub) sub.style.display = 'none';
		var CHEV = '<svg class="tk-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#161616" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>';
		var h3s = form.querySelectorAll(':scope > h3.title');
		for (var i = 0; i < h3s.length; i++) {
			var h = h3s[i], body = h.nextElementSibling;
			var sec = el('div', 'tk-cd tk-sec');
			form.insertBefore(sec, h);
			sec.appendChild(h);
			if (body && body.tagName === 'DIV' && !/reconfirm/.test(body.className)) sec.appendChild(body);
			h.insertAdjacentHTML('beforeend', CHEV);
			// 위사 toggle_next 로 접고 펼 때 화살표 방향도 바꾼다
			(function(h){ h.addEventListener('click', function(){ setTimeout(function(){ var b = h.nextElementSibling; h.classList.toggle('tk-closed', !!b && getComputedStyle(b).display === 'none'); }, 0); }); })(h);
			if (body && getComputedStyle(body).display === 'none') h.classList.add('tk-closed');
		}
		var submit = form.querySelector('#order3 input[type=submit]'); if (submit && !submit.value) submit.value = '결제하기';
		cnt.insertBefore(header('주문서'), box);
		return true;
	}

	function start(){
		var cnt = document.getElementById('cnt');
		if (!cnt || cnt.classList.contains('tkbb-my')) return;
		var st = document.createElement('style');
		st.appendChild(document.createTextNode(CSS));
		try {
			(document.head || document.documentElement).appendChild(st);
			cnt.classList.add('tkbb-my');
			if (!PAGES[P](cnt)) { cnt.classList.remove('tkbb-my'); st.parentNode.removeChild(st); }
		} catch (e) {
			// 실패하면 원래 화면으로 다시 연다 (옮긴 요소까지 확실히 되돌리기 위해)
			location.replace(location.href + (location.search ? '&' : '?') + 'tkbb_old=1');
		}
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
	else start();
})();
/* ===== 마이페이지 하위 메뉴 끝 ===== */

/* ===== 상품후기 작성 팝업 (마켓컬리식 카드, 타코베베 컬러) — 2026-09-30 =====
   위사가 body 끝에 붙이는 #revWriteAjaxDiv 레이어의 모양만 바꾼다. 기능은 그대로.
   되돌리려면 이 블록만 지우면 된다. */
(function(){
	if (window.__TKBB_REVW) return; window.__TKBB_REVW = 1;
	if (window.browser_type === 'pc') return;
	var R = '#revWriteAjaxDiv ';
	var CSS = ''
		+ R + '.qnarev_write_popup{background:#F4F2EC !important;border-radius:20px 20px 0 0;padding:22px 16px 20px !important;font-family:inherit;letter-spacing:-.02em;color:#161616;box-sizing:border-box;max-height:88vh;overflow-y:auto;}'
		+ R + '.qnarev_write{background:none !important;padding:0 !important;border:0 !important;}'
		+ R + '.qnarev_write_popup{z-index:100001 !important;}'
		+ R + 'fieldset{border:0;margin:0;padding:0;}'
		+ R + 'legend{display:block;width:100%;margin:0 0 14px;padding:0;font-size:19px;font-weight:700;color:#161616;border:0 !important;}'
		+ R + 'fieldset > div{background:#fff;border-radius:14px;padding:16px;margin:0 0 10px;border:0;}'
		+ R + 'fieldset > div > label{display:block;float:none;width:auto;margin:0 0 6px;padding:0;font-size:13px;color:#6A6A66;}'
		+ R + '.grade{text-align:center;}'
		+ R + '.grade .msg{margin:0 0 10px;font-size:15px;font-weight:600;color:#161616;}'
		+ R + 'select,' + R + '.form_input{width:100%;box-sizing:border-box;min-height:46px;border:1px solid #DAD5C8 !important;border-radius:8px;background:#fff;padding:0 12px;font-size:15px;}'
		+ R + 'textarea.form_input{height:160px;padding:12px;line-height:1.6;}'
		+ R + '.msg_milage{background:#D1D798 !important;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;font-size:14px;color:#3E4220;}'
		+ R + '.msg_milage strong{font-size:16px;font-weight:700;color:#161616;}'
		+ R + '.msg_milage img{height:20px;width:auto;}'
		+ R + '.btn_col{display:flex;gap:8px;margin:14px 0 0;padding:0;}'
		+ R + '.btn_col .box_btn{flex:1;display:block;width:auto;margin:0;padding:0;border:0;background:none;float:none;}'
		+ R + '.btn_col .box_btn input,' + R + '.btn_col .box_btn a{display:flex;align-items:center;justify-content:center;width:100%;height:52px;border-radius:10px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;}'
		+ R + '.btn_col .box_btn input{order:2;border:0 !important;background:#161616 !important;color:#fff !important;}'
		+ R + '.btn_col .box_btn.white a{border:1px solid #DAD5C8 !important;background:#fff !important;color:#161616 !important;}'
		+ R + '.btn_col .box_btn.white{order:-1;}';
	function add(){
		var st = document.createElement('style');
		st.appendChild(document.createTextNode(CSS));
		(document.head || document.documentElement).appendChild(st);
	}
	if (document.head) add(); else document.addEventListener('DOMContentLoaded', add);
})();
/* ===== 상품후기 작성 팝업 끝 ===== */
