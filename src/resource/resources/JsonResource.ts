import type { RESOURCE_TYPE } from "../define";
import { Resource } from "./Resource";

export class JsonResource extends Resource<typeof RESOURCE_TYPE.Json> {}
