$SD.on('connected', (jsonObj) => connected(jsonObj));

function connected(jsn) {
  $SD.on('com.motu.audio.action.keyUp', (jsonObj) => toggleMute(jsonObj));
};

async function toggleMute(jsn) {
  const { store_url } = jsn.payload.settings;
  if(!store_url){
    $SD.api.showAlert(jsn.context);
    return;
  }

  log('toggleMute:', store_url);

  const nowStatus = await fetch(store_url).then((resp) => resp.json()).catch(() => null);

  if(nowStatus == null) {
    log('toggleMute:', 'failure to fetch current status');
    return;
  }

  const nextStatus = Number(!nowStatus['value']);
  log('toggleMute:', `nextStatus is ${nextStatus}`);

  try {
    await fetch(store_url, { method: "PATCH", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `json={"value":${nextStatus}}` })
    log('toggleMute:', 'success to toggle mute')
  } catch {
    log('toggleMute:', 'failure to toggle mute')
    log(e);
  }
}

function log(...msg) {
  console.log(msg.map(stringify).join(' '));
}

function stringify(input) {
  if (typeof input !== 'object' || input instanceof Error){
    return input.toString();
  }

  return JSON.stringify(input, null, 2);
}
