import { convertToFormData } from '../utils/convertFormData';

describe('convertToFormData', () => {
  it('should return a valid FormData object', () => {
    const patientObject = {
      fullname: 'John Doe',
      email: 'johndoe@example.com',
      phoneNo: '1234567890',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      gender: 'male',
      specialAttention: 'None',
      file: new File([''], 'test.jpg', { type: 'image/jpeg' })
    };

    const formData = convertToFormData(patientObject);

    expect(formData.get('fullname')).toBe('John Doe');
    expect(formData.get('email')).toBe('johndoe@example.com');
    expect(formData.get('phoneNo')).toBe('1234567890');
    expect(formData.get('dateOfBirth')).toBe('1990-01-01');
    expect(formData.get('address')).toBe('123 Main St');
    expect(formData.get('gender')).toBe('male');
    expect(formData.get('specialAttention')).toBe('None');
    expect(formData.get('file').name).toBe('test.jpg');
    expect(formData.get('file').type).toBe('image/jpeg');
  });
});