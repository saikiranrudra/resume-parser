import { ResumeData, toBase64 } from "../utils";
import Parser from "./Parser"
import axios from "axios";


class RChilliParser extends Parser {
    async parse(data, callback = () => {}) {
        let base64Data = await toBase64(data.get("file_name"));
        
        console.log({
            "userkey": process.env.NEXT_PUBLIC_RCHILLI_USER_KEY,
            "version": process.env.NEXT_PUBLIC_RCHILLI_VERSION,
            "subuserid": process.env.NEXT_PUBLIC_RCHILLI_SUBUSERID
        })
        
        const res = await axios.post("https://rest.rchilli.com/RChilliParser/Rchilli/parseResumeBinary", {
            "filedata": base64Data,
            "filename": data.get("name"),
            "userkey": process.env.NEXT_PUBLIC_RCHILLI_USER_KEY,
            "version": process.env.NEXT_PUBLIC_RCHILLI_VERSION,
            "subuserid": process.env.NEXT_PUBLIC_RCHILLI_SUBUSERID
        });

        callback();

        return res.data;
    }

    standardize(data) {
        let resumeData = new ResumeData();

        resumeData.firstname = data?.Name?.FirstName;
        resumeData.lastname = data?.Name?.LastName;
        resumeData.middlename = data?.Name?.MiddleName

        resumeData.links.email = data?.Name?.Email?.[0]?.EmailAddress
        resumeData.links.linkedin = data?.WebSite?.find(link => link?.Type == "Linkedin")?.Url

        resumeData.address.street = data?.Address?.[0]?.Street;
        resumeData.address.city = data?.Address?.[0]?.City;
        resumeData.address.state = data?.Address?.[0]?.State;
        resumeData.address.country = data?.Address?.[0]?.Country;
        resumeData.address.zipCode = data?.Address?.[0]?.ZipCode;

        let educations = data?.SegregatedQualification?.map(qualification => ({
            degree: qualification?.Degree?.DegreeName, 
            instituteName: qualification?.Institution?.Name, 
            startDate: qualification.StartDate, 
            endDate: qualification.EndDate
        }))

        resumeData.education = educations

        resumeData.skills = data?.SkillKeywords?.split(",")

        resumeData.exprience = data?.SegregatedExperience?.map(exprience => ({
            employer: exprience?.Employer?.EmployerName, 
            title: exprience.JobProfile?.Title, 
            location: {
                city: exprience?.Location?.City,
                state: exprience?.Location?.State,
                country: exprience?.Location?.Country,
            }, 
            jobPeriod: {
                startDate: exprience?.JobPeriod?.split("-")?.[0]?.trim(),
                endDate: exprience?.JobPeriod?.split("-")?.[1]?.trim()
            }, 
            jobDescription: exprience?.JobDescription
        }))

        return resumeData;

    }
    
}

export default RChilliParser;