var config;
var list;
var step = 0;
var answers = new Array();


function getConfig(){
	$.ajaxSetup({async: false});
	var data = $.getJSON('config.json');
	$.ajaxSetup({async: true});
	// console.log(data.responseJSON);
	return data.responseJSON;
}


function getImageList(){
	$.ajaxSetup({async: false});
	var data = $.getJSON('files.json');
	$.ajaxSetup({async: true});
	// console.log(data.responseJSON);
	return data.responseJSON;
}


function postData(data){
	$.ajaxSetup({async: false});
	var post = $.post(config.url, data);
	$.ajaxSetup({async: true});
	console.log(post.status);
	return post.status;
}


function getImages(){
	var sets = new Array();
	var keys = Object.keys(list);
	var index = step * config.number;
	$.each(keys, function(i, key){
		for (var i = index ; i < index + config.number; i++){
			sets.push({path: list[key][i], label: key});
		}
	});
	return sets;
}


function createData(sign, allow){
	var data = {
		sign: sign,
		allow: allow
	}
	for (var i = 0; i < answers.length; i++){
		data['answer' + i] = answers[i];
	}
	return data;
}


function setImages(){
	$('#area').empty();
	var sets = getImages();
	sets = sets.sort(function(){
		return Math.random() - 0.5;
	});
	for (var i = 0; i < sets.length; i++){
		var col = $('<div>');
		col.addClass('col s6 m4 center');
		var img = $('<img>');
		img.attr('src', sets[i].path);
		img.data('label', sets[i].label);
		img.click(function(){
			label = $(this).data('label');
			select(label);
		});
		col.append(img);
		$('#area').append(col);
	}
}


function setScreen(name){
	$('.screen').hide();
	$('#' + name).show();
}


function select(label){
	console.log('select: ' + label);
	answers.push(label);
	step++;
	if (step >= config.steps){
		showEnding();
		return;
	}
	setImages();
}


function submit(){
	var sign = $('#sign').val();
	var allow = $("#allow").prop('checked');
	if ($('#sign').val() == ''){
		$('#info3').text("署名を入力してください");
		$('#info3').addClass('pink-text');
		return;
	}
	data = createData(sign, allow);
	console.log(data);
	$('#sending').show();
	$('#submit-button').prop("disabled", true);
	var status = postData(data);
	if (status == 200){
		showAck();
	} else {
		$('#info3').text("送信に失敗しました");
		$('#info3').addClass('pink-text');
	}
}


function showTitle(){
	setScreen('screen1');
	// 遷移先設定
	$('#start-button').click(showForm);
}


function showForm(){
	setScreen('screen2');
	setImages();
}


function showEnding(){
	setScreen('screen3');
	$('#submit-button').click(submit);
}


function showAck(){
	setScreen('screen4');
}


$(function(){
	console.log('ready');
	// 設定ファイルの読み込み
	config = getConfig();
	list = getImageList();
	// タイトル画面表示
	showTitle();
});