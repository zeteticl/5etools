"use strict";
const JSON_URL = "data/races.json";
const JSON_FLUFF_URL = "data/fluff-races.json";

const ASI_SORT_POS = {
	Strength: 0,
	Dexterity: 1,
	Constitution: 2,
	Intelligence: 3,
	Wisdom: 4,
	Charisma: 5
};

window.onload = async function load () {
	await ExcludeUtil.pInitialise();
	SortUtil.initHandleFilterButtonClicks();
	DataUtil.loadJSON(JSON_URL).then(onJsonLoad);
};

function getAbilityObjs (abils) {
	function makeAbilObj (asi, amount) {
		return {
			asi: asi,
			amount: amount,
			_toIdString: () => {
				return `${asi}${amount}`
			}
		}
	}

	const out = new CollectionUtil.ObjectSet();
	if (abils.choose) {
		abils.choose.forEach(ch => {
			if (ch.predefined) {
				ch.predefined.forEach(pre => {
					Object.keys(pre).forEach(abil => out.add(makeAbilObj(abil, pre[abil])));
				});
			} else if (ch.weighted) {
				// add every ability + weight combo
				ch.weighted.from.forEach(f => {
					ch.weighted.weights.forEach(w => {
						out.add(makeAbilObj(f, w));
					});
				});
			} else {
				const by = ch.amount || 1;
				ch.from.forEach(asi => out.add(makeAbilObj(asi, by)));
			}
		});
	}
	Object.keys(abils).filter(abil => abil !== "choose").forEach(abil => out.add(makeAbilObj(abil, abils[abil])));
	return Array.from(out.values());
}

function mapAbilityObjToFull (abilObj) {
	return `${Parser.attAbvToFull(abilObj.asi)}${abilObj.amount < 0 ? "" : "+"}${abilObj.amount}`;
}

function getSpeedRating (speed) {
	return speed > 30 ? "Walk (Fast)" : speed < 30 ? "Walk (Slow)" : "Walk";
}

