const { Machine } = require("xstate");

const progressBar = new Machine({
  id: "progress",
  initial: "idle",
  states: {
    idle: {
      on: {
        INIT: "requesting",
        FAIL: "failed",
      },
    },
    requesting: {
      type: "compound",
      initial: "active",
      states: {
        active: {
          on: {
            TRANSITION: "#progress.generating",
            FAIL: "#progress.failed",
            CANCEL: "cancel",
            ERROR: "error",
          },
        },
        error: {
          type: "final",
        },
        cancel: {
          type: "final",
        },
      },
    },
    generating: {
      type: "compound",
      initial: "active",
      states: {
        active: {
          on: {
            TRANSITION: "#progress.success",
            FAIL: "#progress.failed",
            CANCEL: "cancel",
            ERROR: "error",
          },
        },
        error: {
          type: "final",
        },
        cancel: {
          type: "final",
        },
      },
    },
    success: {
      type: "final",
    },
    failed: {
      type: "final",
    },
  },
});

const { initialState } = progressBar;

function toNextState(status, state) {
  switch (status) {
    case "idle":
      break;
    case "requesting":
      return progressBar.transition(state, "INIT");
    case "generating":
      return progressBar.transition(state, "TRANSITION");
    case "successful":
      return progressBar.transition(state, "TRANSITION");
    case "canceled":
      return progressBar.transition(state, "CANCEL");
    case "error":
      return progressBar.transition(state, "ERROR");
    case "failed":
      return progressBar.transition(state, "FAIL");
    default:
      throw new Error("Unknown status");
  }
  return state;
}

function happyPath(state) {
  // Go from idle to requesting
  let nextState = toNextState("requesting", state);

  // Go from requesting to generating
  nextState = toNextState("generating", state);

  // Go from generating to successful
  nextState = toNextState("successful", state);

  nextState.matches("success"); // true
}

function failedPath(state) {
  // Go from idle to requesting
  let nextState = toNextState("requesting", state);

  // Go from requesting to generating
  nextState = toNextState("generating", state);

  // Go from generating to failed
  nextState = toNextState("failed", state)

  nextState.matches("failed") // true
}

function cancelGenerating(state) {
  // Go from idle to requesting
  let nextState = toNextState("requesting", state);

  // Go from requesting to generating
  nextState = toNextState("generating", state);

  // Cancel generating
  nextState = toNextState("canceled", state);

  nextState.matches("generating.cancel") // true
 }

module.exports = {
  progressBar,
  toNextState,
  initialState,
};
