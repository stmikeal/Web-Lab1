function onlyDigits() {
	var separator = this.dataset.separator;
	var replaced = new RegExp('[^\\d\\'+separator+'\\-]', "g");
	var regex = new RegExp('\\'+separator, "g");
	this.value = this.value.replace(replaced, "");

	var minValue = parseFloat(this.dataset.min);
	var maxValue = parseFloat(this.dataset.max);
	var val = parseFloat(separator == "." ? this.value : this.value.replace(new RegExp(separator, "g"), "."));
	if (minValue <= maxValue) {
		if (this.value[0] == "-") {
			if (this.value.length > 8) 
				this.value = this.value.substr(0, 8);
		} else {
			if (this.value.length > 7) 
				this.value = this.value.substr(0, 7); 
		}
		
		if (this.value[0] == separator) {
			this.value = "0" + this.value;
		}
		
		if (minValue < 0 && maxValue < 0) {
			if (this.value[0] != "-")
				this.value = "-" + this.value[0];
		} else if (minValue >= 0 && maxValue >= 0) {
			if (this.value[0] == "-") 
				this.value = this.value.substr(0, 0);
		}
			 
		if (val < minValue || val > maxValue)
			this.value = this.value.substr(0, 0);
		
		if (this.value.match(regex)) 
			if (this.value.match(regex).length > 1) 
				this.value = this.value.substr(0, 0);
		
		if (this.value.match(/\-/g)) 
			if (this.value.match(/\-/g).length > 1) 
				this.value = this.value.substr(0, 0);
	}
}

document.querySelector(".number1").onkeyup = onlyDigits;
document.querySelector(".number2").onkeyup = onlyDigits;

var inputs = document.getElementsByClassName("input-checkbox");
for (var i = 0; i < inputs.length; i++) inputs[i].onchange = checkboxHandler;
         
function checkboxHandler() {
    for (var i = 0; i < inputs.length; i++)
        if (inputs[i].checked && inputs[i] !== this) inputs[i].checked = false;
}

document.querySelector("#forsubmit").onkeyup = startPHP;

function onAnswer(res) {
	$('.button-form').attr('disabled', false);
	var data = JSON.parse(JSON.stringify(res));
	var result = "<b>Проверка точки (" + data.x + "; " + data.y + ")</b><br>";
	result += "<b>Параметр: </b>" + data.r + "<br>";
	result += "<b>Время отправки: </b>" + data.currentTime + "<br>";
	result += "<b>Время исполнения: </b>" + (parseFloat(data.scriptTime)*1000).toFixed(2) + " ms<br>";
	result += "<b>Результат: </b>" + data.hit;
	textwindow.innerHTML = result;
}

function startPHP() {
	var x = xtextinput.value;
	var y = ytextinput.value;
	var r = false;
	if (rcheckbox1.checked) r = "1";
	if (rcheckbox2.checked) r = "2";
	if (rcheckbox3.checked) r = "3";
	if (rcheckbox4.checked) r = "4";
	if (rcheckbox5.checked) r = "5";
	if (x&&y&&r) {
		$.ajax({
			type: "GET",
			url: "scripts/input.php",
			data: {
				"x": x,
				"y": y,
				"r": r,
				"time": (new Date()).getTimezoneOffset()
			},
			beforeSend: function() {
				$('.button-form').attr('disabled', 'disabled');
			},
			success: onAnswer,
			dataType: "json"
		});
	} 
	else 
		alert('Заполните форму до конца!');
}

