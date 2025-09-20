// Image Preview
const uploadImg = document.querySelector("[upload-image]");
if (uploadImg) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const removeImage = document.querySelector("[remove-image]");
  const imagePreviewWrapper = document.querySelector(".image-preview-wrapper");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra file có phải là ảnh không
      if (file.type.startsWith("image/")) {
        uploadImagePreview.src = URL.createObjectURL(file);
        imagePreviewWrapper.classList.add("active");
      } else {
        alert("Vui lòng chọn file ảnh hợp lệ!");
        uploadImageInput.value = "";
      }
    }
  });

  removeImage.addEventListener("click", (e) => {
    e.preventDefault();
    // Revoke object URL để tránh memory leak
    if (uploadImagePreview.src.startsWith("blob:")) {
      URL.revokeObjectURL(uploadImagePreview.src);
    }
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
    imagePreviewWrapper.classList.remove("active");
  });
}

// Audio Preview
const uploadAudio = document.querySelector("[upload-audio]");
if (uploadAudio) {
  const uploadAudioInput = document.querySelector("[upload-audio-input]");
  const uploadAudioPreview = document.querySelector("[upload-audio-preview]");
  const removeAudio = document.querySelector("[remove-audio]");
  const audioPreviewWrapper = document.querySelector(".audio-preview-wrapper");
  const audioFilename = document.querySelector(".audio-filename");
  const audioSize = document.querySelector(".audio-size");

  uploadAudioInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra file có phải là audio không
      if (file.type.startsWith("audio/")) {
        // Tạo object URL cho audio
        const audioUrl = URL.createObjectURL(file);
        uploadAudioPreview.src = audioUrl;

        // Hiển thị thông tin file
        audioFilename.textContent = file.name;
        audioSize.textContent = formatFileSize(file.size);

        // Hiển thị preview wrapper
        audioPreviewWrapper.classList.add("active");
      } else {
        alert("Vui lòng chọn file audio hợp lệ!");
        uploadAudioInput.value = "";
      }
    }
  });

  removeAudio.addEventListener("click", (e) => {
    e.preventDefault();
    // Revoke object URL để tránh memory leak
    if (uploadAudioPreview.src.startsWith("blob:")) {
      URL.revokeObjectURL(uploadAudioPreview.src);
    }
    uploadAudioInput.value = "";
    uploadAudioPreview.src = "";
    audioFilename.textContent = "";
    audioSize.textContent = "";
    audioPreviewWrapper.classList.remove("active");
  });

  // Hàm format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Cleanup khi trang được unload
window.addEventListener("beforeunload", () => {
  const imagePreview = document.querySelector("[upload-image-preview]");
  const audioPreview = document.querySelector("[upload-audio-preview]");

  if (imagePreview && imagePreview.src.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.src);
  }

  if (audioPreview && audioPreview.src.startsWith("blob:")) {
    URL.revokeObjectURL(audioPreview.src);
  }
});
