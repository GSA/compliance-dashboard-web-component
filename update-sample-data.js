const { writeFileSync } = require('fs');
const { get } = require('axios');

get("https://api.code.gov/status.json").then(response => {
  console.log(response.data);
  const { statuses } = response.data;
  const data = Object.values(statuses)
    .filter(value => value.requirements && value.requirements.overallCompliance > 0)
    .map(value => {
      const acronym = value.metadata.agency.acronym;
      const name = value.metadata.agency.name;
      const reqs = value.requirements;
      console.log(acronym + " reqs:", reqs);
      return {
        img: `img/${acronym}-50x50.png`,
        name: name,
        requirements: {
          overall: reqs.overallCompliance,
          sub: {
            agencyWidePolicy: reqs.agencyWidePolicy,
            openSourceRequirement: reqs.openSourceRequirement,
            inventoryRequirement: reqs.inventoryRequirement,
            schemaFormat: reqs.schemaFormat
          }
        }
      }
    });

  writeFileSync('example-data.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log("wrote example-data.json");
});