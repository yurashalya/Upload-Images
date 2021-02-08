import firebase from "firebase/app";
import "firebase/storage";
import { uploadFile } from "./upload.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxF-fQ7L2b0zHyerMuDWT2hMwWyt7cqDo",
  authDomain: "upload-image-88565.firebaseapp.com",
  projectId: "upload-image-88565",
  storageBucket: "upload-image-88565.appspot.com",
  messagingSenderId: "302039011869",
  appId: "1:302039011869:web:258285e30d51509feeacf4",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

uploadFile("#file", {
  multi: true,
  accept: [".png", ".jpg", ".jpeg", "gif"],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`);
      const task = ref.put(file);

      task.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
              0
            ) + "%";
          const block = blocks[index].querySelector(".preview-info-progress");
          block.textContent = percentage;
          block.style.width = percentage;
        },
        (error) => {
          console.log(error);
        },
        () => {
          task.snapshot.ref.getDownloadURL().then((url) => {
            console.log("Download URL", url);
          });
        }
      );
    });
  },
});
