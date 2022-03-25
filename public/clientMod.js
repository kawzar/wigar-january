var isDrunk = false;
var drankBeer = false;
var drunkFrameCount = 0;
var drankBeerFrameCount = 0;
var speaksGibberish = false;
var gibberishFrameCount = 0;
var drunkPlayers = [];
var gibberishTalkPlayers = [];

function initMod(playerId, roomId) {
    print("Mod: " + players[playerId].nickName + " (you) joined the game at " + roomId);

    //prevent duplicate listeners
    if (!socket.hasListeners('drinkInteracted')) {
        socket.on('drinkInteracted', function(player) {
            console.log("interacted " + player.id)
            if (player.id == me.id) {
                isDrunk = true;
                drunkFrameCount = frameCount;
            }
        });
    }

    if (!socket.hasListeners('beerInteracted')) {
        socket.on('beerInteracted', function(player) {
            drunkPlayers.push(player.id);
            handStand(player.id, -1);

            if (player.id == me.id) {
                drankBeer = true;
                drankBeerFrameCount = frameCount;
            }
        });
    }

    if (!socket.hasListeners('beerFinished')) {
        socket.on('beerFinished', function(p) {
            console.log("finished " + p.id)
            drunkPlayers = drunkPlayers.filter(playerId => playerId !== p.id)
            handStand(p.id, 1);
        });
    }

    if (!socket.hasListeners('gibberishInteracted')) {
        socket.on('gibberishInteracted', function(player) {
            gibberishTalkPlayers.push(player.id);

            if (player.id == me.id) {
                speaksGibberish = true;
                gibberishFrameCount = frameCount;
                var p = players[player.id];
                socket.emit('talk', {
                    room: "patio",
                    id: p.id,
                    color: p.labelColor,
                    message: "*gulp*",
                    x: p.x,
                    y: p.y,
                })
            }
        });
    }

    if (!socket.hasListeners('gibberishFinished')) {
        socket.on('gibberishFinished', function(p) {
            gibberishTalkPlayers = gibberishTalkPlayers.filter(playerId => playerId !== p.id);
        });
    }

    if (!socket.hasListeners('playerAmount')) {
        socket.on('playerAmount', function(data) {
            updateCounters(data);
        });
    }
}

function patioUpdate() {
    if (isDrunk) {
        colorMode(HSB);
        tint((frameCount * 2) % 255, 40, 50);
        drawSprites();
        colorMode(RGB);

        if (frameCount - drunkFrameCount >= 60 * 5) {
            isDrunk = false;
        }
    }

    if (drankBeer) {
        if (frameCount - drankBeerFrameCount >= 60 * 15) {
            drankBeer = false;
            socket.emit("action", "BeerFinished");
        }
    }

    if (speaksGibberish) {
        if (frameCount - gibberishFrameCount >= 60 * 30) {
            speaksGibberish = false;
            socket.emit("action", "GibberishFinished");
        }
    }
}

function patioTalk(playerId, bubble) {
    if (gibberishTalkPlayers.includes(playerId)) {
        var translatedText = bubble.message.replace(/(?:a|e|i|o|u(?!e)|u(?!i)){1,3}/ig, "$&p$&").replace(/(?:pue){1,3}/ig, "pe").replace(/(?:pui){1,3}/ig, "pi");
        bubble.message = translatedText;
        bubble.tw = textWidth(bubble.message);
        bubble.w = round(bubble.tw + TEXT_PADDING * 2);

        bubble.x = round(bubble.px - bubble.w / 2);
        if (bubble.x + bubble.w + BUBBLE_MARGIN > width) {
            bubble.x = width - bubble.w - BUBBLE_MARGIN
        }
        if (bubble.x < BUBBLE_MARGIN) {
            bubble.x = BUBBLE_MARGIN;
        }
    }
}

//called when I receive data from a player already in the room
function patioIntro(playerId, roomId) {
    if (drunkPlayers.includes(playerId)) {
        handStand(playerId, -1);
    }
}

function handStand(playerId, multiplier) {
    var p = players[playerId];
    p.sprite.scale = multiplier * ASSET_SCALE;
}

function updateCounters(data) {
    var currentCounter = document.getElementById("currentVisitors");
    var totalCounter = document.getElementById("totalVisitors");

    currentCounter.innerHTML = data.current;
    totalCounter.innerHTML = data.total;
}