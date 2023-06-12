import React, { useEffect, useState } from "react";
import Add from "../add/Add";
import { createClient } from 'pexels';
import Card from '@mui/material/Card';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useParams } from 'react-router-dom';
import "./gallery.css";
import pureBlack from "../main/images/pure black.jpg"
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import 'animate.css';


export default function Gallery() {
    const path = useParams();
    const query = path.path
    const [galleryPhotos, setGalleryPhotos] = useState([])
    const [backendPhotos, setBackendPhotos] = useState([])
    const client = createClient('HXmcARPuClkJUcyiSmw7BFDtZtLy4UAydLwou0weXQLfV5a1YQnSD0y6');
    const [files, setFiles] = useState([])
    const [open, setOpen] = useState(false);
    const [galleryObjects, setGalleryObjects] = useState([])
    const [lightboxIndex, setLightboxIndex] = useState(0);


    // get custom photos without backend
    useEffect(() => {
        getPhotos()
    }, [])

    useEffect(() => {
        let shouldClear = false;

        if (files.length !== 0) {
            files.forEach(element => {
                setGalleryPhotos(prevs => [...prevs, element.preview])
                setBackendPhotos(prevs => [...prevs, { path: element.paht, preview: element.preview }])
            })
            shouldClear = true
        }

        shouldClear && setFiles([])

    }, [files])

    // handle lightbox including custom and backend
    useEffect(() => {
        if (backendPhotos && galleryPhotos){
            const galleryArray = galleryPhotos.map(element => {
                return { src: element };
            })
            const backendArray = backendPhotos.map(element => {
                return { src: element };
                
            })
            setGalleryObjects(galleryArray.concat(backendArray))

        }else if (galleryPhotos) {
            const arrayOfObjects = galleryPhotos.map(element => {
                return { src: element };
            })
            setGalleryObjects(arrayOfObjects)
        } else if (backendPhotos) {
            const arrayOfObjects = backendPhotos.map(element => {
                return { src: element };
                
            })
            setGalleryObjects(arrayOfObjects)
        }
    }, [galleryPhotos, backendPhotos])


    // default option without backend, get 5 ramdom photos from pexels

    async function getPhotos() {

        const response = await client.photos.search({ query, per_page: 5 });
        if (response.photos.length < 1) {
            for (let i = 0; i <= 4; i++) {
                setGalleryPhotos(prevs => [...prevs, pureBlack])
            }
        } else {
            response.photos.forEach(element => {
                setGalleryPhotos(prevs => [...prevs, element.src.large]);
            })
        }
    }

    function handleDeletePhoto(index) {
        const removePhoto = [...galleryPhotos]
        removePhoto.splice(index, 1)
        setGalleryPhotos([...removePhoto])
    }


    // option with backend
    //
    // useEffect(() => {
    //     getBackendGalleries();
    // }, [])
    //
    async function getBackendGalleries() {
        const backendApi = "/gallery";
        try {
            const response = await axios.get(backendApi);
            const backendPhoto = response.data.images;
            backendPhoto.map((element) => {
                return (
                    setGalleryPhotos(prevs => [...prevs, element.path]))
            });

        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.error("Internal Server Error");

            } else if (error.response && error.response.status === 404) {
                console.error("Gallery does not exists:", error.message)
            } else {
                console.error("Error occurred:", error.message);
            }
        }
    }

    async function handleDeleteBackendPhoto(path) {
        const backendApi = `/gallery/${query}?path=${path}`
        try {
            await axios.delete(backendApi)
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error("Photo doesnt exist:", error.message)
            } else {
                console.error("Internal Server Error");
            }

        }
    }


    return (
        <div>
            <div className="container">
                <h1>Fotogaléria</h1>
                <h4>Kategórie</h4>
                <div className="gallery">
                    {/* defauld generated photos */}
                    {galleryPhotos.map((element, index) => (
                        <Card className="photo-card animate__animated animate__fadeIn" key={index}>
                            <img src={element} alt="galery img" onClick={() => { setOpen(true); setLightboxIndex(index) }} />
                            <ClearRoundedIcon onClick={() => handleDeletePhoto(index)} />
                        </Card>
                    ))}
                    {/* photos from backend */}
                    { /* backendPhotos.map((element, index) => (
                        <Card className="photo-card animate__animated animate__fadeIn" key={index}>
                            <img src={element.path} />
                            <ClearRoundedIcon onClick={() => handleDeleteBackendPhoto(element.path)}/>
                        </Card>
                    )) */ }
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