const bytesToSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (!bytes) {
    return "0 Byte";
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};

export const uploadFile = (selector, options = {}) => {
  let files = [];
  const input = document.querySelector(selector);
  const preview = document.createElement("div");

  preview.classList.add("preview");

  const openButton = document.createElement("button");
  openButton.classList.add("btn");
  openButton.textContent = "Open";

  if (options.multi) {
    input.setAttribute("multiple", true);
  }
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute("accept", options.accept.join(","));
  }

  input.insertAdjacentElement("afterend", preview);
  input.insertAdjacentElement("afterend", openButton);

  const triggerInput = () => input.click();
  const changeHandler = (e) => {
    if (!e.target.files.length) {
      return;
    }

    files = Array.from(e.target.files);

    preview.innerHTML = "";
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

    // if (!files.length) {
    //   upload.style.display = "none";
    // }

    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest(".preview-image");

    block.classList.add("removing");
    setTimeout(() => block.remove(), 300);
  };

  openButton.addEventListener("click", triggerInput);
  input.addEventListener("change", changeHandler);
  preview.addEventListener("click", removeHandler);
};
