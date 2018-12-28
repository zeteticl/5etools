"use strict";
class NavBar {
	static init () {
		// render the visible elements ASAP
		window.addEventListener(
			"DOMContentLoaded",
			function () {
				NavBar.initElements();
				NavBar.highlightCurrentPage();
			}
		);
		window.addEventListener("load", NavBar.initHandlers);
	}

	static initElements () {
		const navBar = document.getElementById("navbar");

		addLi(navBar, "5etools.html", "首頁");

		const ulRules = addDropdown(navBar, "規則");
		addLi(ulRules, "quickreference.html", "快速參照");
		addLi(ulRules, "variantrules.html", "變體&選用規則");
		addLi(ulRules, "tables.html", "表格");
		addDivider(ulRules);
		addLi(ulRules, "book.html", "地下城主指南", false, "DMG");
		addLi(ulRules, "book.html", "怪物圖鑑", false, "MM");
		addLi(ulRules, "book.html", "玩家手冊", false, "PHB");
		addDivider(ulRules);
		addLi(ulRules, "book.html", "拉尼卡的公會長指南", false, "GGR");
		addLi(ulRules, "book.html", "魔鄧肯的眾敵卷冊", false, "MTF");
		addLi(ulRules, "book.html", "劍灣冒險指南", false, "SCAG");
		addLi(ulRules, "book.html", "瓦羅的怪物指南", false, "VGM");
		addLi(ulRules, "book.html", "姍納薩的萬事指南", false, "XGE");
		addDivider(ulRules);
		addLi(ulRules, "book.html", "冒險者聯盟", false, "AL");
		addDivider(ulRules);
		addLi(ulRules, "books.html", "查看所有/自製內容");

		const ulPlayers = addDropdown(navBar, "玩家選項");
		addLi(ulPlayers, "classes.html", "職業");
		addLi(ulPlayers, "optionalfeatures.html", "職業能力選項");
		addLi(ulPlayers, "backgrounds.html", "背景");
		addLi(ulPlayers, "feats.html", "專長");
		addLi(ulPlayers, "races.html", "種族");
		addLi(ulPlayers, "lifegen.html", "這是你的人生");
		addLi(ulPlayers, "names.html", "名稱");

		const ulDms = addDropdown(navBar, "DM工具");
		addLi(ulDms, "dmscreen.html", "DM屏幕");
		addDivider(ulDms);
		const ulAdventures = addDropdown(ulDms, "冒險模組", true);
		addLi(ulAdventures, "adventures.html", "查看所有/自製內容");
		addDivider(ulAdventures);
		addLi(ulAdventures, "adventure.html", "Lost Mines of Phandelver", true, "LMoP");
		addLi(ulAdventures, "adventure.html", "Hoard of the Dragon Queen", true, "HotDQ");
		addLi(ulAdventures, "adventure.html", "Rise of Tiamat", true, "RoT");
		addLi(ulAdventures, "adventure.html", "Lost Mines of Phandelver", true, "LMoP");
		addLi(ulAdventures, "adventure.html", "Hoard of the Dragon Queen", true, "HotDQ");
		addLi(ulAdventures, "adventure.html", "Rise of Tiamat", true, "RoT");
		addLi(ulAdventures, "adventure.html", "Princes of the Apocalypse", true, "PotA");
		addLi(ulAdventures, "adventure.html", "Out of the Abyss", true, "OotA");
		addLi(ulAdventures, "adventure.html", "Curse of Strahd", true, "CoS");
		addLi(ulAdventures, "adventure.html", "Storm King's Thunder", true, "SKT");
		addLi(ulAdventures, "adventure.html", "Tales from the Yawning Portal: The Sunless Citadel", true, "TftYP-TSC");
		addLi(ulAdventures, "adventure.html", "Tales from the Yawning Portal: The Forge of Fury", true, "TftYP-TFoF");
		addLi(ulAdventures, "adventure.html", "Tales from the Yawning Portal: The Hidden Shrine of Tamoachan", true, "TftYP-THSoT");
		addLi(ulAdventures, "adventure.html", "Tales from the Yawning Portal: White Plume Mountain", true, "TftYP-WPM");
		addLi(ulAdventures, "adventure.html", "Tales from the Yawning Portal: Dead in Thay", true, "TftYP-DiT");
		addLi(ulAdventures, "adventure.html", "Tales from the Yawning Portal: Against the Giants", true, "TftYP-AtG");
		addLi(ulAdventures, "adventure.html", "Tales from the Yawning Portal: Tomb of Horrors", true, "TftYP-ToH");
		addLi(ulAdventures, "adventure.html", "Tomb of Annihilation", true, "ToA");
		addLi(ulAdventures, "adventure.html", "The Tortle Package", true, "TTP");
		addLi(ulAdventures, "adventure.html", "Waterdeep: Dragon Heist", true, "WDH");
		addLi(ulAdventures, "adventure.html", "Lost Laboratory of Kwalish", true, "LLK");
		addLi(ulAdventures, "adventure.html", "Waterdeep: Dungeon of the Mad Mage", true, "WDMM");
		addLi(ulAdventures, "adventure.html", "Krenko's Way", true, "KKW");
		addLi(ulDms, "crcalculator.html", "CR計算機");
		addLi(ulDms, "cultsboons.html", "異教&惡魔恩惠");
		addLi(ulDms, "encountergen.html", "遭遇生成器");
		addLi(ulDms, "lootgen.html", "戰利品生成器");
		addLi(ulDms, "objects.html", "物件");
		addLi(ulDms, "ships.html", "船隻");
		addLi(ulDms, "trapshazards.html", "陷阱&危險");

		const ulReferences = addDropdown(navBar, "參照資料");
		addLi(ulReferences, "bestiary.html", "怪物圖鑑");
		addLi(ulReferences, "conditionsdiseases.html", "狀態 & 疾病");
		addLi(ulReferences, "deities.html", "神祇");
		addLi(ulReferences, "items.html", "物品");
		addLi(ulReferences, "rewards.html", "其他獎勵");
		addLi(ulReferences, "psionics.html", "靈能");
		addLi(ulReferences, "spells.html", "法術");

		addLi(navBar, "statgen.html", "屬性生成器");

		const ulUtils = addDropdown(navBar, "其他功能");
		addLi(ulUtils, "blacklist.html", "內容黑名單");
		addLi(ulUtils, "managebrew.html", "管理所有自製內容");
		addDivider(ulUtils);
		addLi(ulUtils, "demo.html", "渲染器 Demo");
		addLi(ulUtils, "converter.html", "文字轉換器");
		addDivider(ulUtils);
		addLi(ulUtils, "roll20.html", "Roll20腳本小幫手");
		addLi(ulUtils, "makeshaped.html", "Roll20 Shaped Sheet JS Builder");
		addDivider(ulUtils);
		addLi(ulUtils, "donate.html", "捐獻");

		addNightModeToggle(navBar);

		/**
		 * Adds a new item to the navigation bar. Can be used either in root, or in a different UL.
		 * @param appendTo - Element to append this link to.
		 * @param aHref - Where does this link to.
		 * @param aText - What text does this link have.
		 * @param [isSide] - True if this item
		 * @param [aHash] - Optional hash to be appended to the base href
		 */
		function addLi (appendTo, aHref, aText, isSide, aHash) {
			const hashPart = aHash ? `#${aHash}`.toLowerCase() : "";

			const li = document.createElement("li");
			li.setAttribute("role", "presentation");
			li.setAttribute("id", aText.toLowerCase().replace(/\s+/g, ""));
			li.setAttribute("data-page", `${aHref}${hashPart}`);
			if (isSide) {
				li.onmouseenter = function () { NavBar.handleSideItemMouseEnter(this) }
			} else {
				li.onmouseenter = function () { NavBar.handleItemMouseEnter(this) }
			}

			const a = document.createElement("a");
			a.href = `${aHref}${hashPart}`;
			a.innerHTML = aText;

			li.appendChild(a);
			appendTo.appendChild(li);
		}

		function addDivider (appendTo) {
			const li = document.createElement("li");
			li.setAttribute("role", "presentation");
			li.className = "divider";

			appendTo.appendChild(li);
		}

		/**
		 * Adds a new dropdown starting list to the navigation bar
		 * @param {String} appendTo - Element to append this link to.
		 * @param {String} text - Dropdown text.
		 * @param {boolean} [isSide=false] - If this is a sideways dropdown.
		 */
		function addDropdown (appendTo, text, isSide = false) {
			const li = document.createElement("li");
			li.setAttribute("role", "presentation");
			li.className = "dropdown";
			if (isSide) {
				li.onmouseenter = function () { NavBar.handleSideItemMouseEnter(this); };
			} else {
				li.onmouseenter = function () { NavBar.handleItemMouseEnter(this); };
			}

			const a = document.createElement("a");
			a.className = "dropdown-toggle";
			a.href = "#";
			a.setAttribute("role", "button");
			a.onclick = function (event) { NavBar.handleDropdownClick(this, event, isSide); };
			if (isSide) {
				a.onmouseenter = function () { NavBar.handleSideDropdownMouseEnter(this); };
				a.onmouseleave = function () { NavBar.handleSideDropdownMouseLeave(this); };
			}
			a.innerHTML = `${text} <span class="caret ${isSide ? "caret--right" : ""}"></span>`;

			const ul = document.createElement("li");
			ul.className = `dropdown-menu ${isSide ? "dropdown-menu--side" : ""}`;
			ul.onclick = function (event) { event.stopPropagation(); };

			li.appendChild(a);
			li.appendChild(ul);
			appendTo.appendChild(li);
			return ul;
		}

		/**
		 * Special LI for the Day/Night Switcher
		 */
		function addNightModeToggle (appendTo) {
			const li = document.createElement("li");
			li.setAttribute("role", "presentation");

			const a = document.createElement("a");
			a.href = "#";
			a.className = "nightModeToggle";
			a.onclick = function (event) { event.preventDefault(); styleSwitcher.toggleActiveStyleSheet(); };
			a.innerHTML = styleSwitcher.getActiveStyleSheet() === StyleSwitcher.STYLE_DAY ? "夜晚模式" : "白晝模式";

			li.appendChild(a);
			appendTo.appendChild(li);
		}
	}

