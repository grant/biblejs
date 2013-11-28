/**
 * BibleJS
 *
 * Get, search, filter the bible (with fuzzy searching)
 * Bible results are wrapped in a class with helper methods
 *
 * @author Grant Timmerman
 * @copyright M.I.T
 * @example
 *
 * Bible()
 * console.log(Bible('Genesis 1:1'));
 * console.log(Bible('Genesis 1'));
 * console.log(Bible('Genesis 1')());
 * console.log(Bible('Genesis 1').get());
 * console.log(Bible.getBibleObject());
 * console.log(Bible.find('God'));
 * console.log(Bible.find('God', 20));
 * console.log(Bible.get());
 * console.log(Bible.get(1));
 * console.log(Bible.get('Genesis 1:1'));
 * console.log(Bible.get('Genesis').get(1).get(1));
 * console.log(Bible.get('Genesis').get('1:1'));
 */
(function() {
	var BIBLE_URL = '/src/bible.json';
	if (!window.Bible) {

		//
		// Private fields
		//

		// The level of the bible part
		var LEVEL = {
			BIBLE: 'BIBLE',
			BOOK: 'BOOK',
			CHAPTER: 'CHAPTER',
			VERSE: 'VERSE'
		};

		var bibleObject; // BiblePart

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
				} else {
					return bibleObject.get(param);
				}
			}
		};

		/**
		 * Loads the bible json
		 * @param {Function} callback The function to call after the bible loads
		 */
		Bible.load = function (callback) {
			$.getJSON(BIBLE_URL, function (bible) {
				bibleObject = new BiblePart(bible, LEVEL.BIBLE);
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

		Bible.find = function (query) {

		}

		/**
		 * Gets a part of the bible
		 * @param {String} query The query to get
		 * @returns {Object} The result from the query
		 */
		Bible.get = function (query) {
			if (!query) {
				return Bible.getBibleObject();
			} else {
				return bibleObject.get(query);
			}
		}

		//
		// Private Methods
		//

		function stringHasNumbers (string) {
			if (!string || typeof string !== 'string') {
				return false;
			}

			var has = false;
			for (var i = 0; i < string.length; ++i) {
				var charCode = string.charAt(i).charCodeAt(0);
				if (charCode >= 48 && charCode < 58) {
					return true;
				}
			}
			return has;
		}

		// Errors

		function throwBibleNotLoadedError () {
			throw Error('Bible not loaded');
		}

		//
		// Public Methods (BiblePart)
		//

		/**
		 * A part of the bible
		 * @param {Object} part The part that this references
		 * @param {LEVEL} level The scope that this object entails
		 * @returns {BiblePart}
		 */
		var BiblePart = function(part, level) {
			this.part = part;
			this.level = level;

			/**
			 * Gets the result from a query
			 * @param {string} query The raw query
			 * @returns {BiblePart} The resulting bible part
			 */
			this.getResult = function (query) {
				var newPart;
				var newLevel = getLowerLevel(this.level);
				if (stringHasNumbers(query)) {
					query = query.trim();
					var stringParts = query.split(' ');
					var lastPart = stringParts[stringParts.length - 1];
					var colonSplit = lastPart.split(':');

					var book = query.substring(0, query.length - lastPart.length - 1).toUpperCase();
					var chapter = colonSplit[0].toUpperCase();
					var verse;
					if (colonSplit.length > 1) {
						verse = colonSplit[1].toUpperCase();
					}

					console.log(book);
					console.log(chapter);
					console.log(verse);

					// Handle the 3 cases
					if (!!book && !!chapter && !!verse) {
						newPart = this.part[book][chapter][verse];
						newLevel = getLowerLevel(newLevel);
						newLevel = getLowerLevel(newLevel);
					} else if (!!book && !!chapter) {
						newPart = this.part[book][chapter];
						newLevel = getLowerLevel(newLevel);
					} else if (!!chapter && !!verse) {
						newPart = this.part[chapter][verse];
						newLevel = getLowerLevel(newLevel);
					}
				} else {
					var key;
					if (typeof query !== 'number') { // Clean up string if not a number
						key = query.trim().toUpperCase();
					}
					newPart = this.part[key];
				}
				return new BiblePart(newPart, newLevel);
			};
		};

		BiblePart.prototype = {
			get: function(param) {
				if (!param) {
					return this.part;
				} else {
					return this.getResult(param);
				}
			},
			list: function() {
				return Object.keys(this.part);
			},
			length: function() {
				return Object.keys(this.part).length;
			}
		};

		//
		// Private Methods (BiblePart)
		//

		/**
		 * Gets the next lower level
		 * @param {LEVEL} level The current level
		 * @returns {LEVEL} The next lower level
		 */
		function getLowerLevel (level) {
			switch (level) {
				case LEVEL.BIBLE: return LEVEL.BOOK;
				case LEVEL.BOOK: return LEVEL.CHAPTER;
				case LEVEL.CHAPTER: return LEVEL.VERSE;
				default: return undefined;
			}
		}

		/**
		 * Gets the next higher level
		 * @param {LEVEL} level The current level
		 * @returns {LEVEL} The next higher level
		 */
		function getHigherLevel (level) {
			switch (level) {
				case LEVEL.BOOK: return LEVEL.BIBLE;
				case LEVEL.CHAPTER: return LEVEL.BOOK;
				case LEVEL.VERSE: return LEVEL.CHAPTER;
				default: return undefined;
			}
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
// Bible(run);

Bible(function() {
	run();
});