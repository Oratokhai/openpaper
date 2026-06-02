import { createLowlight, common } from "lowlight";

/** Shared lowlight instance with the common language grammars registered. */
export const lowlight = createLowlight(common);
