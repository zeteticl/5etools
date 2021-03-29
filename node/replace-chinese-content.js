// rugini code
// 无法直接运行，只是记录代码以后用

var data2 = [
]
var data1 = [
]

// 替代内容，一般为替代中文的部分
var data1 = data1.map((k, index, array) => {
    var ch = data2
        .find((i, index, array) => {
        return i != undefined && k.name == i.ENG_name && k.source == i.source;
    });

    if (ch == undefined)
    {
        return k;
    }
    else
    {
        k.name = ch.name;
        k.entries = ch.entries;

        /*
        k.ENG_name = ch.ENG_name;
        k.entries = ch.entries;
        if (ch.languages != undefined)
            k.languages = ch.languages.split(/[,、，]/).map(x => x.trim());
        k.trait = ch.trait;
        if (ch.senses != undefined)
            k.senses = ch.senses.split(/[,、，]/).map(x => x.trim());
        k.resist = ch.resist;
        k.speed = ch.speed;
        k.immune = ch.immune;
        k.action = ch.action;
        k.legendary = ch.legendary;
        */
        return k;
    }
});
JSON.stringify(data1);

// 寻找中文有但英文没有的内容，可能是ENG_name换名子或打错
var data2 = data2.filter((k) => {
    if (k.ENG_name == undefined) {
        return false;
    }

    var ch = data1
        .find((i, index, array) => {
        return i != undefined && i.name == k.ENG_name && k.source == i.source;
    });

    if (ch == undefined)
    {
        return true;
    }
    else
    {
        return false
    }
});
JSON.stringify(data2);
