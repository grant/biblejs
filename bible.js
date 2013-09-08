/**
 * BibleJS
 *
 * Get, search, filter the bible
 *
 * @author Grant Timmerman
 * @copyright M.I.T
 * @example
 *
 * Bible()
 * console.log(Bible('Genesis 1:1'));
 * console.log(Bible('Genesis 1'));
 * console.log(Bible.getBibleObject());
 * console.log(Bible.find('God'));
 * console.log(Bible.find('God', 20));
 * console.log(Bible.get(1));
 * console.log(Bible.get('Genesis').get(1).get(1));
 * console.log(Bible.get('Genesis').get('1:1'));
 */
(function() {
	var BIBLE_URL = 'bible.json';
	if (!window.Bible) {
		var bibleObject;

		//
		// Public Methods
		//

		/**
		 * 2 Functions:
		 * - Shorthand for loading the bible (if not loaded)
		 * - Queries the bible
		 * @param {Mixed} param The callback function or the query
		 * @returns {Mixed} The result of the query
		 */
		var Bible = function (param) {
			// Load bible
			if (!param || typeof param === 'function') {
				Bible.isLoaded() || Bible.load(param);
			} else { // Query bible
				if (!Bible.isLoaded()) {
					throwBibleNotLoadedError();
				}

				return getQueryResult(param);
			}
		};

		/**
		 * Loads the bible json
		 * @param {Function} callback The function to call after the bible loads
		 */
		Bible.load = function (callback) {
			$.getJSON(BIBLE_URL, function (bible) {
				bibleObject = bible;
				if (typeof callback === 'function') {
					callback();
				}
			}, function (error) {
				console.log(error);
			});
		};

		/**
		 * Gets if the bible is loaded
		 * @returns {Boolean} If the bible is loaded
		 */
		Bible.isLoaded = function () {
			return !!bibleObject;
		};

		/**
		 * Gets the raw bible javascript object
		 * @returns {Object} The bible object
		 */
		Bible.getBibleObject = function () {
			if (Bible.isLoaded()) {
				return bibleObject;
			} else {
				throwBibleNotLoadedError();
			}
		}

		//
		// Private Methods
		//

		function getQueryResult (query) {
			console.log(query);
			console.log(bibleObject);
		}

		// Errors

		function throwBibleNotLoadedError () {
			throw Error('Bible not loaded');
		}

		// Expose Bible
		window.Bible = Bible;
	}
})();
function run() {
	console.log("console.log(Bible('Genesis 1:1'))");
	console.log(Bible('Genesis 1:1'));
	console.log("console.log(Bible('Genesis 1'))");
	console.log(Bible('Genesis 1'));
	console.log("console.log(Bible.getBibleObject())");
	console.log(Bible.getBibleObject());
	console.log("console.log(Bible.find('God'))");
	console.log(Bible.find('God'));
	console.log("console.log(Bible.find('God', 20))");
	console.log(Bible.find('God', 20));
	console.log("console.log(Bible.get(1))");
	console.log(Bible.get(1));
	console.log("console.log(Bible.get('Genesis').get(1).get(1))");
	console.log(Bible.get('Genesis').get(1).get(1));
	console.log("console.log(Bible.get('Genesis').get('1:1'))");
	console.log(Bible.get('Genesis').get('1:1'));
}
Bible(run);