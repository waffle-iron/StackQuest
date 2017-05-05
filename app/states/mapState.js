import StackQuest from '../main'

let cursors, AGuy, BGuy, weapon, firebutton
const mapState = {
  init: function(x, y) {
    if (!x && !y) return
    // ZGuy = this.add.text(x, y, 'Z', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    AGuy = this.add.text(x, y, 'A', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    cursors = this.input.keyboard.createCursorKeys()
    this.physics.enable(AGuy, Phaser.Physics.ARCADE)
    AGuy.body.collideWorldBounds = true
    this.camera.follow(AGuy)
  },
  preload: function() {

  },
  create: function() {
    this.world.setBounds(0, 0, 1920, 1080)

    // Mover
    if (!AGuy) {
      AGuy = this.add.text(200, 200, 'A', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
      cursors = this.input.keyboard.createCursorKeys()
      this.physics.enable(AGuy, Phaser.Physics.ARCADE)
      AGuy.body.collideWorldBounds = true
      this.camera.follow(AGuy)
    }
    // A's Gun
    weapon = this.add.weapon(30, 'bullet')
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 100
    // bounds bullets to AGuy
    weapon.trackPointer(AGuy)
    // number of bullets per millisecond
    weapon.fireRate = 0.003
    firebutton = this.input.keyboard.addKey(Phaser.KeyCode.F)
    // Transportation
    BGuy = this.add.text(400, 400, 'B', { font: '32px Arial', fill: '#f27c4f', align: 'center' })
    this.physics.enable(BGuy, Phaser.Physics.ARCADE)
    // console.log('A Guy Stuff initial', AGuy)
  },
  update: function() {
    // console.log('A Guy Stuff', AGuy)
    // if (AGuy.body.blocked.up || AGuy.body.blocked.down || AGuy.body.blocked.left || AGuy.body.blocked.right) {
    //   this.state.start('anotherMapState', true, false, AGuy.position.x, AGuy.position.y)
    // }
    if (AGuy.body.top <= this.world.bounds.top) {
      this.state.start('anotherMapState', true, false, AGuy.position.x, AGuy.position.y+20)
    }
    if (AGuy.body.left <= this.world.bounds.left) {
      this.state.start('anotherMapState', true, false, AGuy.position.x+20, AGuy.position.y)
    }
    if (AGuy.body.down >= this.world.bounds.down) {
      this.state.start('anotherMapState', true, false, AGuy.position.x, AGuy.position.y-20)
    }
    if (AGuy.body.right >= this.world.bounds.right) {
      this.state.start('anotherMapState', true, false, AGuy.position.x-20, AGuy.position.y)
    }
    // if (AGuy.body.blocked.up) this.state.start('anotherMapState', true, false, AGuy.position.x, AGuy.position.y + 5)
    if (this.physics.arcade.collide(AGuy, BGuy)) {
      this.state.start('anotherMapState')
    }
    // if bullet collides with B, kill B!
    if (this.physics.arcade.collide(BGuy, weapon)){
      BGuy.destroy()
    }
    if (firebutton.isDown) {
      weapon.fire()
    }
    if (cursors.up.isDown) {
      AGuy.position.y -= 2
    } else if (cursors.down.isDown) {
      AGuy.position.y += 2
    } if (cursors.left.isDown) {
      AGuy.position.x -= 2
    } else if (cursors.right.isDown) {
      AGuy.position.x += 2
    }
  },
  render: function() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default mapState
