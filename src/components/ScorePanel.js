import { GemsDom } from "../builder.js";

export class ScorePanel extends GemsDom {
  render() {
    this.style = `
        .self{
            position:fixed;
            top:0;
            left:0;
            font-size:20rem;
        }
      `;
    this.on("ticker", this.update.bind(this));
    return () => `
        分数:${this.$state.score}
        `;
  }
}
