import { Tween as _Tween, Group, Easing } from "@tweenjs/tween.js";

class Tween<T extends object = any> extends _Tween<T> {
    to(target: Partial<T>, duration?: number): this {
        return super.to(target, duration);
    }
}

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
