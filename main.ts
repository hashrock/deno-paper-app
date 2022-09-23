import { Webview } from "https://deno.land/x/webview/mod.ts";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const htmlFile = Deno.readTextFileSync("./frontend/index.html");

const doc = new DOMParser().parseFromString(htmlFile, "text/html")!;
const scripts = doc.querySelectorAll("script")

for (const script of scripts) {
  if (script instanceof Element) {
    const el = script as Element;
    const src = el.getAttribute("src");
    if (src) {
      const js = Deno.readTextFileSync(`./frontend/${src}`);
      const newScript = doc.createElement("script");
      newScript.innerHTML = js;
      el.replaceWith(newScript);
    }
  }
}

const styles = doc.querySelectorAll("link[rel=stylesheet]");
for (const style of styles) {
  if (style instanceof Element) {
    const el = style as Element;
    const href = el.getAttribute("href");
    if (href) {
      const css = Deno.readTextFileSync(`./frontend/${href}`);
      const newStyle = doc.createElement("style");
      newStyle.innerHTML = css;
      el.replaceWith(newStyle);
    }
  }
}

const html = doc.querySelector("html")?.outerHTML!;
const webview = new Webview();

webview.navigate(`data:text/html,${encodeURIComponent(html)}`);
webview.run();
