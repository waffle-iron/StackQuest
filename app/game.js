import easystar from 'easystar'

const Game = {
  borderPadding: 10, // size of the gray border of the game window
  HUDheight: 32, // height of the HUD bar at the bottom (with life etc.)
  nbGroundLayers: 4, // number of tilemap layers corresponding to "ground" elements (ground, grass, water, cliffs), vs high elements (trees, houses, ...)
  defaultOrientation: 4, // Face down by default
  playerSpeed: 120, // number of ms that the movement tween takes to cross one tile (the lower the faster)
  playerLife: 100,
  cursor: 'url(/assets/sprites/hand.png), auto', // image of the mouse cursor in normal circumstances
  cameraFollowing: true,
  // mapWideningY: 54, // y coordinate (in tiles) of the region of the map above which the bounds of the world are wider HUHHH??????
  healthBarWidth: 179, // width of the sprite representing the life of the player
  nbConnected: 0, // number of players connected to the game
  playerIsInitialized: false, // has the client received data from the server and created the world?
  HPdelay: 100, // Delay before displaying hit points
  // Keep this in mind for larger player pools
  latency: 0, // Initial latency of the client continuously updated by values from server
  charactersPool: {}, // Map of the players in the game, accessed by their player id
}

// used to map the orientation of the player, stored as a number, to the actual name of the orientation
// (used to select the right animations to play, by name)
const orientationsDict = {
  1: 'left',
  2: 'up',
  3: 'right',
  4: 'down'
}

Game.init = () => {
  Game.easystar = new easystar()
  game.canvas.style.cursor = Game.cursor // Sets the pointer to hand sprite
}

//  preloads all sprites and tilesheets
//  put audio here later if time allows
Game.preload = function() {
  game.load.tilemap('map', 'assets/maps/minimap_client.json', null, Phaser.Tilemap.TILED_JSON)
  game.load.spritesheet('tileset', 'assets/tilesets/tilesheet.png',32,32)
  game.load.atlasJSONHash('atlas4', 'assets/sprites/atlas4.png', 'assets/sprites/atlas4.json') // Atlas of monsters
  game.load.spritesheet('bubble', 'assets/sprites/bubble2.png',5,5) // tilesprite used to make speech bubbles
  game.load.spritesheet('life', 'assets/sprites/lifelvl.png',5,18) // tilesprite used to make lifebar
  game.load.json('entities', 'assets/json/entities_client.json') // Basically a list of the NPC, mapping their id to the key used in other JSON files
}

// Makes a map mapping the numerical id's of elements of a collection to their names (their names being the keys used to fetch relevant data from JSON files)
Game.makeIDmap = function(collection,map){
  Object.keys(collection).forEach(function(key) {
      var e = collection[key]
      map[e.id] = key
  })
}

Game.create = function() {
  Game.HUD = game.add.group() // Group containing all objects involved in the HUD
  Game.HUD.add(game.add.sprite(0, 0, 'atlas1','border')) // Adds the gray border of the game
  Game.displayLoadingScreen() // Display the loading screen

  // A few maps mapping the name of an element (a monster, npc, item...) to its properties
  // Put before other functions, which might need it
  Game.itemsInfo = Game.db.items
  Game.npcInfo = Game.db.npc
  Game.monstersInfo = Game.db.monsters

  // A few maps mapping numerical id's to string keys
  Game.itemsIDmap = {}
  Game.monstersIDmap = {}
  Game.makeIDmap(Game.itemsInfo, Game.itemsIDmap)
  Game.makeIDmap(Game.monstersInfo, Game.monstersIDmap)
  Game.entities = game.add.group() // Group containing all the objects appearing on the map (npc, monster, items, players ...)
  Game.scenery = game.add.group() // Group containing all the animated sprites generated from the map

  Game.displayMap() // Reads the Tiled JSON to generate the map, manage layers, create collision array for the pathfinding and make a dictionary of teleports
  //  Game.displayScenery() // Finds all "scenery" tiles in the map and replace them by animated sprites
  Game.displayNPC() // Read the Tiled JSON and display the NPC

  Game.makeHPtexts() // Creates a pool of text elements to use to display HP
  //  add sounds here

  // Factories used to fetch unused sprites before creating new ones (or creating new ones when no other available)
  Game.playerFactory = new Factory(function(x, y, key) {
    return new Player(x, y, key)
  })
  Game.itemFactory = new Factory(function(x, y, key) {
    return new Item(x, y, key)
  })
  Game.monsterFactory = new Factory(function(x, y, key) {
    return new Monster(x, y, key)
  })

  // this calls a function in the sockets file that emits the world
  //  need to update/fix this so it uses a db instead of local storage
  Client.requestData()
}
