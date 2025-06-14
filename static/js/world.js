import * as THREE from "three";

function MazeAlgo(width, height) { // recursive backtracking algo
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ visited: false, walls: [true, true, true, true] }))
  );

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function carve(x, y) {
    const directions = shuffle([
      [0, -1, 0], // top
      [1, 0, 1],  // right
      [0, 1, 2],  // bottom
      [-1, 0, 3], // left
    ]);

    maze[y][x].visited = true;

    for (const [dx, dy, dir] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (ny >= 0 && ny < height && nx >= 0 && nx < width && !maze[ny][nx].visited) {
        maze[y][x].walls[dir] = false;
        maze[ny][nx].walls[(dir + 2) % 4] = false;
        carve(nx, ny);
      }
    }
  }

  carve(0, 0);
  return maze;
}


export class World {
  constructor(width, height) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2e4482); // basic blue sky background

    this.size = 5;
    this.wallHeight = 5;
    this.wallThickness = 0.5;

    this.mazeHeight = height;
    this.mazeWidth = width;

    // methods call 

    this.createGround();
    this.createLight(); // true / false arg for visual representation
    this.createMaze(this.mazeWidth, this.mazeHeight, this.size, this.wallHeight, this.wallThickness);
  }


  // setup maze generation


  createWall(x, z, width, depth, height, wallTexture) { // texture looks like ass
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ map: wallTexture})
    );

    wall.position.set(x, height / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    this.scene.add(wall);
  }

  createMaze(mazeWidth, mazeHeight,size, wallHeight,wallThickness ) { 
    const maze = MazeAlgo(mazeWidth, mazeHeight);

    maze[0][0].walls[3] = false; 
    maze[maze.length - 1][maze[0].length - 1].walls[1] = false;

    const wallTexture = new THREE.TextureLoader().load("static/assets/wall.jpg");
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(3,3);  // repeated to avoid stretching


    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        const cell = maze[y][x];
        const cx = x * size - (maze[0].length * size) / 2;
        const cz = y * size - (maze.length * size) / 2;

        if (cell.walls[0]) {
          this.createWall(cx, cz - size / 2, size, wallThickness, wallHeight,wallTexture); // top
        }
        if (cell.walls[1]) {
          this.createWall(cx + size / 2, cz, wallThickness, size, wallHeight,wallTexture); // right
        }
        if (cell.walls[2]) {
          this.createWall(cx, cz + size / 2, size, wallThickness, wallHeight,wallTexture); // bottom
        }
        if (cell.walls[3]) {
          this.createWall(cx - size / 2, cz, wallThickness, size, wallHeight,wallTexture); // left
        }
      }
    }

  }




  // setup test world gen func
  createGround() {
    const groundTexture = new THREE.TextureLoader().load("static/assets/ground.jpg");
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(50,50);  // repeated to avoid stretching


    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ map: groundTexture})
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    // this.scene.add(new THREE.GridHelper(100, 100));
  }

  createLight(lightHelper = false ){
    const ambientLight = new THREE.AmbientLight(0xffffff,0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // bruuuuh
    directionalLight.position.set(10,20,10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    this.scene.add(directionalLight);

    if (lightHelper){
    const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    this.scene.add(helper);
    }

  }


}