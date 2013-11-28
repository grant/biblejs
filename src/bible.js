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
					return getQueryResult(param);
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

		/**
		 * Gets the result from a generic query
		 * @param {[type]} query [description]
		 * @returns {[type]} [description]
		 */
		function getQueryResult (query) {
			if (hasNumbers(query)) {
				//Get specific section
			} else {
				//Get generic book
			}
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
		};

		BiblePart.prototype = {
			get: function(param) {
				if (!param) {
					return this.part;
				} else {
					var query = param.toUpperCase();
					return new BiblePart(this.part[query], getLowerLevel(this.level));
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

});