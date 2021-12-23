// global websocket, used to communicate from/to Stream Deck software
// as well as some info about our plugin, as sent by Stream Deck software 
var websocket = null,
  uuid = null,
  inInfo = null,
  actionInfo = {},
  settingsModel = {
	  Summoner: '0',
	  Spell: '0'
  };

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo);
  inInfo = JSON.parse(inInfo);
  websocket = new WebSocket('ws://localhost:' + inPort);

  //initialize values
  if (actionInfo.payload.settings.settingsModel) {
	  settingsModel.Summoner = actionInfo.payload.settings.settingsModel.Summoner;
  }
  if (actionInfo.payload.settings.settingsModel) {
	  settingsModel.Spell = actionInfo.payload.settings.settingsModel.Spell;
  }

	for (let option of document.getElementById('summoner').getElementsByTagName('option')) {
		option.selected = false;

		if (option.value == actionInfo.payload.settings.settingsModel.Summoner) {
			option.selected = true;
		}
	}
	for (let option of document.getElementById('spell').getElementsByTagName('option')) {
		option.selected = false;

		if (option.value == actionInfo.payload.settings.settingsModel.Spell) {
			option.selected = true;
		}
	}

  websocket.onopen = function () {
	var json = { event: inRegisterEvent, uuid: inUUID };
	// register property inspector to Stream Deck
	websocket.send(JSON.stringify(json));

  };

  websocket.onmessage = function (evt) {
	// Received message from Stream Deck
	var jsonObj = JSON.parse(evt.data);
	var sdEvent = jsonObj['event'];
	switch (sdEvent) {
	  case "didReceiveSettings":
			if (jsonObj.payload.settings.settingsModel.Summoner) {
			settingsModel.Summoner = jsonObj.payload.settings.settingsModel.Summoner;
			document.getElementById('summoner').value = settingsModel.Summoner;
		}
			if (jsonObj.payload.settings.settingsModel.Spell) {
				settingsModel.Spell = jsonObj.payload.settings.settingsModel.Spell;
				document.getElementById('spell').value = settingsModel.Spell;
		}
		break;
	  default:
		break;
	}
  };
}

function sendValueToPlugin(value, param) {
	if (websocket) {
		const json = {
			"action": actionInfo['action'],
			"event": "sendToPlugin",
			"context": uuid,
			"payload": {
				[param]: value
			}
		};
		websocket.send(JSON.stringify(json));
	}
}

const setSettings = (value, param) => {
  if (websocket) {
	settingsModel[param] = value;
	var json = {
	  "event": "setSettings",
	  "context": uuid,
	  "payload": {
		"settingsModel": settingsModel
	  }
	};
	websocket.send(JSON.stringify(json));
  }
};

