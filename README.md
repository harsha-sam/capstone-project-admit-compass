### **README for AdmitCompass**

---

## **Project Summary**

**AdmitCompass** is a web-based platform designed to assist both prospective students and program administrators within UMBC's Engineering Department. The platform offers the following key features:

- **For Prospective Students**: AdmitCompass provides a dynamic application form that evaluates a student's chances of admission to various undergraduate and graduate engineering programs. Students can input their academic details, and the system calculates their admission likelihood based on predefined rules and conditions set by program administrators.
  
- **For Program Directors and Admission Coordinators**: The platform enables administrators to create and manage rule sets for specific programs. These rule sets define the admission criteria (e.g., GPA, coursework, and test scores) and can be adjusted over time. Program administrators can assign rule sets to multiple programs, edit existing ones, and manage the overall admission evaluation process.

---

## **Features**

### **Prospective Students**
- **Program Exploration**: Browse available engineering programs, grouped by type (Bachelor's, Accelerated, Master's, etc.).
- **Dynamic Application Form**: Fill out a program-specific form, dynamically generated based on the assigned admission rules.
- **Admission Likelihood Calculation**: Get real-time feedback on the likelihood of admission after submitting the form.

### **Program Directors & Admission Coordinators**
- **User Authentication**: Secure sign-up and login using UMBC domain emails, with role-based access (Director or Coordinator).
- **Rule Set Creation & Management**: Create, edit, and manage rule sets that define admission criteria, including attributes like GPA and test scores.
- **Program Assignment**: Assign rule sets to specific programs and ensure each program has only one active rule set at a time.
- **Advanced Search & Filter**: Easily search and filter rule sets by program or criteria.

---

## **Technology Stack**

- **Frontend**: Next.js 14 with TypeScript, Shadcn/UI for components, TailwindCSS for styling.
- **Backend**: Next.js API routes for handling authentication, rule set management, and application form processing.
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: JWT-based authentication for secure user sessions.
- **Hosting**: Supabase for database hosting and static assets.

---

## **Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/admitcompass.git
cd admitcompass
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-jwt-secret-key
```

### **4. Database Setup**
- Install and run PostgreSQL locally or use Supabase for cloud-hosted PostgreSQL.
- Use Prisma to generate the database schema.

```bash
npx prisma migrate dev
npx prisma generate
```

### **5. Run the Development Server**
```bash
npm run dev
```
Access the project at `http://localhost:3000`.

---

## **API Routes**

- **POST /api/signup**: User sign-up with UMBC domain validation.
- **POST /api/signin**: User login, returns JWT token.
- **GET /api/programs**: Fetch the list of programs available.
- **POST /api/rules/create**: Create a new rule set for a program.
- **POST /api/programs/[programId]/apply**: Submit an application form and calculate admission likelihood.

---

## **License**
This project is licensed under the MIT License.