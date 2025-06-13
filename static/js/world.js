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
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // basic blue sky background

    this.wallMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false});
    this.size = 5;
    this.wallHeight = 3;
    this.wallThickness = 0.5;

    // methods call 

    this.createGround();
    this.createMaze(this.size, this.wallHeight, this.wallThickness);
  }


  // setup maze generation


  createWall(x, z, width, depth, height) {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      this.wallMaterial
    );
    wall.position.set(x, height / 2, z);
    this.scene.add(wall);
  }

  createMaze(s, height, thickness) {
    const maze = MazeAlgo(10, 10);
    const size = s;
    const wallHeight = height;
    const wallThickness = thickness;

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        const cell = maze[y][x];
        const cx = x * size - (maze[0].length * size) / 2;
        const cz = y * size - (maze.length * size) / 2;

        if (cell.walls[0]) {
          this.createWall(cx, cz - size / 2, size, wallThickness, wallHeight); // top
        }
        if (cell.walls[1]) {
          this.createWall(cx + size / 2, cz, wallThickness, size, wallHeight); // right
        }
        if (cell.walls[2]) {
          this.createWall(cx, cz + size / 2, size, wallThickness, wallHeight); // bottom
        }
        if (cell.walls[3]) {
          this.createWall(cx - size / 2, cz, wallThickness, size, wallHeight); // left
        }
      }
    }

    maze[0][0].walls[3] = false; 
    maze[maze.length - 1][maze[0].length - 1].walls[1] = false;
  }




  // setup test world gen func
  createGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({ color: 0x00aa00})
    );
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
    this.scene.add(new THREE.GridHelper(100, 100));
  }


}