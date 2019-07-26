var delay;
var firstRun = true;
var hasLocalStorage = false;
var autoRun = true;

// From: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// If the person is on a mobile device, show them a diff screen
if (isMobile()) {
    document.getElementsByClassName("panel-container")[0].style.display = "none";

    document.getElementById("runCode").style.display = "none";
    document.getElementById("stopAnimation").style.display = "none";

    document.getElementById("mobile").style.display = "";
}

/**
 * Clear the contents of the onscreen console.
 */
function clearConsole() {
    document.getElementById("console").value = "";
}

/**
* Handle the run code button click to run code for the first time.
*/
function runCode() {
    // Disable button because auto-run is now enabled
    var el = document.getElementById("runCode");
    el.disabled = true;
    el.innerHTML = "Auto-Run Enabled";

    autoRun = true;

    // Run the user's code for the first time
    executeCode();

    // Attach an event listener 
    var editor = document.querySelector('.CodeMirror').CodeMirror;
    editor.on("change", function() {
        if (autoRun) {
            // Reset delay and add delay again
            clearTimeout(delay);
            delay = setTimeout(executeCode, 300);

            // Clear the console log view
            clearConsole();

            // if localStorage is available, save the code
            if (hasLocalStorage)
                localStorage.setItem("code", editor.getValue());
        }
    });
}

/**
 * Stop the animation in case it's giving you a headache.
 */
function stopAnimation() {
    // Re-enable the run code button to restart the animation
    document.getElementById("runCode").disabled = false;
    document.getElementById("runCode").innerHTML = "Run Code";

    autoRun = false;

    // Clear all intervals
    for (var i = 1; i < 999999; i++)
        window.clearInterval(i);
}

/**
 * Execute user's code.
 */
function executeCode() {
    // Clear all intervals if its an animation
    for (var i = 1; i < 999999; i++)
        window.clearInterval(i);

    // Get code from editor
    var editor = document.querySelector('.CodeMirror').CodeMirror;
    var code = editor.getValue();

    // Add code as a script to page + execute
    var script = document.createElement('script');
    try {
        // If its first time executing something
        if (firstRun) {
            // Add script tag
            script.appendChild(document.createTextNode(code));
            document.body.appendChild(script);
        }
        else {
            // Remove old code
            document.body.removeChild(document.body.lastChild);

            // Add new code
            script.appendChild(document.createTextNode(code));
            document.body.appendChild(script);
        }
                        
        firstRun = false;
    } catch (e) {
        script.text = code;
        document.body.appendChild(script);
    }
}

window.onload  = function() {
    // Create splitter panel
    $(".panel-left").resizable({
        handleSelector: ".splitter",
        resizeHeight: false
    });

    // Create CodeMirror editor
    var editor = CodeMirror(document.getElementById("editor"), {
        mode: "javascript",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        indentWithTabs: true,
        lineWrapping: true,
        autofocus: true,
        value: "var moz = new Mosaic(5, 5);\n\nmoz.setTileColor(0, 0, 'black');",
        extraKeys: {
            "Ctrl-/": function(instance) { 
                commentSelection(true);
            },
        }      
    });

    // Test for localStorage capabilities
    try {
        var test = 'test';

        localStorage.setItem(test, test);
        localStorage.removeItem(test);

        hasLocalStorage = true;
    } catch(e) {
        hasLocalStorage = false;
    }

    // If the browser supports localStorage
    if (hasLocalStorage) {
        // Get CodeMirror instance
        var editor = document.querySelector('.CodeMirror').CodeMirror;

        // Check if the user has code saved before
        if (localStorage.getItem("code"))
            editor.setValue(localStorage.getItem("code"));
    }

    CodeMirror.commands["selectAll"](editor);
      
    function getSelectedRange() {
        return { from: editor.getCursor(true), to: editor.getCursor(false) };
    }
      
    function autoFormatSelection() {
        var range = getSelectedRange();
        editor.autoFormatRange(range.from, range.to);
    }
      
    function commentSelection(isComment) {
        var range = getSelectedRange();
        editor.commentRange(isComment, range.from, range.to);
    }
}();

/**
 * Capture console.log() calls and display them onscreen.
 */
(function() {
    var oldLog = console.log;
    console.log = function(message) {
        var consoleEl = document.getElementById("console");

        // Append value to the end if there is already log output
        if (consoleEl.value)
            consoleEl.value += "\n" + message;
        // Set the new value of log output
        else
            consoleEl.value = message;

        oldLog.apply(console, arguments);
    };
})();