﻿var myPlayer=videojs('my_video_1');var changeQualityTimer=0;var ifrmAd;var ifrmAdLoadDone=false;var aClose=null;var displayAdTimeout=null;$('#selectQuality').change(function(){$('.clsTempMSg').remove();$('.user-action').after('<div class="clsTempMSg"><div style="font-size: 14px; font-weight: bold">If the player does not work, CLICK <a href="'+ $kissenc.decrypt($(this).val())+'">HERE</a> to use your device\'s player</div></div>');SetPlayer($kissenc.decrypt($(this).val()));changeQualityTimer++;});$('#selectQuality').change();function SetPlayer(code){var whereYouAt=myPlayer.currentTime();myPlayer.src({type:"video/mp4",src:code});$('#my_video_1').focus();if(changeQualityTimer>0){myPlayer.play();myPlayer.on("loadedmetadata",function(){myPlayer.currentTime(whereYouAt);});}
else{window.scrollTo(0,0);}
var volume=getCookie("videojsVolume");if(volume!=null&&volume!=""){myPlayer.volume(volume);}}
myPlayer.ready(function(){this.hotkeys({volumeStep:0.1,seekStep:5,enableMute:true,enableFullscreen:true});var div=document.createElement('div');div.innerHTML='<iframe src="//kimcartoon.me/ads/adsterra300x250.aspx" id="videoAd" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" src="" onload="ifrmAdLoadDone = true; if ($(ifrmAd).css(\'display\') == \'block\') { $(aClose).css(\'display\', \'block\'); }"></iframe>'+'<a class="videoAdClose" href="javascript:void(0)" onclick="$(\'#videoAd\').remove(); ifrmAd = null; $(this).remove();">&#10006</a>';ifrmAd=div.firstChild;aClose=div.childNodes[1];this.el().appendChild(ifrmAd);this.el().appendChild(aClose);this.on("pause",function(){if(ifrmAd!=null){displayAdTimeout=setTimeout(function(){if(myPlayer.paused()){$(ifrmAd).css('display','block');if(ifrmAdLoadDone){$(aClose).css('display','block');}}},1500);}});this.on("play",function(){if(ifrmAd!=null){$(ifrmAd).css('display','none');$(aClose).css('display','none');if(displayAdTimeout!=null){clearTimeout(displayAdTimeout);displayAdTimeout=null;}}});$('#my_video_1').focus();window.scrollTo(0,0);});$('#my_video_1').focusout(function(){$(this).css("outline","0px");});$('#my_video_1').focus(function(){$(this).css("outline","#333333 solid 1px");});var prevTime=0;function updatePrevTime(){prevTime=myPlayer.currentTime();}
setInterval(function(){updatePrevTime();},3000);var errorCount=0;var retryPlay=0;myPlayer.on('error',function(e){try{retryPlay++;if(retryPlay<=100){var tempVar=$kissenc.decrypt($('#selectQuality').val());var currTime=myPlayer.currentTime();myPlayer.src({type:"video/mp4",src:tempVar});if(currTime!=0){myPlayer.currentTime(currTime);}else{myPlayer.currentTime(prevTime);}
myPlayer.play();}
errorCount++;if(errorCount==10){$.ajax({type:"POST",url:"/External/RPB",data:"urlRP="+ encodeURIComponent(tempVar),success:function(message){if(message=="0"){alert("This video is broken, we're working to fix it.");}else{alert("There is network problem, please try to refresh browser or choose another video mirror.");}}});}}catch(ex){}});myPlayer.on('volumechange',function(){setCookie('videojsVolume',myPlayer.volume(),365);});