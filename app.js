import { uploadFile } from "./upload.js";

uploadFile("#file", {
  multi: true,
  accept: [".png", ".jpg", ".jpeg", "gif"],
});
