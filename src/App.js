// src/App.js
import './App.css';
import React from 'react';
import TextToSpeech from './TextToSpeech';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import yaml from 'js-yaml';
import swaggerFile from './swagger.yaml';

function App() {
  const [swagger, setSwagger] = React.useState(null);

  React.useEffect(() => {
    fetch(swaggerFile)
      .then((response) => response.text())
      .then((text) => {
        const parsedYaml = yaml.load(text);
        setSwagger(parsedYaml);
      })
      .catch((error) => console.error('Error loading swagger.yaml:', error));
  }, []);


  return (
    <div className="App">
      <TextToSpeech />
      {swagger && <SwaggerUI spec={swagger} />}
    </div>
  );
}

export default App;
