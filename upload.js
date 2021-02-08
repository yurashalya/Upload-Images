const bytesToSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (!bytes) {
    return "0 Byte";
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag);

  if (classes.length) {
    node.classList.add(...classes);
  }

  if (content) {
    node.textContent = content;
  }

  return node;
};

const empty = () => {};

export const uploadFile = (selector, options = {}) => {
  let files = [];
  const onUpload = options.onUpload ?? empty;

  const input = document.querySelector(selector);
  const preview = element("div", ["preview"]);
  const openButton = element("button", ["btn"], "Open");
  const uploadButton = element("button", ["btn", "primary"], "Upload");
  uploadButton.style.display = "none";

  if (options.multi) {
    input.setAttribute("multiple", true);
  }
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute("accept", options.accept.join(","));
  }

  input.insertAdjacentElement("afterend", preview);
  input.insertAdjacentElement("afterend", uploadButton);
  input.insertAdjacentElement("afterend", openButton);

  const triggerInput = () => input.click();
  const changeHandler = (e) => {
    if (!e.target.files.length) {
      return;
    }

    files = Array.from(e.target.files);

    preview.innerHTML = "";
    uploadButton.style.display = "inline";

    files.forEach((file) => {
      if (!file.type.match("image")) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (ev) => {
        const src = ev.target.result;
        preview.insertAdjacentHTML(
          "afterbegin",
          `
            <div class="preview-image">
                <div class="preview-remove" data-name="${
                  file.name
                }">&times;</div>
                <img src="${src}" alt="${file.name}"/>
                <div class="preview-info">
                    <span>${file.name}</span>
                    ${bytesToSize(file.size)}
                </div>
            </div>
       `
        );
      };

      reader.readAsDataURL(file);
    });
  };
  const removeHandler = (e) => {
    if (!e.target.dataset.name) {
      return;
    }

    const { name } = e.target.dataset;
    files = files.filter((file) => file.name !== name);

    if (!files.length) {
      uploadButton.style.display = "none";
    }

    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest(".preview-image");

    block.classList.add("removing");
    setTimeout(() => block.remove(), 300);
  };

  const clearPreview = (el) => {
    el.style.bottom = "4px";
    el.innerHTML = '<div class="preview-info-progress"></div>';
  };

  const uploadHandler = () => {
    preview.querySelectorAll(".preview-remove").forEach((e) => e.remove());
    const previewInfo = preview.querySelectorAll(".preview-info");
    previewInfo.forEach(clearPreview);
    onUpload(files, previewInfo);
  };

  openButton.addEventListener("click", triggerInput);
  input.addEventListener("change", changeHandler);
  preview.addEventListener("click", removeHandler);
  uploadButton.addEventListener("click", uploadHandler);
};
