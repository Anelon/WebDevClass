var game = document.getElementById("game");
var board = game.children;
var dimention = board.length;
var rows = [];
var turn = "player1";

class Player {
	constructor(name, locationX, locationY){
		console.log("meh?");
		this.name = name;
		this.range = 5;
		this.movement = 2;
		this.health = 100;
		this.locationX = locationX;
		this.locationY = locationY;
		console.log(rows);
		if(rows) rows[this.locationX][this.locationY].classList.add(name);
	}
	get getClassList() {
		var play = document.getElementsByClassName(this.name);
		console.log(play);
		return play.classList;
	}
	drawRange() {
		console.log(this.range);
		for(let i = 0; i < range; i++) {
			
		}
	}
	move(locationX,locationY) {
		rows[locationX][locationY].classList.remove(name);
		rows[this.locationX][this.locationY].classList.add(name);
		drawRange();
	}
	takeDamge(dmg){
		this.health -= dmg;
	}
}

//ability drop down (not a drop down)
var select = document.getElementById("abilitySelect");
var abilities = ["tornado", "rain", "fire", "lava", "oil", "ooze"];
var terrainTypes = ["blood", "water", "fire", "lava", "oil", "cloud", "posion", "smoke", "steam"];
var explosiveTerrain = ["oil", "posion"];
for (var i = 0; i < abilities.length; i++) {
    var ability = document.createElement("div");
    ability.innerText = abilities[i];
    ability.className = "ability";
    ability.setAttribute("id", "ability" + i);
    select.appendChild(ability);
    console.log(abilities[i]);

    ability.addEventListener("click", selectAbility);
}
function selectAbility(){
	var abilityarr = select.children;
	var id = event.target.id.charAt(7); //7 = idnumber
	for (var i = 0; i < abilityarr.length; i++) {
		if (i == id) abilityarr[i].className = "ability bold";
		else abilityarr[i].className = "ability";
	}
}


var abilitysizeX = 1;
var abilitysizeY = 1;
var maxSize = 5;
var minSize = 1;
var abilitySizeDiv = document.getElementById("xy"); //xy values, fun
var xdiv = document.createElement("div");
var ydiv = document.createElement("div");
var xtext = document.createElement("div");
var ytext = document.createElement("div");
xtext.innerHTML = "X = ";
ytext.innerHTML = "Y = ";
xtext.className = "xytext";
ytext.className = "xytext";
var x = document.createElement("input");
var y = document.createElement("input");
x.placeholder = abilitysizeX;
y.placeholder = abilitysizeY;
x.className = "input";
y.className = "input";
xdiv.appendChild(xtext);
ydiv.appendChild(ytext);
xdiv.appendChild(x);
ydiv.appendChild(y);
x.setAttribute("id", "x");
y.setAttribute("id", "y");
var currentxy = document.createElement("div");
currentxy.className = "text";
currentxy.innerText = "(" + abilitysizeX + "," + abilitysizeY + ")";
var setxy = document.createElement("button");
setxy.innerText = "Set";
abilitySizeDiv.appendChild(xdiv);
abilitySizeDiv.appendChild(ydiv);
abilitySizeDiv.appendChild(setxy);
abilitySizeDiv.appendChild(currentxy);
setxy.addEventListener("click", function() {
    if (parseInt(x.value)) {
        abilitysizeX = parseInt(x.value);
        if (abilitysizeX > maxSize) abilitysizeX = maxSize;
        if (abilitysizeX < minSize) abilitysizeX = minSize;
    }
    if (parseInt(y.value)) {
        abilitysizeY = parseInt(y.value);
        if (abilitysizeY > maxSize) abilitysizeY = maxSize;
        if (abilitysizeY < minSize) abilitysizeY = minSize;
    }
    x.value = "";
    y.value = "";
    x.placeholder = abilitysizeX;
    y.placeholder = abilitysizeY;
    currentxy.innerText = "(" + abilitysizeX + "," + abilitysizeY + ")";
});

