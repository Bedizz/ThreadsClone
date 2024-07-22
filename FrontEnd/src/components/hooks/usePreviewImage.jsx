import React, { useState } from 'react'
import { useShowToast } from './useShowToast'

export const usePreviewImage = () => {
    const toast = useShowToast()
    const [previewImage,setPreviewImage] = useState(null)
    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)
    } else {
        toast("Invalid file type","Please select an image file","error")
        setPreviewImage(null)

    }
    }
  return {handleImageChange,previewImage,setPreviewImage}
}

