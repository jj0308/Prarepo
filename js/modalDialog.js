function createModalDialog(messageText, successful) {
    const dialogContainer = document.createElement('div');
    dialogContainer.id = 'modalContainer';
  
    const modalDialog = document.createElement('div');
    modalDialog.id = 'msgDialog';
  
    const message = document.createElement('p');
    message.id = 'message';
    message.textContent = messageText;
  
    const btnOK = document.createElement('button');
    btnOK.id = 'btnOK';
    btnOK.textContent = 'OK';
  
    modalDialog.appendChild(message);
    modalDialog.appendChild(btnOK);
    dialogContainer.appendChild(modalDialog);
    document.body.appendChild(dialogContainer);
  
    // Center the modal dialog
    function centerModalDialog() {
      const containerWidth = dialogContainer.offsetWidth;
      const containerHeight = dialogContainer.offsetHeight;
      modalDialog.style.left = `calc(50% - ${containerWidth / 2}px)`;
      modalDialog.style.top = `calc(50% - ${containerHeight / 2}px)`;
    }
  
    centerModalDialog();
  
    btnOK.addEventListener('click', () => {
        document.body.removeChild(dialogContainer);
        if (successful) {
            location.reload();
        }
      });

    // Recenter the modal dialog when the window is resized
    window.addEventListener('resize', centerModalDialog);
  }