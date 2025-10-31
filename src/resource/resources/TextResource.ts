import type { RESOURCE_TYPE } from "../define";
import { Resource } from "./Resource";

export class TextResource extends Resource<typeof RESOURCE_TYPE.Text> {}
