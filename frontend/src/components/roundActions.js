// Buttons on a game's "Well done" card. Inside a chapter's rounds the first button moves on.
export function doneActions(round, onReplay, onExit) {
  if (round && round.onNext) {
    return [
      { label: 'Next round ▶', primary: true, onClick: round.onNext },
      { label: 'Play again', onClick: onReplay },
    ];
  }
  return [
    { label: 'Play again', primary: true, onClick: onReplay },
    { label: 'Back to chapters', onClick: onExit },
  ];
}
