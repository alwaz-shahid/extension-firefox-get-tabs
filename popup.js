chrome.tabs.query({}, function(tabs) {
  // Create an empty string to store the file contents
  var fileContent = "";

  // Loop through the tabs array and add each tab's title and URL to the file contents
  for (var i = 0; i < tabs.length; i++) {
    var tab = tabs[i];
    var title = tab.title;
    var url = tab.url;
    fileContent += title + ":\n" + url + "\n\n";

    // Add the tab title and URL to the UI
    var li = document.createElement('li');
    li.innerText = title + " - " + url;
    document.getElementById('tabs-list').appendChild(li);
  }

  // When the "Save as file" button is clicked, save the file to the user's computer
  document.getElementById('save-file-btn').addEventListener('click', function() {
    // Use the chrome.fileSystem API to create a new file
    chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableEntry) {
      // Use the chrome.downloads API to download the file to the user's computer
      writableEntry.createWriter(function(writer) {
        var blob = new Blob([fileContent], {type: 'text/plain'});
        writer.write(blob);
        chrome.downloads.download({
          url: URL.createObjectURL(blob),
          filename: writableEntry.name,
          saveAs: false
        });
      });
    });
  });

  // When the "Copy links and titles" button is clicked, copy the file contents to the clipboard
  document.getElementById('copy-links-btn').addEventListener('click',function() {
    var textarea = document.createElement('textarea');
    textarea.value = fileContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Links and titles copied to clipboard!');
  });

  // Add styles to the UI
  var styles = `body { font-family: Arial, sans-serif; } h1 { font-size: 24px; font-weight: bold; margin-bottom: 20px; } li { font-size: 18px; line-height: 1.5; margin-bottom: 10px; } button { background-color: #4CAF50; border: none; color: white; padding: 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-right: 10px; border-radius: 5px; cursor: pointer; } #save-file-btn { background-color: #2196F3; } #copy-links-btn { background-color: #f44336; }`;

  var styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
});

// HTML code for the popup UI
var html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Open Tabs</title>
    </head>
    <body>
      <h1>Open Tabs</h1>
      <ul id="tabs-list"></ul>
      <button id="save-file-btn">Save as file</button>
      <button id="copy-links-btn">Copy links and titles</button>
      <script src="popup.js"></script>
    </body>
  </html>
`;

// Set the HTML code for the popup UI
chrome.browserAction.setPopup({popup: `data:text/html,${html}`});

// /* h1 { font-size: 12px; font-weight: 700; margin-bottom: 8px; } ul {
// list-style-type: none; padding: 0; margin: 0; } li { font-size: 12px;
// margin-bottom: 4px; /* border: 2px red solid; */ list-style-type: disc; }