	static highlightCurrentPage () {
		let currentPage = window.location.pathname;
		currentPage = currentPage.substr(currentPage.lastIndexOf("/") + 1);

		if (!currentPage) currentPage = "5etools.html";

		let isSecondLevel = false;
		if (currentPage.toLowerCase() === "book.html" || currentPage.toLowerCase() === "adventure.html") {
			const hashPart = window.location.hash.split(",")[0];
			if (hashPart) {
				if (currentPage.toLowerCase() === "adventure.html") isSecondLevel = true;
				currentPage += hashPart.toLowerCase();
			}
		}
		if (currentPage.toLowerCase() === "adventures.html") isSecondLevel = true;

		try {
			let current = document.querySelector(`li[data-page="${currentPage}"]`);
			if (current == null && currentPage.includes("#")) {
				currentPage = currentPage.split("#")[0];
				if (NavBar.ALT_CHILD_PAGES[currentPage]) currentPage = NavBar.ALT_CHILD_PAGES[currentPage];
				current = document.querySelector(`li[data-page="${currentPage}"]`);
			}
			current.parentNode.childNodes.forEach(n => n.classList && n.classList.remove("active"));
			current.classList.add("active");

			let closestLi = current.parentNode;
			const setNearestParentActive = () => {
				while (closestLi !== null && closestLi.nodeName !== "LI") closestLi = closestLi.parentNode;
				closestLi && closestLi.classList.add("active");
			};
			setNearestParentActive();
			if (isSecondLevel) {
				closestLi = closestLi.parentNode;
				setNearestParentActive();
			}
		} catch (ignored) { setTimeout(() => { throw ignored }); }
	}

