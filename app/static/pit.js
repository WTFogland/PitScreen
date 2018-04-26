// Alias oft-used parts of the interface.
var ui = {
    panels: {
        match: {
            number: document.getElementById('match-number'),
            time: document.getElementById('matchtime'),
            alliance: document.getElementById('alliance'),
            timeremain: document.getElementById('timeremain'),
            getready: document.getElementById('getReady')
        },
        red: document.getElementById('red'),
        blue: document.getElementById('blue')
    },
    arrow: {
        previous: document.getElementById('previous'),
        next: document.getElementById('next')
    }
};

// Fetch pregenerated match data
var getMatches = new XMLHttpRequest();
getMatches.open('GET', '/static/data/matches.json', false);
getMatches.send();
var matches = JSON.parse(getMatches.responseText);
console.log(matches);

// Fetch pregenerated team data
var getTeams = new XMLHttpRequest();
getTeams.open('GET', '/static/data/teams.json', false);
getTeams.send();
var teams = JSON.parse(getTeams.responseText);
console.log(teams);

// Fetch pregenerated team stats
var getStats = new XMLHttpRequest();
getStats.open('GET', '/static/data/stats.json', false);
getStats.send();
var stats = JSON.parse(getStats.responseText);

var getInsight = new XMLHttpRequest();
getInsight.open('GET', '/static/data/insights.json', false);
getInsight.send();
var insight = JSON.parse(getInsight.responseText);
console.log(insight);

var currentMatch = 0;
var newMatch = false;

grabMatch(0);

function grabMatch(match) {
    var redBoi;
    var blueBoi;

    var red = matches[match].alliances.red.team_keys;
    console.log(red);
    redData = [];
    var blue = matches[match].alliances.blue.team_keys;
    console.log(blue);
    blueData = [];

    oprs = stats.oprs;
    console.log(oprs);

    var predtime = matches[match].predicted_time;

    var fixedTime = new Date(predtime * 1000);
    givenTime = fixedTime;
    fixedTime = formatAMPM(fixedTime);

    for (i = 0; i < 3; i++) {
        var temp = red[i];
        var temp2 = blue[i];
        redData[i] = teams[temp].team_number;
        blueData[i] = teams[temp2].team_number;

        if (redData[i] == 4362) {
            redBoi = true;
        }
        else if (blueData[i] == 4362) {
            blueBoi = true;
        }
    }

    ui.panels.match.number.innerHTML = 'Match ' + matches[match].comp_level.toUpperCase() + matches[match].match_number;
    ui.panels.match.time.innerHTML = '<p style="font-size: 2.5vw;">Match Time: ' + fixedTime + '</p>';
    if (blueBoi) {
        ui.panels.match.alliance.innerHTML = '<p style="color: #156bde; font-size: 3vw;">' + 'We are on Blue Alliance' + '</p>';
    }
    else {
        ui.panels.match.alliance.innerHTML = '<p style="color: #d12727; font-size: 3vw;">' + 'We are on Red Alliance' + '</p>';
    }
    ui.panels.red.innerHTML = '<h1>Predicted Score: ~' + Math.round(oprs[red[0]] + oprs[red[1]] + oprs[red[2]]) + '</h1>';
    ui.panels.blue.innerHTML = '<h1>Predicted Score: ~' + Math.round(oprs[blue[0]] + oprs[blue[1]] + oprs[blue[2]]) + '</h1>';

    for (i = 0; i < 3; i++) {
        ui.panels.red.innerHTML +=
            '<div>' +
            '<h2>' + teams[red[i]].team_number + " | " + teams[red[i]].nickname + '</h2>' +
            '<ul>' +
            '<li>OPR: ' + Math.round(oprs[red[i]]) + ' Points</li>' +
            '</ul>' +
            '</div>';
        ui.panels.blue.innerHTML +=
            '<div>' +
            '<h2>' + teams[blue[i]].team_number + " | " + teams[blue[i]].nickname + '</h2>' +
            '<ul>' +
            '<li>OPR: ' + Math.round(oprs[blue[i]]) + ' Points</li>' +
            '</ul>' +
            '</div>';
    }
}

ui.arrow.previous.onclick = function() {
    if (currentMatch > 0) {
        currentMatch--;
        grabMatch(currentMatch);
    }
};

ui.arrow.next.onclick = function() {
    if (currentMatch < matches.length - 1) {
        currentMatch++;
        grabMatch(currentMatch);
    }
};

var hours;
var minutes;
var givenTime;

function formatAMPM(date) {
    hours = date.getHours();
    minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

// Update the count down every 1 second
var x = setInterval(function() {
    var countDownDate = new Date(givenTime).getTime();
    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    ui.panels.match.timeremain.innerHTML = '<p style="font-size: 7.5vw; color: #f4425f">' + hours + "h "
        + minutes + "m " + seconds + "s " + '</p>';

    if (hours === 0 && minutes < 20) {
      ui.panels.match.getready.innerHTML = 'QUEUE UP';
/*        y = setInterval(function() {
            ui.panels.match.getready.style.display = (ui.panels.match.getready.style.display == 'none' ? '' : 'none');
        }, 1000);*/
    }
    else if (hours === 0 && minutes < 10) {
        ui.panels.match.getready.innerHTML = '10 MINS TILL MATCH';
/*        y = setInterval(function() {
            ui.panels.match.getready.style.display = (ui.panels.match.getready.style.display == 'none' ? '' : 'none');
        }, 1000);*/
    }

    if (distance < 0) {
        ui.panels.match.getready.innerHTML = '';
        currentMatch++;
        grabMatch(currentMatch);
    }

}, 1000);