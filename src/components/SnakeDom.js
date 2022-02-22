import { GemsDom } from "../builder.js";

export class SnakeDom extends GemsDom {
  render() {
    this.style = `
        .snake{
            --unit:min(2vw,2vh);
            position:absolute;
            top:0;
            left:0;
            width:var(--unit);
            height:var(--unit);
            background:#000;
        }
        .header{
            background:#003300;
            border-radius:50%;
        }
      `;
    this.on("ticker", this.update.bind(this));
    return () =>
      this.$state.snake
        .map(
          ({ x, y }, i) =>
            `<div class='snake ${
              i ? "body" : "header"
            }' style='transform:translate(calc(${x} * var(--unit)),calc(${y} * var(--unit)))'></div>`
        )
        .join("");
  }
}
