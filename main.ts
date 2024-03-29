import { SizeHint, Webview } from "https://deno.land/x/webview@0.7.6/mod.ts";

const os = Deno.build.os;
let height = 600;
if (os === "darwin") {
  // osx seems to have a 28px title bar
  height = 628;
}

const webview = new Webview(true, {
  width: 600,
  height,
  hint: SizeHint.FIXED,
});

function url2buf(url: string) {
  const base64 = url.split(",")[1];
  const bytes = atob(base64);
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    buffer[i] = bytes.charCodeAt(i);
  }
  return buffer;
}

// webview.run has taken ahold of it only allowing sync callbacks
// https://github.com/webview/webview_deno/issues/131
webview.bind("save", (data: string) => {
  // pic_yyyy-mm-dd-hh-mm-ss.png
  const filename = "pic_" + new Date().toISOString().replace(/:/g, "-") +
    ".png";
  Deno.writeFileSync(filename, url2buf(data));
  return { ok: true, filename };
});

webview.bind("saveRecent", (data: string) => {
  Deno.writeFileSync("output.png", url2buf(data));
  return { ok: true, filename: "output.png" };
});

webview.bind("loadRecent", () => {
  const data = Deno.readFileSync("output.png");
  const base64 = btoa(String.fromCharCode(...data));
  return { data: `data:image/png;base64,${base64}` };
});

webview.title = "Paper | [Enter] clear & save";
webview.navigate("https://hashrock.github.io/deno-paper-app/");
webview.run();
