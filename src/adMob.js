// select the right Ad Id according to platform
var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
	admobid = {
		banner: 'ca-app-pub-5057654597529273/4261848341', // or DFP format "/6253334/dfp_example_ad"
	};
} 
else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
	admobid = {
		banner: 'ca-app-pub-xxx/zzz', // or DFP format "/6253334/dfp_example_ad"
	};
} 
else { // for windows phone
	admobid = {
		banner: 'ca-app-pub-xxx/zzz', // or DFP format "/6253334/dfp_example_ad"
	};
}

document.addEventListener('deviceready', initApp, false);

function initApp() {
	AdMob.createBanner( {
				adId: "ca-app-pub-5057654597529273/4261848341", 
				adSize:'SMART_BANNER', 
				overlap:true, 
				position:AdMob.AD_POSITION.BOTTOM_CENTER, 
				isTesting:false,
				autoShow:true,
				error: function(){
					alert('failed to create banner');
				}}, function(){console.log("ad created")}, function(){console.log("ad creation failed")} );
}