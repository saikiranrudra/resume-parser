"use client";
import axios from "axios";
import Parser from "./Parser";
import { ResumeData } from "../utils";

class SuperParser extends Parser {
  async parse(data, callback = () => {}) {
    const res = await axios.post("https://api.superparser.com/parse", data, {
      headers: {
        "X-API-Key": process.env.NEXT_PUBLIC_SUPER_PARSER_API_KEY,
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    });

    callback();

    return res;
  }

  async parseFromUrl(url) {
    const res = await axios.post(
      "https://api.superparser.com/parse",
      {
        resume_url: url,
      },
      {
        "X-API-Key": "5kbqvngMfU6X046F4NWyi7Mz7cUWXqUP9LSpC7xC",
        "Content-Type": "multipart/form-data",
      }
    );

    return res.data.data;
  }

  standardize(data) {
    let resumeData = new ResumeData();

    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

    resumeData.education = data?.data?.education?.map(edu => ({
      degree: edu?.degree, 
      instituteName: edu?.institute, 
      startYear: null, 
      endYear: edu?.to_year
    }));
    resumeData.firstname = data?.data?.data?.name?.first_name;
    resumeData.lastname = data?.data?.data?.name?.last_name;

    resumeData.address.street = data?.data?.data?.address?.city;
    resumeData.address.country = data?.data?.data?.address?.country_code
      ? regionNames.of(data?.data?.data?.address?.country_code)
      : null;

    resumeData.skills = data?.data?.data?.skills?.overall_skills;

    resumeData.exprience = data?.data?.data?.employer?.map((exprience) => ({
      employer: exprience?.company_name,
      title: exprience.role,
      location: {
        city: exprience?.address?.city,
        state: null,
        country: exprience?.address?.country_code
          ? regionNames.of(exprience?.address?.country_code)
          : null,
      },
      jobPeriod: {
        startDate: exprience?.from_year + "/" + exprience?.from_month,
        endDate: exprience?.to_year + "/" + exprience?.to_month,
      },
      jobDescription: exprience?.description,
    }));

    resumeData.links.email = data?.data?.data?.email?.[0]?.email
    resumeData.links.linkedin = data?.data?.data?.personal_urls?.find(url => url.includes("linkedin"));

    return resumeData;
  }
}

export default SuperParser;
