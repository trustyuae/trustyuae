import Swal from "sweetalert2";

const ShowAlert = async (
  title,
  text,
  icons,
  showConfirmButton,
  showCancelButton = false,
  confirmButtonText,
  cancelButtonText,
  timer
) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: icons,
    showConfirmButton: showConfirmButton,
    showCancelButton: showCancelButton,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    timer: timer,
  });
  return result;
};

export default ShowAlert;
