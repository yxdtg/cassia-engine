import { Tween as _Tween, Easing, Group } from "@tweenjs/tween.js";
import { secondsToMs } from "cassia-engine/utils";

class Tween<T extends object = any> extends _Tween<T> {
    to(target: Partial<T>, duration: number = 1): this {
        return super.to(target, secondsToMs(duration));
    }

    duration(duration: number = 1): this {
        return super.duration(secondsToMs(duration));
    }
}

export { Easing, Group, Tween };

const tweenGroup = new Group();

/**
 * @internal
 * @param time
 */
export function updateAllTweens(time: number): void {
    tweenGroup.update(time);
}

export function clearAllTweens(): void {
    tweenGroup.removeAll();
}

export function tween<T extends object>(target: T): Tween<T> {
    const tween = new Tween<T>(target);
    tweenGroup.add(tween);

    return tween;
}
