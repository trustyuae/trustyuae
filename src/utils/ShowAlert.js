import Swal from "sweetalert2";

const ShowAlert = async (title, text, icons) => {
    console.log(title)
    console.log(text)
    console.log(icons, '<==== icon')
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: icons
    })
    return result;
}

export default ShowAlert