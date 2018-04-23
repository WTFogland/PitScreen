// Alias oft-used parts of the interface.
var ui = {
    panels: {
        match: {
            number: document.getElementById('match-number'),
            time: document.getElementById('matchtime'),
            alliance: document.getElementById('alliance')
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
    fixedTime = formatAMPM(fixedTime);

    for (i = 0; i < 3; i++) {
        var temp = red[i];
        var temp2 = blue[i];
        redData[i] = teams[temp];
        blueData[i] = teams[temp2];

        if (redData[i] == 4362) {
            redBoi = true;
        }
        else if (blueData[i] == 4362) {
            blueBoi = true;
        }
    }

    ui.panels.match.number.innerHTML = 'Match ' + matches[match].comp_level.toUpperCase() + matches[match].match_number;
    ui.panels.match.time.innerHTML = 'Predicted Match Time: ' + fixedTime;
    if (blueBoi) {
        ui.panels.match.alliance.innerHTML = '<p style="color: #156bde; font-size: 60px;">' + 'We are on Blue Alliance' + '</p>';
    }
    else {
        ui.panels.match.alliance.innerHTML = '<p style="color: #d12727; font-size: 60px;">' + 'We are on Red Alliance' + '</p>';
    }
    ui.panels.red.innerHTML = '<h1>Predicted Score: ~' + Math.round(oprs[red[0]] + oprs[red[1]] + oprs[red[2]]) + '</h1>';
    ui.panels.blue.innerHTML = '<h1>Predicted Score: ~' + Math.round(oprs[blue[0]] + oprs[blue[1]] + oprs[blue[2]]) + '</h1>';

    for (i = 0; i < 3; i++) {
        ui.panels.red.innerHTML +=
            '<div>' +
            '<h2>' + teams[red[i]] + '</h2>' +
            '<ul>' +
            '<li>OPR: ' + Math.round(oprs[red[i]]) + ' Points</li>' +
            '</ul>' +
            '</div>';
        ui.panels.blue.innerHTML +=
            '<div>' +
            '<h2>' + teams[blue[i]] + '</h2>' +
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

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
