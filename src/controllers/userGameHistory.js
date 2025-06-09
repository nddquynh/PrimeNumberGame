const rankingApi = ("https://68415cffd48516d1d35b3f6c.mockapi.io/ranking");
async function fetchListUserGameHistory$() {
    try {
        const reponse = await fetch(rankingApi);
        return await reponse.json()
    } catch (error) {
        console.error(`fetch list user error: ${error}`);
    }
}
async function postUserGameHistory$(gameHistory) {
    try {
        const reponse = await fetch(rankingApi, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: gameHistory.name,
                score: gameHistory.score,
                rankingLevel: gameHistory.rankingLevel,
                avatar: gameHistory.avatar,
                deviceId: gameHistory.deviceId
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`create user account error: `, error);
    }
}
async function updatedScoreGamePlay$(userId, gameHistory) {
    try {
        const reponse = await fetch(`${rankingApi}/${userId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: gameHistory.name,
                score: gameHistory.score,
                rankingLevel: gameHistory.rankingLevel,
                avatar: gameHistory.avatar,
                deviceId: gameHistory.deviceId
            })
        });
        return await reponse.json();

    } catch (error) {
        console.error(`create user account error: `, error);
    }
}
export { fetchListUserGameHistory$, postUserGameHistory$, updatedScoreGamePlay$ }