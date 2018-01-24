var config;
var list;
var step;
var steps;
var answers = new Array();


// 設定ファイル読み込み
function getConfig(){
	$.ajaxSetup({async: false});
	var data = $.getJSON('config.json');
	$.ajaxSetup({async: true});
	// console.log(data.responseJSON);
	return data.responseJSON;
}


// 画像リスト読み込み
function getImageList(){
	$.ajaxSetup({async: false});
	var data = $.getJSON('files.json');
	$.ajaxSetup({async: true});
	// console.log(data.responseJSON);
	return data.responseJSON;
}


// 評価結果送信
function postData(data){
	var post = $.post(config.url, data, showAck);
}


// データセット作成
function getImages(){
	var sets = new Array();
	var keys = Object.keys(list);
	// ステップ数から参照先番号を計算
	var index = step * config.number;
	// 各種類から指定枚数ずつ取得
	$.each(keys, function(i, key){
		for (var i = index ; i < index + config.number; i++){
			sets.push({path: list[key][i], label: key});
		}
	});
	return sets;
}


// 送信用データ作成
function createData(sign, age, sex, allow){
	var data = {
		name: 'sr-sg',
		sign: sign,
		age: age,
		sex: sex,
		allow: allow
	}
	// 配列をオブジェクト形式に変換
	for (var i = 0; i < answers.length; i++){
		data['answer' + i] = answers[i];
	}
	return data;
}


// 進捗を表示
function showProgress(){
	var prog = '(' + (step + 1) + '/' + steps + ')';
	var long = step * 100 / steps;
	$('#info2').text(prog);
	$('#progress').css('width', long + '%');
}


// 画像を表示
function setImages(){
	$('#area').empty();
	var sets = getImages();
	// 配列をシャッフル
	sets = sets.sort(function(){
		return Math.random() - 0.5;
	});
	// カラムを追加
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


// 画面遷移
function setScreen(name){
	$('.screen').hide();
	$('#' + name).show();
}


// 画像選択
function select(label){
	console.log('select: ' + label);
	answers.push(label);
	step++;
	// 最終ステップならばエンディングへ
	if (step >= steps){
		showEnding();
		return;
	}
	setImages();
	showProgress();
}


// 評価結果送信
function submit(){
	var sign = $('#sign').val();
	var age = $('#age').val();
	var sex = $('#sex').val();
	var allow = $("#allow").prop('checked');
	// 署名入力の確認
	if ($('#sign').val() == ''){
		$('#sign').addClass('invalid');
		$('#info3').text("署名を入力してください");
		$('#info3').addClass('pink-text');
		return;
	}
	if ($('#age').val() == null){
		$('#info3').text("年齢を選択してください");
		$('#info3').addClass('pink-text');
		return;
	}
	if ($('#sex').val() == null){
		$('#info3').text("性別を選択してください");
		$('#info3').addClass('pink-text');
		return;
	}
	data = createData(sign, age, sex, allow);
	// console.log(data);
	// プリローダーを表示
	$('#sending').show();
	$('#submit-button').prop("disabled", true);
	postData(data);
}


// タイトル画面表示
function showTitle(){
	setScreen('screen1');
	$('#start-button').click(showForm);
}


// 評価画面表示
function showForm(){
	setScreen('screen2');
	setImages();
	showProgress();
}


// エンディング表示
function showEnding(){
	setScreen('screen3');
	$('#submit-button').click(submit);
}


// 謝辞表示
function showAck(){
	setScreen('screen4');
}


// ページ読み込み完了で実行
$(function(){
	console.log('ready');
    $('select').material_select();
	// 設定ファイルの読み込み
	config = getConfig();
	list = getImageList();
	// ステップ数の初期化
	var keys = Object.keys(list);
	steps = list[keys[0]].length / config.number;
	step = 0;
	showTitle();
});