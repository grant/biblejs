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

		// Book order is scraped off of the bible json
		var BOOK_ORDER = ["GENESIS", "EXODUS", "LEVITICUS", "NUMBERS", "DEUTERONOMY", "THE BOOK OF JOSHUA", "THE BOOK OF JUDGES", "THE BOOK OF RUTH", "THE FIRST BOOK OF THE KINGS", "THE SECOND BOOK OF THE KINGS", "THE THIRD BOOK OF THE KINGS", "THE FOURTH BOOK OF THE KINGS", "THE FIRST BOOK OF THE CHRONICLES", "THE SECOND BOOK OF THE CHRONICLES", "EZRA", "THE BOOK OF NEHEMIAH", "THE BOOK OF ESTHER", "THE BOOK OF JOB", "THE BOOK OF PSALMS", "THE PROVERBS", "ECCLESIASTES", "THE SONG OF SOLOMON", "THE BOOK OF THE PROPHET ISAIAH", "THE BOOK OF THE PROPHET JEREMIAH", "THE LAMENTATIONS OF JEREMIAH", "THE BOOK OF THE PROPHET EZEKIEL", "THE BOOK OF DANIEL", "HOSEA", "JOEL", "AMOS", "OBADIAH", "JONAH", "MICAH", "NAHUM", "HABAKKUK", "ZEPHANIAH", "HAGGAI", "ZECHARIAH", "MALACHI", "THE GOSPEL ACCORDING TO SAINT MATTHEW", "THE GOSPEL ACCORDING TO SAINT MARK", "THE GOSPEL ACCORDING TO SAINT LUKE", "THE GOSPEL ACCORDING TO SAINT JOHN", "THE ACTS OF THE APOSTLES", "THE EPISTLE OF PAUL THE APOSTLE TO THE ROMANS", "THE FIRST EPISTLE OF PAUL THE APOSTLE TO THE CORINTHIANS", "THE SECOND EPISTLE OF PAUL THE APOSTLE TO THE CORINTHIANS", "THE EPISTLE OF PAUL THE APOSTLE TO THE GALATIANS", "THE EPISTLE OF PAUL THE APOSTLE TO THE EPHESIANS", "THE EPISTLE OF PAUL THE APOSTLE TO THE PHILIPPIANS", "THE EPISTLE OF PAUL THE APOSTLE TO THE COLOSSIANS", "THE FIRST EPISTLE OF PAUL THE APOSTLE TO THE THESSALONIANS", "THE SECOND EPISTLE OF PAUL THE APOSTLE TO THE THESSALONIANS", "THE FIRST EPISTLE OF PAUL THE APOSTLE TO TIMOTHY", "THE SECOND EPISTLE OF PAUL THE APOSTLE TO TIMOTHY", "THE EPISTLE OF PAUL TO TITUS", "THE EPISTLE OF PAUL TO PHILEMON", "THE EPISTLE OF PAUL THE APOSTLE TO THE HEBREWS", "THE GENERAL EPISTLE OF JAMES", "THE FIRST EPISTLE GENERAL OF PETER", "THE SECOND EPISTLE GENERAL OF PETER", "THE FIRST GENERAL EPISTLE OF JOHN", "THE SECOND EPISTLE OF JOHN", "THE THIRD EPISTLE OF JOHN", "THE GENERAL EPISTLE OF JUDE", "THE REVELATION OF SAINT JOHN THE DIVINE"];

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

		};

		/**
		 * Gets a part of the bible
		 * @param {String} query The query to get
		 * @returns {Object} The result from the query
		 */
		Bible.get = function (query) {
			return bibleObject.get(query);
		};

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
				} else {// String doesn't have string numbers
					var key;
					if (typeof query !== 'number') { // Clean up string if not a number
						key = query.trim().toUpperCase();
					} else { // query is a number
						if (this.level === LEVEL.BIBLE) { // Get the right number book of the bible
							key = BOOK_ORDER[query - 1];
						} else { // handle the number like a normal key
							key = query + '';
						}
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