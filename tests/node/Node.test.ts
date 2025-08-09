import { expect, test } from "vitest";
import { Draggable, Node } from "../../dist";

test("Node add component", () => {
    const myNode = new Node();
    const draggable = myNode.addComponent(Draggable);

    expect(draggable).not.toBeNull();
    expect(myNode.getComponent(Draggable)).toBe(draggable);
    expect(myNode.getComponent("Draggable")).toBe(draggable);
    expect(myNode.getComponent(0)).toBe(draggable);
    expect(myNode.components.length).toBe(1);
});

test("Node transform", () => {
    const myNode = new Node();
    myNode.setPosition(100, 200);

    const child1 = new Node();
    child1.parent = myNode;
    child1.setPosition(300, 50);

    const child2 = new Node();
    child2.parent = child1;
    child2.setPosition(45, 22);

    const child3 = new Node();
    child3.parent = child2;
    child3.setPosition(99, 100);

    const child3WorldPosition = child3.getWorldPosition();
    const child3LocalPosition = child3.parent.toLocalPosition(child3WorldPosition);

    expect(child3LocalPosition).toEqual(child3.position);
});
