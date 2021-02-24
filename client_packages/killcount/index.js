// Natives
const REGISTER_PEDHEADSHOT = "0x4462658788425076";
const BEGIN_TEXT_COMMAND_THEFEED_POST = "0x202709F4C58A0424";
const END_TEXT_COMMAND_THEFEED_POST_VERSUS_TU = "0xB6871B0555B02996";
const UNREGISTER_PEDHEADSHOT = "0x96B1361D9B24C2FF";

// Functions
function createHeadshotAsync(pedHandle, maxTries = 10) {
    return new Promise((resolve, reject) => {
        const handle = mp.game.invoke(REGISTER_PEDHEADSHOT, pedHandle);
        let tries = 0;

        const timer = setInterval(() => {
            if (tries >= maxTries) {
                clearInterval(timer);
                reject();
            }

            if (mp.game.ped.isPedheadshotReady(handle)) {
                clearInterval(timer);
                resolve([handle, mp.game.ped.getPedheadshotTxdString(handle)]);
            }

            tries++;
        }, 100);
    });
}

// Events
mp.events.add("displayKillCounter", async (killer, numKillerKills, numVictimKills) => {
    if (!killer) {
        return;
    }

    const [killerHeadshotHandle, killerHeadshotTxd] = await createHeadshotAsync(killer.handle);
    const [victimHeadshotHandle, victimHeadshotTxd] = await createHeadshotAsync(mp.players.local.handle);

    mp.game.invoke(BEGIN_TEXT_COMMAND_THEFEED_POST, ""); // well it is empty in decompiled scripts
    mp.game.invoke(
        END_TEXT_COMMAND_THEFEED_POST_VERSUS_TU,
        killerHeadshotTxd, killerHeadshotTxd, numKillerKills,
        victimHeadshotTxd, victimHeadshotTxd, numVictimKills,
        6, // HUD_COLOUR_RED - for killer
        9 // HUD_COLOUR_BLUE - for victim
    );

    // Free headshot handles
    mp.game.invoke(UNREGISTER_PEDHEADSHOT, killerHeadshotHandle);
    mp.game.invoke(UNREGISTER_PEDHEADSHOT, victimHeadshotHandle);
});