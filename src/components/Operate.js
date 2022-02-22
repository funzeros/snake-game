import { GemsDom } from "../builder.js";
import { MoveHandlerKeys } from "../store/index.js";

export class StartGame extends GemsDom {
  render() {
    const handleStart = () => {
      this.emit("startGame");
      this.update();
    };
    this.on("gameOver", this.update.bind(this));
    return () => {
      if (this.$state.gameStart) {
        this.style = "";
        return "";
      }
      this.style = `
        .self{
            position:fixed;
            top:0;
            left:0;
            width:100vw;
            height:100vh;
            background:rgba(0,0,0,0.7);
            display:flex;
            justify-content:center;
            align-items:center; 
            flex-direction:column;
        }
        .button{
            padding:6rem 20rem;
            background:#fff;
            box-shadow:0 0 0 10rem #bbb;
            border-radius:10rem;
        }
        .score{
          color:#fff;
          margin-bottom:50rem;
        }
    `;
      this.handler(() => {
        this.ref("button").addEventListener("click", handleStart, false);
      });
      return this.$state.gameOver
        ? `
            <div class='score'>得分${this.$state.score}</div>
            <div class='button' ref='button'>重新开始</div>
            `
        : `<div class='button' ref='button'>开始游戏</div>`;
    };
  }
}

export class VirtualKey extends GemsDom {
  render() {
    this.style = `
      .self{
          --size:200rem;
          margin-top:20rem;
          height: var(--size);
          width:var(--size);
          transform:rotateZ(45deg);
          border-radius:50%;
          border:1px solid #666;
          overflow:hidden;
      }
      .key{
        display:inline-block;
        width:50%;
        height:50%;
        text-align:center;
        line-height:calc(var(--size) / 2);
        border:1px solid #666;
        box-sizing:border-box;
        background:#eee;
      }
      .key:active{
        box-shadow:0 0 30rem #bbb inset;
      }
      span{
        display:inline-block;
        transform:rotate(calc(var(--k) * 90deg - 45deg));
        pointer-events:none;
      }
      .key:active span{
        transform:rotate(calc(var(--k) * 90deg - 45deg)) scale(0.9);
      }
    `;
    const rotate = [4, 1, 3, 2];
    this.handler(() => {
      this.refs("key").forEach((item) => {
        item.addEventListener(
          "touchstart",
          (e) => {
            e.preventDefault();
            console.log(e);
            this.emit("setDirection", +e.target.dataset.key);
          },
          false
        );
      });
    });
    return () =>
      Object.values(MoveHandlerKeys)
        .map(
          (v, i) =>
            `<div class='key' ref='key'  data-key='${v}'>
              <span style='--k:${rotate[i]}'>
              ↑
              </span>
            </div>`
        )
        .join("");
  }
}
