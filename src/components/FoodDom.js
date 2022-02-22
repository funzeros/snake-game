import { GemsDom } from "../builder.js";

export class FoodDom extends GemsDom {
  render() {
    this.style = `
        .self{
            --unit:min(2vw,2vh);
            position:absolute;
            top:0;
            left:0;
        }
        .food{
            width:var(--unit);
            height:var(--unit);
            background:#ff6600;
        }
      `;
    this.on("ticker", () => {
      this.update();
    });
    return () => {
      const { foodPosition: p } = this.$state;
      return `
        <div class='food' style='transform:translate(calc(${p.x} * var(--unit)),calc(${p.y} * var(--unit)))'></div>
        `;
    };
  }
}
