export const TAG_TYPES = ['CONTENT', 'TABLE', 'IMAGE'];


// Animation variants
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const isValidS3Url = (url: string): boolean => {
    const s3UrlPattern = /^https:\/\/pdf-crafter2\.s3\.us-east-1\.amazonaws\.com\/.+$/;
    return s3UrlPattern.test(url);
};







export const imageUrl = 'https://media.istockphoto.com/id/1967543722/photo/the-city-of-london-skyline-at-night-united-kingdom.jpg?s=2048x2048&w=is&k=20&c=ZMquw-lP_vrSVoUlSWjuWIZHdVma7z4ju9pD1EkRPvs='

export const hdr = ` <div style="font-family: Arial, sans-serif; line-height: 1.5; margin: 0; padding: 0; text-align: center;text-align: center; width: 100%; border-top: 1px solid #ccc;">
<div style="background-color: #f4f4f4; padding: 20px; ">
      <img
        src="${imageUrl}"
        alt="Logo"
        style="display: block; margin: 0 auto; max-width: 100px;"
      />
      <h1 style="margin: 10px 0;font-size: 20px; color: #555;">Company Name</h1>
      <p style="margin: 0; font-size: 14px; color: #555;">Your tagline or slogan here</p>
    </div> </div>`

export const ftr = `<div style="font-size: 10px; text-align: center; width: 100%;">
<div
      style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #555;"
    >
      <p style="margin: 0;">123 Business Street, Business City, BC 12345</p>
      <p style="margin: 0;">
        Contact us: <a href="mailto:info@company.com" style="color: #007BFF;">info@company.com</a>
      </p>
      <p style="margin: 0;">&copy; 2024 Company Name. All rights reserved.</p>
    </div></div>`;

export const bdy = `<div style="padding: 20px;">
      <h2 style="color: #333;">Welcome to Our Report</h2>
      <p style="margin: 0 0 10px; color: #555;">
        Below is a summary of our performance and goals. Feel free to review the details and let us know your thoughts.
      </p>

      <!-- Image Example -->
      <div style="text-align: center; margin: 20px 0;">
        <img
          src="${imageUrl}"
          alt="Sample Chart"
          style="max-width: 100%; height: auto;"
        />
      </div>

      <!-- Table Example -->
      <h3 style="color: #333;">Performance Overview</h3>
      <table
        style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;"
      >
        <thead>
          <tr style="background-color: #f4f4f4;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Metric</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Target</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Achieved</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Revenue</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$1,000,000</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$950,000</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 8px;">Customer Growth</td>
            <td style="border: 1px solid #ddd; padding: 8px;">20%</td>
            <td style="border: 1px solid #ddd; padding: 8px;">18%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Satisfaction Score</td>
            <td style="border: 1px solid #ddd; padding: 8px;">90%</td>
            <td style="border: 1px solid #ddd; padding: 8px;">88%</td>
          </tr>
        </tbody>
      </table>
    </div>
`;


export const initialTableData = {
  initialColumns: 3,
  initialRows: [
    { col1: "Data 1", col2: "Data 2", col3: "Data 3" }, // Default row data
  ],
  initialStyles: Array.from({ length: 3 }, () => ({
    backgroundColor: "#f4f4f4", // Default background color
    fontSize: "14", // Default font size
    padding: "8px", // Default padding
    color: "#000", // Default text color
  })),
  customHtml: `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #007bff; color: #ffffff;">
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header 1</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header 2</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header 3</th>
                            </tr>
                        </thead><tbody></tbody></table>`
}