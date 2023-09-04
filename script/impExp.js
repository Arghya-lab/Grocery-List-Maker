/*  */
function exportData() {
  const dataToExport = localStorage.getItem("list");

  if (dataToExport) {
    // Create a Blob with the data (assuming it's in text format)
    const blob = new Blob([dataToExport], { type: "json" });
    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);
    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json"; // Set the desired file name
    // Trigger a click event to start the download
    a.click();
    // Release the temporary URL
    window.URL.revokeObjectURL(url);
  } else {
    console.log("Data not found in localStorage.");
  }
}
document.getElementById("exportBtn").addEventListener("click", exportData);


const importButton = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");

importButton.addEventListener("click", function () {
  fileInput.click();
});

fileInput.addEventListener("change", function () {
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onload = function (event) {
      const jsonContent = event.target.result;
      localStorage.setItem("list", jsonContent);
      console.log("JSON data importeded and saved to localStorage.");
    };
  }
});
