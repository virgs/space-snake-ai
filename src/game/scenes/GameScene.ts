import { Scene } from "phaser";

import { EventBus, GameEvents } from "../EventBus";

export class GameScene extends Scene {
  public constructor() {
    super("GameScene");
  }

  public async init() {}

  public create() {
    EventBus.emit(GameEvents.UPDATE_GAME_SCENE, this);
  }

  public async startGame() {}
}
