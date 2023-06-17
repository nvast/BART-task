import React, { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone'
import "./add.css";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams } from "react-router-dom";
import axios from "axios";
import 'animate.css';


export default function Add({ createGallery, setFiles, files, galleryItems }) {

    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [warning, setWarning] = useState(false);
    const [exist, setExist] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {

        if (acceptedFiles?.length) {
            const updatedFiles = acceptedFiles.map(file =>
                Object.assign(file, { preview: URL.createObjectURL(file) })
            );
            setSelectedFiles(prevs => [...prevs, ...updatedFiles]);
        }
    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const params = useParams().path

    function handleSubmit() {
        const exists = galleryItems.some(element => element.name === inputValue);

        if (inputValue.includes("/")) {
            setWarning(true)
        } else if (exists) {
            setExist(true)
        } else {
            createGallery(inputValue)
            setOpen(false)
            setInputValue("")
        }
    }

    async function handleAddPhotos() {
        setFiles(prevs => [...prevs, ...selectedFiles])
        setOpen(false)

        const backendApi = `http://api.programator.sk/gallery/${params}`;
        const formData = new FormData();

        selectedFiles.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
          });

        const headers = {
          'Content-Type': 'multipart/form-data; boundary=--boundary'
        };

        try {
            await axios.post(backendApi, formData, { headers });
        } catch (error) {
            console.error('Error uploading photos:', error);
        }

        setSelectedFiles([])
    }

    return (
        <React.Fragment>
            <Card className="card card-add animate__animated animate__fadeIn" onClick={() => setOpen(true)}>
                <AddBoxOutlinedIcon style={{ color: "grey" }} className="mt-3" />
                <p className="mt-3">{params ? "Pridať fotky" : "Pridať kategóriu"}</p>
            </Card>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                className="dialog"
            >
                <div className="dialog-head">
                    <DialogTitle >
                        {params ? "Pridať fotky" : "Pridať kategóriu"}
                    </DialogTitle>
                    <IconButton
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <DialogContent>

                    {params ?

                        <>
                            <div {...getRootProps({
                                className: "dialog-file"
                            })}>

                                <ImageOutlinedIcon />
                                <h6 className="m-3">Sem presunte fotky</h6>
                                <p>alebo</p>
                                <label>Vyberte súbory</label>
                                <input {...getInputProps()} />
                            </div>

                            <div className="staged-div">
                                {selectedFiles.map((element, index) => (
                                    <div className="staged-files" key={index}>
                                        <img
                                            key={index}
                                            src={element.preview}
                                            className="added-photos"
                                            alt="image"
                                        />
                                        <CancelIcon onClick={() => setSelectedFiles(prevs => prevs.filter((a, b) => b !== index))} />
                                    </div>
                                ))}
                            </div>
                        </>

                        :
                        <TextField
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter"){
                                    e.preventDefault();
                                    handleSubmit()
                                }
                            } }
                            className="dialog-input"
                            label="Názov kategórie"
                            variant="outlined"
                            value={inputValue}
                        />
                    }

                </DialogContent>
                <p className="warning" style={{ display: warning ? "block" : "none" }}>Názov nemôže obsahovať znak " / "</p>
                <p className="warning" style={{ display: exist ? "block" : "none" }}>Galéria s týmto názvom už existuje.</p>
                <DialogActions>
                    <Button
                        onClick={params ? handleAddPhotos : handleSubmit}
                        className="m-3 dialog-button"
                    >Pridať</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}