//get the rows into nice array, pushes them into rows[][]
for (var i = 0; i < dimention; i++) {
    rows.push(board[i].children);
}
//setup the game board with ids and classes
for (var i = 0; i < dimention; i++) {
    board[i].setAttribute("id", "row" + i);
    for (var j = 0; j < dimention; j++) {
        rows[i][j].setAttribute("id", i * dimention + j);
        rows[i][j].className = "empty noselect";
        //rows[i][j].innerText = "empty";
        if (i == 0) rows[i][j].className += " top";
        if (j == 0) rows[i][j].className += " left";
        if (j == dimention - 1) rows[i][j].className += " right";
        if (i == dimention - 1) rows[i][j].className += " bottom";
		//add players
		console.log("players");
        var num = i + j;
        rows[i][j].addEventListener("click", useClick);
    }
}
//Initialize Players
currPlayer = new Player("player1", 0, 0);
oppPlayer = new Player("player2", dimention-1, dimention-1);

function useClick(){
	if(!event) return;
	console.log(event.target.id);
	var use;
	if (document.getElementsByClassName("bold")[0]) {
		use = document.getElementsByClassName("bold")[0].innerText;
	}
	else alert("No Ability Selected"); //make popup thing or something
	console.log(use);
	useAbility(use, event.target.id);
	}
//takes two coordinates returns a number
function toNum(x, y) {
    return y * dimention + x;
}
//converts a number to coordinates
function toCoords(num) {
    var coord = [];
    coord.push(num % dimention);
    coord.push(parseInt(num / dimention));
    return coord;
}
//checks if over the edge
function edgeCheck(first, second) {
    return parseInt(first / dimention) == parseInt((second / dimention));
}
//gets area then places ability
function useAbility(skill, num) {
    console.log("get area");
    var area = getArround(num, parseInt(abilitysizeX), parseInt(abilitysizeY));
    console.log(area);
    for (var i = 0; i < area.length; i++) {
        placeAbility(skill, area[i]);
    }
}
//gets area to use the ability in (gross rewrite or clean up)
function getArround(num, areaX, areaY) {
    var area = [];
    num = parseInt(num);
    area.push(num);
	console.log("x = " + areaX + " y = " + areaY);
	var location;

    if (areaX == 2 && areaY == 2) { // adjust player 1 vs player 2
        location = num + 1;
        if (edgeCheck(num, location)) area.push(num + 1);

        location = num + dimention;
        if (location < (dimention * dimention)) {
            area.push(location);
            if (edgeCheck(location, location + 1)) area.push(location + 1);
        }
    }
    else if (areaX == 2) {
        if (edgeCheck(num, num + 1)) area.push(num + 1);
    }
    else if (areaY == 2) {
        if (num + dimention < dimention * dimention) area.push(num + dimention);
    }

	if(areaX == 1) {
		for (let j = 1; j < areaY / 2; j++) {//vertical
			let shiftY = num + j * dimention;
			if (shiftY < dimention * dimention) {
				location = shiftY; //up
				area.push(location);
			}
			shiftY = num - j * dimention;
			if (shiftY >= 0) {
				location = shiftY; //down
				area.push(location);
			}
			if(areaY % 2 == 0) {//extra up or down if even
				console.log("Extra");
				shiftY = num + (j+1) * dimention;
				if (shiftY >= 0) {
					location = shiftY; //up
					area.push(location);
				}
			}
		}
	}
    for (let i = 1; i < areaX/2; i++) { //use in area specified
        location = num + i; //right
        if (edgeCheck(num, location)) area.push(location);
        location = num - i; //left
        if (edgeCheck(num, location)) area.push(location);
        if (areaX % 2 == 0) {
            location = num + i; //extra right or left
            if (turn == "player1") location++;
            else location--;
            if (edgeCheck(num, location)) area.push(location);
        }
        for (var j = 1; j < areaY / 2; j++) {//vertical
            var shiftY = num + j * dimention;
            if (shiftY < dimention * dimention) {
                location = shiftY; //up
                area.push(location);
                location = shiftY + i; //right
                if (edgeCheck(shiftY, location)) area.push(location);
                location = shiftY - i; //left
                if (edgeCheck(shiftY, location)) area.push(location);
                if (areaX % 2 == 0) {
                    location = shiftY + i; //extra right or left
                    if (turn == "player1") location++;
                    else location--;
                    if (edgeCheck(shiftY, location)) area.push(location);
                }
            }
            shiftY = num - j * dimention;
            if (shiftY > 0) {
                location = shiftY; //down
                area.push(location);
                location = shiftY + i; //right
                if (edgeCheck(shiftY, location)) area.push(location);
                location = shiftY - i; //left
                if (edgeCheck(shiftY, location)) area.push(location);
                //player1
                if (areaX % 2 == 0) {
                    location = shiftY + i;
                    if (turn == "player1") location++;
                    else location--;
                    if (edgeCheck(shiftY, location)) area.push(location);
                }
            }
            if (areaY % 2 == 0) { //extra down (or up?)
                shiftY = num + (1 + j) * dimention;
                if (shiftY < dimention * dimention) {
                    location = shiftY; //up or down
                    area.push(location);
                    location = shiftY + i; //right
                    if (edgeCheck(shiftY, location)) area.push(location);
                    location = shiftY - i; //left
                    if (edgeCheck(shiftY, location)) area.push(location);
                    if (areaX % 2 == 0) {
                        location = shiftY + i; //extra left or right
                        if (turn == "player1") location++;
                        else location--;
                        if (edgeCheck(shiftY, location)) area.push(location);
                    }
                }
            }
        }
    }
    return area;
}
//calls use_ for the name of the ability
function placeAbility(skill, num) {
    num = parseInt(num);
    if (skill == "tornado") useTornado(num);
    else if (skill == "rain") useRain(num);
    else if (skill == "fire") useFire(num);
    else if (skill == "lava") useLava(num);
    else if (skill == "oil") useOil(num);
    else if (skill == "ooze") useOoze(num);
}

