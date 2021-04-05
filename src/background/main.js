/**
 * Initiate the default settings.
 */
chrome.storage.sync.set({
	gridIsEnabled: false,
	gridColumnWidth: 60,
	gridColumnCount: 16,
	gridColumnColor: '#c80000',
	gridGutterWidth: 20,
	gridBaselineColor: '#29abe2',
	gridBaselineDistance: 24,
	gridColumnColorOpacity: 0.2,
	gridMargin: 10,
	marginsAreEnabled: true,
	eventListenersEnabled: true,
	currentGrid: 'modular-grid'
});

/**
 * Set the off icon when the extension is initially installed.
 */
chrome.action.setIcon({path: 'img/icon19-off.png'});

/**
 * Fired when the browser action icon is clicked, this method enables/disables the
 * grid.
 */
chrome.action.onClicked.addListener(function () {
	chrome.storage.sync.get(
		{gridIsEnabled: false},
		function (settings) {
			if (settings.gridIsEnabled) {
				chrome.action.setIcon({path: 'img/icon19-off.png'});
			} else {
				chrome.action.setIcon({path: 'img/icon19.png'});
			}

			chrome.storage.sync.set({gridIsEnabled: !settings.gridIsEnabled});
		}
	);
});
