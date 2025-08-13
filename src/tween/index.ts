import { Tween, Group, Easing } from "@tweenjs/tween.js";

export { Tween, Group, Easing };

const tweenGroup = new Group();

/**
 * @internal
 * @param time
 */
export function updateTweens(time: number): void {
    tweenGroup.update(time);
}

export function tween<T extends object>(target: T): Tween<T> {
    const tween = new Tween<T>(target);
    tweenGroup.add(tween);

    return tween;
}
