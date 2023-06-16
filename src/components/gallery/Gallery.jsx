import React, { useEffect, useState } from "react";
import Add from "../add/Add";
import { createClient } from 'pexels';
import Card from '@mui/material/Card';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useParams } from 'react-router-dom';
import "./gallery.css";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import 'animate.css';


export default function Gallery() {
    const path = useParams();
    const query = path.path
    const [galleryPhotos, setGalleryPhotos] = useState([]);
    const [files, setFiles] = useState([]);
    //lightbox
    const [open, setOpen] = useState(false);
    const [galleryObjects, setGalleryObjects] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        getImages()
    }, [])

    useEffect(() => {
        let shouldClear = false;
        if (files.length !== 0) {
            console.log(files)
            setGalleryPhotos(prevs => [...prevs, ...files])
            shouldClear = true
        }

        shouldClear && setFiles([])
    }, [files])

    useEffect(() => {
        const galleryArray = galleryPhotos.map(element => {
            return { src: `http://api.programator.sk/images/0x700/${query}/${element.path}`};
        })
        setGalleryObjects(galleryArray)
    }, [galleryPhotos])

    async function handleDeletePhoto(index, element) {
        console.log(`http://api.programator.sk/gallery/${query}/${element.path}`)
        try {
            const backendApi = `http://api.programator.sk/gallery/${query}/${element.path}`
            await axios.delete(backendApi)

        } catch (error) {
            console.error(error.message);
        }

        const removePhoto = [...galleryPhotos]
        removePhoto.splice(index, 1)
        setGalleryPhotos([...removePhoto])
    }

    async function getImages() {
        const backendApi = `http://api.programator.sk/gallery/${query}`;
        try {
            const response = await axios.get(backendApi);
            const responseImgs = response.data.images;
            setGalleryPhotos(responseImgs)

        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div>
            <div className="container">
                <h1>Fotogaléria</h1>
                <h4>Kategórie</h4>
                <div className="gallery">
                    {galleryPhotos.map((element, index) => (
                        <Card className="photo-card animate__animated animate__fadeIn" key={index}>
                            <img 
                            src={element.preview ? element.preview :`http://api.programator.sk/images/0x700/${query}/${element.path}`} 
                            alt="galery img" 
                            onClick={() => { setOpen(true); setLightboxIndex(index) }} 
                            loading="lazy"/>
                            <ClearRoundedIcon onClick={() => handleDeletePhoto(index, element)} />
                        </Card>
                    ))}
                    <Add setFiles={setFiles} files={files} />
                </div>

            </div>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={galleryObjects}
                index={lightboxIndex}
            />
        </div>
    )
}