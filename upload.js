export const uploadFile = (selector, options = {}) => {
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

    const files = Array.from(e.target.files);
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
            <img src="${src}" alt="${file.name}"/>
        </div>
       `
        );
      };

      reader.readAsDataURL(file);
    });
  };

  openButton.addEventListener("click", triggerInput);
  input.addEventListener("change", changeHandler);
};
