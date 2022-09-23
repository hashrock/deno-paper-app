import { Webview } from "https://deno.land/x/webview/mod.ts";
import {
  DOMParser,
  Element,
  Comment,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const htmlFile = Deno.readTextFileSync("./frontend/index.html");
const jsFile = Deno.readTextFileSync("./frontend/main.js");

const doc = new DOMParser().parseFromString(htmlFile, "text/html")!;
const head = doc.querySelector("head")!;
const script = doc.createElement("script");
script.innerText = jsFile;
head.append(script);

const html = doc.querySelector("html")?.outerHTML!;
const webview = new Webview();

webview.navigate(`data:text/html,${encodeURIComponent(html)}`);
webview.run();
