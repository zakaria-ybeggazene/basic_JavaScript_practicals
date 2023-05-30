
window.addEventListener("load", function () {
    var queue_on = [];
    var queue_off = [];

    var callback = function (ev) {
	var div = ev.currentTarget;
	console.log(div.id);
	queue_on.push(div);
    };
    for (var i = 1; i <= 8; i++) {
	var d = document.getElementById("d" + i);
	d.addEventListener("click", callback, i >= 5); //les 4 premiers sont false
	                                               //les 4 suivants sont true

    }
    setInterval(function () {
	if (queue_off.length > 0) {
	    (queue_off.shift()).style.backgroundColor = "";
	};

	if (queue_on.length > 0) {
	    var div = queue_on.shift();
	    div.style.backgroundColor = "#ff8888";
	    queue_off.push(div);
	};


    }, 800);


});
