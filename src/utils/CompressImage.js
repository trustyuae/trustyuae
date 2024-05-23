import imageCompression from 'browser-image-compression';

export const CompressImage = async (file) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920
    }
    const compressedFileBlob = await imageCompression(file, options);
    // let compressedFile = new File([compressedFileBlob], file.name)
    return new File([compressedFileBlob], file?.name)
}