import React, { useCallback } from "react";
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
import 'animate.css';


export default function Add({ setGalleryName, setFiles, files }) {

    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("")
    const [selectedFiles, setSelectedFiles] = React.useState([]);

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
        setGalleryName(prevs => [...prevs, inputValue])
        setOpen(false)
        setInputValue("")
    }

    async function handleAddPhotos(){
        setFiles(prevs => [...prevs, ...selectedFiles])
        setOpen(false)
        // handle backend
        //
        // const backendApi = `/gallery/${path}`;
        // const formData = new FormData();

        // selectedFiles.forEach((file) => {
        //   formData.append('image', file.path);
        // });
      
        // const headers = {
        //   'Content-Type': 'multipart/form-data; boundary=--boundary'
        // };
      
        // try {
        //     await axios.post(backendApi, formData, { headers })
        // } catch (error) {
        //     console.error('Error uploading photos:', error);
        // }
        
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
                                        <CancelIcon onClick={() => setSelectedFiles(prevs => prevs.filter((a, b) => b !== index))}/>
                                    </div>
                                ))}
                            </div>
                        </>

                        :
                        <TextField
                            onChange={e => setInputValue(e.target.value)}
                            className="dialog-input"
                            label="Názov kategórie"
                            variant="outlined"
                            value={inputValue}
                        />
                    }

                </DialogContent>
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