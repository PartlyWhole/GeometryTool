import { solve } from "./solver";
self.onmessage = (event) => {
  try {
    const { id, board, targets, budget } = event.data;
    self.postMessage({ id, ...solve(board, targets, budget) });
  } catch (error) {
    self.postMessage({
      id: event.data.id,
      ok: false,
      message: (error as Error).message,
    });
  }
};