let list;
const sourceFilter = getSourceFilter();
const sizeFilter = new Filter({header: "Size", headerName: "體型", displayFn: Parser.sizeAbvToFull});
const asiFilter = new Filter({
	header: "Ability Bonus (Including Subrace)", headerName: "屬性加值 (包括亞種)",
	items: [
		"任意力量增加",
		"任意敏捷增加",
		"任意體質增加",
		"任意智力增加",
		"任意睿知增加",
		"任意魅力增加",
		"力量+2",
		"力量+1",
		"敏捷+2",
		"敏捷+1",
		"體質+2",
		"體質+1",
		"智力+2",
		"智力+1",
		"睿知+2",
		"睿知+1",
		"魅力+2",
		"魅力+1"
	]
});
let filterBox;
async function onJsonLoad (data) {
	list = ListUtil.search({
		valueNames: ['name', 'ability', 'size', 'source', 'clean-name', "uniqueid", "eng_name"],
		listClass: "races"
	});

	const jsonRaces = EntryRenderer.race.mergeSubraces(data.race);
	const speedFilter = new Filter({header: "Speed", headerName: "速度", items: ["Climb", "Fly", "Swim", "Walk (Fast)", "Walk", "Walk (Slow)"], displayFn: Parser.SpeedToDisplay});
	const traitFilter = new Filter({
		header: "Traits", headerName: "特性",
		items: [
			"Amphibious",
			"Armor Proficiency",
			"Damage Resistance",
			"Darkvision", "Superior Darkvision",
			"Dragonmark",
			"Improved Resting",
			"Monstrous Race",
			"Natural Armor",
			"NPC Race",
			"Powerful Build",
			"Skill Proficiency",
			"Spellcasting",
			"Tool Proficiency",
			"Unarmed Strike",
			"Weapon Proficiency"
		],
		displayFn: function(t){
			switch(t){
				case "NPC Race": 		return "NPC種族";
				case "Monstrous Race":	return "怪物種族";
				case "Armor Proficiency": 	return "護甲熟練";
				case "Skill Proficiency": 	return "技能熟練";
				case "Tool Proficiency": 	return "工具熟練";
				case "Weapon Proficiency": 	return "武器熟練";
				case "Darkvision": 			return "黑暗視覺";
				case "Superior Darkvision": return "高級黑暗視覺";
				case "Natural Armor": 		return "天生護甲";
				case "Damage Resistance": 	return "傷害抗性";
				case "Spellcasting": 		return "施法";
				case "Unarmed Strike": 		return "徒手打擊";
				case "Amphibious": 			return "兩棲";
				case "Powerful Build": 		return "強健體格";
				case "Dragonmark": 			return "龍紋";
				case "Improved Resting": 	return "修整強化";
				default: return t;
			}
		},
		deselFn: (it) => {
			return it === "NPC Race";
		}
	});
	const languageFilter = new Filter({
		header: "Languages", headerName: "語言",
		items: [
			"Abyssal",
			"Aquan",
			"Auran",
			"Celestial",
			"Choose",
			"Common",
			"Draconic",
			"Dwarvish",
			"Elvish",
			"Giant",
			"Gnomish",
			"Goblin",
			"Halfling",
			"Infernal",
			"Orc",
			"Other",
			"Primordial",
			"Sylvan",
			"Terran",
			"Undercommon"
		],
		displayFn: Parser.translateLangKeyToDisplay,
		umbrellaItems: ["Choose"]
	});

	filterBox = await pInitFilterBox(
		sourceFilter,
		asiFilter,
		sizeFilter,
		speedFilter,
		traitFilter,
		languageFilter
	);

	list.on("updated", () => {
		filterBox.setCount(list.visibleItems.length, list.items.length);
	});

	// filtering function
	$(filterBox).on(
		FilterBox.EVNT_VALCHANGE,
		handleFilterChange
	);

	const subList = ListUtil.initSublist({
		valueNames: ["name", "ability", "size", "id"],
		listClass: "subraces",
		getSublistRow: getSublistItem
	});
	ListUtil.initGenericPinnable();

	addRaces({race: jsonRaces});
	BrewUtil.pAddBrewData()
		.then(handleBrew)
		.then(BrewUtil.pAddLocalBrewData)
		.catch(BrewUtil.pPurgeBrew)
		.then(async () => {
			BrewUtil.makeBrewButton("manage-brew");
			BrewUtil.bind({list, filterBox, sourceFilter});
			await ListUtil.pLoadState();
			RollerUtil.addListRollButton();

			History.init(true);
			ExcludeUtil.checkShowAllExcluded(raceList, $(`#pagecontent`));
		});
}

function handleBrew (homebrew) {
	addRaces(homebrew);
	return Promise.resolve();
}

