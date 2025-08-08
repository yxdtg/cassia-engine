import { resourceSystem } from "cassia-engine";

export class AudioSystem {
    constructor() {}

    public playSound(soundName: string, volume: number = 1, loop: boolean = false): void {
        const resource = resourceSystem.getAudioResource(soundName);
        if (!resource) return console.error(`Audio resource ${soundName} not found`);

        const audio = resource.data;
        audio.volume(volume);
        audio.loop(loop);
        audio.play();
    }
    public stopSound(soundName: string): void {
        const resource = resourceSystem.getAudioResource(soundName);
        if (!resource) return console.error(`Audio resource ${soundName} not found`);

        const audio = resource.data;
        audio.stop();
    }

    public pauseSound(soundName: string): void {
        const resource = resourceSystem.getAudioResource(soundName);
        if (!resource) return console.error(`Audio resource ${soundName} not found`);

        const audio = resource.data;
        audio.pause();
    }
    public resumeSound(soundName: string): void {
        const resource = resourceSystem.getAudioResource(soundName);
        if (!resource) return console.error(`Audio resource ${soundName} not found`);

        const audio = resource.data;
        audio.play();
    }
}
