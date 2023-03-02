# Patient-info-system

 Introduction:
 
    Patient information system records the information of the patient. Admin can singup and login to the system and can add information of patient.
    Admin can add different information of patient like fullname, email, phone, address, gender and photo. Admin can aslo mark the patient as
    special attention. Special attention patient always comes to the top of list.

 ScreenShot:
 
 <img width="1327" alt="Screenshot 2023-03-02 at 14 47 10" src="https://user-images.githubusercontent.com/36202383/222381704-d4211e88-3962-4673-848e-6861c50724c6.png">
<img width="636" alt="Screenshot 2023-03-02 at 14 47 36" src="https://user-images.githubusercontent.com/36202383/222381738-73eec3df-69d4-4fdd-b793-e466ec0fff5c.png">
<img width="596" alt="Screenshot 2023-03-02 at 15 08 48" src="https://user-images.githubusercontent.com/36202383/222387601-c3280d14-aff5-4030-b134-276872555c3b.png">
<img width="1345" alt="Screenshot 2023-03-02 at 15 09 29" src="https://user-images.githubusercontent.com/36202383/222387610-afcfac62-77ce-4d78-93d7-94f619685497.png">


  Setup process:

    This application is build up using React as frontend and NestJs as backend. NestJs is framework of nodejs.
    To run this application:
      1. Clone the repositary to local system.
      2. go to directory
      3. for backend
      4. Npm i
      5. npm run start:dev
      6. for running test 
      7. npm run test
      8. for frontend
      9. npm i
      10. npm start
      11. for test case: npm run test
      
    Postman Collection:

     https://www.postman.com/phoenixnepal/workspace/patient-info-sys/collection/10808356-4a612589-380b-4191-9b41-47fc5c62f9bc?action=share&creator=10808356

    API used in application:
      For User
          create user: http://localhost:3000/user/signup (post)
          login: http://localhost:3000/user/signin (post)
      For Patient
          create patient: http://localhost:3000/patient/create (post)
          update patient: http://localhost:3000/patient/63e4cf57fe16c03ef857e7e3(put)
          get-one : http: http://localhost:3000/patient/63e4cf57fe16c03ef857e7e3(getOne)
          delete-patient: http://localhost:3000/patient/63e4cf57fe16c03ef857e7e3 (delete)
          get-all: http://localhost:3000/patient(get)