let raceList = [];
let rcI = 0;
function addRaces (data) {
	if (!data.race || !data.race.length) return;

	raceList = raceList.concat(data.race);

	const racesTable = $("ul.races");
	let tempString = "";
	for (; rcI < raceList.length; rcI++) {
		const race = raceList[rcI];
		if (ExcludeUtil.isExcluded(race.name, "race", race.source)) continue;

		const ability = race.ability ? utils_getAbilityData(race.ability) : {asTextShort: "無"};
		if (race.ability) {
			const abils = getAbilityObjs(race.ability);
			race._fAbility = abils.map(a => mapAbilityObjToFull(a));
			const increases = {};
			abils.filter(it => it.amount > 0).forEach(it => increases[it.asi] = true);
			Object.keys(increases).forEach(it => race._fAbility.push(`任意${Parser.attAbvToFull(it)}增加`));
		} else race._fAbility = [];
		race._fSpeed = race.speed.walk ? [race.speed.climb ? "Climb" : null, race.speed.fly ? "Fly" : null, race.speed.swim ? "Swim" : null, getSpeedRating(race.speed.walk)].filter(it => it) : getSpeedRating(race.speed);
		race._fMisc = [
			race.darkvision === 120 ? "Superior Darkvision" : race.darkvision ? "Darkvision" : null,
			race.hasSpellcasting ? "Spellcasting" : null
		].filter(it => it).concat(race.traitTags || []);
		race._fSources = ListUtil.getCompleteSources(race);

		race._slAbility = ability.asTextShort;

		// convert e.g. "Elf (High)" to "High Elf" and add as a searchable field
		const bracketMatch = /^(.*?) \((.*?)\)$/.exec(race.name);

		tempString +=
			`<li class="row" ${FLTR_ID}='${rcI}' onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
				<a id='${rcI}' href="#${UrlUtil.autoEncodeHash(race)}" title="${race.name}">
					<span class='name col-4'>${race.name}</span>
					<span class='ability col-4'>${ability.asTextShort}</span>
					<span class='size col-2'>${Parser.sizeAbvToFull(race.size)}</span>
					<span class='source col-2 text-align-center ${Parser.sourceJsonToColor(race.source)}' title="${Parser.sourceJsonToFull(race.source)}">${Parser.sourceJsonToAbv(race.source)}</span>
					${bracketMatch ? `<span class="clean-name hidden">${bracketMatch[2]} ${bracketMatch[1]}</span>` : ""}
					
					<span class="uniqueid hidden">${race.uniqueId ? race.uniqueId : rcI}</span>
					<span class="eng_name hidden">${race.ENG_name ? race.ENG_name : race.name}</span>
				</a>
			</li>`;

		// populate filters
		sourceFilter.addIfAbsent(race._fSources);
		sizeFilter.addIfAbsent(race.size);
		asiFilter.addIfAbsent(race._fAbility);
	}
	const lastSearch = ListUtil.getSearchTermAndReset(list);
	racesTable.append(tempString);

	// sort filters
	sourceFilter.items.sort(SortUtil.ascSort);
	sizeFilter.items.sort(ascSortSize);
	asiFilter.items.sort(ascSortAsi);

	function ascSortSize (a, b) {
		return SortUtil.ascSort(toNum(a), toNum(b));

		function toNum (size) {
			switch (size) {
				case "M":
					return 0;
				case "S":
					return -1;
				case "V":
					return 1;
			}
		}
	}

	function ascSortAsi (a, b) {
		if (a.startsWith("任意") && b.startsWith("任意")) {
			const aAbil = a.replace("任意", "").replace("增加", "").trim();
			const bAbil = b.replace("任意", "").replace("增加", "").trim();
			return ASI_SORT_POS[aAbil] - ASI_SORT_POS[bAbil];
		} else if (a.startsWith("任意")) {
			return -1;
		} else if (b.startsWith("任意")) {
			return 1;
		} else {
			const [aAbil, aScore] = a.split(" ");
			const [bAbil, bScore] = b.split(" ");
			return (ASI_SORT_POS[aAbil] - ASI_SORT_POS[bAbil]) || (Number(bScore) - Number(aScore));
		}
	}

	list.reIndex();
	if (lastSearch) list.search(lastSearch);
	list.sort("name");
	filterBox.render();
	handleFilterChange();

	ListUtil.setOptions({
		itemList: raceList,
		getSublistRow: getSublistItem,
		primaryLists: [list]
	});
	ListUtil.bindPinButton();
	EntryRenderer.hover.bindPopoutButton(raceList);
	UrlUtil.bindLinkExportButton(filterBox);
	ListUtil.bindDownloadButton();
	ListUtil.bindUploadButton();

	$(`body`).on("click", ".btn-name-pronounce", function () {
		const audio = $(this).find(`.name-pronounce`)[0];
		audio.currentTime = 0;
		audio.play();
	});
}

