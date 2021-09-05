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
			if (this.value.length > 8) {
				this.value = this.value.substr(0, 8);
			}
		} else {
			if (this.value.length > 7) {
				this.value = this.value.substr(0, 7);
			}
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
			 
		if (val < minValue || val > maxValue) {
			this.value = this.value.substr(0, 0);
		}
		if (this.value.match(regex)) 
			if (this.value.match(regex).length > 1) {
				this.value = this.value.substr(0, 0);
			}
		
		if (this.value.match(/\-/g)) 
			if (this.value.match(/\-/g).length > 1) {
				this.value = this.value.substr(0, 0);
			}
		
		let x = parseFloat(xtextinput.value.replace(new RegExp(separator, "g"), "."));
		let y = parseFloat(ytextinput.value.replace(new RegExp(separator, "g"), "."));
		movePoint(x ? x : 0, y ? y : 0);
	}
}

document.querySelector(".number1").onkeyup = onlyDigits;
document.querySelector(".number2").onkeyup = onlyDigits;

var inputs = document.getElementsByClassName("input-checkbox");
for (var i = 0; i < inputs.length; i++) inputs[i].onchange = checkboxHandler;
         
function checkboxHandler() {
    for (var i = 0; i < inputs.length; i++)
        if (inputs[i].checked && inputs[i] !== this) inputs[i].checked = false;
	changeR(parseFloat(this.value));
}

document.querySelector("#forsubmit").onclick = startPHP;
document.querySelector("#forreset").onclick = clearHistory;

function clearHistory() {
	localStorage.clear();
	historyBrowser.innerHTML = "";
	movePoint(0, 0, 5);
}

function onAnswer(res) {
	$('.button-form').attr('disabled', false);
	var timer = JSON.stringify(res);
	var data = JSON.parse(timer);
	var result = "<b>Проверка точки (" + data.x + "; " + data.y + ")</b><br>";
	result += "<b>Параметр: </b>" + data.r + "<br>";
	result += "<b>Время отправки: </b>" + data.currentTime + "<br>";
	result += "<b>Время исполнения: </b>" + (parseFloat(data.scriptTime)*1000).toFixed(2) + " ms<br>";
	result += "<b>Результат: </b>" + data.hit;
	textwindow.innerHTML = result;
	localStorage.setItem(localStorage.length, timer);
	createTableRow(timer)
}

function createTableRow(data) {
	data = JSON.parse(data);
	let result;
	result = "<tr class='historyTd'>";
	result += `<td class='historyElem'> Точка: (${data.x}, ${data.y}) </td>`;
	result += `<td class='historyElem'> Параметр: ${data.r} </td>`;
	result += `<td class='historyElem'> Отправка: ${data.currentTime} </td>`;
	result += `<td class='historyElem'> Исполнение: ${(parseFloat(data.scriptTime)*1000).toFixed(2)} ms</td>`;
	result += `<td class='historyElem'> Результат: ${data.hit} </td>`;
	result += "</tr>"
	historyBrowser.innerHTML = result + historyBrowser.innerHTML;
}

function loadTable() {
	for (let i = 0; i < localStorage.length; i++) {
		createTableRow(localStorage.getItem(i))
	}
}

loadTable()

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








let colorStroke = "#ACBECE";
let colorFill = "#8C9EAE";
let colorGraphStroke = "rgba(0,0,0,0)";
let colorGraphFill = "rgba(115, 213, 131, 0.5)";
let colorGreenStroke = "rgba(115, 213, 131, 0.5)s";
let colorGreenFill = "rgba(112,255,64, 0)";
let colorPointStroke = "#AC7140";
let colorPointFill = "#E57C25";

var elem = document.getElementById("graph");
var ctx = elem.getContext('2d');
var small = 5;
var big = 15;
let basicX = 0;
let basicY = 0;
let basicR = 5;

drawSample();
changeR(5);

