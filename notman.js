var tiles
var enemies
var stars
var currentLevel

var orientations = {
	left: "left",
	right: "right",
	up: "up",
	down: "down"
}

var directions = {
	forward: "forward",
	behind: "behind",
	cw: "clockwise",
	ccw: "counterclockwise"
}

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
		[{type: blockTypes.tile, enemy: enemyTypes.notman, orientation: orientations.right}, {type: blockTypes.tile}, {type: blockTypes.block}],
		[{type: blockTypes.notblock}, {type: blockTypes.notblock}, {type: blockTypes.block}],
		[{type: blockTypes.tile, stars: 1}, {type: blockTypes.block}, {type: blockTypes.block}]
	]}
]

document.addEventListener('keydown', function (event) {
    switch(event.keyCode){
        case 32: processTurn()
    }
});

function newLevel(level){
	tiles = []
	enemies = []
	currentLevel = levels[level]
	levelSize = levels[level].size
	document.getElementById("gamefield").innerHTML = ""
	for(var i = 0; i < levelSize; i++){
		tiles.push([])
		var row = document.createElement("TR")
		for(var e = 0; e < levelSize; e++){
			tiles[i].push({type: levels[level].layout[i][e].type, elem: document.createElement("TD")})
			tiles[i][e].elem.className = tiles[i][e].type
			tiles[i][e].elem.setAttribute("x", i)
			tiles[i][e].elem.setAttribute("y", e)

			tiles[i][e].elem.onclick = function(){processClick(this)}
			row.appendChild(tiles[i][e].elem)

			if(levels[level].layout[i][e].enemy){
				enemies.push({type: levels[level].layout[i][e].enemy, orientation: levels[level].layout[i][e].orientation, x: i, y:e, elem: document.createElement("IMG")})
				enemies[enemies.length - 1].elem.src = enemies[enemies.length - 1].type + ".png"
				enemies[enemies.length - 1].elem.className = "enemy"
				document.body.appendChild(enemies[enemies.length - 1].elem)
			}
		}
		document.getElementById("gamefield").appendChild(row)
	}
	updateSprites()
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
	updateSprites()
}

function updateSprites(){
	for(var i = 0; i < enemies.length; i++){
		switch(enemies[i].orientation){
			case orientations.right: enemies[i].elem.style.transform = "rotate(0deg)"; break;
			case orientations.left: enemies[i].elem.style.transform = "scaleX(-1)"; break;
			case orientations.up: enemies[i].elem.style.transform = "rotate(270deg)"; break;
			case orientations.down: enemies[i].elem.style.transform = "rotate(90deg)"; break;
		}
		enemies[i].elem.style.left = tiles[enemies[i].x][enemies[i].y].elem.getBoundingClientRect().x + 2 + "px"
		enemies[i].elem.style.top = tiles[enemies[i].x][enemies[i].y].elem.getBoundingClientRect().y + 2 + "px"
	}
}

function getDirection(direction, orientation){
	if(orientation == orientations.right){
		switch(direction){
			case directions.forward: return orientations.right
			case directions.cw: return orientations.down
			case directions.ccw: return orientations.up
			case directions.behind: return orientations.left
		}
	}
	if(orientation == orientations.left){
		switch(direction){
			case directions.forward: return orientations.left
			case directions.cw: return orientations.up
			case directions.ccw: return orientations.down
			case directions.behind: return orientations.right
		}
	}
	if(orientation == orientations.up){
		switch(direction){
			case directions.forward: return orientations.up
			case directions.cw: return orientations.right
			case directions.ccw: return orientations.left
			case directions.behind: return orientations.down
		}
	}
	if(orientation == orientations.down){
		switch(direction){
			case directions.forward: return orientations.down
			case directions.cw: return orientations.left
			case directions.ccw: return orientations.right
			case directions.behind: return orientations.up
		}
	}
}

function getSurrounding(enemy){
	/// THESE ARE THE BASE VALUES FOR IF FACING TO THE RIGHT
	var base = {}

	if(enemy.y <= 0){
		base[directions.behind] = true
	} else {
		if(tiles[enemy.x][enemy.y - 1].type != blockTypes.tile){
			base[directions.behind] = true
		} else {
			base[directions.behind] = false
		}
	}

	if(enemy.x <= 0){
		base[directions.ccw] = true
	} else {
		if(tiles[enemy.x - 1][enemy.y].type != blockTypes.tile){
			base[directions.ccw] = true
		} else {
			base[directions.ccw] = false
		}
	}

	if(enemy.y == currentLevel.size - 1){
		base[directions.forward] = true
	} else {
		if(tiles[enemy.x][enemy.y + 1].type != blockTypes.tile){
			base[directions.forward] = true
		} else {
			base[directions.forward] = false
		}
	}

	if(enemy.x == currentLevel.size - 1){
		base[directions.cw] = true
	} else {
		if(tiles[enemy.x + 1][enemy.y].type != blockTypes.tile){
			base[directions.cw] = true
		} else {
			base[directions.cw] = false
		}
	}

	var final = {};
	switch(enemy.orientation){
		case orientations.right:final[directions.ccw] = base[directions.ccw]; 
								final[directions.cw] = base[directions.cw]; 
								final[directions.behind] = base[directions.behind]; 
								final[directions.forward] = base[directions.forward]; break;
		case orientations.left: final[directions.ccw] = base[directions.cw]; 
								final[directions.cw] = base[directions.ccw]; 
								final[directions.behind] = base[directions.forward]; 
								final[directions.forward] = base[directions.behind]; break;
		case orientations.up:   final[directions.ccw] = base[directions.behind]; 
								final[directions.cw] = base[directions.forward]; 
								final[directions.behind] = base[directions.cw]; 
								final[directions.forward] = base[directions.ccw]; break;
		case orientations.down: final[directions.ccw] = base[directions.forward]; 
								final[directions.cw] = base[directions.behind]; 
								final[directions.behind] = base[directions.ccw]; 
								final[directions.forward] = base[directions.cw]; break;
	}

	return final
}

function getMovement(enemy){
	var bounds = getSurrounding(enemy)
	var move 
	if(!bounds[directions.forward] && !bounds[directions.ccw] && !bounds[directions.cw]){
		move = directions.forward
	} else if(!bounds[directions.cw]){
		move = directions.cw
	} else if(!bounds[directions.ccw]){
		move = directions.ccw
	} else if(!bounds[directions.forward]){
		move = directions.forward
	} else if(!bounds[directions.behind]){
		move = directions.behind
	}
	if(move == undefined){
		return
	}
	return getDirection(move, enemy.orientation)
}

function processTurn(){
	for(var i = 0; i < enemies.length; i++){
		var mov = getMovement(enemies[i])
		if(mov != undefined){
			enemies[i].orientation = mov
			switch(mov){
				case orientations.right: enemies[i].y += 1; break;
				case orientations.left: enemies[i].y -= 1; break;
				case orientations.up: enemies[i].x -= 1; break;
				case orientations.down: enemies[i].x += 1; break;
			}	
		}
	}
	updateSprites()
}

newLevel(0)
