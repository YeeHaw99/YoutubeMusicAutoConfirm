/*
YouTube Music Auto Confirm
Automatically confirms the "I understand and wish to proceed" prompt. 
This prompt CONSTANTLY pops up on content Youtube decides requires viewer discretion. 
This extension is by no means a replacement for any such discretion and by using this extension you are confirming that you understand this and do not need any viewer disrection warnings.
*/

const TAG = "[YT Music Auto Confirm]";

// Stores the last button clicked to prevent duplicate clicks while the popup remains on screen.
let lastClickedButton = null;


 // Writes a message to the browser console.
function log(message) {
    console.log(`${TAG} ${message}`);
}

/*
Searches the warning dialog for the confirmation button.

 Returns:
  HTMLButtonElement if found
  null otherwise
 */
function findConfirmButton(dialog) {

    const buttons = dialog.querySelectorAll("button");

    for (const button of buttons) {

        const text = button.textContent.trim();
        const ariaLabel = button.getAttribute("aria-label");

        if (
            text === "I understand and wish to proceed" ||
            ariaLabel === "I understand and wish to proceed"
        ) {
            return button;
        }
    }

    return null;
}


 // Looks for the explicit content warning and clicks the confirmation button.
function checkForWarning() {

    // Locate the warning dialog.
    const dialog = document.querySelector("yt-player-error-message-renderer");

    // Dialog not present.
    if (!dialog) {
        lastClickedButton = null;
        return;
    }

    // Locate the confirmation button.
    const button = findConfirmButton(dialog);

    if (!button) {
        lastClickedButton = null;
        return;
    }

    // Prevent repeated clicks on the same button.
    if (button === lastClickedButton)
        return;

    lastClickedButton = button;

    log("Explicit content warning detected.");
    log("Clicking confirmation button.");

    button.click();
}

/*
Watches YouTube Music for DOM changes.
Whenever the page updates we check for the warning dialog.
 */
const observer = new MutationObserver(() => {
    checkForWarning();
});

// Wait until the document body exists before observing.
function startObserver() {

    if (!document.body) {
        setTimeout(startObserver, 100);
        return;
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    log("Monitoring YouTube Music for explicit content warnings.");

    // Run one initial check in case the dialog already exists.
    checkForWarning();
}

startObserver();