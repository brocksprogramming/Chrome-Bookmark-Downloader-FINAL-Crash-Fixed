/*
Copyright Brock Lynch 2020-2023

This file is part of Chrome Bookmarked Website Dowloader.

Chrome Bookmarked Website Dowloader is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Chrome Bookmarked Website Dowloader is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Chrome Bookmarked Website Dowloader. If not, see <https://www.gnu.org/licenses/>.
*/
window.addEventListener('DOMContentLoaded', (event) => {
// Traverse the bookmark tree, and print the folder and nodes.
function addBookmarks() {
  chrome.storage.local.get("downloadedUrls", function (result) {
    downloadedUrls = result.downloadedUrls;
    if(typeof downloadedUrls === "undefined") {
      downloadedUrls = [];
    }
    console.log('downloadedUrls retrieved: ' + downloadedUrls);
    // Traverse the bookmark tree, and dynamically generate the list of bookmarks
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
      var list = $('#bookmarks');
      for (var i = 0; i < bookmarkTreeNodes.length; i++) {
        addBookmarkNode(bookmarkTreeNodes[i], list, downloadedUrls, i);
      }
    });
  });
}

function addBookmarkNode(node, list, downloadedUrls) {
  // If the node has a title and is not a folder, add it to the list
  if (node.title && !node.children) {
	if (typeof downloadedUrls !== "undefined") {
		var isChecked = downloadedUrls.includes(node.url); // check if the bookmark's URL is in the downloadedUrls array
	}
    else{
		var isChecked = ""
	}
    list.append('<div class="input-group mb-3"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" aria-label="Checkbox for following text input" value="' + node.url + '"' + (isChecked ? ' checked disabled' : '') + '></div></div><input style="width:500px;" type="text" aria-label="Text input with checkbox" readonly="readonly" class="form-control" value="' + node.title + '"></div>');
  }
  // If the node is a folder, recursively add its children to the list
  else if (node.children && node.children.length > 0) {
    for (var i = 0; i < node.children.length; i++) {
	if (typeof downloadedUrls !== "undefined") {
      addBookmarkNode(node.children[i], list, downloadedUrls);
    }
  }
}
}
// Paypal donation site redirect
// Define the URL of the webpage that contains your PayPal button code
var paypalUrl = "https://www.omnisection.com/home/chrome-bookmarked-website-downloader";

// Add an event listener to your extension button that opens the PayPal donation page
document.getElementById("donate-button").addEventListener("click", function() {
  // Use the chrome.tabs.create() method to open a new tab with the PayPal URL
  chrome.tabs.create({ url: paypalUrl });
});
$('#selectall').click(function(){
	$(":checkbox").each(function(index) {
		// Check all of the checkboxes
		$(this).prop("checked", true);
	});
});
$('#unselectall').click(function(){
	$(":checkbox").each(function(index) {
		// Check all of the checkboxes
		$(this).prop("checked", false);
	});
});

$('#getbookmarks').click(function(){
		setTimeout(downloadBookmarks, 1000);
});


function areThereChildren(nodes, list, downloadedUrls) {
    // Loop through each element
    for(var i = 0; i < nodes.length; i++) {
        // If the node has a title display it and save the url
        if(Object.hasOwn(nodes[i], 'title')) {
            if(!Object.hasOwn(nodes[i], 'children')) {
                if(nodes[i].title != "" && nodes[i].title.length > 0) {
                    var isChecked = downloadedUrls.includes(nodes[i].url); // check if the bookmark's URL is in the downloadedUrls array
                    list.append('<div class="input-group mb-3"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" aria-label="Checkbox for following text input" value="' + nodes[i].url + '"' + (isChecked ? 'checked' : '') + '></div></div><input style="width:500px;"type="text" aria-label="Text input with checkbox" readonly="readonly" class="form-control" value="' + nodes[i].title + '"></div>');
                }
            }
        }
        if(Object.hasOwn(nodes[i], 'children')) {
            // This will recursively get each child in the branch
            areThereChildren(nodes[i].children, list, downloadedUrls); // pass the downloadedUrls array to the recursive call
        }
    }
}

function downloadBookmarks() {
  var checkedBookmarks = [];
  chrome.storage.local.get("downloadedUrls", function (result) {
    downloadedUrls = result.downloadedUrls;
	  if(typeof downloadedUrls === "undefined") {
		  downloadedUrls = [];
	  }
	  console.log(typeof downloadedUrls);
	  $("input").each(function(index) {
		var is_checked = $(this).is(':checked');
		if (is_checked && !downloadedUrls.includes($(this).val())) {
		  chrome.downloads.download({
			url: $(this).val()
		  });
		  checkedBookmarks.push($(this).val());
		  console.log("The first conditional clause ran");
		} else if (is_checked) {
		  console.log("The bookmark is already downloaded: " + $(this).val());
		} 
	  });
	  // Store the downloadedBookmarks array in Chrome's storage
	  chrome.storage.local.set({ 'downloadedUrls': downloadedUrls.concat(checkedBookmarks) });
  });
}
addBookmarks();
});




