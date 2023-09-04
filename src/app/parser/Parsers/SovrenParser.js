const { default: Parser } = require("./Parser");
import axios from "axios";
import { ResumeData, toBase64 } from "../utils";

class SovrenParser extends Parser {
  async parse(file, callback = () => {}) {
    const string = await toBase64(file.get("file_name"));
    let currentDate = file.get("file_name").lastModifiedDate;

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');


    const res = await axios.post(
      "https://rest.resumeparsing.com/v10/parser/resume",
      {
        DocumentAsBase64String: string,
        DocumentLastModified: `${year}-${month}-${day}`,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Sovren-AccountId": process.env.NEXT_PUBLIC_SOVREN_ACCOUNTID,
          "Sovren-ServiceKey": process.env.NEXT_PUBLIC_SOVREN_SERVICE_KEY,
        },
      }
    );

    callback();
    return res.data;
  }

  standardize(data) {
    let resume = new ResumeData();

    resume.firstname = data?.Value?.ResumeData?.ContactInformation?.CandidateName?.GivenName;
    resume.lastname = data?.Value?.ResumeData?.ContactInformation?.CandidateName?.FamilyName;
  
    resume.links = {
      email: null,
      linkedin: data?.Value?.ResumeData?.ContactInformation?.WebAddresses?.find(link => link?.Type == "LinkedIn")?.Address
    }
  
    resume.address = {
      street: null,
      city: null,
      state: null,
      country: null,
      zipCode: null,
    };
  
    resume.education =  data?.Value?.ResumeData?.Education?.EducationDetails?.map(education => ({
        degree: education?.Degree?.Name?.Raw, 
        instituteName: education?.SchoolName?.Raw, 
        startYear: null, 
        endYear: null
    })); 
    resume.skills = data?.Value?.ResumeData?.Skills?.Raw?.map(skill => skill?.Name); // [string]
  
    resume.exprience = data?.Value?.ResumeData?.EmploymentHistory?.Positions?.map(exp => ({

    })); // [{  }]

    return resume;
  }
}

export default SovrenParser;
