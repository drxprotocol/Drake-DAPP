import {Buffer} from "buffer";
import process from "process";

window.Buffer = Buffer;
window.global = window.globalThis;
window.process = process;
