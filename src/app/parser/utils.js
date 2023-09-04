export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target.result.split(",")[1];
      resolve(base64String);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });

export class ResumeData {
  firstname;
  lastname;
  middlename;

  links = {
    email: null,
    linkedin: null
  }

  address = {
    street: null,
    city: null,
    state: null,
    country: null,
    zipCode: null,
  };

  education = []; // [{ degree, instituteName, startYear, endYear }]
  skills = []; // [string]

  exprience = []; // [{ employer, title, location, jobPeriod, jobDescription  }]
}
