import { ChangeEvent, useEffect, useState } from 'react';
import './App.css'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { imageDB } from './firebase/config';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(':')[1].split(';')[0];

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mimeString });
}

function App() {

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [resizedImage, setResizedImage] = useState("");
  const [ImgUrl, setImgUrl] = useState<string[]>([]);

  useEffect(() => {
    
    listAll(ref(imageDB,"files")).then(imgs => (
      imgs.items.forEach(val => (
        getDownloadURL(val).then(url => {
          setImgUrl(data => [...data,url])
        })
      ))
    ))
    return () => {
      
    }
  }, []);

  // console.log(ImgUrl);
  

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle content change
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  // Handle image upload and URL creation
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            canvas.width = 1200;
            canvas.height = 630;

            const aspectRatio = img.width / img.height;
            let newWidth = canvas.width;
            let newHeight = canvas.width / aspectRatio;

            if (newHeight < canvas.height) {
              newHeight = canvas.height;
              newWidth = canvas.height * aspectRatio;
            }
            const offsetX = (canvas.width - newWidth) / 2;
            const offsetY = (canvas.height - newHeight) / 2;
            ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
            const resizedImageUrl = canvas.toDataURL("image/jpeg");
            setResizedImage(resizedImageUrl);
          }
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    // console.log("Resized image data URL:", resizedImage);
    if (resizedImage) {
      const imgBlob = dataURLToBlob(resizedImage);
      const imgRef = ref(imageDB, `files/${v4()}`);
      uploadBytes(imgRef, imgBlob).then(() => {
        console.log("Image uploaded successfully!");
        alert("Image Uploaded Successfully")
      }).catch((error) => {
        console.error("Error uploading image:", error);
      });
    } else {
      console.error("No image to upload.");
      alert("No Image to upload");
    }
  }

  return (
    <HelmetProvider>
      <div className="post-page">
        <Helmet>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={content} />
          <meta property="og:image" content={ImgUrl[0]} />
        </Helmet>
        <h1>Create a Post</h1>
        <form className='post-page-form'>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            className='post-page-form-input'
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={handleContentChange}
            className='post-page-form-text'
          />
          <label className="drop-container" id="dropcontainer">
            <span className="drop-title">Drop files here</span>
            or
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <button onClick={handleClick} type='button'>Upload</button>
        </form>
        {/* <div className="post-preview">
        <h2>{title}</h2>
        <p>{content}</p>
        {image.url && <img src={image.url} alt="Post" />}
      </div> */}
      </div>
    </HelmetProvider>
  )
}

export default App
