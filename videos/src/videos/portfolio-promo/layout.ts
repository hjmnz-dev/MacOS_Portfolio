// World positions at 1920x1080, measured with `stills.ts --debug` (never guessed)
export const dockY = 1015;

export const dockX: Record<string, number> = {
  finder: 745,
  safari: 831,
  photos: 917,
  contact: 1003,
  music: 1089,
  terminal: 1175,
};

export const navY = 22;
export const navContactX = 295;
export const navResumeX = 364;

// Window buttons, where the cursor clicks
export const terminalClose = { x: 183, y: 150 };
export const resumeMinimize = { x: 1165, y: 87 };
export const musicMinimize = { x: 558, y: 82 };
export const contactMinimize = { x: 845, y: 262 };

// On the current song's row, clear of its title and duration
export const musicRow = { x: 1110, y: 417 };

// On the LinkedIn card, clear of its label
export const linkedInRest = { x: 1412, y: 592 };

// The title and subtitle boxes, used to place the letter weight wave
export const subtitleBox = { left: 755, width: 409 };
export const titleBox = { left: 731, width: 458 };
export const endTitleBox = { left: 559, width: 802 };
