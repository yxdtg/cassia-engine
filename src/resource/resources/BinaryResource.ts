import type { RESOURCE_TYPE } from "../define";
import { Resource } from "./Resource";

export class BinaryResource extends Resource<typeof RESOURCE_TYPE.Binary> {}
