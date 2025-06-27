import { Scene } from "phaser";

export class PreloaderScene extends Scene {
  constructor() {
    super("Preloader");
  }

  preload() {}

  create() {
    this.scene.start("GameScene");
  }
}