	static initHandlers () {
		NavBar._dropdowns = [...document.getElementById("navbar").querySelectorAll(`li.dropdown`)];
		document.addEventListener("click", () => NavBar._dropdowns.forEach(ele => ele.classList.remove("open")));
		document.addEventListener("mousemove", evt => {
			NavBar._mouseX = evt.clientX;
			NavBar._mouseY = evt.clientY;
		});

		NavBar._clearAllTimers();
	}

	static handleDropdownClick (ele, event, isSide) {
		event.preventDefault();
		event.stopPropagation();
		if (isSide) return;
		NavBar._openDropdown(ele);
	}

	static _openDropdown (fromLink) {
		const noRemove = new Set();
		let parent = fromLink.parentNode;
		parent.classList.add("open");
		noRemove.add(parent);

		while (parent.nodeName !== "NAV") {
			parent = parent.parentNode;
			if (parent.nodeName === "LI") {
				parent.classList.add("open");
				noRemove.add(parent);
			}
		}

		NavBar._dropdowns.filter(ele => !noRemove.has(ele)).forEach(ele => ele.classList.remove("open"));
	}

	static handleItemMouseEnter (ele) {
		const $ele = $(ele);
		const timerIds = $ele.siblings("[data-timer-id]").map((i, e) => ({$ele: $(e), timerId: $(e).data("timer-id")})).get();
		timerIds.forEach(({$ele, timerId}) => {
			if (NavBar._timersOpen[timerId]) {
				clearTimeout(NavBar._timersOpen[timerId]);
				delete NavBar._timersOpen[timerId];
			}

			if (!NavBar._timersClose[timerId] && $ele.hasClass("open")) {
				const getTimeoutFn = () => {
					if (NavBar._timerMousePos[timerId]) {
						const [xStart, yStart] = NavBar._timerMousePos[timerId];
						// for generalised use, this should be made check against the bounding box for the side menu
						// and possibly also check Y pos; e.g.
						// || NavBar._mouseY > yStart + NavBar.MIN_MOVE_PX
						if (NavBar._mouseX > xStart + NavBar.MIN_MOVE_PX) {
							NavBar._timerMousePos[timerId] = [NavBar._mouseX, NavBar._mouseY];
							NavBar._timersClose[timerId] = setTimeout(() => getTimeoutFn(), NavBar.DROP_TIME / 2);
						} else {
							$ele.removeClass("open");
							delete NavBar._timersClose[timerId];
						}
					} else {
						$ele.removeClass("open");
						delete NavBar._timersClose[timerId];
					}
				};

				NavBar._timersClose[timerId] = setTimeout(() => getTimeoutFn(), NavBar.DROP_TIME);
			}
		});
	}

