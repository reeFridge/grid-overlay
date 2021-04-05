import './main.scss';

/**
 * Returns the largest z-index of all non-static elements in the tree whose root is
 * at the HTML element named in rootNode.
 *
 * @example
 * let body = document.getElementsByTagName('body')[0],
 *     largestZIndex = getLargestZIndexOfElementsIn(body);
 *
 * @param rootNode is the root node at which to start traversing the DOM, inspecting
 * for z-index values.
 * @returns {*} an integer representing the largest z-index in the DOM, or null if
 * one is not calculated.
 */
function getLargestZIndexOfElementsIn(rootNode) {
	let largestZIndexThusFar = null,
		zIndexOfCurrentHTMLElement = 0,
		occurrencesOfAuto = 0,
		positionOfCurrentHTMLElement = '';

	const HTML_ELEMENT = 1;

	if (undefined === rootNode.nodeType) {
		console.error(rootNode + ' is not a valid HTML node.');

		return;
	}

	function calculateLargestZIndex(rootNode) {
		if (HTML_ELEMENT === rootNode.nodeType) {
			positionOfCurrentHTMLElement = window.document.defaultView
				.getComputedStyle(rootNode, null)
				.getPropertyValue('position');

			if ('static' !== positionOfCurrentHTMLElement) {
				zIndexOfCurrentHTMLElement = window.document.defaultView
					.getComputedStyle(rootNode, null).getPropertyValue('z-index');

				if (!Number.isNaN(Number(zIndexOfCurrentHTMLElement))) {
					zIndexOfCurrentHTMLElement =
						parseInt(zIndexOfCurrentHTMLElement, 10);

					if (null === largestZIndexThusFar) {
						largestZIndexThusFar = zIndexOfCurrentHTMLElement;
					} else {
						if (zIndexOfCurrentHTMLElement > largestZIndexThusFar) {
							largestZIndexThusFar = zIndexOfCurrentHTMLElement;
						}
					}
				} else {

					//
					// Note: The “inherit” case is not handled.
					//
					if ('auto' === zIndexOfCurrentHTMLElement) {
						occurrencesOfAuto = occurrencesOfAuto + 1;
					}
				}
			}

			rootNode = rootNode.firstChild;

			while (rootNode) {
				calculateLargestZIndex(rootNode);
				rootNode = rootNode.nextSibling;
			}
		}
	}

	calculateLargestZIndex(rootNode);

	if (null === largestZIndexThusFar) {
		return occurrencesOfAuto;
	} else {
		return largestZIndexThusFar + occurrencesOfAuto;
	}
}

