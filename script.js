// script.js
function generateCSV() {
    // Get the form data
    const form = document.getElementById('dataForm');
    const name = form.elements['name'].value;
    const email = form.elements['email'].value;

    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email\n"
        + `${name},${email}\n`;

    // Encode the CSV content
    const encodedUri = encodeURI(csvContent);

    // Create a link element
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");

    // Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}