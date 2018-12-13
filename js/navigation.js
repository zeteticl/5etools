"use strict";

window.addEventListener(
	"DOMContentLoaded",
	function () {
		navigation();
		currentPage();
	}, false
);

const CHILD_PAGES = {
	"adventure.html": "adventures.html"
};

const ALT_CHILD_PAGES = {
	"book.html": "books.html"
};

function currentPage () {
	let currentPage = window.location.pathname;
	currentPage = currentPage.substr(currentPage.lastIndexOf('/') + 1);

	if (!currentPage) currentPage = "5etools.html";
	if (CHILD_PAGES[currentPage]) currentPage = CHILD_PAGES[currentPage];

	if (currentPage.toLowerCase() === "book.html") {
		const hashPart = window.location.hash.split(",")[0];
		if (hashPart) {
			currentPage += hashPart.toLowerCase();
		}
	}

	try {
		let current = document.querySelector(`li[data-page="${currentPage}"]`);
		if (current == null && currentPage.includes("#")) {
			currentPage = currentPage.split("#")[0];
			if (ALT_CHILD_PAGES[currentPage]) currentPage = ALT_CHILD_PAGES[currentPage];
			current = document.querySelector(`li[data-page="${currentPage}"]`);
		}
		current.parentNode.childNodes.forEach(n => n.classList && n.classList.remove("active"));
		current.classList.add("active");
		let closestLi = current.parentNode;
		while (closestLi !== null && closestLi.nodeName !== "LI") closestLi = closestLi.parentNode;
		closestLi && closestLi.classList.add("active");
	} catch (ignored) {
		setTimeout(() => { throw ignored });
	}
}

