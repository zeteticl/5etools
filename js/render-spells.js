class RenderSpells {
	static $getRenderedSpell (sp, subclassLookup) {
		const renderer = Renderer.get();

		const renderStack = [];
		renderer.setFirstSection(true);

		renderStack.push(`
			${Renderer.utils.getBorderTr()}
			${Renderer.utils.getExcludedTr(sp, "spell", UrlUtil.PG_SPELLS)}
			${Renderer.utils.getNameTr(sp, {page: UrlUtil.PG_SPELLS})}
			<tr><td class="rd-spell__level-school-ritual" colspan="6"><span>${Parser.spLevelSchoolMetaToFull(sp.level, sp.school, sp.meta, sp.subschools)}</span></td></tr>
			<tr><td colspan="6"><span class="bold">施法时间：</span>${Parser.spTimeListToFull(sp.time)}</td></tr>
			<tr><td colspan="6"><span class="bold">射程：</span>${Parser.spRangeToFull(sp.range)}</td></tr>
			<tr><td colspan="6"><span class="bold">构材：</span>${Parser.spComponentsToFull(sp.components, sp.level)}</td></tr>
			<tr><td colspan="6"><span class="bold">持续时间：</span>${Parser.spDurationToFull(sp.duration)}</td></tr>
			${Renderer.utils.getDividerTr()}
		`);

		const entryList = {type: "entries", entries: sp.entries};
		renderStack.push(`<tr class="text"><td colspan="6" class="text">`);
		renderer.recursiveRender(entryList, renderStack, {depth: 1});
		if (sp.entriesHigherLevel) {
			const higherLevelsEntryList = {type: "entries", entries: sp.entriesHigherLevel};
			renderer.recursiveRender(higherLevelsEntryList, renderStack, {depth: 2});
		}
		renderStack.push(`</td></tr>`);

		const stackFroms = [];

		const fromClassList = Renderer.spell.getCombinedClasses(sp, "fromClassList");
		if (fromClassList.length) {
			const [current, legacy] = Parser.spClassesToCurrentAndLegacy(fromClassList);
			stackFroms.push(`<div><span class="bold">职业：</span>${Parser.spMainClassesToFull(current)}</div>`);
			if (legacy.length) stackFroms.push(`<div class="text-muted"><span class="bold">职业（旧版）：</span>${Parser.spMainClassesToFull(legacy)}</div>`);
		}

		const fromSubclass = Renderer.spell.getCombinedClasses(sp, "fromSubclass");
		if (fromSubclass.length) {
			const [current, legacy] = Parser.spSubclassesToCurrentAndLegacyFull(sp, subclassLookup);
			stackFroms.push(`<div><span class="bold">子职业：</span>${current}</div>`);
			if (legacy.length) {
				stackFroms.push(`<div class="text-muted"><span class="bold">子职业（旧版）：</span>${legacy}</div>`);
			}
		}

		const fromClassListVariant = Renderer.spell.getCombinedClasses(sp, "fromClassListVariant");
		if (fromClassListVariant.length) {
			const [current, legacy] = Parser.spVariantClassesToCurrentAndLegacy(fromClassListVariant);
			if (current.length) {
				stackFroms.push(`<div><span class="bold">可选/变体职业：</span>${Parser.spMainClassesToFull(current)}</div>`);
			}
			if (legacy.length) {
				stackFroms.push(`<div class="text-muted"><span class="bold">可选/变体职业（旧版）：</span>${Parser.spMainClassesToFull(legacy)}</div>`);
			}
		}

		const fromRaces = Renderer.spell.getCombinedRaces(sp);
		if (fromRaces.length) {
			fromRaces.sort((a, b) => SortUtil.ascSortLower(a.name, b.name) || SortUtil.ascSortLower(a.source, b.source));
			stackFroms.push(`<div><span class="bold">种族：</span>${fromRaces.map(r => `${SourceUtil.isNonstandardSource(r.source) ? `<span class="text-muted">` : ``}${renderer.render(`{@race ${Parser.RaceToDisplay(r.name)}|${r.source}}`)}${SourceUtil.isNonstandardSource(r.source) ? `</span>` : ``}`).join("、")}</div>`);
		}

		const fromBackgrounds = Renderer.spell.getCombinedBackgrounds(sp);
		if (fromBackgrounds.length) {
			fromBackgrounds.sort((a, b) => SortUtil.ascSortLower(a.name, b.name) || SortUtil.ascSortLower(a.source, b.source));
			stackFroms.push(`<div><span class="bold">背景：</span>${fromBackgrounds.map(r => `${SourceUtil.isNonstandardSource(r.source) ? `<span class="text-muted">` : ``}${renderer.render(`{@background ${r.name}|${r.source}}`)}${SourceUtil.isNonstandardSource(r.source) ? `</span>` : ``}`).join("、")}</div>`);
		}

		if (sp.eldritchInvocations) {
			sp.eldritchInvocations.sort((a, b) => SortUtil.ascSortLower(a.name, b.name) || SortUtil.ascSortLower(a.source, b.source));
			stackFroms.push(`<div><span class="bold">魔能祈唤：</span>${sp.eldritchInvocations.map(r => `${SourceUtil.isNonstandardSource(r.source) ? `<span class="text-muted">` : ``}${renderer.render(`{@optfeature ${r.name}|${r.source}}`)}${SourceUtil.isNonstandardSource(r.source) ? `</span>` : ``}`).join("、")}</div>`);
		}

		if (stackFroms.length) {
			renderStack.push(`<tr class="text"><td colspan="6">${stackFroms.join("")}</td></tr>`)
		}

		if (sp._scrollNote) {
			renderStack.push(`<tr class="text"><td colspan="6"><section class="text-muted">`);
			renderer.recursiveRender(`{@italic 注意：{@class 战士||战士（魔能骑士）|Eldritch Knight}和{@class 游荡者||游荡者（诡术师）|Arcane Trickster} 的法术列表包含了所有{@class 法师}法术。5环或更高环位法术可以在法术卷轴或者类似物品的帮助下施放。}`, renderStack, {depth: 2});
			renderStack.push(`</section></td></tr>`);
		}

		renderStack.push(`
			${Renderer.utils.getPageTr(sp)}
			${Renderer.utils.getBorderTr()}
		`);

		return $(renderStack.join(""));
	}
}
