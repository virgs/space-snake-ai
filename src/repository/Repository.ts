export class Repository {
  public static isMuted(): boolean {
    const saved = localStorage.getItem("isMuted");
    if (saved) {
      return JSON.parse(saved || "{}") as boolean;
    } else {
    }
    Repository.saveMute(false);
    return false;
  }
  public static saveMute(isMuted: boolean) {
    localStorage.setItem("isMuted", JSON.stringify(isMuted));
  }
}
