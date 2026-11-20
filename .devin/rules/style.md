# Style

- Named exports only; `src/index.js` re-exports the public API.
- Validate input at the boundary and throw `TypeError` or `RangeError` with the offending value in the message.
