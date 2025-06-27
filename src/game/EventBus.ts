import { Events } from "phaser";

export enum GameEvents {
  GAME_CONTAINER_POINTER_DOWN = "game-container-pointer-down",
  UPDATE_GAME_SCENE = "update-game-scene",
  TOGGLE_SOUND = "toggle-sound",
}

// Used to emit events between components, HTML and Phaser scenes
export const EventBus = new Events.EventEmitter();
