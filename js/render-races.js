class RenderRaces {
	static $getRenderedRace (race) {
		const renderer = Renderer.get().setFirstSection(true);

		const $ptHeightWeight = RenderRaces._$getHeightAndWeightPart(race);

		return $$`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getExcludedTr(race, "race")}
		${Renderer.utils.getNameTr(race, {controlRhs: race.soundClip ? RenderRaces._getPronunciationButton(race) : "", page: UrlUtil.PG_RACES})}
		<tr><td colspan="6"><b>属性值：</b> ${(race.ability ? Renderer.getAbilityData(race.ability) : {asText: "无"}).asText}</td></tr>
		<tr><td colspan="6"><b>体型：</b> ${(race.size || [SZ_VARIES]).map(sz => Parser.sizeAbvToFull(sz)).join("/")}</td></tr>
		<tr><td colspan="6"><b>速度：</b> ${Parser.getSpeedString(race)}</td></tr>
		<tr><td class="divider" colspan="6"><div></div></td></tr>
		${race._isBaseRace ? `<tr class="text"><td colspan="6">${renderer.render({type: "entries", entries: race._baseRaceEntries}, 1)}</td></tr>` : `<tr class="text"><td colspan="6">${renderer.render({type: "entries", entries: race.entries}, 1)}</td></tr>`}

		${race.traitTags && race.traitTags.includes("NPC Race") ? `<tr class="text"><td colspan="6"><section class="text-muted">
			${renderer.render(`{@i 注记： 这个种族被记载于{@i 《地下城主指南》}以作为创造非玩家角色的选项。它并非被设计作为玩家可用的种族。}`, 2)}
		 </section></td></tr>` : ""}

		${$ptHeightWeight ? $$`<tr class="text"><td colspan="6"><hr class="rd__hr">${$ptHeightWeight}</td></tr>` : ""}

		${Renderer.utils.getPageTr(race)}
		${Renderer.utils.getBorderTr()}`;
	}

	static _getPronunciationButton (race) {
		return `<button class="btn btn-xs btn-default btn-name-pronounce ml-2">
			<span class="glyphicon glyphicon-volume-up name-pronounce-icon"></span>
			<audio class="name-pronounce">
			   <source src="${Renderer.utils.getMediaUrl(race, "soundClip", "audio")}" type="audio/mpeg">
			</audio>
		</button>`;
	}

	static _$getHeightAndWeightPart (race) {
		if (!race.heightAndWeight) return null;
		if (race._isBaseRace) return null;

		const getRenderedHeight = (height) => {
			const heightFeet = Math.floor(height / 12);
			const heightInches = height % 12;
			return `${heightFeet ? `${heightFeet}'` : ""}${heightInches ? `${heightInches}"` : ""}`;
		};

		const entries = [
			"你可以在“随机身高与体重表”上掷骰来决定你的角色的身高与体重。“身高调整值列”的掷骰结果（寸）将会加在角色基础身高上。随机体重则是用在“体重调整值列”的掷骰结果乘上掷骰得到的身高值，并将结果（磅）加在基础体重上。",
			{
				type: "table",
				caption: "随机身高与体重",
				colLabels: ["基础身高", "基础体重", "身高调整值", "体重调整值", ""],
				colStyles: ["col-2-3 text-center", "col-2-3 text-center", "col-2-3 text-center", "col-2 text-center", "col-3-1 text-center"],
				rows: [
					[
						getRenderedHeight(race.heightAndWeight.baseHeight),
						`${race.heightAndWeight.baseWeight} lb.`,
						`+<span data-race-heightmod="true"></span>`,
						`× <span data-race-weightmod="true"></span> lb.`,
						`<div class="flex-vh-center">
							<div class="ve-hidden race__disp-result-height-weight flex-v-baseline">
								<div class="mr-1">=</div>
								<div class="race__disp-result-height"></div>
								<div class="mr-2">; </div>
								<div class="race__disp-result-weight mr-1"></div>
								<div class="small">lb.</div>
							</div>
							<button class="btn btn-default btn-xs my-1 race__btn-roll-height-weight">掷骰</button>
						</div>`,
					],
				],
			},
		];

		const $render = $$`${Renderer.get().render({entries})}`;

		// {@dice ${race.heightAndWeight.heightMod}||Height Modifier}
		// ${ptWeightMod}

		const $dispResult = $render.find(`.race__disp-result-height-weight`);
		const $dispHeight = $render.find(`.race__disp-result-height`);
		const $dispWeight = $render.find(`.race__disp-result-weight`);

		const lock = new VeLock();
		let hasRolled = false;
		let resultHeight;
		let resultWeightMod;

		const $btnRollHeight = $render
			.find(`[data-race-heightmod="true"]`)
			.html(race.heightAndWeight.heightMod)
			.addClass("roller")
			.mousedown(evt => evt.preventDefault())
			.click(async () => {
				try {
					await lock.pLock();

					if (!hasRolled) return pDoFullRoll(true);
					await pRollHeight();
					updateDisplay();
				} finally {
					lock.unlock();
				}
			});

		const isWeightRoller = race.heightAndWeight.weightMod && isNaN(race.heightAndWeight.weightMod);
		const $btnRollWeight = $render
			.find(`[data-race-weightmod="true"]`)
			.html(isWeightRoller ? `(<span class="roller">${race.heightAndWeight.weightMod}</span>)` : race.heightAndWeight.weightMod || "1")
			.click(async () => {
				try {
					await lock.pLock();

					if (!hasRolled) return pDoFullRoll(true);
					await pRollWeight();
					updateDisplay();
				} finally {
					lock.unlock();
				}
			});
		if (isWeightRoller) $btnRollWeight.mousedown(evt => evt.preventDefault());

		const $btnRoll = $render
			.find(`button.race__btn-roll-height-weight`)
			.click(async () => pDoFullRoll());

		const pRollHeight = async () => {
			const mResultHeight = await Renderer.dice.pRoll2(race.heightAndWeight.heightMod, {
				isUser: false,
				label: "身高调整值",
				ENG_label: "Height Modifier",
				name: race.name,
			});
			if (mResultHeight == null) return;
			resultHeight = mResultHeight;
		};

		const pRollWeight = async () => {
			const weightModRaw = race.heightAndWeight.weightMod || "1";
			const mResultWeightMod = isNaN(weightModRaw) ? await Renderer.dice.pRoll2(weightModRaw, {
				isUser: false,
				label: "体重调整值",
				ENG_label: "Weight Modifier",
				name: race.name,
			}) : Number(weightModRaw);
			if (mResultWeightMod == null) return;
			resultWeightMod = mResultWeightMod;
		};

		const updateDisplay = () => {
			const renderedHeight = getRenderedHeight(race.heightAndWeight.baseHeight + resultHeight);
			const totalWeight = race.heightAndWeight.baseWeight + (resultWeightMod * resultHeight);
			$dispHeight.text(renderedHeight);
			$dispWeight.text(totalWeight);
		};

		const pDoFullRoll = async isPreLocked => {
			try {
				if (!isPreLocked) await lock.pLock();

				$btnRoll.parent().removeClass(`flex-vh-center`).addClass(`split-v-center`);
				await pRollHeight();
				await pRollWeight();
				$dispResult.removeClass(`ve-hidden`);
				updateDisplay();

				hasRolled = true;
			} finally {
				if (!isPreLocked) lock.unlock();
			}
		};

		return $render;
	}
}
