import { GemsDom } from "../builder.js";
import { MoveHandlerKeys } from "../store/index.js";

export class MainSence extends GemsDom {
  render() {
    addEventListener("resize", this.update.bind(this), false);
    addEventListener(
      "keydown",
      (e) => {
        e.preventDefault();
        if (!this.$state.gameStart) return;
        const key = e.key.toUpperCase();
        if (Object.keys(MoveHandlerKeys).includes(key)) {
          this.emit("setDirection", MoveHandlerKeys[key]);
        }
      },
      false
    );
    return () => {
      const ua = navigator.userAgent.toLowerCase();
      const mobile = /mobile/gi.test(ua);
      this.style = `
          .self{
            position:fixed;
            top:0;
            left:0;
            width:100vw;
            height:100vh;
            background-color:#f6f6f6;
            font-size:32rem;
            display:flex;
            flex-direction: column;
            align-items:center;
            justify-content:center;
            box-sizing: border-box;
            ${mobile ? "padding-bottom:34rem;" : ""}
          }
          .screen{
              --size:min(80vw,80vh);
              width:var(--size);
              height:var(--size);
              border:2px solid #000;
              background:#999;
              position:relative;
          }
          `;
      return `
        <div class='screen'>
            <score-panel></score-panel>
            <snake-dom></snake-dom>
            <food-dom></food-dom>
        </div>
        ${mobile ? `<virtual-key></virtual-key>` : ""}
        <start-game></start-game>
        `;
    };
  }
}
