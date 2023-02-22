export const convertToFormData = (patientObject) => {
    const formData = new FormData();
    formData.append('fullname', patientObject.fullname);
    formData.append('email', patientObject.email);
    formData.append('phoneNo', patientObject.phoneNo);
    formData.append('dateOfBirth', patientObject.dateOfBirth);
    formData.append('address', patientObject.address);
    formData.append('gender', patientObject.gender);
    formData.append('specialAttention', patientObject.specialAttention);
    formData.append('file', patientObject.file);
    return formData;
}