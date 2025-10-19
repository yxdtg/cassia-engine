export const SPINE_ANIMATION_EVENT_TYPE = {
    SpineAnimationStart: "spine-animation-start",
    SpineAnimationEnd: "spine-animation-end",
    SpineAnimationComplete: "spine-animation-complete",
} as const;
export type SPINE_ANIMATION_EVENT_TYPE = (typeof SPINE_ANIMATION_EVENT_TYPE)[keyof typeof SPINE_ANIMATION_EVENT_TYPE];
