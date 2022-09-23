import { SizeHint, Webview } from "https://deno.land/x/webview/mod.ts";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { dirname, join } from "https://deno.land/std/path/mod.ts";

function bundle(indexPath: string) {
  const base = dirname(indexPath);

  const htmlFile = Deno.readTextFileSync(indexPath);

  const doc = new DOMParser().parseFromString(htmlFile, "text/html")!;
  const scripts = doc.querySelectorAll("script");

  for (const script of scripts) {
    if (script instanceof Element) {
      const el = script as Element;
      const src = el.getAttribute("src");
      if (src) {
        const js = Deno.readTextFileSync(join(base, src));
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
        const css = Deno.readTextFileSync(join(base, href));
        const newStyle = doc.createElement("style");
        newStyle.innerHTML = css;
        el.replaceWith(newStyle);
      }
    }
  }

  return doc.querySelector("html")?.outerHTML!;
}

const html = bundle("frontend/index.html");
const webview = new Webview(true, {
  width: 600,
  height: 600,
  hint: SizeHint.FIXED,
});

// webview.run has taken ahold of it only allowing sync callbacks 
// https://github.com/webview/webview_deno/issues/131
webview.bind("save", (data: string) => {
  const base64 = data.split(",")[1];
  const bytes = atob(base64);
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    buffer[i] = bytes.charCodeAt(i);
  }
  Deno.writeFileSync("output.png", buffer);
  console.log("saved")
  return { ok: true };
});

webview.bind("loadRecent",  () => {
  console.log("loadRecent")
  const data = Deno.readFileSync("output.png");
  const base64 = btoa(String.fromCharCode(...data));
  return {data: `data:image/png;base64,${base64}`};
});

webview.title = "Paper";
webview.navigate(`data:text/html,${encodeURIComponent(html)}`);
webview.run();
