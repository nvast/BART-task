import React, { useEffect, useState } from "react";
import "./main.css";
import { createClient } from 'pexels';
import Card from '@mui/material/Card';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Link } from 'react-router-dom';
import Add from "../add/Add";
import pureBlack from "./images/pure black.jpg";
import axios from "axios";
import 'animate.css';

export default function Main() {
    const [galleryName, setGalleryName] = useState(["Nature", "Architecture", "People", "Food", "Abstract"]);
    const [coverPhotos, setCoverPhotos] = useState([]);
    const [backendGalleryName, setBackendGalleryName] = useState([]);
    const [backendGalleryPhotos, setBackendGalleryPhotos] = useState([])
    const client = createClient('HXmcARPuClkJUcyiSmw7BFDtZtLy4UAydLwou0weXQLfV5a1YQnSD0y6');

    useEffect(() => {
        getPhotos();
        // createBackendGallery()
    }, [galleryName]);

    // default option without backend, get 5 ramdom photos from pexels
    async function getPhotos() {
        const promises = galleryName.map(async (element) => {
            try {
                const response = await client.photos.search({ query: element, per_page: 1 });
                return response.photos[0].src.large;
            } catch {
                return pureBlack
            }

        });

        const photos = await Promise.all(promises);
        setCoverPhotos(photos);
    }

    function handleDeleteGallery(index) {
        const removeName = [...galleryName]
        removeName.splice(index, 1)
        setGalleryName([...removeName])

        const removePhoto = [...coverPhotos]
        removePhoto.splice(index, 1)
        setCoverPhotos([...removePhoto])
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
            const backendGalleries = response.data;
            setBackendGalleryName(prevs => [...prevs, ...backendGalleries.map(element => element.gallery.name)]);
            setBackendGalleryPhotos(prevs => [...prevs, ...backendGalleries.map(element => element.images[0].path)]);

        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.error("Internal Server Error");
            } else {
                console.error("Error occurred:", error.message);
            }
        }
    }

    async function createBackendGallery() {
        const backendApi = "/gallery";
        try {
            await axios.post(backendApi, { "name": backendGalleryName[backendGalleryName.length - 1] })
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error("Invalid request. The request doesn't conform to the schema:", error.message)
            } else if (error.response && error.response.status === 409) {
                console.error("Gallery with this name already exists:", error.message)
            } else {
                console.error("Error occurred:", error.message);
            }
        }
    }

    async function handleDeleteBackendGalery(name) {
        const backendApi = `/gallery?name=${name}`
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
        <div className="container">
            <h1>Fotogaléria</h1>
            <h4>Kategórie</h4>
            <div className="gallery">
                {galleryName.map((element, index) => (
                    <Card className="card animate__animated animate__fadeIn" key={index}>
                        <Link to={`/gallery/${element}`}>
                            <img src={coverPhotos[index]} alt={element} />
                        </Link>
                        <ClearRoundedIcon className="delete-icon" onClick={() => handleDeleteGallery(index)} />
                        <h6>{element}</h6>
                    </Card>
                ))}
                {/* photos from backend */}
                { /* backendGalleryName.map((element, index) => (
                        <Card className="photo-card animate__animated animate__fadeIn" key={index}>
                            <Link to={`/gallery/${element}`}>
                                <img src={backendGalleryPhotos[index]} alt={element} />
                            </Link>
                            <ClearRoundedIcon className="delete-icon" onClick={() => handleDeleteBackendGalery(element)} />
                            <h6>{element}</h6>
                        </Card>
                    )) */ }
                <Add setGalleryName={setGalleryName} />
            </div>
        </div>
    );
}
