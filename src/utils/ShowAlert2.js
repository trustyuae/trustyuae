import Swal from "sweetalert2";

const ShowAlert2 = (
    title,
    text,
    icon,
    showCancelButton,
    closeOnConfirm,
    confirmButtonText,
    thirdButtonText,
    cancelButtonText,
    confirmButtonIndex,
    cancelButtonIndex,
    thirdButtonIndex
  ) => {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: showCancelButton,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        denyButtonText: thirdButtonText,
        showDenyButton: !!thirdButtonText,
        customClass: {
          confirmButton: "confirm-button",
          cancelButton: "cancel-button",
          denyButton: "deny-button",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(confirmButtonText);
        } else if (result.isDenied) {
          resolve(thirdButtonText);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          resolve(cancelButtonText);
        } else {
          resolve(null);
        }
      });
    });
  };

  export default ShowAlert2;