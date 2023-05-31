/**
 * Trigger Download of a file using blob data
 *
 * @param {blobData}  - Array Buffer read from http response or data read from FileReader
 * @param {string} fileName - name of the file with extension - `report.csv`
 * @param {string} - MIME type of the file - `text/csv`, `application/pdf`
 *
 */

export default (blobData, fileName, fileType) => {
  const blob = new Blob([blobData], { type: fileType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
