import { Scene } from "phaser";
import { Repository } from "../../repository/Repository";
import { EventBus, GameEvents } from "../EventBus";
import { gameConstants } from "../GameConstants";

export class AudioController {
  private readonly scene: Scene;
  private readonly coinAudio:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  private readonly flapAudio:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  private readonly diedAudio:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  private isMuted: boolean;

  public constructor(scene: Phaser.Scene) {
    this.isMuted = Repository.isMuted();
    this.scene = scene;
    const config = { volume: 0.4 };
    this.coinAudio = this.scene.sound.add(
      gameConstants.audioAssets.coin.key,
      config
    );
    this.flapAudio = this.scene.sound.add(
      gameConstants.audioAssets.flap.key,
      config
    );
    this.diedAudio = this.scene.sound.add(
      gameConstants.audioAssets.drop.key,
      config
    );

    EventBus.on(GameEvents.TOGGLE_SOUND, (value: boolean) => {
      this.isMuted = value;
    });
  }

  public destroy() {
    EventBus.removeListener(GameEvents.TOGGLE_SOUND);
  }
}
