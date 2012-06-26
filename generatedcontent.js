//.oldie :before & :after
(function( $ ) {
$.fn.generatedcontent = function() {
	if (!Modernizr) { return false; }
	if (Modernizr.generatedcontent) { return false; }
	this.loaded = function() {
		if (this.count != this.a.length) { return; }		
		var iEvil = $('html').hasClass('ie6');
		var sBase = 'http://' + window.location.host;
		this.a = this.a.join('\/* JOINED HERE *\/');
		this.a = this.a.replace(/\/\*(.|\n|\r)*?\*\//gi,''); // comments
		this.a = this.a.replace(/@media\sprint[\s\t\n\r]*\{(.|\n|\r)*?\}[\s\t\n\r]*\}/gi,''); // print media queries
		var ao = [];
		var r = /([^{\r\n]+)\:(after|before)[\s\r\n]*\{([^}]+)\}/g
		while ((a = r.exec(this.a)) != null) {
			var ocss = {selector : a[1], psuedoclass : a[2], rawstyles : {}};
			/*if ((/\,/).test(a[1])) {
				
				Not sure what to do about extra commas
				
				var aExtras = [];
				//console.log('comma');
			}*/
			var el;
			try { el = $(a[1]); } catch(e) { continue; } // IE will just kick out some complicated selectors
			if (!el.length) { continue; }
			var pc = el.children('.' + a[2]);
			if (!pc.length) {
				pc = $(document.createElement('div'));
				pc.addClass(a[2]);
			}

			var rcss = /[^\w]*([^\:]+)[\s\t]?\:[\s\t]?([^\;]+)\;/g
			var ac = [];
			while((ac = rcss.exec(a[3])) != null) {
				if (ac[1] === 'content') {
					ac[2] = ac[2].replace(/\'/g, '');
					try {
						if ((/^\\/).test(ac[2])) {
							ac[2] = ac[2].replace(/^\\/, '\\u');
							ac[2] = eval('"' + ac[2] + '"');
						}
						pc.text(ac[2]);
					} catch(e) {}
					continue;
				}
				ac[2] = ac[2].replace(/\"/g, "'");
				ocss.rawstyles[ac[1]] = ac[2];
				pc.css(ac[1], ac[2]);
			}

			if (!pc.parent().length) { if (pc.hasClass('before')) { el.prepend(pc); } else { el.append(pc); } }
			
			ao.push(ocss);
			
			try {
				if (window.DD_belatedPNG && iEvil && (this.a.indexOf('.png') != -1) && pc.get(0).style.backgroundImage) {
					if (pc.get(0).style.backgroundImage.indexOf('http://') == -1) {
						pc.get(0).style.backgroundImage = sBase + pc.get(0).style.backgroundImage;
					}
					pc.get(0).currentStyle.backgroundImage = pc.get(0).style.backgroundImage;
					DD_belatedPNG.fix(pc.get(0));
				}
			} catch(e) {}
			
		}
	};
	this.a = [];
	
	var css = $('link[rel="stylesheet"]').not('[href*="googleapis.com"]');
	this.count = css.length;
	
	
	var o = this;
	css.each(function(){
		var s = $(this).attr('href');
		var jqxhr = $.ajax({type:"GET",dataType:"text",url:s})
		.success(function(d){ o.a.push(d.toString()); })
		.error(function(){})
		.complete(function(){ o.loaded(); });
	});
};
})( jQuery );