function navigation () {
	LI('navbar', '5etools.html', '首頁');

	LIDropdown('navbar', 'rules', 'dropdown');
	A('rules', 'ruleOption', 'dropdown-toggle', 'dropdown', '#', 'button', 'true', 'false', "規則 <span class='caret'></span>");
	UL('rules', 'ul_rules', 'dropdown-menu');
	LI('ul_rules', 'quickreference.html', '快速參照');
	LI('ul_rules', 'variantrules.html', '變體&選用規則');
	LI('ul_rules', 'tables.html', '表格');
	LIDivider('ul_rules');
	LI('ul_rules', 'book.html', "地下城主指南", "DMG");
	LI('ul_rules', 'book.html', "怪物圖鑑", "MM");
	LI('ul_rules', 'book.html', "玩家手冊", "PHB");
	LIDivider('ul_rules');
	LI('ul_rules', 'book.html', "拉尼卡的公會長指南", "GGR");
	LI('ul_rules', 'book.html', "魔鄧肯的眾敵卷冊", "MTF");
	LI('ul_rules', 'book.html', "劍灣冒險指南", "SCAG");
	LI('ul_rules', 'book.html', "瓦羅的怪物指南", "VGM");
	LI('ul_rules', 'book.html', "姍納薩的萬事指南", "XGE");
	LIDivider('ul_rules');
	LI('ul_rules', 'book.html', "冒險者聯盟", "AL");
	LIDivider('ul_rules');
	LI('ul_rules', 'books.html', "查看所有/房規");

	LIDropdown('navbar', 'players', 'dropdown');
	A('players', 'playerOption', 'dropdown-toggle', 'dropdown', '#', 'button', 'true', 'false', "玩家選項 <span class='caret'></span>");
	UL('players', 'ul_players', 'dropdown-menu');
	LI('ul_players', 'classes.html', '職業');
	LI('ul_players', 'optionalfeatures.html', '職業能力選項');
	LI('ul_players', 'backgrounds.html', '背景');
	LI('ul_players', 'feats.html', '專長');
	LI('ul_players', 'races.html', '種族');
	LI('ul_players', 'lifegen.html', '這是你的人生');
	LI('ul_players', 'names.html', '名稱');

	LIDropdown('navbar', 'dms', 'dropdown');
	A('dms', 'dmOption', 'dropdown-toggle', 'dropdown', '#', 'button', 'true', 'false', "DM工具 <span class='caret'></span>");
	UL('dms', 'ul_dms', 'dropdown-menu');
	LI('ul_dms', 'adventures.html', '冒險模組');
	LI('ul_dms', 'crcalculator.html', 'CR計算機');
	LI('ul_dms', 'cultsboons.html', '邪教&惡魔恩惠');
	LI('ul_dms', 'dmscreen.html', 'DM屏幕');
	LI('ul_dms', 'encountergen.html', '遭遇生成器');
	LI('ul_dms', 'lootgen.html', '戰利品生成器');
	LI('ul_dms', 'objects.html', '物件');
	LI('ul_dms', 'ships.html', '船隻');
	LI('ul_dms', 'trapshazards.html', '陷阱&危險');

	LIDropdown('navbar', 'references', 'dropdown');
	A('references', 'references', 'dropdown-toggle', 'dropdown', '#', 'button', 'true', 'false', "參照資料 <span class='caret'></span>");
	UL('references', 'ul_references', 'dropdown-menu');
	LI('ul_references', 'bestiary.html', '怪物圖鑑');
	LI('ul_references', 'conditionsdiseases.html', '狀態 & 疾病');
	LI('ul_references', 'deities.html', '神祇');
	LI('ul_references', 'items.html', '物品');
	LI('ul_references', 'rewards.html', '其他獎賞');
	LI('ul_references', 'psionics.html', '靈能');
	LI('ul_references', 'spells.html', '法術');

	LI('navbar', 'statgen.html', '屬性生成器');

	LIDropdown('navbar', 'utils', 'dropdown');
	A('utils', 'utils', 'dropdown-toggle', 'dropdown', '#', 'button', 'true', 'false', "其他功能 <span class='caret'></span>");
	UL('utils', 'ul_utils', 'dropdown-menu');
	LI('ul_utils', 'blacklist.html', '內容黑名單');
	LI('ul_utils', 'managebrew.html', '管理所有房規');
	LIDivider('ul_utils');
	LI('ul_utils', 'demo.html', '渲染器 Demo');
	LI('ul_utils', 'converter.html', '文字轉換器');
	LIDivider('ul_utils');
	LI('ul_utils', 'roll20.html', 'Roll20 腳本小幫手');
	LI('ul_utils', 'makeshaped.html', 'Roll20 Shaped Sheet JS Builder');
	LIDivider('ul_utils');
	LI('ul_utils', 'donate.html', '捐獻');

	LISwitcher('navbar', 'daynightMode', 'nightModeToggle', '#', 'styleSwitcher.toggleActiveStyleSheet(); return false;');

	/**
	 * Adds a link for the LIDropdowns
	 * @param {String} append_to_id - Which ID does this link belong too .
	 * @param {String} _id - What ID should this link have.
	 * @param {String} _class - What class(es) should this link have.
	 * @param {String} _datatoggle - What type of datatoggle.
	 * @param {String} _href - Where does this link to.
	 * @param {String} _role - Specific role.
	 * @param {String} _ariahaspop - Aria has pop.
	 * @param {String} _ariaexpanded - Default state.
	 * @param {String} _text - Text of the link.
	 */
	function A (append_to_id, _id, _class, _datatoggle, _href, _role, _ariahaspop, _ariaexpanded, _text) {
		const a = document.createElement('a');
		a.id = _id;
		a.className = _class;
		a.setAttribute('data-toggle', _datatoggle);
		a.href = _href;
		a.setAttribute('role', _role);
		a.setAttribute('aria-haspopup', _ariahaspop);
		a.setAttribute('aria-expanded', _ariaexpanded);
		a.innerHTML = _text;

		const appendTo = document.getElementById(append_to_id);
		appendTo.appendChild(a);
	}

	/**
	 * Adds a new list to the navigation bar
	 * @param {String} append_to_id - Which ID does this link belong too .
	 * @param {String} ul_id - What ID should this UL have.
	 * @param {String} _class - What class(es) should this link have.
	 */
	function UL (append_to_id, ul_id, _class) {
		const ul = document.createElement('ul');
		ul.id = ul_id;
		ul.className = _class;

		const appendTo = document.getElementById(append_to_id);
		appendTo.appendChild(ul);
	}

	/**
	 * Adds a new item to the navigation bar. Can be used either in root, or in a different UL.
	 * @param append_to_id - Which ID does this link belong too .
	 * @param a_href - Where does this link to.
	 * @param a_text - What text does this link have.
	 * @param a_hash - Optional hash to be appended to the base href
	 */
	function LI (append_to_id, a_href, a_text, a_hash) {
		const hashPart = a_hash ? `#${a_hash}`.toLowerCase() : "";
		document.querySelector(`#${append_to_id}`).innerHTML += `
			<li role="presentation" id="${a_text.toLowerCase().replace(/\s+/g, '')}" data-page="${a_href}${hashPart}">
				<a href="${a_href}${hashPart}">${a_text}</a>
			</li>
		`;
	}

	function LIDivider (append_to_id) {
		document.querySelector(`#${append_to_id}`).innerHTML += `<li role="presentation" class="divider"></li>`;
	}

	/**
	 * Adds a new dropdown starting list to the navigation bar
	 * @param {String} append_to_id - Which ID does this link belong too .
	 * @param {String} li_id - What ID should this LI have.
	 * @param {String} _class - What class(es) should this LI have.
	 */
	function LIDropdown (append_to_id, li_id, _class) {
		const li = document.createElement('li');
		li.id = li_id;
		li.setAttribute('role', 'presentation');
		li.className = _class;

		const appendTo = document.getElementById(append_to_id);
		appendTo.appendChild(li);
	}

	/**
	 * Special LI for the Day/Night Switcher
	 * @param {String} append_to_id - Which ID does this link belong too .
	 * @param {String} li_id - What ID should this LI have.
	 * @param {String} a_class - What class(es) should this link have.
	 * @param {String} a_href - Where does this link to.
	 * @param {Function} a_onclick - What should the link do when you click on it.
	 */
	function LISwitcher (append_to_id, li_id, a_class, a_href, a_onclick) {
		const a = document.createElement('a');
		a.href = a_href;
		a.className = a_class;
		a.setAttribute('onclick', a_onclick);
		a.innerHTML = styleSwitcher.getActiveStyleSheet() === StyleSwitcher.STYLE_DAY ? "夜晚模式" : "白晝模式";

		const li = document.createElement('li');
		li.id = li_id;
		li.setAttribute('role', 'presentation');
		li.appendChild(a);

		const appendTo = document.getElementById(append_to_id);
		appendTo.appendChild(li);
	}
}
