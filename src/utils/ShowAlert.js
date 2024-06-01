import Swal from "sweetalert2";

const ShowAlert = async (
  title,
  text,
  icons,
  showCancelButton = false,
  showConfirmButton,
  cancelButtonText,
  confirmButtonText,
  timer
) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: icons,
    showCancelButton: showCancelButton,
    showConfirmButton: showConfirmButton,
    cancelButtonText: cancelButtonText,
    confirmButtonText: confirmButtonText,
    timer: timer,
  });
  return result;
};

export default ShowAlert;
