import StackQuest from '../main'

let cursors, AGuy, BGuy, weapon, firebutton
const mapState = {
  init: function(x, y) {
    this.world.setBounds(0, 0, 1920, 1080)
    this.physics.startSystem(Phaser.Physics.P2JS)
    if (!x && !y) return
    AGuy = this.add.text(x, y, 'A', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    cursors = this.input.keyboard.createCursorKeys()
    this.physics.p2.enable(AGuy)
    AGuy.body.collideWorldBounds = true
    this.physics.p2.updateBoundsCollisionGroup()
  },
  preload: function() {
    this.load.image('bullet', 'bullet.png')
  },
  create: function() {
    // Mover
    if (!AGuy) {
      AGuy = this.add.text(200, 200, 'A', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
      cursors = this.input.keyboard.createCursorKeys()
      this.physics.p2.enable(AGuy)
      AGuy.body.collideWorldBounds = true
      this.physics.p2.updateBoundsCollisionGroup()
      this.camera.follow(AGuy)
    }
    // A's Gun
    // weapon = this.add.weapon(30, 'bullet')
    // weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    // weapon.bulletSpeed = 100
    // bounds bullets to AGuy
    // weapon.trackPointer(AGuy)
    // number of bullets per millisecond
    // weapon.fireRate = 0.003
    this.createBullets()
    console.log('bullets', this.bullets)
    firebutton = this.input.keyboard.addKey(Phaser.KeyCode.F)
    // Transportation
    BGuy = this.add.text(400, 400, 'B', { font: '32px Arial', fill: '#f27c4f', align: 'center' })

    this.camera.follow(AGuy)

    BGuy = this.add.text(400, 400, 'B', { font: '32px Arial', fill: '#f27c4f', align: 'center' })
    this.physics.p2.enable(BGuy)
  },
  update: function() {

    if (AGuy.position.y <= this.world.bounds.top) {
      this.state.start('anotherMapState', true, false, AGuy.position.x, this.world.bounds.bottom - 20)
    }
    if (AGuy.position.x <= this.world.bounds.left) {
      this.state.start('anotherMapState', true, false, this.world.bounds.right - 20, AGuy.position.y)
    }
    if (AGuy.position.y >= this.world.bounds.bottom) {
      this.state.start('anotherMapState', true, false, AGuy.position.x, this.world.bounds.top + 20)
    }
    if (AGuy.position.x >= this.world.bounds.right) {
      this.state.start('anotherMapState', true, false, this.world.bounds.left + 20, AGuy.position.y)
    }

    if (firebutton.isDown) {
      // weapon.fire()
      console.log('Bullet fired!', this.bullets)

      this.bullets.children.forEach((bullet) => {
        bullet.body.setZeroVelocity()
        bullet.body.moveUp(200)
        console.log('')
      })
    }
    if (this.physics.arcade.collide(AGuy, BGuy)) {
      this.state.start('anotherMapState')
    }
    AGuy.body.setZeroVelocity()
    if (cursors.up.isDown) {
      AGuy.body.moveUp(200)
    } else if (cursors.down.isDown) {
      AGuy.body.moveDown(200)
      console.log('bullets position?', this.bullets)
    } if (cursors.left.isDown) {
      AGuy.body.moveLeft(200)
    } else if (cursors.right.isDown) {
      AGuy.body.moveRight(200)
    }
  },
  render: function() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  },
  // function to create bullet group
  createBullets: function() {
    this.bullets = this.add.group()
    this.bullets.enableBody = true
    this.bullets.physicsBodyType = Phaser.Physics.P2JS
    this.bullets.createMultiple(2, 'bullet', 0, false)
    this.bullets.setAll('outOfBoundsKill', true)
    this.bullets.setAll('checkWorldBounds', true)
    this.bullets.setAllChildren('position.x', AGuy.position.x)
    this.bullets.setAllChildren('position.y', AGuy.position.y)
    console.log('Are bullets bounds?', this.bullets)
  }
}

export default mapState
