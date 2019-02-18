const path = require('path');
const fs = require('fs');
const utS = require("./util-search-index");

const my_path = path.join("../search/", "index.json");
fs.writeFileSync(my_path, JSON.stringify(utS.UtilSearchIndex.getIndex()), "utf8");