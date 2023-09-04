"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import SuperParser from "./Parsers/SuperParser";
import PDFParser from "./components/Parser";

const Parser = () => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    let formData = new FormData();

    let fileData = acceptedFiles[acceptedFiles.length - 1];
    formData.append("file_name", fileData);
    formData.append("name", fileData.name);
    setFile(formData);

  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="mx-5">
      <h1 className="inline-block border-b-4 border-indigo-500 my-3">
        Resume Parser
      </h1>

      <div {...getRootProps()} className="my-5 cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="bg-[#974EC3] text-[#fff] inline-block px-4 py-2 rounded drop-shadow-2xl ">
            Drop the files here ...
          </p>
        ) : (
          <p className="bg-[#974EC3] text-[#fff] inline-block px-4 py-2 rounded drop-shadow-2xl ">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <PDFParser file={file} />
        <PDFParser file={file} />
      </div>
    </div>
  );
};

export default Parser;