function drawSample(x = basicX, y = basicY, r = basicR) {
	/*
		Draw background
	*/
	ctx.fillStyle = $('body').css('backgroundColor');
	ctx.fillRect(0, 0, elem.width, elem.height);
	/*
		Options for graphic-zone
		I used stroke style to smooth lines
	*/
	ctx.lineWidth = 1;
	ctx.strokeStyle = "hsl(0,0%,100%)";
	ctx.fillStyle = colorGraphFill;
	ctx.strokeStyle = colorGraphStroke;
	/*
		Drawing graphic-zone
		Actually, I should make a function
		for each drawings but I don't care
	*/
	ctx.fillRect(elem.width/2, elem.height/2, elem.width/6, elem.height/3); //Rectange drawing
	ctx.strokeRect(elem.width/2, elem.height/2, elem.width/6, elem.height/3);
	
	ctx.beginPath(); // Triangle drawing
		ctx.moveTo(elem.width/2, elem.height*4/6);
		ctx.lineTo(elem.width*1/6, elem.height/2);
		ctx.lineTo(elem.width/2, elem.height/2);
		ctx.lineTo(elem.width/2, elem.height*4/6);
		ctx.fill();
		ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath(); // Arc drawind
		ctx.lineWidth = 2;
		ctx.arc(elem.width/2, elem.height/2, elem.width/3, Math.PI, Math.PI*3/2, false);
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.moveTo(elem.width/2, elem.height/2); // Canvas can't draw filled arc
		ctx.lineTo(elem.width/6, elem.height/2); // It's the reason why I draw another triangle
		ctx.lineTo(elem.width/2, elem.height/6);
		ctx.lineTo(elem.width/2, elem.height/2);
		ctx.fill();
	ctx.closePath();
	/*
		Option for graphic lines and notes
	*/
	ctx.fillStyle = colorFill;
	ctx.strokeStyle = colorStroke;
	ctx.lineWidth = 1;
	ctx.setTransform(1,0,0,1,0.5,0.5); 
	ctx.font = "10pt serif";
	/*
		Lines and notes drawing
	*/
	ctx.beginPath();
		ctx.moveTo(elem.width/2, elem.height);
		ctx.lineTo(elem.width/2, 0);
		ctx.lineTo(elem.width/2 + small, big);
		ctx.moveTo(elem.width/2, 0);
		ctx.lineTo(elem.width/2 - small, big);
		ctx.moveTo(0, elem.height/2);
		ctx.lineTo(elem.width, elem.height/2);
		ctx.lineTo(elem.width - big, elem.height/2 + small);
		ctx.moveTo(elem.width, elem.height/2);
		ctx.lineTo(elem.width - big, elem.height/2 - small);
		ctx.moveTo(elem.width/2 - small, elem.height*1/6);
		ctx.lineTo(elem.width/2 + small, elem.height*1/6);
		ctx.fillText("R", elem.width/2 + 2*small, elem.height*1/6 + small);
		ctx.moveTo(elem.width/2 - small, elem.height*2/6);
		ctx.lineTo(elem.width/2 + small, elem.height*2/6);
		ctx.fillText("R/2", elem.width/2 + 2*small, elem.height*2/6 + small);
		ctx.moveTo(elem.width/2 - small, elem.height*4/6);
		ctx.lineTo(elem.width/2 + small, elem.height*4/6);
		ctx.fillText("R/2", elem.width/2 + 2*small, elem.height*4/6 + small);
		ctx.moveTo(elem.width/2 - small, elem.height*5/6);
		ctx.lineTo(elem.width/2 + small, elem.height*5/6);
		ctx.fillText("R", elem.width/2 + 2*small, elem.height*5/6 + small);
		ctx.moveTo(elem.width*1/6, elem.height/2 + small);
		ctx.lineTo(elem.width*1/6, elem.height/2 - small);
		ctx.fillText("R", elem.width*1/6 - small, elem.height/2 - 2*small);
		ctx.moveTo(elem.width*2/6, elem.height/2 + small);
		ctx.lineTo(elem.width*2/6, elem.height/2 - small);
		ctx.fillText("R/2", elem.width*2/6 - small, elem.height/2 - 2*small);
		ctx.moveTo(elem.width*4/6, elem.height/2 + small);
		ctx.lineTo(elem.width*4/6, elem.height/2 - small);
		ctx.fillText("R/2", elem.width*4/6 - small, elem.height/2 - 2*small);
		ctx.moveTo(elem.width*5/6, elem.height/2 + small);
		ctx.lineTo(elem.width*5/6, elem.height/2 - small);
		ctx.fillText("R", elem.width*5/6 - small, elem.height/2 - 2*small);
		ctx.stroke();
	ctx.closePath();
	/*
		Option for green zone
	*/
	ctx.fillStyle = colorGreenFill;
	ctx.strokeStyle = colorGreenStroke;
	/*
		Green zone drawing
	*/
	ctx.fillRect(-10,-10,20,30);
	ctx.fillRect(elem.width/2 - (3/r)*elem.width/3, elem.height/2 + (3/r)*elem.height/3, (8/r)*elem.width/3, -(8/r)*elem.height/3);
	ctx.strokeRect(elem.width/2 - (3/r)*elem.width/3, elem.height/2 + (3/r)*elem.height/3, (8/r)*elem.width/3, -(8/r)*elem.height/3);
	/*
		Option for point
	*/
	ctx.fillStyle = colorPointFill;
	ctx.strokeStyle = colorPointStroke;
	ctx.lineWidth = 1;
	var valx = elem.width/2 + (x/r)*elem.width/3;
	var valy = elem.height/2 - (y/r)*elem.height/3
	/*
		Point drawing
	*/
	ctx.beginPath();
		ctx.arc(valx, valy, 4, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.stroke();
	ctx.closePath();
}

function changeR(r) {
	basicR = r;
	drawSample();
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
 
function movePoint(x, y) {
	basicX = x;
	basicY = y;
	drawSample();
}