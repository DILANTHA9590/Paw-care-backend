// function for  validate required fields in a data object---------------------->
export function checkRequredField(Data, requiredFields) {
  return requiredFields
    .map((field) => {
      if (
        Data[field] === null ||
        Data[field] === undefined ||
        Data[field] === ""
      ) {
        return { message: `${field} field is required` };
      }
      return null;
    })
    .filter((val) => val !== null);
}