	static handleSideItemMouseEnter (ele) {
		const timerId = $(ele).closest(`li.dropdown`).data("timer-id");
		if (NavBar._timersClose[timerId]) {
			clearTimeout(NavBar._timersClose[timerId]);
			delete NavBar._timersClose[timerId];
			delete NavBar._timerMousePos[timerId];
		}
	}

	static handleSideDropdownMouseEnter (ele) {
		const $ele = $(ele);
		const timerId = $ele.parent().data("timer-id") || NavBar._timerId++;
		$ele.parent().attr("data-timer-id", timerId);

		if (NavBar._timersClose[timerId]) {
			clearTimeout(NavBar._timersClose[timerId]);
			delete NavBar._timersClose[timerId];
		}

		if (!NavBar._timersOpen[timerId]) {
			NavBar._timersOpen[timerId] = setTimeout(() => {
				NavBar._openDropdown(ele);
				delete NavBar._timersOpen[timerId];
				NavBar._timerMousePos[timerId] = [NavBar._mouseX, NavBar._mouseY];
			}, NavBar.DROP_TIME);
		}
	}

	static handleSideDropdownMouseLeave (ele) {
		const $ele = $(ele);
		if (!$ele.parent().data("timer-id")) return;
		const timerId = $ele.parent().data("timer-id");
		clearTimeout(NavBar._timersOpen[timerId]);
		delete NavBar._timersOpen[timerId];
	}

	static _clearAllTimers () {
		Object.entries(NavBar._timersOpen).forEach(([k, v]) => {
			clearTimeout(v);
			delete NavBar._timersOpen[k];
		});
	}
}
NavBar.DROP_TIME = 250;
NavBar.MIN_MOVE_PX = 7;
NavBar.ALT_CHILD_PAGES = {
	"book.html": "books.html",
	"adventure.html": "adventures.html"
};
NavBar._timerId = 1;
NavBar._timersOpen = {};
NavBar._timersClose = {};
NavBar._timerMousePos = {};
NavBar._mouseX = null;
NavBar._mouseY = null;
NavBar.init();
