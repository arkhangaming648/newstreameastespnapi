$(document).ready(function () {
$.ajaxSetup({ cache: false });

function scoreFunc(){
$.getJSON(url, function (data) {



for (let i = 0; i < data.scores.length; i++) {

events = data.scores[i].events;

for (let i = 0; i < events.length; i++) {
eventId = events[i].id;
state = events[i].competitions[0].status.type.state;
status = events[i].competitions[0].status.type.description;

status = status.replace("First", "1st");
status = status.replace("Second", "2nd");
status = status.replace("Full Time", "FT");
status = status.replace("Final Score - After Penalties", "FT - Pens");
status = status.replace("Final Score - After Extra Time", "FT - AET");
homeScore = events[i].competitions[0].competitors[0].score;
awayScore = events[i].competitions[0].competitors[1].score;
score = homeScore + ' - ' + awayScore;

vs = '<span class="fw-bold fs-6">vs</span>';

statusDetail = status;

clockSpan = document.getElementById("clock-"+eventId);
gameStatus = document.getElementById("gameStatus-"+eventId);

if (clockSpan) {
//console.log(clockSpan);
clock = events[i].competitions[0].status.displayClock;
clockSpan.innerHTML = clock;
//statusClock = statusDetail + ": "+clock;
statusClock = clock;
} else {
statusClock = statusDetail;
}


if (gameStatus) {
if (state == 'post') {
	  gameStatus.className = "status-badge badge bg-danger";
	  gameStatus.innerHTML = score;
} else if (status.match(/halftime/i)) {
	  gameStatus.className = "status-badge badge bg-ht";
	  gameStatus.innerHTML = "<span id='clock-"+eventId+"'>"+statusDetail+"</span>";
} else if (state == "in"){
		gameStatus.className = "status-badge badge bg-success";
		gameStatus.innerHTML = "<span id='clock-"+eventId+"'>"+statusClock+"</span>";
}
}

}

}


});
}
scoreFunc(); // run on page load

setInterval(function(){
    scoreFunc() // run after/every 10 seconds
}, 300000);

});