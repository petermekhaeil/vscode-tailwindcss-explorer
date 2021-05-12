//@ts-ignore

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();

  var toggler = document.getElementsByClassName("caret");
  var searchInput = document.getElementById("search");
  var twListItem = document.querySelectorAll("li[data-name]");

  var i;
  for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }

  // https://davidwalsh.name/javascript-debounce-function
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  var handleSearchKeyUp = debounce(function (e) {
    var value = e.target.value.toUpperCase();
    var spans = document.querySelectorAll(".name");

    for (i = 0; i < spans.length; i++) {
      var txtValue = spans[i].textContent || spans[i].innerText;
      if (txtValue.toUpperCase().indexOf(value) > -1) {
        spans[i].style.display = "";
        spans[i].nextElementSibling.style.display = "";
      } else {
        spans[i].style.display = "none";
        spans[i].nextElementSibling.style.display = "none";
      }
    }
  }, 250);

  var handleClassClick = (e) => {
    vscode.postMessage({
      type: "addClass",
      value: e.target.getAttribute("data-name").substring(1),
    });
  };

  searchInput.addEventListener("keyup", handleSearchKeyUp);

  for (let i = 0; i < twListItem.length; i++) {
    twListItem[i].addEventListener("click", handleClassClick);
  }
})();