function handleFilterChange () {
	const f = filterBox.getValues();
	list.filter(function (item) {
		const r = raceList[$(item.elm).attr(FLTR_ID)];
		return filterBox.toDisplay(
			f,
			r._fSources,
			r._fAbility,
			r.size,
			r._fSpeed,
			r._fMisc,
			r.languageTags
		);
	});
	FilterBox.nextIfHidden(raceList);
}

function getSublistItem (race, pinId) {
	return `
		<li class="row" ${FLTR_ID}="${pinId}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(race)}" title="${race.name}">
				<span class="name col-5">${race.name}</span>
				<span class="ability col-5">${race._slAbility}</span>
				<span class="size col-2">${Parser.sizeAbvToFull(race.size)}</span>
				<span class="id hidden">${pinId}</span>
			</a>
		</li>
	`;
}

const renderer = EntryRenderer.getDefaultRenderer();
function loadhash (id) {
	renderer.setFirstSection(true);
	const $pgContent = $("#pagecontent").empty();
	const race = raceList[id];

	function buildStatsTab () {
		function getPronunciationButton () {
			return `<button class="btn btn-xs btn-default btn-name-pronounce">
				<span class="glyphicon glyphicon-volume-up name-pronounce-icon"></span>
				<audio class="name-pronounce">
				   <source src="${race.soundClip}" type="audio/mpeg">
				   <source src="audio/races/${/^(.*?)(\(.*?\))?$/.exec(race._baseName || race.name)[1].trim().toLowerCase()}.mp3" type="audio/mpeg">
				</audio>
			</button>`;
		}

		$pgContent.append(`
		<tbody>
		${EntryRenderer.utils.getBorderTr()}
		<tr><th class="name" colspan="6">
		<span><b class="stats-name copyable" onclick="EntryRenderer.utils._handleNameClick(this, '${race.source.escapeQuotes()}')">${race.name}</b>${race.ENG_name? ("("+race.ENG_name):")"}</span>
		${race.soundClip ? getPronunciationButton() : ""}
		<span class="stats-source ${Parser.sourceJsonToColor(race.source)}" title="${Parser.sourceJsonToFull(race.source)}">${Parser.sourceJsonToAbv(race.source)}</span>
		</th></tr>
		<tr><td colspan="6"><b>屬性值：</b> ${(race.ability ? utils_getAbilityData(race.ability) : {asText: "無"}).asText}</td></tr>
		<tr><td colspan="6"><b>體型：</b> ${Parser.sizeAbvToFull(race.size)}</td></tr>
		<tr><td colspan="6"><b>速度：</b> ${Parser.getSpeedString(race)}</td></tr>
		<tr id="traits"><td class="divider" colspan="6"><div></div></td></tr>
		${EntryRenderer.utils.getBorderTr()}
		</tbody>
		`);

		const renderStack = [];
		renderStack.push("<tr class='text'><td colspan='6'>");
		renderer.recursiveEntryRender({type: "entries", entries: race.entries}, renderStack, 1);
		renderStack.push("</td></tr>");
		if (race.traitTags && race.traitTags.includes("NPC Race")) {
			renderStack.push(`<tr class="text"><td colspan="6"><section class="text-muted">`);
			renderer.recursiveEntryRender(
				`{@i Note: This race is listed in the {@i Dungeon Master's Guide} as an option for creating NPCs. It is not designed for use as a playable race.}`
				, renderStack, 2);
			renderStack.push(`</section></td></tr>`);
		}
		renderStack.push(EntryRenderer.utils.getPageTr(race));

		$pgContent.find('tbody tr:last').before(renderStack.join(""));
	}

	const traitTab = EntryRenderer.utils.tabButton(
		"特性",
		() => {},
		buildStatsTab
	);
	const infoTab = EntryRenderer.utils.tabButton(
		"情報",
		() => {},
		() => {
			function get$Tr () {
				return $(`<tr class="text">`);
			}
			function get$Td () {
				return $(`<td colspan="6" class="text">`);
			}

			$pgContent.append(EntryRenderer.utils.getBorderTr());
			$pgContent.append(EntryRenderer.utils.getNameTr(race));
			let $tr = get$Tr();
			let $td = get$Td().appendTo($tr);
			$pgContent.append($tr);
			$pgContent.append(EntryRenderer.utils.getBorderTr());

			DataUtil.loadJSON(JSON_FLUFF_URL).then((data) => {
				function renderMeta (prop) {
					let $tr2 = get$Tr();
					let $td2 = get$Td().appendTo($tr2);
					$tr.after($tr2);
					$tr.after(EntryRenderer.utils.getDividerTr());
					renderer.setFirstSection(true);
					$td2.append(renderer.renderEntry(data.meta[prop]));
					$tr = $tr2;
					$td = $td2;
				}

				const findFluff = (appendCopy) => {
					return data.race.find(it => it.name.toLowerCase() === appendCopy.name.toLowerCase() && it.source.toLowerCase() === appendCopy.source.toLowerCase());
				};

				const appendCopy = (fromFluff) => {
					if (fromFluff && fromFluff._appendCopy) {
						const appFluff = findFluff(fromFluff._appendCopy);
						renderer.setFirstSection(true);
						$td.append(renderer.renderEntry({type: "section", entries: appFluff.entries}));
					}
				};

				const subFluff = race._baseName && race.name.toLowerCase() === race._baseName.toLowerCase() ? "" : data.race.find(it => it.name.toLowerCase() === race.name.toLowerCase() && it.source.toLowerCase() === race.source.toLowerCase());
				const baseFluff = data.race.find(it => race._baseName && it.name.toLowerCase() === race._baseName.toLowerCase() && race._baseSource && it.source.toLowerCase() === race._baseSource.toLowerCase());
				if (race.fluff && race.fluff.entries) { // override; for homebrew usage only
					renderer.setFirstSection(true);
					$td.append(renderer.renderEntry({type: "section", entries: race.fluff.entries}));
				} else if (subFluff || baseFluff) {
					if (subFluff && (subFluff.entries || subFluff._appendCopy) && !baseFluff) {
						renderer.setFirstSection(true);
						$td.append(renderer.renderEntry({type: "section", entries: subFluff.entries}));
						appendCopy(subFluff);
					} else if (subFluff && (subFluff.entries || subFluff._appendCopy) && baseFluff && (baseFluff.entries || baseFluff._appendCopy)) {
						renderer.setFirstSection(true);
						if (subFluff.entries) $td.append(renderer.renderEntry({type: "section", entries: subFluff.entries}));
						appendCopy(subFluff);
						let $tr2 = get$Tr();
						let $td2 = get$Td().appendTo($tr2);
						$tr.after($tr2);
						$tr.after(EntryRenderer.utils.getDividerTr());
						renderer.setFirstSection(true);
						$td2.append(renderer.renderEntry({type: "section", name: race._baseName, entries: baseFluff.entries}));
						appendCopy(baseFluff);
						$tr = $tr2;
						$td = $td2;
					} else if (baseFluff && (baseFluff.entries || baseFluff._appendCopy)) {
						renderer.setFirstSection(true);
						$td.append(renderer.renderEntry({type: "section", entries: baseFluff.entries}));
						appendCopy(baseFluff);
					}
					if ((subFluff && subFluff.uncommon) || (baseFluff && baseFluff.uncommon)) {
						renderMeta("uncommon");
					}
					if ((subFluff && subFluff.monstrous) || (baseFluff && baseFluff.monstrous)) {
						renderMeta("monstrous");
					}
				} else {
					$td.empty();
					$td.append(HTML_NO_INFO);
				}
			});
		}
	);
	EntryRenderer.utils.bindTabButtons(traitTab, infoTab);

	ListUtil.updateSelected();
}

function loadsub (sub) {
	filterBox.setFromSubHashes(sub);
	ListUtil.setFromSubHashes(sub);
}
