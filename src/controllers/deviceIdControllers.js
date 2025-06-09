async function getOrCreateDeviceId() {
    FingerprintJS.load().then(fp => {
        return fp.get();
    }).then(result => {
        localStorage.setItem('visitorId', result.visitorId);
        // TODO: gửi visitorId về server
        window.location.href = "/src/pages/Game/game.html"
    }).catch(err => {
        console.error('FingerprintJS error', err);
    });
}
{/* <script src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"></script> */ } // Add thư viện fingerPrintJs

export { getOrCreateDeviceId }