//template for new abilities
function usetmp(num) { //TMP
    var spot = document.getElementById(num);
    var spotClass = spot.classList;
    if (spotClass.contains("water")) {}
    else if (spotClass.contains("blood")) {}
    else if (spotClass.contains("fire")) {}
    else if (spotClass.contains("lava")) {}
    else if (spotClass.contains("oil")) {}
    else if (spotClass.contains("posion")) {}
    else if (spotClass.contains("smoke")) {}
    else if (spotClass.contains("steam")) {}
    else spot.className += " tmp";
}
//clears terrain in area
function useTornado(num) { //tornado
    var spot = document.getElementById(num);
    var spotClass = spot.classList;
    spot.innerText = "";
    for (var i = 0; i < terrainTypes.length; i++) spotClass.remove(terrainTypes[i]);
}
//puts water in area
function useRain(num) { //RAIN
    var spot = document.getElementById(num);
    var spotClass = spot.classList;
    if (spotClass.contains("water")) {}
    else if (spotClass.contains("blood")) {}
    else if (spotClass.contains("fire")) {
        spotClass.remove("fire");
        spot.innerText += " steam";
        spot.className += " water";
    }
    else if (spotClass.contains("lava")) {}
    else if (spotClass.contains("oil")) {}
    else if (spotClass.contains("posion")) {}
    else if (spotClass.contains("smoke")) {}
    else if (spotClass.contains("steam")) {}
    else spot.className += " water";
}
//puts fire in area
function useFire(num) { // FIRE
    var spot = document.getElementById(num);
    var spotClass = spot.classList;
    if (spotClass.contains("water")) {
        spotClass.remove("water");
        spot.innerText += " steam";
        spot.className += " fire";
    }
    else if (spotClass.contains("blood")) {}
    else if (spotClass.contains("fire")) {}
    else if (spotClass.contains("lava")) {}
    else if (spotClass.contains("oil")) {
        spotClass.remove("oil");
        explosion(num); //boom
        spot.className += " fire";
    }
    else if (spotClass.contains("posion")) {
        spotClass.remove("posion");
        explosion(num); //boom
        spot.className += " fire";
    }
    else if (spotClass.contains("smoke")) {}
    else if (spotClass.contains("steam")) {}
    else spot.className += " fire";
}
//puts lava in area
function useLava(num) { //LAVA
    var spot = document.getElementById(num);
    var spotClass = spot.classList;
    if (spotClass.contains("water")) {
        spotClass.remove("water");
        spot.innerText += " steam";
        spot.className += " lava";
    }
    else if (spotClass.contains("blood")) {}
    else if (spotClass.contains("fire")) {
        spotClass.remove("fire");
        spot.className += " lava";
    }
    else if (spotClass.contains("lava")) {}
    else if (spotClass.contains("oil")) {
        spotClass.remove("oil");
        explosion(num); //boom
        spot.className += " lava";
    }
    else if (spotClass.contains("posion")) {
        spotClass.remove("posion");
        explosion(num); //boom
        spot.className += " lava";
    }
    else if (spotClass.contains("smoke")) {}
    else if (spotClass.contains("steam")) {}
    else spot.className += " lava";
}
//puts oil in area
function useOil(num) { //OIL
    console.log("oil");
    var spot = document.getElementById(num);
    var spotClass = spot.classList;
    if (spotClass.contains("water")) {}
    else if (spotClass.contains("blood")) {}
    else if (spotClass.contains("fire")) {
        spotClass.remove("fire");
        explosion(num); //boom
        spot.className += " fire";
    }
    else if (spotClass.contains("lava")) {
        spotClass.remove("lava");
        explosion(num); //boom
        spot.className += " fire";
    }
    else if (spotClass.contains("oil")) {}
    else if (spotClass.contains("posion")) {}
    else if (spotClass.contains("smoke")) {}
    else if (spotClass.contains("steam")) {}
    else spot.className += " oil";
}
//put ooze in area
function useOoze(num) { //OOZE
    console.log("ooze");
    var spot = document.getElementById(num);
    var spotClass = spot.classList;
    if (spotClass.contains("water")) {}
    else if (spotClass.contains("blood")) {}
    else if (spotClass.contains("fire")) {
        spotClass.remove("fire");
        explosion(num); //boom
        spot.className += " fire";
    }
    else if (spotClass.contains("lava")) {
        spotClass.remove("lava");
        explosion(num); //boom
        spot.className += " fire";
    }
    else if (spotClass.contains("oil")) {}
    else if (spotClass.contains("posion")) {}
    else if (spotClass.contains("smoke")) {}
    else if (spotClass.contains("steam")) {}
    else spot.className += " posion";
}
function contains(list, arr) {
	let contains = false;
	arr.forEach(function(word){
		if(list.contains(word)) contains = true;
	});
	return contains;
}
//if fire or lava hits oil or ooze
function explosion(num) {
    var spot = document.getElementById(num);
    var spotClass = spot.classList;
    spotClass.remove("oil");
    spotClass.remove("posion");
    spot.innerText = "Smoke";
	//initialize variables and check if rolling over the edge
	var right, left, up, down;
	if(edgeCheck(num, num+1))
    	right = document.getElementById(num + 1);
	if(edgeCheck(num, num-1))
    	left = document.getElementById(num - 1);
    up = document.getElementById(num - dimention);
    down = document.getElementById(num + dimention);
	//if the directions exist then test for explosive meterial
    if (right)
		if(contains(right.classList, explosiveTerrain)) explosion(num + 1);
        //if (right.classList.contains("oil")) explosion(num + 1);
    if (left)
		if(contains(left.classList, explosiveTerrain)) explosion(num - 1);
    if (up)
		if(contains(up.classList, explosiveTerrain)) explosion(num - dimention);
    if (down)
		if(contains(down.classList, explosiveTerrain)) explosion(num + dimention);
}
//run once per turn
function nextTurn() {
	let playClass = currPlayer.getClassList;
	console.log(playClass);
    if (playClass.contains("water")) move = parseInt(move / 2); //half movement
    else if (playClass.contains("blood")) move = parseInt(move / 2); //half movement
    else if (playClass.contains("fire")) {} //take 5 damage
    else if (playClass.contains("lava")) {} // take 7 damage
    else if (playClass.contains("oil")) move = parseInt(move / 2); //half movement
    else if (playClass.contains("posion")) {} //take 3 damage (apply posion?)
    else if (playClass.contains("smoke")) range -= 3; //lower range by 3
    else if (playClass.contains("steam")) range -= 2; // lower range by 2
    
	currPlayer.drawRange();
    var rangeArea = getArround(parseInt(play.id), range, range);
    var rangeTag;
    if (turn == "player1") rangeTag = "range1";
    else rangeTag = "range2";
    for (var i = 0; i < rangeArea.length; i++) {
        
    }
	//see Destructuring Assignment Array Matching
	[currPlayer, oppPlayer] = [oppPlayer, currPlayer]; //swaps values of two players Javascript magic
}

function updateClasses() {
    for (var i = 0; i < dimention; i++) {
        for (var j = 0; j < dimention; j++) {
            if (turn == "player1") rows[i][j].classList.remove("range2");
            else rows[i][j].classList.remove("range1");
        }
    }
}
