// API
mp.Player.prototype.getKillsAgainst = function(player) {
    return this.__killCounter[player.id] || 0;
};

// Events
mp.events.add("playerJoin", (player) => {
    player.__killCounter = {};
});

mp.events.add("playerDeath", (player, reason, killer) => {
    if (!killer || killer === player) {
        return;
    }

    killer.__killCounter[player.id] = killer.getKillsAgainst(player) + 1;
    player.call("displayKillCounter", [ killer, killer.__killCounter[player.id], player.getKillsAgainst(killer) ]);
});

mp.events.add("playerQuit", (player) => {
    // Remove disconnected player's deaths from every kill counter
    mp.players.forEach((otherPlayer) => {
        delete otherPlayer.__killCounter[player.id];
    });
});