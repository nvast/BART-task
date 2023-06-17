import React, { useEffect, useState, useMemo } from "react";
import "./main.css";
import Card from '@mui/material/Card';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Link } from 'react-router-dom';
import Add from "../add/Add";
import axios from "axios";
import pureBlack from "./images/pure black.jpg"
import 'animate.css';

export default function Main() {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGalleries();
    }, [])

    async function getGalleries() {
        const backendApi = "http://api.programator.sk/gallery";
        try {
            const response = await axios.get(backendApi);
            const data = response.data.galleries.filter(
                (element) => element.path !== "test"
            );
            setGalleryItems(data)
        } catch (error) {
            console.error(error.message);
        }
    }

    async function createGallery(galleryName) {
        const backendApi = "http://api.programator.sk/gallery";
        try {
            const headers = {
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            await axios.post(backendApi, { name: galleryName }, headers);

            getGalleries();

        } catch (error) {
            console.error(error.message);

        }
    }

    async function handleDelete(name) {
        const backendApi = `http://api.programator.sk/gallery/${name}`
        try {
            await axios.delete(backendApi)
            getGalleries()

        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="container">
            <h1>Fotogaléria</h1>
            <h4>Kategórie</h4>
            <div className="gallery">
                {galleryItems.map((element, index) => (
                    <Card className="card animate__animated animate__fadeIn" key={index}>
                        <Link to={`/${element.path}`}>
                            <img 
                            src={element.image ? loading ? `http://api.programator.sk/images/0x5/${element.image.fullpath}` : `http://api.programator.sk/images/0x700/${element.image.fullpath}` : pureBlack}
                            onLoad={() => {setLoading(false)}} 
                            alt={element.name} 
                            loading="lazy"
                            />
                        </Link>
                        <ClearRoundedIcon className="delete-icon" onClick={() => handleDelete(element.name)} />
                        <h6>{element.name}</h6>
                    </Card>
                ))}
                <Add createGallery={createGallery} galleryItems={galleryItems} />
            </div>
        </div>
    );
}
