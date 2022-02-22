import { GemsDom } from "../builder.js";

const MAX_CELL = 40;
const CELL_CENTER = 19;
const GAP_TIME = 200;
const between = (n, l, r) => {
  return n >= l && n < r;
};
const hitBody = (arr) => {
  const [header, ...body] = arr;
  const { x: hx, y: hy } = header;
  return body.some(({ x, y }) => {
    return x === hx && y == hy;
  });
};
const LIMIT = 5;
export const MoveHandlerKeys = Object.freeze({
  ARROWUP: 1,
  ARROWRIGHT: 3,
  ARROWLEFT: 2,
  ARROWDOWN: 4,
});
export const createStore = () => {
  const getPosition = () => {
    return {
      x: GemsDom.randomInteger(MAX_CELL),
      y: GemsDom.randomInteger(MAX_CELL),
    };
  };
  GemsDom.initStore(
    {
      foodPosition: {
        x: 0,
        y: 0,
      },
      gameStart: false,
      gameOver: false,
      score: 0,
      snake: [],
      direction: MoveHandlerKeys.ARROWUP,
      timer: 0,
      level: 1,
    },
    {
      updateFoodPosition({ state }) {
        state.foodPosition = getPosition();
      },
      startGame({ state, emit }) {
        state.gameOver = false;
        state.gameStart = true;
        state.score = 0;
        state.level = 1;
        state.snake = [{ x: CELL_CENTER, y: CELL_CENTER }];
        state.direction = MoveHandlerKeys.ARROWUP;
        emit("updateFoodPosition");
        emit("ticker");
      },
      snakeMove({ state, emit }) {
        let [header] = state.snake;
        header = { ...header };
        switch (state.direction) {
          case MoveHandlerKeys.ARROWUP:
            --header.y;
            break;
          case MoveHandlerKeys.ARROWDOWN:
            ++header.y;
            break;
          case MoveHandlerKeys.ARROWLEFT:
            --header.x;
            break;
          case MoveHandlerKeys.ARROWRIGHT:
            ++header.x;
            break;
        }
        if (
          !between(header.x, 0, MAX_CELL) ||
          !between(header.y, 0, MAX_CELL) ||
          hitBody(state.snake)
        ) {
          state.gameOver = true;
          state.gameStart = false;
          return;
        }
        state.snake.unshift(header);
        if (
          header.x === state.foodPosition.x &&
          header.y === state.foodPosition.y
        ) {
          emit("updateFoodPosition");
          state.level = Math.ceil(++state.score / 10);
          return;
        }
        state.snake.pop();
      },
      ticker({ state, emit }) {
        clearTimeout(state.timer);
        if (state.gameOver) {
          emit("gameOver");
          return;
        }
        emit("snakeMove");
        state.timer = setTimeout(() => {
          emit("ticker");
        }, Math.trunc(GAP_TIME / state.level));
      },
      setDirection({ state, emit }, payload) {
        if (state.direction + payload === LIMIT) return;
        state.direction = payload;
        emit("ticker");
      },
      ARROWUP({ state }) {
        console.log(state);
      },
      ARROWDOWN({ state }) {
        console.log(state);
      },
      ARROWLEFT({ state }) {
        console.log(state);
      },
      ARROWRIGHT({ state }) {
        console.log(state);
      },
    }
  );
};
