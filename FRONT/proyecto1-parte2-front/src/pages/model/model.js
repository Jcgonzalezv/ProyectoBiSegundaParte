import React, { useEffect, useState, useRef } from "react";
import "./model.scss";
import {Card, Button} from 'react-bootstrap'
import {fromEvent} from 'file-selector'

const API_FIT = "http://127.0.0.1:8000/fit"
const API_PREDICT = "http://127.0.0.1:8000/predict"

export const Model = () =>
{

    // On each file selection update the default image
    const [selectedFitFile, setSelectedFitFile] = useState();
    const [selectedPredictFile, setSelectedPredictFile] = useState();
    const [requestFitMessage, setRequestFitMessage] = useState()
    const [requestMessage, setRequestMessage] = useState()
    // we are referencing the file input
    const imageRef = useRef([]);
    var fileContents
    // Clean up the selection to avoid memory leak
    useEffect(() => {
        if (selectedFitFile) {
            var fr=new FileReader()
            fr.onload=function(){
               fileContents = fr.result
               /*console.log(fileContents)*/
            }
            fr.readAsText(selectedFitFile);
        }
        else if (selectedPredictFile)
        {
            var fr=new FileReader()
            fr.onload=function(){
               fileContents = fr.result
               /*console.log(fileContents)*/
            }
            fr.readAsText(selectedPredictFile);
        }
        console.log(selectedFitFile)
    }, [selectedFitFile, selectedPredictFile]);

    const fit_request = () =>
    {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: fileContents
        }
        fetch(API_FIT, requestOptions)
            .then(response => response.json())
            .then(data => {
                setSelectedFitFile(undefined)
                setRequestFitMessage(data.data.message) 
                imageRef.current[0].value = ""

            })
            .catch(function(error)
            {
                setSelectedFitFile(undefined)
                setRequestFitMessage("There was an error with the request, please check that the file is a valid Dataframe and try again") 
                imageRef.current[0].value = ""
            });
    }

    function predict_request()
    {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: fileContents
        }
        fetch(API_PREDICT, requestOptions)
            .then(response => response.json())
            .then(data => {
                setSelectedPredictFile(undefined)
                setRequestMessage(data.data.MSE + " " + data.data.MAE + " " + data.data.R2) 
                imageRef.current[1].value = ""

            })
            .catch(function(error)
            {
                setSelectedPredictFile(undefined)
                setRequestMessage("There was an error with the request, please check that the file is a valid Dataframe and try again") 
                imageRef.current[0].value = ""
            });
    }

    const showOpenFileFitDialog = () => {
        imageRef.current[0].click();
    };

    const showOpenFileDialog = () => {
        imageRef.current[1].click();
    };

    const handleFitChange = (event) => {
        const file = event.target.files[0];
        setSelectedFitFile(file)
      };

    const handlePredictChange = (event) => {
        const file = event.target.files[0];
        setSelectedPredictFile(file)
    };

    return(
        <div className="Container-Fluid">
            <div className="Row">
                <Card>
                    <Card.Header as="h5">Fit the model</Card.Header>
                    <Card.Body>
                        <Card.Title>Upload JSON File</Card.Title>
                        <Card.Text>
                            Upload the Dataframe which will be used to fit the model in .json format 
                        </Card.Text>
                        <Button // Notice I omitted the text instead used icon
                        onClick={() => showOpenFileFitDialog()}>
                        Open File
                        </Button>
                        <input
                        ref={el => imageRef.current[0] = el}
                        type="file"
                        style={{ display: 'none' }}
                        accept=".json"
                        onChange={handleFitChange}
                        />
                        {(((selectedFitFile != undefined) ? (<a> {selectedFitFile.name}</a>) : (<a>Select a file</a>)))}
                        <br/>
                        <br/>
                        <Button variant="primary" onClick={() => fit_request()}>Fit</Button>
                        <br/>
                        {((((selectedFitFile === undefined) && (requestFitMessage != undefined)) ? (<a> {requestFitMessage}</a>) : (<p/>)))}

                    </Card.Body>
                </Card>
            </div>

            <div className="Row">
                <Card>
                    <Card.Header as="h5">Predict with The model</Card.Header>
                    <Card.Body>
                        <Card.Title>Upload JSON File</Card.Title>
                        <Card.Text>
                            Upload the Dataframe which has the data to be predicted.
                            The Dataframe must have the labels in order to show metrics about the performance
                        </Card.Text>
                        <Button // Notice I omitted the text instead used icon
                        onClick={() => showOpenFileDialog()}>
                        Open File
                        </Button>
                        <input
                        ref={el => imageRef.current[1] = el}
                        type="file"
                        style={{ display: 'none' }}
                        accept=".json"
                        onChange={handlePredictChange}
                        />
                        {(((selectedPredictFile != undefined) ? (<a> {selectedPredictFile.name}</a>) : (<a>Select a file</a>)))}
                        <br/>
                        <br/>
                        <Button variant="primary" onClick={() => predict_request()}>Predict</Button>
                        <br/>
                        {((((selectedPredictFile === undefined) && (requestMessage != undefined)) ? (<a> {requestMessage}</a>) : (<p/>)))}

                    </Card.Body>
                </Card>
            </div>  
        </div>
    );
};