/**
 * Accepts a Hex-formatted color and a floating point opacity value; returns its
 * <tt>rgba</tt> equivalent, or <tt>-1</tt> on error.
 *
 * @example
 * convertToRGBA('#bada55', 0.2); // Returns rgba(188, 222, 248, 0.2)
 *
 * @param hex A 7-character color value, ranging from #000000 – #ffffff. Note: this
 * function does not accept 3-character shortcuts, as in #fff, for example.
 * @param opacity A floating point number between 0.0 – 1.0.
 * @returns {*} A CSS3 rgba equivalent to the hex and opacity combination, or undefined.
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function convertHexToRGBA(hex, opacity) {
	const patternForHex = /^#([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])$/;
	let currentNumberInNibble = 0;
	let previousNumberInNibble = 0;
	let calculateNibble = 0;
	let rgba = 'rgba(';
	let index = 0;

	const HEX = 16;
	const END_OF_HEX = 6;
	const HEX_LENGTH = hex.length;

	if (!Number.isNaN(Number(opacity))) {
		opacity = parseFloat(opacity, 10);

		if ((opacity < 0.0) || (opacity > 1.0)) {
			console.error('The opacity variable must fall within the range of 0.0 – 1.0');

			return;
		}
	} else {
		console.error('The opacity variable must be a number');

		return;
	}

	if (null !== hex.match(patternForHex)) {
		for (index = 1; index < HEX_LENGTH; index += 1) {
			currentNumberInNibble = hex.substring(index, index + 1);

			switch (currentNumberInNibble) {
				case 'a':
				case 'A':
					currentNumberInNibble = 10;

					break;

				case 'b':
				case 'B':
					currentNumberInNibble = 11;

					break;

				case 'c':
				case 'C':
					currentNumberInNibble = 12;

					break;

				case 'd':
				case 'D':
					currentNumberInNibble = 13;

					break;

				case 'e':
				case 'E':
					currentNumberInNibble = 14;

					break;

				case 'f':
				case 'F':
					currentNumberInNibble = 15;

					break;
			}

            //
            // For every second digit, meaning we’re at the end of a nibble…
            //
			if (0 === (index % 2)) {

                //
                // Perform the math to convert from hex to decimal…
                //
				calculateNibble = (
					Math.pow(HEX, 1) * previousNumberInNibble +
					Math.pow(HEX, 0) * currentNumberInNibble
				);

                //
                // Append the result to the running calculation of the string…
                //
				rgba = rgba + calculateNibble;

                //
                // And, if we’re not at the end of the hex string, append a comma and
                // a space.
                //
				if (0 !== (index % (END_OF_HEX + 2))) {
					rgba = rgba + ', ';
				}
            }

            //
            // Keep track of the previous nibble in order to carry out the conversion
            // in the beginning of the if statement.
            //
			previousNumberInNibble = currentNumberInNibble;
		}

        //
        // We’ve arrived at the end of the conversion, so append the opacity and the
        // closing of the string.
        //
		rgba = rgba + opacity + ')';
	} else {
		return -1;
	}

	return rgba;
}

/**
 * Remove the grid, which is comprised of a style sheet, the grid node, and the info
 * side bar, from the page, if either exists.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function removeGrid() {
    let _gridStyleSheet = document.getElementById('modular-grid-css'),
        _modularGridContainer = document.getElementById('modular-grid--container');

    if (null !== _gridStyleSheet) {
        _gridStyleSheet.parentNode.removeChild(_gridStyleSheet);
    }

    if (null !== _modularGridContainer) {
        _modularGridContainer.parentNode.removeChild(_modularGridContainer);
    }
}

/**
 * Paints the grid by injecting three nodes into the DOM: modularGrid__Container,
 * styleSheet, and infoSidebar__Container.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function paintGrid() {
    chrome.storage.sync.get(
        null,
        function (settings) {
            if (settings.gridIsEnabled) {
                removeGrid();

                if (settings.eventListenersEnabled) {
                    chrome.storage.sync.set({eventListenersEnabled: !settings.eventListenersEnabled});
                }

                let html = document.querySelector('html'),
                    head = document.querySelector('head'),
                    body = document.querySelector('body'),

                    settings__ColumnWidth = parseFloat(settings.gridColumnWidth),
                    settings__ColumnCount = parseInt(settings.gridColumnCount, 10),
                    settings__ColumnColor = settings.gridColumnColor,
                    settings__GutterWidth = parseFloat(settings.gridGutterWidth),
                    settings__BaselineColor = settings.gridBaselineColor,
                    settings__BaselineDistance = settings.gridBaselineDistance,
                    settings__ColumnColorOpacity = settings.gridColumnColorOpacity,
                    settings__LeftMargin = parseFloat(settings.gridMargin),
                    settings__CurrentGrid = settings.currentGrid,

                    viewportWidth = html.clientWidth,
                    firstChildOfBody = body.firstElementChild,

                    pageHeight = (undefined !== document.height)
                        ? document.height
                        : Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),

                    gridUnit = (settings__ColumnWidth + settings__GutterWidth),
                    widthOfAllGridUnits = settings__ColumnCount * gridUnit,
                    gridColumnColor = convertHexToRGBA(settings__ColumnColor, settings__ColumnColorOpacity),

                    styleSheet = document.createElement('link'),

                    modularGrid__Container = document.createElement('div'),
                    modularGrid = document.createElement('div'),

                    modularGrid__ZIndex;

                if (viewportWidth < widthOfAllGridUnits) {
                    settings__ColumnCount = Math.floor(viewportWidth / (settings__ColumnWidth + settings__GutterWidth));
                }

                styleSheet.href = chrome.runtime.getURL('content.css');
                styleSheet.rel = 'stylesheet';
                styleSheet.id = 'modular-grid-css';

                modularGrid.id = 'modular-grid';
                modularGrid.className = settings__CurrentGrid;

                modularGrid__Container.id = 'modular-grid--container';
                modularGrid__Container.appendChild(modularGrid);

                modularGrid__ZIndex = getLargestZIndexOfElementsIn(body);

                if (null !== modularGrid__ZIndex) {
                    modularGrid__Container.setAttribute('style', 'display: block !important; z-index: ' + modularGrid__ZIndex);
                    modularGrid.style.zIndex = modularGrid__ZIndex;
                } else {
                    modularGrid__Container.style.zIndex = 'auto';
                    modularGrid.style.zIndex = 'auto';
                }

                head.appendChild(styleSheet);
                body.insertBefore(modularGrid__Container, firstChildOfBody);

                switch (settings__CurrentGrid) {
                case 'modular-grid':
                    modularGrid.className = 'modular-grid';

                    modularGrid.setAttribute(
                        'style',
                        'display: block !important; ' +
                                'height: ' + pageHeight + 'px !important; ' +
                                'background-image: linear-gradient(90deg, ' + gridColumnColor + ' ' + settings__ColumnWidth + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' + settings__BaselineColor + ' 100%) !important; ' +
                                'background-size: ' + gridUnit + 'px 100%, 100% ' + settings__BaselineDistance + 'px !important; ' +
                                'background-position: ' + settings__LeftMargin + 'px 0 !important; ' +
                                'width: auto !important; ' +
                                'max-width: ' + widthOfAllGridUnits + 'px !important;'
                    );

                    break;

                case 'column-grid':
                    modularGrid.className = 'column-grid';

                    modularGrid.setAttribute(
                        'style',
                        'display: block !important; ' +
                                'height: ' + pageHeight + 'px !important; ' +
                                'background-image: linear-gradient(90deg, ' + gridColumnColor + ' ' + settings__ColumnWidth + 'px, transparent 0) !important; ' +
                                'background-size: ' + gridUnit + 'px 100% !important; ' +
                                'background-position: ' + settings__LeftMargin + 'px 0 !important; ' +
                                'width: auto !important; ' +
                                'max-width: ' + widthOfAllGridUnits + 'px !important;'
                    );

                    break;

                case 'baseline-grid':
                    modularGrid.className = 'baseline-grid';

                    modularGrid.setAttribute(
                        'style',
                        'display: block !important; ' +
                                'height: ' + pageHeight + 'px !important; ' +
                                'background-image: linear-gradient(0deg, transparent 95%, ' + settings__BaselineColor + ' 100%) !important; ' +
                                'background-size: 100% ' + settings__BaselineDistance + 'px !important; ' +
                                'width: auto !important; ' +
                                'max-width: ' + widthOfAllGridUnits + 'px !important;'
                    );

                    break;
                }
            } else {
                if (!settings.eventListenersEnabled) {
					document.onkeydown = null;
					window.onresize = null;
                    chrome.storage.sync.set({eventListenersEnabled: !settings.eventListenersEnabled});
                }

                removeGrid();
            }
        }
    );
}

chrome.storage.sync.get(
    null,
    function (settings) {
        if (settings.gridIsEnabled) {
            paintGrid();
            chrome.storage.sync.set({eventListenersEnabled: true});
        } else {
			document.onkeydown = null;
			window.onresize = null;
            chrome.storage.sync.set({eventListenersEnabled: false});
        }
    }
);

chrome.storage.onChanged.addListener(paintGrid);
