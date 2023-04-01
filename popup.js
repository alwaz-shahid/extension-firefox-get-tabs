// Get all open tabs and their details
chrome.tabs.query({}, function(tabs) {
    // Create an empty string to store the file contents
    // Firefox
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
  
    // When the "Save to file" button is clicked, save the file to the user's computer
    document.getElementById('save-btn').addEventListener('click', function() {
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
    document.getElementById('copy-btn').addEventListener('click', function() {
      var textarea = document.createElement('textarea');
      textarea.value = fileContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Links and titles copied to clipboard!');
    });
  });
  