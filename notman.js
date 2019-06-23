var tiles
var enemies
var stars

var blockTypes = {
	notblock: "notblock", // not breakable
	block: "block", // breakable
	tile: "tile" // walkable
}

var enemyTypes = {
	notman: "notman", // not pac-man, but robot
	spike: "spike"
}
	
var levels = [
	{name: "Introduction", size: 3, layout: [
		[blockTypes.tile, blockTypes.tile, blockTypes.block],
		[blockTypes.notblock, blockTypes.notblock, blockTypes.block],
		[blockTypes.tile, blockTypes.block, blockTypes.block]
	], enemies: [
		[enemyTypes.notman, 0, 0],
		[0,0,0],
		[0,0,0]
	], stars: [
		[0,0,0],
		[0,0,0],
		[1,0,0]
	]}
]

function newLevel(level){
	tiles = []
	levelSize = levels[level].size
	document.getElementById("gamefield").innerHTML = ""
	for(var i = 0; i < levelSize; i++){
		tiles.push([])
		var row = document.createElement("TR")
		for(var e = 0; e < levelSize; e++){
			tiles[i].push({type: levels[level].layout[i][e], elem: document.createElement("TD")})
			tiles[i][e].elem.className = tiles[i][e].type
			tiles[i][e].elem.setAttribute("x", i)
			tiles[i][e].elem.setAttribute("y", e)

			tiles[i][e].elem.onclick = function(){processClick(this)}
			row.appendChild(tiles[i][e].elem)
		}
		document.getElementById("gamefield").appendChild(row)
	}
}

function processClick(element){
	if(tiles[element.getAttribute("x")][element.getAttribute("y")].type == blockTypes.block){
		tiles[element.getAttribute("x")][element.getAttribute("y")].type = blockTypes.tile
	}
	for(var i = 0; i < levelSize; i++){
		for(var e = 0; e < levelSize; e++){
			tiles[i][e].elem.className = tiles[i][e].type
		}
	}
}

newLevel(0)
