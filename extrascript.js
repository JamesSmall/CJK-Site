"use strict";
var hold = false;
var expectedRun = 0;
var currentRun = 0;
function fixDynamicJSElement(element){
	if(element.src/* && loadedFiles.indexOf(element.src) === -1*/){
		var parent = element.parentElement;
		var newScript = document.createElement("script");
		newScript.type = "text/javascript";
		newScript.innerHTML = element.innerHTML;
		newScript.src = element.src;
		newScript.onload = function(){ 
			//script will load from external source, must be referenced
			if(newScript.innerHTML){
				eval(newScript.innerHTML);//can now eval internal script
			}
			currentRun++;
			newScript.onload = element.onload;
			if(currentRun===expectedRun){
				//afterRun();
			}
		}
		parent.appendChild(newScript);
		//loadedFiles.push(newScript.src);
		expectedRun++;
	}
	else if(element.innerHTML){
		eval(element.innerHTML);
	}
}
/*
function afterRun(){
	var childrenAll = document.getElementById('maincontainer').getElementsByTagName("*");
		for(var i = 0; i < childrenAll.length;i++){
			if(childrenAll[i].onload){
				childrenAll[i].onload();
			}
		}
}*/
//base function
function loadPage(id,moveto){
	hold = true;
	jQuery.ajax({
			url:""+id+".html",
			type:'GET',
			dataType: 'html',
			success: function(data){
				var toFind = document.createElement("div");
				toFind.innerHTML = data;
				//jQuery(tofind).find('#content-area')
				var page = toFind.querySelector('.main-content');
				//var pageDiv = document.createElement('div');
				//pageDiv.appendChild(page);
				//pageDiv.classList.add("hidden-page");
				//pageDiv.id = id;
				for(var i = 0; i < page.children.length;i++){
	   				document.getElementById('content-pages').appendChild(page.children[i]);
				}
				hold = false;
				switchPage(id,moveto);

				var js = document.getElementById(id).getElementsByTagName('script');
				var length = js.length; //prevents from an ifinite loop via scripts adding more scripts
				for(var i = 0; i < length;i++){
					fixDynamicJSElement(js[i]);
				}
				//element.classList.add('hidden-page');
 			},
 			error:function(){
 				window.alert("was unable to fetch page");
 				hold = false;
 				jQuery(".loading").removeClass("shown-page");
 				jQuery(".loading").addClass("hidden-page");
 			}
	});	
}

function erasePage(id){
	jQuery("#"+id).remove();
	//loadedFiles = new Array();
}
function switchPage(id,moveto){
	//get center thing to start removing from
	/*if(!moveto){
		moveto = "#services";
	}*/
	if(!hold){
		var selected = document.getElementById('content-pages');
		var items = selected.children;
		for(var i = 0;i < items.length;i++){
			items[i].classList.remove('shown-page');
			items[i].classList.add('hidden-page');
		}
		//get element
		var desiredElement = document.getElementById(id);
		if(desiredElement != null){
			desiredElement.classList.add('shown-page');
			desiredElement.classList.remove('hidden-page');
			//window.location.hash = '_'+id;
			var loc = window.location.pathname;
			var dir = loc.substring(0, loc.lastIndexOf('/')+1);
			//window.location = dir+id+".html";
			history.pushState({}, null, dir+id+".html");
			attemptScroll(moveto);
			var element = document.getElementById('loading');
	    	element.classList.add('hidden-page')
		}
		else{
			loadPage(id,moveto);
			var element = document.getElementById('loading');
	    	element.classList.remove('hidden-page');
	    }
	}
}
/*broken
function attemptScroll(id){
	jQuery(id).animate({
		scrollTop:jQuery(this).offset().top+"px"}
		,'fast'
	)
}*/
function attemptScroll(id){
	setTimeout(function() {
		if(id){
	    	jQuery("html").animate({ scrollTop: jQuery(id).offset().top }, 500);
	    }
	    else{
	    	//jQuery("html").animate({scrollTop:0}, 500);
	    }
	}, 1000);
}