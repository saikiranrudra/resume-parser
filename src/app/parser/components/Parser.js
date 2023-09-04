"use client";
import { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import SuperParser from "../Parsers/SuperParser";
import RChilliParser from "../Parsers/RChilliParser";
import SovrenParser from "../Parsers/SovrenParser";


const Parser = ({ file }) => {
  const [json, setJson] = useState({});
  const [displayObj, setDisplayObj] = useState({});
  const [selectedParser, setSelectedParser] = useState(null);
  const [standardize, setStandardize] = useState(false);
  const [parser, setParser] = useState(null);
  const [loading, setLoading] = useState(false);

  const parse = async () => {
    if (file == null) {
      alert("Please Select the file");
      return;
    }

    let superParser = new SuperParser();
    let sovrenParser = new SovrenParser();
    let rChilliParser = new RChilliParser();


    if (selectedParser == "super-parser") setParser(superParser);
    if (selectedParser == "sovren") setParser(sovrenParser);
    if (selectedParser == "r-chilli") setParser(rChilliParser);

    if (parser == null) {
      alert("Please select parser");
      return;
    }

    setLoading(true);
    let resumeJson = await parser.parse(file, () => setLoading(false));
    setJson(resumeJson);
    setDisplayObj(resumeJson)
  };
  
  useEffect(() => {
    if(parser == null) return;

    if(standardize == true) {
        if (selectedParser == "super-parser") setDisplayObj(parser.standardize(json))
        if (selectedParser == "sovren") setDisplayObj(parser.standardize(json))
        if (selectedParser == "r-chilli") setDisplayObj(parser.standardize(json?.ResumeParserData))
    } else {
        setDisplayObj(json);
    }

  }, [standardize])

  return (
    <div>
      <div className="flex">
        <select
          name="parser-1"
          id="parser-1"
          className="mb-2"
          placeholder="Select Parser"
          defaultValue={"super-parser"}
          onChange={(e) => setSelectedParser(e.target.value)}
        >
          <option value="super-parser">Super Parser</option>
          <option value="sovren">Sovren</option>
          <option value="r-chilli">R Chilli</option>
        </select>
        <p
          className="rounded-full bg-[#974EC3] text-[#fff] px-4 py-1 ms-2 cursor-pointer"
          onClick={parse}
        >
          {loading ? "loading..." : "Parse"}
        </p>
      </div>

      <div className="flex align-center">
        <p className="mb-0">Standardize</p>
        <label className="switch">
          <input type="checkbox" defaultValue={false} onChange={(e) => setStandardize(e.target.checked)}/>
          <span className="slider round"></span>
        </label>
      </div>
      <ReactJson src={displayObj} theme={"monokai"} />
    </div>
  );
};

export default Parser;
